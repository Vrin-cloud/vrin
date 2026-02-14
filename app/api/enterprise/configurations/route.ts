import { NextRequest, NextResponse } from 'next/server'

const ENTERPRISE_API_BASE = 'https://6xjf0e7djg.execute-api.us-east-1.amazonaws.com/dev'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // Forward the request to the actual enterprise API with query params
    const url = organizationId
      ? `${ENTERPRISE_API_BASE}/enterprise/configurations?organization_id=${organizationId}`
      : `${ENTERPRISE_API_BASE}/enterprise/configurations`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error proxying configurations request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
