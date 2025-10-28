import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, include_summary, user_id } = body;

    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ success: false, error: 'Authorization required' }, { status: 401 });
    }

    console.log('Proxying query request for:', query);

    // NEW: Lambda Function URL (replaces API Gateway)
    // No 30-second timeout, supports up to 15 minutes
    const response = await fetch('https://ludeelasqiubh3fxmhtjdzwsou0uundi.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify({ query, include_summary, user_id }),
    });

    const data = await response.json();
    console.log('RAG query response:', data);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Query failed' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Query proxy error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}