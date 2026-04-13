import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/connectors/session
 *
 * Creates a Nango connect session for the authenticated user.
 * If the user already has a connection for the requested integration,
 * creates a RECONNECT session (updates existing connection) instead of
 * a new one — prevents duplicate connections in Nango.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, userEmail, allowedIntegrations, existingConnectionId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const nangoSecretKey = process.env.NANGO_SECRET_KEY

    if (!nangoSecretKey) {
      return NextResponse.json(
        { error: 'Connector service not configured' },
        { status: 500 }
      )
    }

    // If an existing connection_id was provided, use the reconnect endpoint
    // to update that connection instead of creating a duplicate
    if (existingConnectionId) {
      const integration = allowedIntegrations?.[0] || 'notion'
      const reconnectResponse = await fetch('https://api.nango.dev/connect/sessions/reconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${nangoSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connection_id: existingConnectionId,
          integration_id: integration,
        }),
      })

      if (!reconnectResponse.ok) {
        const errorText = await reconnectResponse.text()
        // Fall through to create a new session if reconnect fails
      } else {
        const data = await reconnectResponse.json()
        const sessionToken = data.data?.token || data.token || data.session_token

        if (sessionToken) {
          return NextResponse.json({ sessionToken, reconnect: true })
        }
      }
    }

    // Create a new connect session (first-time connection)
    const nangoRequestBody = {
      end_user: {
        id: userId,
        email: userEmail || undefined,
        display_name: userEmail?.split('@')[0] || undefined,
      },
      allowed_integrations: allowedIntegrations || [
        'notion',
        'google-drive',
        'slack',
        'confluence',
        'linear',
        'asana',
        'dropbox',
      ],
    }

    const nangoResponse = await fetch('https://api.nango.dev/connect/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nangoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nangoRequestBody),
    })

    if (!nangoResponse.ok) {
      const errorText = await nangoResponse.text()
      return NextResponse.json(
        { error: 'Failed to create connector session', details: errorText },
        { status: nangoResponse.status }
      )
    }

    const data = await nangoResponse.json()
    const sessionToken = data.data?.token || data.token || data.session_token

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Invalid session response from Nango' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sessionToken, reconnect: false })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
