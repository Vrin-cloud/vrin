import { NextRequest, NextResponse } from 'next/server'

// Backend Connector Management API (Lambda Function URL)
const CONNECTOR_API_URL = process.env.CONNECTOR_API_URL || 'https://5eg7t4rk23haj2mhe5j7zh2xau0fdthb.lambda-url.us-east-1.on.aws'

// Valid connector types (matches nango.yaml integrations)
const VALID_CONNECTORS = [
  'notion',
  'google-drive',
  'slack',
  'confluence',
  'linear',
  'asana',
  'dropbox',
]

interface RouteParams {
  params: Promise<{ type: string }>
}

/**
 * GET /api/user/connectors/[type]
 * Get status of a specific connector
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { type } = await params
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    if (!VALID_CONNECTORS.includes(type)) {
      return NextResponse.json(
        { error: `Invalid connector type: ${type}` },
        { status: 400 }
      )
    }

    // Call backend Lambda to get connector status
    const response = await fetch(`${CONNECTOR_API_URL}/connectors/${type}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Backend error:', response.status, errorText)

      // Return disconnected status if not found
      if (response.status === 404) {
        return NextResponse.json({
          connector_type: type,
          status: 'disconnected'
        })
      }

      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API] Error fetching connector status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connector status' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/connectors/[type]
 * Disconnect a connector
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { type } = await params
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    if (!VALID_CONNECTORS.includes(type)) {
      return NextResponse.json(
        { error: `Invalid connector type: ${type}` },
        { status: 400 }
      )
    }

    console.log(`[API] Disconnecting connector: ${type}`)

    // Call backend Lambda to disconnect
    const response = await fetch(`${CONNECTOR_API_URL}/connectors/${type}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Backend error:', response.status, errorText)
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API] Error disconnecting connector:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect connector' },
      { status: 500 }
    )
  }
}
