import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { title } = body;

    // Get authorization header (lowercase 'authorization' to match other proxies)
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    console.log('Proxying update conversation title:', sessionId);

    // Correct path from SAM template: /conversations/{session_id}/title (NOT /chat/conversations)
    const response = await fetch(
      `https://rthl3rcg2b.execute-api.us-east-1.amazonaws.com/dev/conversations/${sessionId}/title`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
        body: JSON.stringify({ title }),
      }
    );

    const data = await response.json();
    console.log('Update title response:', data);

    if (!response.ok) {
      return NextResponse.json({ error: data.error || data.message || 'Failed to update title' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update title proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
