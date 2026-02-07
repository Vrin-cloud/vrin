'use client';

import { B2BIdentityProvider } from '@stytch/nextjs/b2b';

/**
 * OAuth Authorization page for MCP Connected Apps (ChatGPT, Claude Web, etc.).
 *
 * Stytch redirects here during the OAuth authorization code flow.
 * The B2BIdentityProvider component handles:
 *   - Showing login UI if the user isn't authenticated
 *   - Showing a consent screen if the user is authenticated
 *   - Completing the OAuth flow and redirecting back to the client
 */
export default function OAuthAuthorizeContent() {
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
