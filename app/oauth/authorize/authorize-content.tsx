'use client';

import { StytchB2BProvider } from '@stytch/nextjs/b2b';
import { createStytchB2BUIClient } from '@stytch/nextjs/b2b/ui';
import { B2BIdentityProvider } from '@stytch/nextjs/b2b';
import React, { useMemo } from 'react';

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
 * Creates its own StytchB2BProvider instance to guarantee the context is
 * available client-side (the root provider may render without context during SSR).
 */
export default function OAuthAuthorizeContent() {
  const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

  const stytchClient = useMemo(() => {
    if (!publicToken) return null;
    return createStytchB2BUIClient(publicToken, {
      cookieOptions: {
        opaqueTokenCookieName: 'stytch_session',
        jwtCookieName: 'stytch_session_jwt',
        path: '/',
        availableToSubdomains: false,
        domain: '',
      },
    });
  }, [publicToken]);

  if (!stytchClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">VRiN</h1>
          <p className="text-sm text-red-500 mt-4">
            Authentication is not configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <StytchB2BProvider stytch={stytchClient}>
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
    </StytchB2BProvider>
  );
}
