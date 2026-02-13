'use client';

import React, { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useStytchB2BClient, useStytchMemberSession } from '@stytch/nextjs/b2b';

/**
 * Enterprise Stytch Authentication Callback
 *
 * Handles two flows:
 *
 * 1. REGISTRATION (Google OAuth from /enterprise/auth/register):
 *    - sessionStorage has `enterprise_register_org_info`
 *    - Authenticate token → get intermediate session
 *    - Validate email domain matches org domain (warn if mismatch)
 *    - Create Stytch org via discovery.organizations.create()
 *    - Call backend to create VRIN DynamoDB records
 *    - Redirect to dashboard
 *
 * 2. LOGIN (Google OAuth or magic link from /enterprise/auth/login):
 *    - No org info in sessionStorage
 *    - Authenticate token → discover orgs → exchange session
 *    - Redirect to dashboard
 */

/** Check if email domain is compatible with the org domain */
function domainsMatch(emailDomain: string, orgDomain: string): boolean {
  const e = emailDomain.toLowerCase();
  const o = orgDomain.toLowerCase();
  if (e === o) return true;
  // Subdomain: email@sub.acme.com matches acme.com
  if (e.endsWith(`.${o}`)) return true;
  // Reverse subdomain: email@acme.com matches sub.acme.com
  if (o.endsWith(`.${e}`)) return true;
  return false;
}

type Status = 'loading' | 'domain_mismatch' | 'success' | 'error';

interface DomainMismatchInfo {
  emailAddress: string;
  emailDomain: string;
  orgDomain: string;
  orgInfo: any;
  fullName: string;
  intermediateToken: string;
}

function EnterpriseAuthenticateInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stytch = useStytchB2BClient();
  const { session, isInitialized } = useStytchMemberSession();

  const [status, setStatus] = useState<Status>('loading');
  const [statusMessage, setStatusMessage] = useState('Authenticating...');
  const [errorMessage, setErrorMessage] = useState('');
  const [mismatchInfo, setMismatchInfo] = useState<DomainMismatchInfo | null>(null);

  const authAttemptedRef = useRef(false);

  /** Shared function: create org + VRIN records after domain is confirmed */
  const completeRegistration = useCallback(async (
    orgInfo: any,
    emailAddress: string,
    fullName: string,
  ) => {
    if (!stytch) return;

    setStatus('loading');
    setStatusMessage('Creating your organization...');

    try {
      const orgSlug = orgInfo.organizationDomain
        .split('.')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');

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

      const nameParts = (member.name || fullName || '').split(' ');
      const firstName = nameParts[0] || emailAddress.split('@')[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const registerResponse = await fetch(
        '/api/auth/stytch/enterprise-register',
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
        localStorage.setItem('enterprise_user', JSON.stringify(registerData.user));
        if (registerData.session_jwt) {
          localStorage.setItem('enterprise_token', registerData.session_jwt);
        }
      } else {
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

    } catch (err: any) {
      console.error('[Enterprise Auth] Registration error:', err);
      setErrorMessage(err.message || 'Failed to create organization. Please try again.');
      setStatus('error');
    }
  }, [stytch]);

  useEffect(() => {
    if (!stytch || !isInitialized) return;

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
          // REGISTRATION FLOW
          // ═══════════════════════════════════════════
          const orgInfo = JSON.parse(orgInfoRaw);
          sessionStorage.removeItem('enterprise_register_org_info');

          // Validate email domain matches org domain
          const emailDomain = emailAddress.split('@')[1] || '';
          const orgDomain = orgInfo.organizationDomain || '';

          if (orgDomain && emailDomain && !domainsMatch(emailDomain, orgDomain)) {
            // Domain mismatch — ask user to confirm
            console.log('[Enterprise Auth] Domain mismatch:', emailDomain, 'vs', orgDomain);
            setMismatchInfo({
              emailAddress,
              emailDomain,
              orgDomain,
              orgInfo,
              fullName,
              intermediateToken,
            });
            setStatus('domain_mismatch');
            return;
          }

          // Domains match — proceed
          await completeRegistration(orgInfo, emailAddress, fullName);

        } else {
          // ═══════════════════════════════════════════
          // LOGIN FLOW
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

          const selectedOrg = discoveredOrgs[0];
          const orgId = selectedOrg.organization?.organization_id;

          const exchangeResponse = await stytch.discovery.intermediateSessions.exchange({
            organization_id: orgId,
            session_duration_minutes: 60,
          });

          const member = (exchangeResponse as any).member;
          const organization = (exchangeResponse as any).organization;

          if (!member) {
            setErrorMessage('Failed to sign in. Please try again.');
            setStatus('error');
            return;
          }

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
  }, [stytch, isInitialized, session, searchParams, router, completeRegistration]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">

        {/* Loading */}
        {status === 'loading' && (
          <div>
            <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {statusMessage}
            </h1>
            <p className="text-gray-600">Please wait...</p>
          </div>
        )}

        {/* Domain Mismatch */}
        {status === 'domain_mismatch' && mismatchInfo && (
          <div>
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Domain mismatch
            </h1>
            <p className="text-gray-600 mb-2">
              Your Google account <span className="font-medium text-gray-900">{mismatchInfo.emailAddress}</span> uses
              a different domain than the organization you&apos;re registering.
            </p>
            <div className="my-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Organization domain:</span>
                <span className="font-medium text-gray-900">{mismatchInfo.orgDomain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Google account domain:</span>
                <span className="font-medium text-gray-900">{mismatchInfo.emailDomain}</span>
              </div>
            </div>
            <div className="space-y-3 mt-6">
              <button
                onClick={() => {
                  // Use the email domain as the org domain
                  const updatedOrgInfo = {
                    ...mismatchInfo.orgInfo,
                    organizationDomain: mismatchInfo.emailDomain,
                  };
                  completeRegistration(updatedOrgInfo, mismatchInfo.emailAddress, mismatchInfo.fullName);
                }}
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
              >
                Use {mismatchInfo.emailDomain} as domain
              </button>
              <button
                onClick={() => {
                  // Keep the original domain and proceed
                  completeRegistration(mismatchInfo.orgInfo, mismatchInfo.emailAddress, mismatchInfo.fullName);
                }}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
              >
                Keep {mismatchInfo.orgDomain} and continue
              </button>
              <button
                onClick={() => router.push('/enterprise/auth/register')}
                className="w-full py-3 px-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Go back to registration
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {statusMessage}
            </h1>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </div>
        )}

        {/* Error */}
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
