import { NextRequest, NextResponse } from 'next/server';
import { getStytchServerClient } from '@/lib/stytch-server';
import * as bcrypt from 'bcryptjs';

/**
 * Password Authentication API Route
 *
 * Handles both login and signup for Stytch B2B users via password.
 * Uses an "authenticate-first" approach — no member search needed.
 *
 * 1. Derive org slug from email (e.g., vedant@email.com → vedant-workspace)
 * 2. Try to authenticate — if it works, it's a login
 * 3. If org/member doesn't exist, create org + member + password (signup)
 * 4. Authenticate again to get session tokens
 *
 * POST /api/auth/stytch/password
 * Body: { email, password, first_name?, last_name? }
 * Returns: { success, member_id, email, name, organization_id, session_token, session_jwt }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const stytch = getStytchServerClient();
    const fullName = [first_name, last_name].filter(Boolean).join(' ');
    const orgSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-workspace';

    // Step 1: Try to authenticate directly (login attempt)
    try {
      const authResponse = await stytch.passwords.authenticate({
        organization_id: orgSlug,
        email_address: email,
        password: password,
        session_duration_minutes: 60,
      });

      // Login succeeded
      return buildSuccessResponse(authResponse, fullName, false);
    } catch (authErr: any) {
      const errorType = authErr.error_type || '';

      // Wrong password — return error immediately, don't try signup
      if (authErr.status_code === 401 || errorType === 'unauthorized_credentials') {
        return NextResponse.json(
          { success: false, error: 'Incorrect password. Please try again.' },
          { status: 401 }
        );
      }

      // Password not set for this member — they signed up via Google/magic link
      if (errorType === 'password_not_set') {
        return NextResponse.json(
          { success: false, error: 'No password set for this account. Please sign in with Google or magic link.' },
          { status: 400 }
        );
      }

      // Org or member not found — proceed to signup
      const isNotFound = errorType.includes('not_found') ||
        errorType.includes('no_password') ||
        authErr.status_code === 404;

      if (!isNotFound) {
        console.error('[Password Auth] Unexpected auth error:', authErr);
        return NextResponse.json(
          { success: false, error: 'Authentication failed. Please try again.' },
          { status: 500 }
        );
      }

      console.log('[Password Auth] Account not found, proceeding to signup for:', email);
    }

    // Step 2: Signup — create org + member with password
    try {
      const orgName = fullName ? `${fullName}'s Workspace` : `${email.split('@')[0]}'s Workspace`;

      const createOrgResponse = await stytch.organizations.create({
        organization_name: orgName,
        organization_slug: orgSlug,
      });

      const organizationId = createOrgResponse.organization.organization_id;
      console.log('[Password Auth] Created org:', organizationId);

      // Hash password and migrate into Stytch (creates member + sets password)
      const hash = await bcrypt.hash(password, 10);

      await stytch.passwords.migrate({
        email_address: email,
        organization_id: organizationId,
        hash: hash,
        hash_type: 'bcrypt',
        name: fullName || undefined,
      });

      console.log('[Password Auth] Created member with password:', email);

      // Authenticate to get session tokens
      const authResponse = await stytch.passwords.authenticate({
        organization_id: organizationId,
        email_address: email,
        password: password,
        session_duration_minutes: 60,
      });

      return buildSuccessResponse(authResponse, fullName, true);
    } catch (signupErr: any) {
      console.error('[Password Auth] Signup failed:', signupErr);

      if (signupErr.error_type === 'organization_slug_already_exists') {
        return NextResponse.json(
          { success: false, error: 'An account with this email may already exist but uses a different sign-in method. Try Google or magic link.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Password Auth] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function buildSuccessResponse(authResponse: any, fullName: string, isNewUser: boolean) {
  const member = authResponse.member;
  const sessionToken = authResponse.session_token;
  const sessionJwt = authResponse.session_jwt;
  const displayName = member.name || fullName || member.email_address.split('@')[0];

  const response = NextResponse.json({
    success: true,
    member_id: member.member_id,
    email: member.email_address,
    name: displayName,
    organization_id: member.organization_id,
    session_token: sessionToken,
    session_jwt: sessionJwt,
    is_new_user: isNewUser,
  });

  response.cookies.set('stytch_session', sessionToken, {
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
  });

  response.cookies.set('stytch_session_jwt', sessionJwt, {
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
  });

  return response;
}
