import { NextRequest, NextResponse } from 'next/server'

const ENTERPRISE_PORTAL_API = 'https://6xjf0e7djg.execute-api.us-east-1.amazonaws.com/dev'

/**
 * POST /api/enterprise/users/invite
 * Create a new invitation
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const body = await request.json()

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      )
    }

    // Forward request to backend
    const response = await fetch(
      `${ENTERPRISE_PORTAL_API}/enterprise/users/invite`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Error in /api/enterprise/users/invite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
