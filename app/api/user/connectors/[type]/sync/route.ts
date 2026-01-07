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
 * POST /api/user/connectors/[type]/sync
 * Trigger a manual sync for a connector
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

    console.log(`[API] Triggering manual sync for: ${type}`)

    // TODO: Call backend API to trigger sync
    // This would:
    // 1. Tell Nango to start a sync for this connection
    // 2. Or queue a sync job in our backend
    //
    // const response = await fetch(`${BACKEND_URL}/user/connectors/${type}/sync`, {
    //   method: 'POST',
    //   headers: { 'Authorization': authHeader },
    // })

    // TODO: Trigger Nango sync
    // const nango = new Nango({ secretKey: process.env.NANGO_SECRET_KEY })
    // await nango.triggerSync(type, connectionId, 'full')

    // Placeholder response
    return NextResponse.json({
      success: true,
      connector_type: type,
      sync_id: `sync_${Date.now()}`,
      status: 'initiated',
      message: 'Sync initiated. Backend integration pending.'
    })
  } catch (error) {
    console.error('[API] Error triggering sync:', error)
    return NextResponse.json(
      { error: 'Failed to trigger sync' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user/connectors/[type]/sync
 * Get sync history for a connector
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

    // TODO: Fetch sync history from backend
    // const response = await fetch(`${BACKEND_URL}/user/connectors/${type}/sync`, {
    //   headers: { 'Authorization': authHeader },
    // })

    // Placeholder response
    return NextResponse.json({
      connector_type: type,
      history: [],
      message: 'Sync history API ready. Backend integration pending.'
    })
  } catch (error) {
    console.error('[API] Error fetching sync history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sync history' },
      { status: 500 }
    )
  }
}
