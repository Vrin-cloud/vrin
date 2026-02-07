/**
 * Stytch B2B Client Configuration
 *
 * This file initializes the Stytch B2B UI client for frontend authentication.
 * For backend operations, use the Node SDK in API routes.
 */

import { createStytchB2BUIClient } from '@stytch/nextjs/b2b/ui';

// Cookie configuration for Stytch sessions
const stytchCookieOptions = {
  opaqueTokenCookieName: 'stytch_session',
  jwtCookieName: 'stytch_session_jwt',
  path: '/',
  availableToSubdomains: false,
  domain: '', // Will use current domain
};

// Initialize Stytch UI client (only on client-side)
let stytchClient: ReturnType<typeof createStytchB2BUIClient> | null = null;

export function getStytchClient() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!stytchClient) {
    const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

    if (!publicToken || publicToken.includes('REPLACE_WITH')) {
      console.warn(
        'Stytch public token not configured. ' +
        'Get your public token from https://stytch.com/dashboard/sdk-configuration'
      );
      return null;
    }

    stytchClient = createStytchB2BUIClient(publicToken, {
      cookieOptions: stytchCookieOptions,
    });
  }

  return stytchClient;
}

// Export type for use in components
export type StytchB2BClient = ReturnType<typeof createStytchB2BUIClient>;
