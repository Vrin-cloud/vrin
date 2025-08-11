import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title, tags } = body;
    
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ success: false, error: 'Authorization required' }, { status: 401 });
    }

    console.log('Proxying insert request for content length:', content?.length);

    const response = await fetch('https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify({ content, title, tags }),
    });

    const data = await response.json();
    console.log('RAG insert response:', data);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Insert failed' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Insert proxy error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}