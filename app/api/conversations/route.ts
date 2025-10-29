import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    // Get query parameters (limit, offset, etc.)
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    console.log('Proxying get conversations list with limit:', limit);

    // Proxy to backend conversation history API
    // Using /Stage to match frontend config (API_CONFIG.CONVERSATION_BASE_URL)
    const response = await fetch(
      `https://rthl3rcg2b.execute-api.us-east-1.amazonaws.com/Stage/conversations?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get conversations error:', response.status, errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }

      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Loaded', data.total || 0, 'conversations');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get conversations proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
