import { NextRequest, NextResponse } from 'next/server'

// Backend Connector Management API (Lambda Function URL)
const CONNECTOR_API_URL = process.env.CONNECTOR_API_URL || 'https://5eg7t4rk23haj2mhe5j7zh2xau0fdthb.lambda-url.us-east-1.on.aws'

/**
 * GET /api/user/connectors/[type]/records
 * Get synced records with hierarchy structure for a connector
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
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

    // Call backend Lambda to get records
    const response = await fetch(`${CONNECTOR_API_URL}/connectors/${type}/records`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Backend error:', response.status, errorText)

      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Connector not found' },
          { status: 404 }
        )
      }

      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API] Error fetching records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}
