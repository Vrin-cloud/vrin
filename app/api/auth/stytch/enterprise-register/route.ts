import { NextRequest, NextResponse } from 'next/server';

/**
 * Enterprise Registration API Route (Proxy)
 *
 * Proxies registration requests to the VRIN auth backend Lambda.
 * This avoids CORS issues since the frontend calls a same-origin endpoint.
 *
 * Supports both:
 *   - Password registration (auth_method absent or 'password')
 *   - Google OAuth registration (auth_method: 'google_oauth')
 *
 * POST /api/auth/stytch/enterprise-register
 */

const AUTH_BACKEND_URL =
  process.env.VRIN_AUTH_API_URL ||
  'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${AUTH_BACKEND_URL}/enterprise/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Registration failed' },
        { status: backendResponse.status }
      );
    }

    // Set Stytch session cookies if returned (password flow)
    const response = NextResponse.json(data);

    if (data.session_token) {
      response.cookies.set('stytch_session', data.session_token, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
      });
    }

    if (data.session_jwt) {
      response.cookies.set('stytch_session_jwt', data.session_jwt, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60,
      });
    }

    return response;
  } catch (error: any) {
    console.error('[Enterprise Register] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
