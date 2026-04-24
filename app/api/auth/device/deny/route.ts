import { NextRequest, NextResponse } from 'next/server';

const AUTH_BACKEND_URL =
  process.env.VRIN_AUTH_API_URL ||
  'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod';

function extractSessionJwt(request: NextRequest): string {
  return request.cookies.get('stytch_session_jwt')?.value || '';
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const userCode: string = (body?.user_code || '').toString();
  if (!userCode) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }
  const sessionJwt = extractSessionJwt(request);
  if (!sessionJwt) {
    return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  }

  try {
    const res = await fetch(`${AUTH_BACKEND_URL}/auth/device/deny`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionJwt}`,
      },
      body: JSON.stringify({ user_code: userCode }),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 502 });
  }
}
