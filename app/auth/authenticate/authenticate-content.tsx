'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useStytchB2BClient, useStytchMemberSession } from '@stytch/nextjs/b2b';

/**
 * Helper function to sync user with VRIN backend and store credentials
 */
async function syncAndStoreCredentials(
  member: any,
  organization: any,
  fullName: string
): Promise<boolean> {
  try {
    const syncResponse = await fetch('/api/auth/stytch/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_id: member.member_id,
        email: member.email_address,
        name: member.name || fullName,
        organization_id: organization?.organization_id,
      }),
    });

    const syncData = await syncResponse.json();
    console.log('[Stytch] VRIN sync response:', syncData);

    if (syncData.success) {
      // Store credentials
      localStorage.setItem('vrin_api_key', syncData.api_key);
      localStorage.setItem('vrin_user', JSON.stringify({
        user_id: syncData.user_id,
        email: syncData.email,
        name: syncData.name,
      }));
      localStorage.setItem('vrin_stytch_auth', JSON.stringify({
        member_id: member.member_id,
        user_id: syncData.user_id,
        api_key: syncData.api_key,
        email: syncData.email,
        name: syncData.name,
      }));
      return true;
    }
    return false;
  } catch (error) {
    console.error('[Stytch] Failed to sync with VRIN:', error);
    return false;
  }
}

/**
 * Stytch Authentication Callback Content
 *
 * This component handles:
 * 1. Email Magic Link token authentication
 * 2. OAuth callback processing
 * 3. Discovery flow - auto-creates or selects organization
 *
 * After successful authentication, redirects to /dashboard
 *
 * NOTE: This component must be dynamically imported with ssr: false
 * because it uses Stytch hooks that require the browser.
 */
function AuthenticateContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stytch = useStytchB2BClient();
  const { session, isInitialized } = useStytchMemberSession();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check for return_to parameter (preserved from OAuth authorize flow)
  const returnTo = searchParams.get('return_to');

  // Prevent double authentication attempts (React strict mode / re-renders)
  const authAttemptedRef = useRef(false);

  useEffect(() => {
    if (!stytch || !isInitialized) return;

    // If already authenticated with VRIN credentials, redirect
    if (session) {
      const vrinApiKey = localStorage.getItem('vrin_api_key');
      const vrinUser = localStorage.getItem('vrin_user');
      if (vrinApiKey && vrinUser) {
        setStatus('success');
        const destination = returnTo || '/dashboard';
        setTimeout(() => {
          window.location.href = destination;
        }, 1000);
        return;
      }
    }

    // Prevent double authentication - tokens are single-use
    if (authAttemptedRef.current) {
      console.log('[Stytch] Authentication already attempted, skipping');
      return;
    }

    const authenticateToken = async () => {
      // Mark as attempted immediately
      authAttemptedRef.current = true;
      try {
        // Check for different token types in URL
        const token = searchParams.get('token');
        const tokenType = searchParams.get('stytch_token_type');

        if (!token) {
          // No token - might be initial OAuth redirect or direct visit
          if (!session) {
            setErrorMessage('No authentication token found. Please try signing in again.');
            setStatus('error');
          }
          return;
        }

        console.log('[Stytch] Authenticating token:', { tokenType, hasToken: !!token });

        let response: any;

        // Authenticate based on token type
        if (tokenType === 'discovery' || tokenType === 'multi_tenant_magic_links') {
          response = await stytch.magicLinks.discovery.authenticate({
            discovery_magic_links_token: token,
          });
          console.log('[Stytch] Discovery magic link auth response:', response);
        } else if (tokenType === 'oauth' || tokenType === 'discovery_oauth') {
          response = await stytch.oauth.discovery.authenticate({
            discovery_oauth_token: token,
          });
          console.log('[Stytch] OAuth auth response:', response);
        } else {
          // Unknown token type - try OAuth first, then magic links
          console.log('[Stytch] Unknown token type, trying OAuth first:', tokenType);
          try {
            response = await stytch.oauth.discovery.authenticate({
              discovery_oauth_token: token,
            });
          } catch (oauthErr) {
            console.log('[Stytch] OAuth failed, trying magic links...');
            response = await stytch.magicLinks.discovery.authenticate({
              discovery_magic_links_token: token,
            });
          }
        }

        // Handle the response - either create org or select existing one
        const discoveredOrgs = response.discovered_organizations || [];
        const email = response.email_address || '';
        const fullName = response.full_name || email.split('@')[0];
        const intermediateToken = response.intermediate_session_token;

        if (!intermediateToken) {
          setErrorMessage('Authentication incomplete. Please try again.');
          setStatus('error');
          return;
        }

        let member: any;
        let organization: any;

        if (discoveredOrgs.length === 0) {
          // No organizations - create a personal workspace
          console.log('[Stytch] No orgs found, creating personal workspace for:', email);

          const orgName = `${fullName}'s Workspace`;
          const orgSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-workspace';

          const createOrgResponse = await stytch.discovery.organizations.create({
            organization_name: orgName,
            organization_slug: orgSlug,
            session_duration_minutes: 60,
          });

          console.log('[Stytch] Organization created:', createOrgResponse);
          member = (createOrgResponse as any).member;
          organization = (createOrgResponse as any).organization;
        } else {
          // Has existing organizations - auto-select the first one (personal workspace)
          console.log('[Stytch] Found', discoveredOrgs.length, 'organization(s), auto-selecting first');

          const selectedOrg = discoveredOrgs[0];
          const orgId = selectedOrg.organization?.organization_id;

          console.log('[Stytch] Auto-selecting organization:', orgId);

          const exchangeResponse = await stytch.discovery.intermediateSessions.exchange({
            organization_id: orgId,
            session_duration_minutes: 60,
          });

          console.log('[Stytch] Session exchange response:', exchangeResponse);
          member = (exchangeResponse as any).member;
          organization = (exchangeResponse as any).organization;
        }

        // Sync with VRIN backend
        if (member) {
          const synced = await syncAndStoreCredentials(member, organization, fullName);
          if (synced) {
            setStatus('success');
            const destination = returnTo || '/dashboard';
            setTimeout(() => {
              window.location.href = destination;
            }, 1000);
            return;
          }
        }

        // If we get here, something went wrong
        setErrorMessage('Failed to complete sign-in. Please try again.');
        setStatus('error');

      } catch (err: any) {
        console.error('[Stytch] Authentication error:', err);
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
        setStatus('error');
      }
    };

    authenticateToken();
  }, [stytch, isInitialized, session, searchParams, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authenticating...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your credentials.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Successful
            </h1>
            <p className="text-gray-600">
              Redirecting to your dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth')}
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function AuthenticateContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <AuthenticateContentInner />
    </Suspense>
  );
}
