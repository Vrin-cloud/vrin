'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useStytchB2BClient, useStytchMemberSession } from '@stytch/nextjs/b2b';
import { API_CONFIG } from '@/config/api';

/**
 * Enterprise Stytch Authentication Callback
 *
 * Handles two flows:
 *
 * 1. REGISTRATION (Google OAuth from /enterprise/auth/register):
 *    - sessionStorage has `enterprise_register_org_info` (saved before OAuth redirect)
 *    - Authenticate token → get intermediate session
 *    - Create Stytch org via discovery.organizations.create()
 *    - Call backend to create VRIN DynamoDB records (auth_method: google_oauth)
 *    - Store enterprise_user in localStorage → redirect to dashboard
 *
 * 2. LOGIN (Google OAuth or magic link from /enterprise/auth/login):
 *    - No org info in sessionStorage
 *    - Authenticate token → get intermediate session + discovered orgs
 *    - Exchange session for the enterprise org
 *    - Store enterprise_user in localStorage → redirect to dashboard
 */

function EnterpriseAuthenticateInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stytch = useStytchB2BClient();
  const { session, isInitialized } = useStytchMemberSession();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [statusMessage, setStatusMessage] = useState('Authenticating...');
  const [errorMessage, setErrorMessage] = useState('');

  const authAttemptedRef = useRef(false);

  useEffect(() => {
    if (!stytch || !isInitialized) return;

    // Already authenticated — redirect
    if (session) {
      const enterpriseUser = localStorage.getItem('enterprise_user');
      if (enterpriseUser) {
        setStatus('success');
        setStatusMessage('Already authenticated');
        setTimeout(() => router.replace('/enterprise/dashboard'), 500);
        return;
      }
    }

    if (authAttemptedRef.current) return;

    const authenticate = async () => {
      authAttemptedRef.current = true;

      try {
        const token = searchParams.get('token');
        const tokenType = searchParams.get('stytch_token_type');

        if (!token) {
          if (!session) {
            setErrorMessage('No authentication token found. Please try again.');
            setStatus('error');
          }
          return;
        }

        console.log('[Enterprise Auth] Authenticating:', { tokenType, hasToken: !!token });
        setStatusMessage('Verifying your identity...');

        // ── Step 1: Authenticate the discovery token ──
        let response: any;

        if (tokenType === 'discovery' || tokenType === 'multi_tenant_magic_links') {
          response = await stytch.magicLinks.discovery.authenticate({
            discovery_magic_links_token: token,
          });
        } else if (tokenType === 'oauth' || tokenType === 'discovery_oauth') {
          response = await stytch.oauth.discovery.authenticate({
            discovery_oauth_token: token,
          });
        } else {
          // Unknown type — try OAuth first, fallback to magic link
          try {
            response = await stytch.oauth.discovery.authenticate({
              discovery_oauth_token: token,
            });
          } catch {
            response = await stytch.magicLinks.discovery.authenticate({
              discovery_magic_links_token: token,
            });
          }
        }

        const discoveredOrgs = response.discovered_organizations || [];
        const emailAddress = response.email_address || '';
        const fullName = response.full_name || emailAddress.split('@')[0];
        const intermediateToken = response.intermediate_session_token;

        if (!intermediateToken) {
          setErrorMessage('Authentication incomplete. Please try again.');
          setStatus('error');
          return;
        }

        // ── Step 2: Check if this is a registration or login ──
        const orgInfoRaw = sessionStorage.getItem('enterprise_register_org_info');

        if (orgInfoRaw) {
          // ═══════════════════════════════════════════
          // REGISTRATION FLOW — create new enterprise org
          // ═══════════════════════════════════════════
          const orgInfo = JSON.parse(orgInfoRaw);
          sessionStorage.removeItem('enterprise_register_org_info');

          console.log('[Enterprise Auth] Registration flow — creating org:', orgInfo.organizationName);
          setStatusMessage('Creating your organization...');

          const orgSlug = orgInfo.organizationDomain
            .split('.')[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-');

          // Create Stytch Organization via discovery
          const createOrgResponse = await stytch.discovery.organizations.create({
            organization_name: orgInfo.organizationName,
            organization_slug: orgSlug,
            session_duration_minutes: 60,
          });

          const member = (createOrgResponse as any).member;
          const organization = (createOrgResponse as any).organization;

          if (!member || !organization) {
            setErrorMessage('Failed to create organization. Please try again.');
            setStatus('error');
            return;
          }

          console.log('[Enterprise Auth] Stytch org created:', organization.organization_id);
          setStatusMessage('Setting up your account...');

          // Parse name from Google profile
          const nameParts = (member.name || fullName || '').split(' ');
          const firstName = nameParts[0] || emailAddress.split('@')[0];
          const lastName = nameParts.slice(1).join(' ') || '';

          // Call backend to create VRIN DynamoDB records
          const registerResponse = await fetch(
            `${API_CONFIG.ENTERPRISE_BASE_URL}/enterprise/auth/register`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                auth_method: 'google_oauth',
                organizationName: orgInfo.organizationName,
                organizationDomain: orgInfo.organizationDomain,
                industry: orgInfo.industry,
                organizationSize: orgInfo.companySize,
                contactEmail: member.email_address || emailAddress,
                firstName,
                lastName,
                stytch_organization_id: organization.organization_id,
                stytch_member_id: member.member_id,
              }),
            }
          );

          const registerData = await registerResponse.json();

          if (registerResponse.ok && registerData.success) {
            // Store enterprise user data
            localStorage.setItem('enterprise_user', JSON.stringify(registerData.user));
            if (registerData.session_jwt) {
              localStorage.setItem('enterprise_token', registerData.session_jwt);
            }
          } else {
            // Backend failed but Stytch org is created — store minimal data so user can still proceed
            console.error('[Enterprise Auth] Backend register failed:', registerData.error);
            localStorage.setItem('enterprise_user', JSON.stringify({
              email: member.email_address || emailAddress,
              firstName,
              lastName,
              role: 'org_owner',
              stytch_organization_id: organization.organization_id,
              stytch_member_id: member.member_id,
            }));
          }

          setStatus('success');
          setStatusMessage('Organization created!');
          setTimeout(() => {
            window.location.href = '/enterprise/dashboard';
          }, 1000);

        } else {
          // ═══════════════════════════════════════════
          // LOGIN FLOW — join existing enterprise org
          // ═══════════════════════════════════════════
          console.log('[Enterprise Auth] Login flow — discovered', discoveredOrgs.length, 'org(s)');

          if (discoveredOrgs.length === 0) {
            setErrorMessage(
              'No enterprise organization found for your account. ' +
              'Please register first or contact your organization admin.'
            );
            setStatus('error');
            return;
          }

          setStatusMessage('Signing you in...');

          // Auto-select first org (most users belong to one enterprise org)
          const selectedOrg = discoveredOrgs[0];
          const orgId = selectedOrg.organization?.organization_id;

          const exchangeResponse = await stytch.discovery.intermediateSessions.exchange({
            organization_id: orgId,
            session_duration_minutes: 1440,
          });

          const member = (exchangeResponse as any).member;
          const organization = (exchangeResponse as any).organization;

          if (!member) {
            setErrorMessage('Failed to sign in. Please try again.');
            setStatus('error');
            return;
          }

          // Store enterprise user data
          const nameParts = (member.name || fullName || '').split(' ');
          localStorage.setItem('enterprise_user', JSON.stringify({
            email: member.email_address || emailAddress,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            role: member.roles?.[0] || 'team_member',
            organizationId: organization?.organization_id || orgId,
            stytch_organization_id: organization?.organization_id || orgId,
            stytch_member_id: member.member_id,
          }));

          setStatus('success');
          setStatusMessage('Welcome back!');
          setTimeout(() => {
            window.location.href = '/enterprise/dashboard';
          }, 1000);
        }

      } catch (err: any) {
        console.error('[Enterprise Auth] Error:', err);
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
        setStatus('error');
      }
    };

    authenticate();
  }, [stytch, isInitialized, session, searchParams, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {statusMessage}
            </h1>
            <p className="text-gray-600">Please wait...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {statusMessage}
            </h1>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/enterprise/auth/login')}
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
              >
                Back to sign in
              </button>
              <button
                onClick={() => router.push('/enterprise/auth/register')}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
              >
                Create an account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function EnterpriseAuthenticateContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <EnterpriseAuthenticateInner />
    </Suspense>
  );
}
