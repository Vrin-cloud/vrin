import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/connectors/session
 *
 * Creates a Nango connect session for the authenticated user.
 * Returns a session token that the frontend uses to open the Nango Connect UI.
 */
export async function POST(request: NextRequest) {
  console.log('[Connectors] Session API called')

  try {
    // Get the authorization header (user's API key or session token)
    const authHeader = request.headers.get('authorization')
    console.log('[Connectors] Auth header present:', !!authHeader)

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { userId, userEmail, allowedIntegrations } = body
    console.log('[Connectors] Request body:', { userId, userEmail, allowedIntegrations })

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get Nango secret key from environment
    const nangoSecretKey = process.env.NANGO_SECRET_KEY
    console.log('[Connectors] Nango secret key present:', !!nangoSecretKey, 'length:', nangoSecretKey?.length)

    if (!nangoSecretKey) {
      console.error('NANGO_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'Connector service not configured' },
        { status: 500 }
      )
    }

    // Create connect session with Nango
    const nangoRequestBody = {
      end_user: {
        id: userId,
        email: userEmail || undefined,
        display_name: userEmail?.split('@')[0] || undefined,
      },
      allowed_integrations: allowedIntegrations || ['notion', 'google-drive', 'slack'],
    }
    console.log('[Connectors] Nango request body:', JSON.stringify(nangoRequestBody))

    const nangoResponse = await fetch('https://api.nango.dev/connect/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nangoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nangoRequestBody),
    })

    console.log('[Connectors] Nango response status:', nangoResponse.status)

    if (!nangoResponse.ok) {
      const errorText = await nangoResponse.text()
      console.error(`[Connectors] Nango session creation failed: ${nangoResponse.status} - ${errorText}`)
      return NextResponse.json(
        { error: 'Failed to create connector session', details: errorText },
        { status: nangoResponse.status }
      )
    }

    const data = await nangoResponse.json()
    console.log('[Connectors] Nango session response:', JSON.stringify(data))

    // Nango wraps the response in a 'data' object: { data: { token: '...' } }
    const sessionToken = data.data?.token || data.token || data.session_token

    if (!sessionToken) {
      console.error('[Connectors] No token in Nango response:', data)
      return NextResponse.json(
        { error: 'Invalid session response from Nango' },
        { status: 500 }
      )
    }

    console.log('[Connectors] Returning session token, length:', sessionToken?.length)

    return NextResponse.json({
      sessionToken: sessionToken,
    })

  } catch (error) {
    console.error('[Connectors] Session error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
