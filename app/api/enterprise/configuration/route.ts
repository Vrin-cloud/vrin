import { NextRequest, NextResponse } from 'next/server'

const ENTERPRISE_API_BASE = 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod'

export async function POST(request: NextRequest) {
  try {
    // Get the request body and headers
    const body = await request.json()
    const authHeader = request.headers.get('Authorization')
    
    console.log('🔑 Auth header received:', authHeader ? 'Bearer token present' : 'No auth header')
    console.log('💾 Save config body:', JSON.stringify(body, null, 2))
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // Forward the request to the actual enterprise API
    console.log('🚀 Forwarding save to:', `${ENTERPRISE_API_BASE}/enterprise/configuration`)
    const response = await fetch(`${ENTERPRISE_API_BASE}/enterprise/configuration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    })

    console.log('📡 Backend save response status:', response.status)
    const data = await response.json()
    console.log('📡 Backend save response data:', data)

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error proxying save request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters and headers
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id')
    const authHeader = request.headers.get('Authorization')
    
    console.log('🔑 Auth header received:', authHeader ? 'Bearer token present' : 'No auth header')
    console.log('📥 Get config for org:', organizationId)
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // Forward the request to the actual enterprise API
    const url = organizationId 
      ? `${ENTERPRISE_API_BASE}/enterprise/configuration?organization_id=${organizationId}`
      : `${ENTERPRISE_API_BASE}/enterprise/configuration`
      
    console.log('🚀 Forwarding get to:', url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    })

    console.log('📡 Backend get response status:', response.status)
    const data = await response.json()
    console.log('📡 Backend get response data:', data)

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error proxying get request:', error)
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
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}