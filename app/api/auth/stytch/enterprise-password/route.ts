import { NextRequest, NextResponse } from 'next/server';
import { getStytchServerClient } from '@/lib/stytch-server';
import { API_CONFIG } from '@/config/api';

/**
 * Enterprise Password Authentication API Route
 *
 * Handles enterprise login via Stytch B2B password authentication.
 * Unlike the individual password route, this discovers the user's
 * organization from the VRIN backend (not derived from email).
 *
 * Flow:
 *   1. Call VRIN backend /enterprise/auth/login with email + password
 *   2. Backend authenticates via Stytch and returns session tokens
 *   3. Set Stytch session cookies
 *   4. Return member info
 *
 * POST /api/auth/stytch/enterprise-password
 * Body: { email, password }
 * Returns: { success, member_id, email, name, organization_id, session_token, session_jwt }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call VRIN backend which handles Stytch auth + org discovery
    const backendResponse = await fetch(
      `${API_CONFIG.ENTERPRISE_BASE_URL}/enterprise/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Login failed' },
        { status: backendResponse.status }
      );
    }

    // If backend returned Stytch session tokens, set cookies
    const sessionToken = data.session_token;
    const sessionJwt = data.session_jwt;

    const responseBody = {
      success: true,
      member_id: data.stytch_member_id,
      email: data.user?.email || email,
      name: data.user ? `${data.user.firstName} ${data.user.lastName}`.trim() : email.split('@')[0],
      organization_id: data.stytch_organization_id,
      user: data.user,
      is_enterprise: true,
    };

    const response = NextResponse.json(responseBody);

    if (sessionToken) {
      response.cookies.set('stytch_session', sessionToken, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
      });
    }

    if (sessionJwt) {
      response.cookies.set('stytch_session_jwt', sessionJwt, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
      });
    }

    // Also store enterprise user data for legacy compatibility
    if (data.user) {
      // Legacy token is the session JWT (or base64 token for non-Stytch users)
      const legacyToken = sessionJwt || data.token;
      if (legacyToken) {
        response.headers.set('X-Enterprise-Token', legacyToken);
      }
    }

    return response;
  } catch (error: any) {
    console.error('[Enterprise Password Auth] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
