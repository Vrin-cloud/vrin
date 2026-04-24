import { NextRequest, NextResponse } from 'next/server';

const AUTH_BACKEND_URL =
  process.env.VRIN_AUTH_API_URL ||
  'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod';

export async function GET(request: NextRequest) {
  const userCode = request.nextUrl.searchParams.get('user_code') || '';
  if (!userCode) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${AUTH_BACKEND_URL}/auth/device/verify?user_code=${encodeURIComponent(userCode)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } },
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 502 });
  }
}
