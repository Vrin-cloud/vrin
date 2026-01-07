import { NextRequest, NextResponse } from 'next/server'

// Backend API URL
const BACKEND_URL = process.env.VRIN_API_URL || 'https://api.vrin.co'

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
 * POST /api/user/connectors/[type]/connect
 * Register a new connector connection after OAuth completes
 *
 * Body: { connectionId: string }
 */
export async function POST(
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

    const body = await request.json()
    const { connectionId } = body

    if (!connectionId) {
      return NextResponse.json(
        { error: 'connectionId is required' },
        { status: 400 }
      )
    }

    console.log(`[API] Registering connector connection: ${type} -> ${connectionId}`)

    // TODO: Call backend API to register the connection
    // const response = await fetch(`${BACKEND_URL}/user/connectors/${type}/connect`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': authHeader,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ connectionId }),
    // })
    //
    // if (!response.ok) {
    //   throw new Error(`Backend error: ${response.status}`)
    // }

    // Placeholder response - indicates successful registration
    return NextResponse.json({
      success: true,
      connector_type: type,
      connection_id: connectionId,
      status: 'connected',
      connected_at: new Date().toISOString(),
      message: 'Connection registered. Backend integration pending for full sync.'
    })
  } catch (error) {
    console.error('[API] Error registering connector:', error)
    return NextResponse.json(
      { error: 'Failed to register connector connection' },
      { status: 500 }
    )
  }
}
