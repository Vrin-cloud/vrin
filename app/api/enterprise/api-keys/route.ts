import { NextRequest, NextResponse } from 'next/server'

const ENTERPRISE_API_BASE = 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod'

export async function POST(request: NextRequest) {
  try {
    // Get the request body and headers
    const body = await request.json()
    const authHeader = request.headers.get('Authorization')
    
    console.log('🔑 Auth header received:', authHeader ? 'Bearer token present' : 'No auth header')
    console.log('🗝️ Generate API key body:', JSON.stringify(body, null, 2))
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // Forward the request to the actual enterprise API
    console.log('🚀 Forwarding API key generation to:', `${ENTERPRISE_API_BASE}/enterprise/api-keys`)
    const response = await fetch(`${ENTERPRISE_API_BASE}/enterprise/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    })

    console.log('📡 Backend API key response status:', response.status)
    const data = await response.json()
    console.log('📡 Backend API key response data:', data)

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error proxying API key request:', error)
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
    console.log('📥 List API keys for org:', organizationId)
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // Forward the request to the actual enterprise API
    const url = organizationId 
      ? `${ENTERPRISE_API_BASE}/enterprise/api-keys?organization_id=${organizationId}`
      : `${ENTERPRISE_API_BASE}/enterprise/api-keys`
      
    console.log('🚀 Forwarding API key list to:', url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    })

    console.log('📡 Backend API key list response status:', response.status)
    const data = await response.json()
    console.log('📡 Backend API key list response data:', data)

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error proxying API key list request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the API key ID from the URL or body
    const { searchParams } = new URL(request.url)
    const apiKeyId = searchParams.get('api_key_id')
    const authHeader = request.headers.get('Authorization')
    
    console.log('🗑️ Delete API key request for ID:', apiKeyId)
    console.log('🔑 Auth header received:', authHeader ? 'Bearer token present' : 'No auth header')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      )
    }

    if (!apiKeyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

    // Forward the request to the actual enterprise API
    console.log('🚀 Forwarding API key deletion to:', `${ENTERPRISE_API_BASE}/enterprise/api-keys/${apiKeyId}`)
    const response = await fetch(`${ENTERPRISE_API_BASE}/enterprise/api-keys/${apiKeyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    })

    console.log('📡 Backend API key deletion response status:', response.status)
    const data = await response.json()
    console.log('📡 Backend API key deletion response data:', data)

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error proxying API key deletion request:', error)
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
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}