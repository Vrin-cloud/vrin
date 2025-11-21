import { NextRequest, NextResponse } from 'next/server'

const ENTERPRISE_PORTAL_API = 'https://6xjf0e7djg.execute-api.us-east-1.amazonaws.com/dev'

/**
 * GET /api/enterprise/users/invitations?organization_id=...
 * List invitations for an organization
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organization_id')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      )
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Missing organization_id parameter' },
        { status: 400 }
      )
    }

    // Forward request to backend
    const response = await fetch(
      `${ENTERPRISE_PORTAL_API}/enterprise/users/invitations?organization_id=${organizationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Error in /api/enterprise/users/invitations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
