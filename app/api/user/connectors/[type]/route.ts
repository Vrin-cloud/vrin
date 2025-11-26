import { NextRequest, NextResponse } from 'next/server'

// Backend API URL
const BACKEND_URL = process.env.VRIN_API_URL || 'https://api.vrin.co'

// Valid connector types
const VALID_CONNECTORS = ['notion', 'google-drive', 'slack']

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

    // TODO: Call backend API
    // const response = await fetch(`${BACKEND_URL}/user/connectors/${type}`, {
    //   headers: { 'Authorization': authHeader },
    // })

    // Placeholder response
    return NextResponse.json({
      connector_type: type,
      status: 'disconnected',
      message: 'Backend integration pending'
    })
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

    // TODO: Call backend API to disconnect
    // const response = await fetch(`${BACKEND_URL}/user/connectors/${type}`, {
    //   method: 'DELETE',
    //   headers: { 'Authorization': authHeader },
    // })

    // TODO: Also revoke connection in Nango
    // const nango = new Nango({ secretKey: process.env.NANGO_SECRET_KEY })
    // await nango.deleteConnection(type, connectionId)

    return NextResponse.json({
      success: true,
      message: `Disconnected from ${type}`
    })
  } catch (error) {
    console.error('[API] Error disconnecting connector:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect connector' },
      { status: 500 }
    )
  }
}
