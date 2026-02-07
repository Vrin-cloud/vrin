'use client';

import { useStytchMemberSession } from '@stytch/nextjs/b2b';
import { StytchB2BProvider } from '@stytch/nextjs/b2b';
import { B2BIdentityProvider } from '@stytch/nextjs/b2b';
import { createStytchB2BUIClient } from '@stytch/nextjs/b2b/ui';
import { useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Inner component that uses Stytch hooks (must be inside StytchB2BProvider).
 */
function OAuthAuthorizeInner() {
  const { session, isInitialized } = useStytchMemberSession();

  useEffect(() => {
    if (!isInitialized) return;

    if (!session) {
      // No active session — redirect to login, preserving the full OAuth URL
      const currentUrl = window.location.href;
      const returnTo = encodeURIComponent(currentUrl);
      window.location.href = `/auth?return_to=${returnTo}`;
    }
  }, [session, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated — show the consent screen
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">VRiN</h1>
          <p className="text-sm text-gray-500 mt-1">
            Connect your knowledge base
          </p>
        </div>
        <B2BIdentityProvider />
      </div>
    </div>
  );
}

/**
 * OAuth Authorization page for MCP Connected Apps (ChatGPT, Claude Web, etc.).
 *
 * Wraps in its own StytchB2BProvider to guarantee the Stytch context is
 * available. This is necessary because the root StytchProvider may not
 * wrap children when the client hasn't initialized yet.
 *
 * Flow:
 *   1. User arrives here from ChatGPT redirect (not logged in)
 *   2. We redirect to /auth with return_to pointing back here (preserving OAuth params)
 *   3. User logs in via Stytch
 *   4. Redirected back here with active session
 *   5. B2BIdentityProvider shows consent screen
 *   6. User approves → redirected back to ChatGPT with auth code
 */
export default function OAuthAuthorizeContent() {
  const stytchClient = useMemo(() => {
    const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;
    if (!publicToken || publicToken.includes('REPLACE_WITH')) {
      return null;
    }
    return createStytchB2BUIClient(publicToken, {
      cookieOptions: {
        opaqueTokenCookieName: 'stytch_session',
        jwtCookieName: 'stytch_session_jwt',
        path: '/',
        availableToSubdomains: false,
        domain: '',
      },
    });
  }, []);

  if (!stytchClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600">Authentication not configured.</p>
        </div>
      </div>
    );
  }

  return (
    <StytchB2BProvider stytch={stytchClient}>
      <OAuthAuthorizeInner />
    </StytchB2BProvider>
  );
}
