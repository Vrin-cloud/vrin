'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  useStytchMemberSession,
  useStytchMember,
  useStytchOrganization,
  useStytchB2BClient,
} from '@stytch/nextjs/b2b';
import { API_CONFIG } from '@/config/api';

/**
 * Enterprise Stytch B2B Authentication Hook
 *
 * Wraps the standard Stytch B2B hooks with enterprise-specific context:
 *   - VRIN organization mapping (Stytch org → VRIN enterprise org)
 *   - RBAC role/permission checks from Stytch + VRIN
 *   - Clearance level and department from trusted_metadata
 *   - Infrastructure config fetching for enterprise dashboard
 *
 * This replaces the old useEnterpriseAuth() hook that relied on
 * localStorage-based base64 JSON tokens.
 */

export interface EnterpriseStytchUser {
  // Stytch fields
  member_id: string;
  email: string;
  name: string;
  stytch_organization_id: string;
  stytch_organization_name: string;

  // VRIN enterprise fields (synced from backend)
  id: string; // VRIN user_id
  organizationId: string; // VRIN organization_id
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];

  // Stytch trusted_metadata
  clearance_level?: string;
  department?: string;
}

interface UseEnterpriseStytchAuthReturn {
  user: EnterpriseStytchUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  session: ReturnType<typeof useStytchMemberSession>['session'];
  organization: ReturnType<typeof useStytchOrganization>['organization'];

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getSessionJWT: () => string | null;

  // Permission helpers
  hasPermission: (permission: string) => boolean;
  canManageUsers: boolean;
  canManageDeployments: boolean;
  canViewBilling: boolean;
}

const ENTERPRISE_STORAGE_KEY = 'vrin_enterprise_stytch_auth';

export function useEnterpriseStytchAuth(): UseEnterpriseStytchAuthReturn {
  const stytch = useStytchB2BClient();
  const { session, isInitialized: sessionInitialized } = useStytchMemberSession();
  const { member, isInitialized: memberInitialized } = useStytchMember();
  const { organization } = useStytchOrganization();

  const [user, setUser] = useState<EnterpriseStytchUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!(session && member && user);

  // Sync Stytch member with VRIN enterprise backend
  useEffect(() => {
    const syncEnterpriseUser = async () => {
      if (!session || !member) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Get session JWT from Stytch SDK (used for API auth + enterprise_token)
        const tokens = stytch?.session?.getTokens();
        const sessionJwt = tokens?.session_jwt || null;

        // Store enterprise_token for backward-compatible API calls
        if (sessionJwt) {
          localStorage.setItem('enterprise_token', sessionJwt);
        }

        // Check localStorage cache first
        const stored = localStorage.getItem(ENTERPRISE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.member_id === member.member_id && parsed.id && parsed.organizationId) {
            setUser(parsed);
            // Also set legacy keys for backward compatibility
            localStorage.setItem('enterprise_user', JSON.stringify(parsed));
            setLoading(false);
            return;
          }
        }

        // Call VRIN backend to sync
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
          // For enterprise users, fetch additional details from portal API
          let enterpriseDetails: any = null;

          if (data.is_enterprise && sessionJwt) {
            try {
              const detailsResp = await fetch(
                `${API_CONFIG.ENTERPRISE_BASE_URL}/enterprise/auth/me`,
                {
                  headers: {
                    Authorization: `Bearer ${sessionJwt}`,
                  },
                }
              );
              if (detailsResp.ok) {
                const detailsData = await detailsResp.json();
                enterpriseDetails = detailsData.user;
              }
            } catch {
              // Fall back to sync data
            }
          }

          // Extract trusted_metadata from Stytch member
          const trustedMeta = (member as any)?.trusted_metadata || {};
          const displayName = member.name || member.email_address.split('@')[0];
          const nameParts = displayName.split(' ');

          const enterpriseUser: EnterpriseStytchUser = {
            member_id: member.member_id,
            email: member.email_address,
            name: displayName,
            stytch_organization_id: member.organization_id,
            stytch_organization_name: organization?.organization_name || '',
            id: enterpriseDetails?.id || data.user_id,
            organizationId: enterpriseDetails?.organizationId || data.organization_id || '',
            firstName: enterpriseDetails?.firstName || nameParts[0] || '',
            lastName: enterpriseDetails?.lastName || nameParts.slice(1).join(' ') || '',
            role: enterpriseDetails?.role || data.role || 'team_member',
            permissions: enterpriseDetails?.permissions || [],
            clearance_level: trustedMeta.clearance_level,
            department: trustedMeta.department,
          };

          // Cache
          localStorage.setItem(ENTERPRISE_STORAGE_KEY, JSON.stringify(enterpriseUser));
          // Legacy compatibility
          localStorage.setItem('enterprise_user', JSON.stringify(enterpriseUser));

          setUser(enterpriseUser);
        } else {
          console.error('[Enterprise Stytch] Sync failed:', data.error);
        }

        setLoading(false);
      } catch (error) {
        console.error('[Enterprise Stytch] Failed to sync:', error);
        setLoading(false);
      }
    };

    if (sessionInitialized && memberInitialized) {
      syncEnterpriseUser();
    }
  }, [session, member, sessionInitialized, memberInitialized, organization]);

  // Login with Stytch password
  const login = useCallback(async (email: string, password: string) => {
    try {
      // Use our password endpoint which handles org discovery
      const response = await fetch('/api/auth/stytch/enterprise-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error during login' };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      localStorage.removeItem(ENTERPRISE_STORAGE_KEY);
      localStorage.removeItem('enterprise_user');
      localStorage.removeItem('enterprise_token');

      if (stytch) {
        await stytch.session.revoke();
      }

      window.location.href = '/enterprise/auth/login';
    } catch (error) {
      console.error('[Enterprise Stytch] Logout failed:', error);
      window.location.href = '/enterprise/auth/login';
    }
  }, [stytch]);

  // Get session JWT for API calls
  const getSessionJWT = useCallback((): string | null => {
    if (!session) return null;
    return (session as any)?.stytch_session?.session_jwt || null;
  }, [session]);

  // Permission helpers
  const role = user?.role || '';
  const permissions = user?.permissions || [];
  const isOwnerOrAdmin = ['org_owner', 'owner', 'org_admin', 'admin'].includes(role);

  const hasPermission = useCallback((permission: string): boolean => {
    return permissions.includes('*') || permissions.includes(permission) || isOwnerOrAdmin;
  }, [permissions, isOwnerOrAdmin]);

  return {
    user,
    loading: loading || !sessionInitialized || !memberInitialized,
    isAuthenticated,
    session,
    organization,
    login,
    logout,
    getSessionJWT,
    hasPermission,
    canManageUsers: hasPermission('manage_users') || isOwnerOrAdmin,
    canManageDeployments: hasPermission('manage_deployments') || ['org_owner', 'owner', 'org_admin', 'admin', 'developer'].includes(role),
    canViewBilling: hasPermission('view_billing') || isOwnerOrAdmin,
  };
}
