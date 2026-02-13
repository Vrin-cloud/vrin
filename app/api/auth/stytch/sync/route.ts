import { NextRequest, NextResponse } from 'next/server';

/**
 * Stytch User Sync API Route
 *
 * This endpoint syncs Stytch authenticated users with VRIN's user database.
 * It handles both individual and enterprise users:
 *
 * - Individual: Lazy migration — existing users linked to Stytch, new users get free plan
 * - Enterprise: If Stytch org maps to VRIN enterprise org, creates/links enterprise user
 *
 * POST /api/auth/stytch/sync
 * Body: { email, name, member_id, organization_id }
 * Returns: { success, user_id, api_key, email, name, is_new_user, migrated, is_enterprise?, organization_id?, role? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, member_id, organization_id } = body;

    if (!email || !member_id) {
      return NextResponse.json(
        { success: false, error: 'Email and member_id are required' },
        { status: 400 }
      );
    }

    console.log('[Stytch Sync] Syncing user:', { email, member_id, organization_id });

    const response = await fetch(
      'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod/auth/stytch/sync',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || email.split('@')[0],
          member_id,
          organization_id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('[Stytch Sync] Backend error:', data);
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to sync user' },
        { status: response.status }
      );
    }

    console.log('[Stytch Sync] User synced successfully:', {
      user_id: data.user_id,
      is_new_user: data.is_new_user,
      migrated: data.migrated,
      is_enterprise: data.is_enterprise || false,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Stytch Sync] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
