'use client';

import { B2BIdentityProvider } from '@stytch/nextjs/b2b';
import React from 'react';

class OAuthErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="w-full max-w-md mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">VRiN</h1>
          <p className="text-sm text-red-500 mt-4">
            Authentication error: {this.state.error.message}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Please try again or contact support.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const token = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;
  console.log('[OAuth] NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN available:', !!token, token ? `${token.substring(0, 20)}...` : 'MISSING');

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">VRiN</h1>
          <p className="text-sm text-red-500 mt-4">
            Stytch public token not found in build. Please redeploy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <OAuthErrorBoundary>
        <div className="w-full max-w-md mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">VRiN</h1>
            <p className="text-sm text-gray-500 mt-1">
              Connect your knowledge base
            </p>
          </div>
          <B2BIdentityProvider />
        </div>
      </OAuthErrorBoundary>
    </div>
  );
}
