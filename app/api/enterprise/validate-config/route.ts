import { NextRequest, NextResponse } from 'next/server'

const ENTERPRISE_API_BASE = 'https://6xjf0e7djg.execute-api.us-east-1.amazonaws.com/dev'

export async function POST(request: NextRequest) {
  try {
    // Get the request body and headers
    const body = await request.json()
    const authHeader = request.headers.get('Authorization')
    
    console.log('🔑 Auth header received:', authHeader ? 'Bearer token present' : 'No auth header')
    console.log('📦 Request body:', JSON.stringify(body, null, 2))
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // Forward the request to the actual enterprise API
    console.log('🚀 Forwarding to:', `${ENTERPRISE_API_BASE}/enterprise/validate-config`)
    const response = await fetch(`${ENTERPRISE_API_BASE}/enterprise/validate-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    })

    console.log('📡 Backend response status:', response.status)
    const data = await response.json()
    console.log('📡 Backend response data:', data)

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error proxying request:', error)
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}