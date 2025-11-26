import { NextRequest, NextResponse } from 'next/server'

// Backend API URL
const BACKEND_URL = process.env.VRIN_API_URL || 'https://api.vrin.co'

/**
 * GET /api/user/connectors
 * List all connected apps for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // For now, return empty connectors list since backend isn't implemented yet
    // This will be replaced with actual backend call once the Lambda is deployed

    // TODO: Call backend API
    // const response = await fetch(`${BACKEND_URL}/user/connectors`, {
    //   headers: {
    //     'Authorization': authHeader,
    //   },
    // })
    //
    // if (!response.ok) {
    //   throw new Error(`Backend error: ${response.status}`)
    // }
    //
    // const data = await response.json()
    // return NextResponse.json(data)

    // Placeholder response
    return NextResponse.json({
      connectors: [],
      message: 'Connectors API ready. Backend integration pending.'
    })
  } catch (error) {
    console.error('[API] Error fetching connectors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connectors' },
      { status: 500 }
    )
  }
}
