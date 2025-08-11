import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ success: false, error: 'Authorization required' }, { status: 401 });
    }

    console.log('Proxying graph request');

    const response = await fetch('https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev/graph', {
      method: 'GET',
      headers: {
        'Authorization': authorization,
      },
    });

    const data = await response.json();
    console.log('RAG graph response:', data);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Graph request failed' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Graph proxy error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}