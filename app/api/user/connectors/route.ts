import { NextRequest, NextResponse } from 'next/server'

// Backend Connector Management API (Lambda Function URL)
const CONNECTOR_API_URL = process.env.CONNECTOR_API_URL || 'https://5eg7t4rk23haj2mhe5j7zh2xau0fdthb.lambda-url.us-east-1.on.aws'

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

    // Call backend Lambda to get connectors
    const response = await fetch(`${CONNECTOR_API_URL}/connectors`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Backend error:', response.status, errorText)

      // Return empty connectors if unauthorized or not found
      if (response.status === 401 || response.status === 404) {
        return NextResponse.json({
          connectors: [],
          count: 0
        })
      }

      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API] Error fetching connectors:', error)
    // Return empty list on error to prevent UI breaking
    return NextResponse.json({
      connectors: [],
      count: 0,
      error: 'Failed to fetch connectors'
    })
  }
}
