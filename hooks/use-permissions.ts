/**
 * usePermissions Hook
 *
 * React hook for managing permissions and access control in the enterprise portal.
 * Provides methods for policies, access checks, and permission queries.
 */

import { useState, useCallback } from 'react';
import { permissionApi, Policy, AccessCheckResult, UserPermissions } from '@/lib/services/enterprise-api';

export function usePermissions() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [accessCheckResult, setAccessCheckResult] = useState<AccessCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch policies with optional filters
   */
  const fetchPolicies = useCallback(async (filters?: { policy_type?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await permissionApi.listPolicies(filters);
      setPolicies(response.policies);
      return response.policies;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch policies');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single policy by ID
   */
  const fetchPolicy = useCallback(async (policyId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await permissionApi.getPolicy(policyId);
      setCurrentPolicy(response.policy);
      return response.policy;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new policy
   */
  const createPolicy = useCallback(async (data: {
    policy_name: string;
    policy_type: string;
    description?: string;
    rules?: any[];
    applies_to?: any;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await permissionApi.createPolicy(data);

      // Add to policies list
      setPolicies(prev => [...prev, response.policy]);

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing policy
   */
  const updatePolicy = useCallback(async (policyId: string, updates: Partial<Policy>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await permissionApi.updatePolicy(policyId, updates);

      // Update in policies list
      setPolicies(prev =>
        prev.map(policy => (policy.policy_id === policyId ? response.policy : policy))
      );

      // Update current policy if it's the one being updated
      if (currentPolicy?.policy_id === policyId) {
        setCurrentPolicy(response.policy);
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPolicy]);

  /**
   * Delete a policy
   */
  const deletePolicy = useCallback(async (policyId: string, hardDelete: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await permissionApi.deletePolicy(policyId, hardDelete);

      // Remove from policies list if hard delete, otherwise mark as inactive
      if (hardDelete) {
        setPolicies(prev => prev.filter(policy => policy.policy_id !== policyId));
      } else {
        setPolicies(prev =>
          prev.map(policy =>
            policy.policy_id === policyId ? { ...policy, status: 'inactive' as const } : policy
          )
        );
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to delete policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if user can access a resource
   */
  const checkAccess = useCallback(async (data: {
    user_id?: string;
    resource: {
      resource_id: string;
      team_id: string;
      sensitivity_level: string;
      need_to_know_departments?: string[];
    };
    action: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await permissionApi.checkAccess(data);
      setAccessCheckResult(response.access_check);
      return response.access_check;
    } catch (err: any) {
      setError(err.message || 'Failed to check access');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if user has sufficient clearance
   */
  const checkClearance = useCallback(async (data: {
    user_id?: string;
    required_sensitivity: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await permissionApi.checkClearance(data);
      return response.clearance_check;
    } catch (err: any) {
      setError(err.message || 'Failed to check clearance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get user permissions across all teams
   */
  const getUserPermissions = useCallback(async (userId: string, teamId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await permissionApi.getUserPermissions(userId, teamId);
      setUserPermissions(response.permissions);
      return response.permissions;
    } catch (err: any) {
      setError(err.message || 'Failed to get user permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    policies,
    currentPolicy,
    userPermissions,
    accessCheckResult,
    loading,
    error,
    fetchPolicies,
    fetchPolicy,
    createPolicy,
    updatePolicy,
    deletePolicy,
    checkAccess,
    checkClearance,
    getUserPermissions,
  };
}
