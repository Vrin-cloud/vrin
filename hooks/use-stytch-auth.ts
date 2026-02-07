'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  useStytchMemberSession,
  useStytchMember,
  useStytchOrganization,
  useStytchB2BClient,
} from '@stytch/nextjs/b2b';

/**
 * Stytch B2B Authentication Hook
 *
 * This hook provides a unified interface for Stytch B2B authentication,
 * including session management, member info, and organization context.
 *
 * It also handles mapping Stytch data to VRIN's existing auth patterns
 * for compatibility during the migration period.
 */

interface StytchUser {
  member_id: string;
  email: string;
  name: string;
  organization_id: string;
  organization_name: string;
  // Mapped fields for VRIN compatibility
  user_id: string;
  api_key: string | null; // Will be fetched/generated from VRIN backend
}

interface UseStytchAuthReturn {
  // User/Member info
  user: StytchUser | null;
  member: ReturnType<typeof useStytchMember>['member'];
  organization: ReturnType<typeof useStytchOrganization>['organization'];

  // Session state
  session: ReturnType<typeof useStytchMemberSession>['session'];
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  logout: () => Promise<void>;
  getSessionJWT: () => string | null;

  // VRIN compatibility
  apiKey: string | null;
}

// Storage key for VRIN API key (mapped from Stytch member)
const VRIN_STYTCH_STORAGE_KEY = 'vrin_stytch_auth';

export function useStytchAuth(): UseStytchAuthReturn {
  const stytch = useStytchB2BClient();
  const { session, isInitialized: sessionInitialized } = useStytchMemberSession();
  const { member, isInitialized: memberInitialized } = useStytchMember();
  const { organization } = useStytchOrganization();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [vrinUserId, setVrinUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if user is authenticated
  const isAuthenticated = !!(session && member);

  // Map Stytch member to VRIN user format
  const user: StytchUser | null = member
    ? {
        member_id: member.member_id,
        email: member.email_address,
        name: member.name || member.email_address.split('@')[0],
        organization_id: member.organization_id,
        organization_name: organization?.organization_name || '',
        // VRIN compatibility - use synced user_id when available
        user_id: vrinUserId || member.member_id,
        api_key: apiKey,
      }
    : null;

  // Fetch or sync VRIN API key when Stytch session is established
  useEffect(() => {
    const syncVrinUser = async () => {
      if (!isAuthenticated || !member || !session) {
        setApiKey(null);
        setIsLoading(false);
        return;
      }

      try {
        // Try to get existing API key from localStorage (cache)
        const stored = localStorage.getItem(VRIN_STYTCH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.member_id === member.member_id && parsed.api_key && parsed.user_id) {
            setApiKey(parsed.api_key);
            setVrinUserId(parsed.user_id);
            // Also update vrin_api_key and vrin_user for legacy compatibility
            localStorage.setItem('vrin_api_key', parsed.api_key);
            localStorage.setItem('vrin_user', JSON.stringify({
              user_id: parsed.user_id,
              email: parsed.email,
              name: parsed.name,
            }));
            setIsLoading(false);
            return;
          }
        }

        // Call VRIN backend to sync/create user and get API key
        console.log('[Stytch] Syncing user with VRIN backend:', {
          member_id: member.member_id,
          email: member.email_address,
          organization_id: member.organization_id,
        });

        const response = await fetch('/api/auth/stytch/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            member_id: member.member_id,
            email: member.email_address,
            name: member.name || member.email_address.split('@')[0],
            organization_id: member.organization_id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log('[Stytch] User synced successfully:', {
            user_id: data.user_id,
            is_new_user: data.is_new_user,
            migrated: data.migrated,
          });

          // Store in Stytch-specific cache
          localStorage.setItem(VRIN_STYTCH_STORAGE_KEY, JSON.stringify({
            member_id: member.member_id,
            user_id: data.user_id,
            api_key: data.api_key,
            email: data.email,
            name: data.name,
          }));

          // Also set legacy localStorage keys for compatibility with existing code
          localStorage.setItem('vrin_api_key', data.api_key);
          localStorage.setItem('vrin_user', JSON.stringify({
            user_id: data.user_id,
            email: data.email,
            name: data.name,
          }));

          setApiKey(data.api_key);
          setVrinUserId(data.user_id);
        } else {
          console.error('[Stytch] Failed to sync user:', data.error);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('[Stytch] Failed to sync VRIN user:', error);
        setIsLoading(false);
      }
    };

    if (sessionInitialized && memberInitialized) {
      syncVrinUser();
    }
  }, [isAuthenticated, member, session, sessionInitialized, memberInitialized]);

  // Logout function
  const logout = useCallback(async () => {
    if (!stytch) return;

    try {
      // Clear VRIN storage
      localStorage.removeItem(VRIN_STYTCH_STORAGE_KEY);
      localStorage.removeItem('vrin_auth');
      localStorage.removeItem('vrin_api_key');
      localStorage.removeItem('vrin_chat_session_id');

      // Revoke Stytch session
      await stytch.session.revoke();

      // Redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('[Stytch] Logout failed:', error);
      // Force redirect even on error
      window.location.href = '/auth';
    }
  }, [stytch]);

  // Get session JWT for API calls
  const getSessionJWT = useCallback((): string | null => {
    if (!session) return null;
    // Access the session JWT from the session object
    return (session as any).stytch_session?.session_jwt || null;
  }, [session]);

  return {
    user,
    member,
    organization,
    session,
    isAuthenticated,
    isLoading: isLoading || !sessionInitialized || !memberInitialized,
    logout,
    getSessionJWT,
    apiKey,
  };
}
