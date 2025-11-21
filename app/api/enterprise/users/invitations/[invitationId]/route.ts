import { NextRequest, NextResponse } from 'next/server'

const ENTERPRISE_PORTAL_API = 'https://6xjf0e7djg.execute-api.us-east-1.amazonaws.com/dev'

/**
 * DELETE /api/enterprise/users/invitations/[invitationId]
 * Revoke an invitation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization')
    const { invitationId } = await params

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      )
    }

    // Transform RESTful DELETE to backend POST /revoke
    const response = await fetch(
      `${ENTERPRISE_PORTAL_API}/enterprise/users/invite/revoke`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invitation_id: invitationId })
      }
    )

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Error in /api/enterprise/users/invitations/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
