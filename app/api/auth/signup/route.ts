import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    console.log('Proxying signup request for:', email);

    const response = await fetch('https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    console.log('Backend response:', data);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Signup failed' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Signup proxy error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}