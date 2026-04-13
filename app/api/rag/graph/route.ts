import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ success: false, error: 'Authorization required' }, { status: 401 });
    }

    // Extract query parameters and forward them to the backend
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const backendUrl = `https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev/graph${queryString ? '?' + queryString : ''}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Graph request failed' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}