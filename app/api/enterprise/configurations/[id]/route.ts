import { NextRequest, NextResponse } from 'next/server'

const ENTERPRISE_API_BASE = 'https://6xjf0e7djg.execute-api.us-east-1.amazonaws.com/dev'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the configuration ID from params (await required in Next.js 15)
    const { id: configId } = await params
    const authHeader = request.headers.get('Authorization')
    
    console.log('🔑 Auth header received:', authHeader ? 'Bearer token present' : 'No auth header')
    console.log('🗑️ Deleting configuration:', configId)
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // Forward the request to the actual enterprise API
    console.log('🚀 Forwarding deletion to:', `${ENTERPRISE_API_BASE}/enterprise/configurations/${configId}`)
    
    // Build headers for backend API
    const backendHeaders: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (authHeader) {
      backendHeaders['Authorization'] = authHeader
      console.log('🔑 Authorization header being sent:', authHeader.substring(0, 20) + '...')
    }
    
    const response = await fetch(`${ENTERPRISE_API_BASE}/enterprise/configurations/${configId}`, {
      method: 'DELETE',
      headers: backendHeaders
    })

    console.log('📡 Backend deletion response status:', response.status)
    const data = await response.json()
    console.log('📡 Backend deletion response data:', data)

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error proxying deletion request:', error)
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}