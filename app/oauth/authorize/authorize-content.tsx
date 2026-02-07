'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStytchMemberSession } from '@stytch/nextjs/b2b';
import { B2BIdentityProvider } from '@stytch/nextjs/b2b';

/**
 * OAuth Authorization page for MCP Connected Apps (ChatGPT, Claude Web, etc.).
 *
 * Follows the Stytch B2B MCP demo pattern:
 *   1. User arrives here from ChatGPT redirect (may or may not be logged in)
 *   2. If no session, redirect to /auth with returnTo carrying the relative path + query
 *   3. User logs in via Stytch (magic link or Google OAuth)
 *   4. After login, redirected back here with an active session
 *   5. B2BIdentityProvider reads OAuth params from URL, shows consent screen
 *   6. User approves → Stytch redirects to ChatGPT with authorization code
 */
export default function OAuthAuthorizeContent() {
  const { session, isInitialized } = useStytchMemberSession();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !session) {
      // Preserve the full path + query string (OAuth params) as a relative URL.
      // Using relative paths keeps the URL short and avoids encoding issues.
      const currentPath = window.location.pathname + window.location.search;
      const encoded = encodeURIComponent(currentPath);
      router.push(`/auth?return_to=${encoded}`);
    }
  }, [isInitialized, session, router]);

  // Don't render until we know authentication status
  if (!isInitialized) {
    return null;
  }

  // Not authenticated — redirect is happening
  if (!session) {
    return null;
  }

  // User is authenticated — B2BIdentityProvider reads OAuth params from URL automatically
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
