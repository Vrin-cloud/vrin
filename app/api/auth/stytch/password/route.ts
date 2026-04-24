import { NextRequest, NextResponse } from 'next/server';
import { getStytchServerClient } from '@/lib/stytch-server';
import * as bcrypt from 'bcryptjs';

/**
 * Password Authentication API Route
 *
 * Handles login for existing Stytch B2B users via password.
 * Primary auth methods are Google and magic link — this route
 * supports legacy password accounts.
 *
 * 1. Search for the user's org by email (then fallback to derived slug)
 * 2. Authenticate with the real org UUID
 * 3. If org/member not found, create org + member + password (signup)
 *
 * POST /api/auth/stytch/password
 * Body: { email, password, first_name?, last_name? }
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

    let stytch;
    try {
      stytch = getStytchServerClient();
    } catch (initErr: any) {
      return NextResponse.json(
        { success: false, error: 'Authentication service unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const fullName = [first_name, last_name].filter(Boolean).join(' ');

    // Step 1: Find the user's org — search by member email first, then by slug
    let existingOrgId: string | null = null;
    try {
      const searchResult = await stytch.organizations.search({
        query: {
          operands: [{ filter_name: 'member_emails', filter_value: [email] }],
          operator: 'AND',
        },
      });
      if (searchResult.organizations.length > 0) {
        existingOrgId = searchResult.organizations[0].organization_id;
      }
    } catch (emailSearchErr: any) {
      // Not fatal — Stytch may legitimately return no matches. Detailed
      // Stytch error fields are logged on the subsequent signup fallback
      // if we actually fail to proceed.
    }

    // Step 2: Authenticate if org found
    if (existingOrgId) {
      try {
        const authResponse = await stytch.passwords.authenticate({
          organization_id: existingOrgId,
          email_address: email,
          password: password,
          session_duration_minutes: 60,
        });
        return buildSuccessResponse(authResponse, fullName, false);
      } catch (authErr: any) {
        const errorType = authErr.error_type || '';

        if (authErr.status_code === 401 || errorType === 'unauthorized_credentials') {
          return NextResponse.json(
            { success: false, error: 'Incorrect password. Please try again.' },
            { status: 401 }
          );
        }

        if (authErr.status_code === 429 || errorType === 'user_lock_limit_reached') {
          return NextResponse.json(
            { success: false, error: 'Too many failed login attempts. Your account has been temporarily locked. Please try again in a few minutes.' },
            { status: 429 }
          );
        }

        if (errorType === 'password_not_set' || errorType === 'member_reset_password') {
          return NextResponse.json(
            { success: false, error: 'No password set for this account. Please sign in with Google or magic link.' },
            { status: 400 }
          );
        }

        const isNotFound = errorType.includes('not_found') || authErr.status_code === 404;
        if (!isNotFound) {
          return NextResponse.json(
            { success: false, error: 'Authentication failed. Please try again.' },
            { status: 500 }
          );
        }
      }
    }

    // Step 3: Signup — create org + member with password
    try {
      const orgName = fullName ? `${fullName}'s Workspace` : `${email.split('@')[0]}'s Workspace`;
      // Opaque, collision-proof slug. Decoupled from email so two users sharing
      // an email local part (e.g. vedant@a.com / vedant@b.com) can both sign up.
      const orgSlug = `ws-${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;

      const createOrgResponse = await stytch.organizations.create({
        organization_name: orgName,
        organization_slug: orgSlug,
      });

      const organizationId = createOrgResponse.organization.organization_id;
      const hash = await bcrypt.hash(password, 10);

      await stytch.passwords.migrate({
        email_address: email,
        organization_id: organizationId,
        hash: hash,
        hash_type: 'bcrypt',
        name: fullName || undefined,
      });

      const authResponse = await stytch.passwords.authenticate({
        organization_id: organizationId,
        email_address: email,
        password: password,
        session_duration_minutes: 60,
      });

      return buildSuccessResponse(authResponse, fullName, true);
    } catch (signupErr: any) {
      // Server-side log only — never surface Stytch internals to the client.
      console.error('[stytch/password] Signup failed:', {
        error_type: signupErr?.error_type,
        error_message: signupErr?.error_message,
        status_code: signupErr?.status_code,
      });

      if (signupErr.error_type === 'organization_slug_already_exists') {
        return NextResponse.json(
          { success: false, error: 'An account with this email may already exist. Try Google or magic link.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function buildSuccessResponse(authResponse: any, fullName: string, isNewUser: boolean) {
  const member = authResponse.member;
  const displayName = member.name || fullName || member.email_address.split('@')[0];

  const response = NextResponse.json({
    success: true,
    member_id: member.member_id,
    email: member.email_address,
    name: displayName,
    organization_id: member.organization_id,
    session_token: authResponse.session_token,
    session_jwt: authResponse.session_jwt,
    is_new_user: isNewUser,
  });

  response.cookies.set('stytch_session', authResponse.session_token, {
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
  });

  response.cookies.set('stytch_session_jwt', authResponse.session_jwt, {
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
  });

  return response;
}
