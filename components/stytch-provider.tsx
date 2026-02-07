'use client';

import { StytchB2BProvider } from '@stytch/nextjs/b2b';
import { createStytchB2BUIClient } from '@stytch/nextjs/b2b/ui';

interface StytchProviderProps {
  children: React.ReactNode;
}

// Create the Stytch client at module level (singleton pattern, matches Stytch's demo).
// This ensures StytchB2BProvider always wraps children — hooks never throw.
const stytch =
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN &&
  !process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN.includes('REPLACE_WITH')
    ? createStytchB2BUIClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN, {
        cookieOptions: {
          opaqueTokenCookieName: 'stytch_session',
          jwtCookieName: 'stytch_session_jwt',
          path: '/',
          availableToSubdomains: false,
          domain: '',
        },
      })
    : null;

export function StytchProvider({ children }: StytchProviderProps) {
  if (!stytch) {
    return <>{children}</>;
  }

  return (
    <StytchB2BProvider stytch={stytch}>
      {children}
    </StytchB2BProvider>
  );
}
