import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ success: false, error: 'Authorization required' }, { status: 401 });
    }

    console.log('Proxying API keys list request');

    const response = await fetch('https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod/api/auth/api-keys', {
      method: 'GET',
      headers: {
        'Authorization': authorization,
      },
    });

    const data = await response.json();
    console.log('Backend API keys response:', data);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Failed to fetch API keys' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API keys proxy error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_name } = body;
    
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ success: false, error: 'Authorization required' }, { status: 401 });
    }

    console.log('Proxying API key creation request for project:', project_name);

    const response = await fetch('https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod/api/auth/create-api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify({ project_name }),
    });

    const data = await response.json();
    console.log('Backend create API key response:', data);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Failed to create API key' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create API key proxy error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}