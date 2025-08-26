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

    console.log('📡 Proxying graph request to:', backendUrl);
    console.log('📊 Query params:', {
      user_only: searchParams.get('user_only'),
      show_all: searchParams.get('show_all'),
      limit: searchParams.get('limit')
    });

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('📊 RAG graph response summary:', {
      success: data.success,
      nodesCount: data.data?.nodes?.length || 0,
      edgesCount: data.data?.edges?.length || 0,
      hasMetadata: !!data.metadata,
      warning: data.metadata?.warning
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Graph request failed' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Graph proxy error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}