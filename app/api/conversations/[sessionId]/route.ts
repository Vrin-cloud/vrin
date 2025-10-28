import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Get authorization header (lowercase 'authorization' to match other proxies)
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    console.log('Proxying delete conversation:', sessionId);

    // Correct path from SAM template: /conversations/{session_id} (NOT /chat/conversations)
    const response = await fetch(
      `https://rthl3rcg2b.execute-api.us-east-1.amazonaws.com/dev/conversations/${sessionId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
      }
    );

    const data = await response.json();
    console.log('Delete conversation response:', data);

    if (!response.ok) {
      return NextResponse.json({ error: data.error || data.message || 'Failed to delete conversation' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete conversation proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
