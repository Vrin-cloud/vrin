'use client';

import { StytchB2BProvider } from '@stytch/nextjs/b2b';
import { createStytchB2BUIClient } from '@stytch/nextjs/b2b/ui';
import { ReactNode } from 'react';

// Create the Stytch client at module level — exactly matching Stytch's official
// B2B MCP demo (stytch-b2b-mcp-demo). No typeof window guard; the SDK handles SSR.
const stytch = createStytchB2BUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || '',
  {
    cookieOptions: {
      opaqueTokenCookieName: 'stytch_session',
      jwtCookieName: 'stytch_session_jwt',
      path: '/',
      availableToSubdomains: false,
      domain: '',
    },
  }
);

const StytchProvider = ({ children }: { children: ReactNode }) => {
  return <StytchB2BProvider stytch={stytch}>{children}</StytchB2BProvider>;
};

export { StytchProvider };
