/**
 * Enterprise Portal API Client
 *
 * Provides comprehensive API methods for VRIN's enterprise multi-tenant portal.
 * Handles teams, permissions, policies, access control, and user management.
 *
 * Based on FRONTEND_IMPLEMENTATION_GUIDE.md and backend Lambda functions.
 */

// ============================================================================
// API ENDPOINTS
// ============================================================================

const TEAM_API_BASE = 'https://tug6uyfdb4.execute-api.us-east-1.amazonaws.com/dev';
const PERMISSION_API_BASE = 'https://e4oqdoz0j4.execute-api.us-east-1.amazonaws.com/dev';
const AUTH_API_BASE = 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Team {
  team_id: string;
  organization_id: string;
  name: string;
  description: string;
  team_type: 'workspace' | 'department' | 'project' | 'executive';
  status: 'active' | 'inactive';
  member_count: number;
  members?: TeamMember[];  // Optional array of team members
  created_at: number;
  created_by: string;
  updated_at: number;
  parent_team_id?: string;
  settings: {
    default_clearance: string;
    auto_approve_members: boolean;
    max_members: number | null;
  };
}

export interface TeamMember {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'org_admin' | 'team_admin' | 'member' | 'guest';
  clearance_level: 'guest' | 'standard' | 'senior' | 'management' | 'executive';
  departments: string[];
  job_title: string;
  employment_type: 'full_time' | 'contractor' | 'intern';
  joined_at: number;
  permissions?: string[];
}

export interface Policy {
  policy_id: string;
  organization_id: string;
  policy_name: string;
  policy_type: 'team_default' | 'user_custom' | 'resource_override';
  description: string;
  rules: Array<{
    action: string;
    resource_types: string[];
    allowed: boolean;
  }>;
  applies_to: {
    teams?: string[];
    users?: string[];
  };
  status: 'active' | 'inactive';
  created_at: number;
  created_by: string;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason: string;
  layer_results: {
    team_boundary?: {
      passed: boolean;
      reason: string;
    };
    clearance_level?: {
      passed: boolean;
      reason: string;
      user_clearance?: string;
      resource_sensitivity?: string;
    };
    role_permissions?: {
      passed: boolean;
      reason: string;
    };
    need_to_know?: {
      passed: boolean;
      reason: string;
    };
  };
}

export interface UserPermissions {
  user_id: string;
  organization_id: string;
  global_clearance_level: string;
  all_teams: Array<{
    team_id: string;
    team_name: string;
    role: string;
    clearance_level: string;
    permissions: string[];
  }>;
  current_team?: {
    team_id: string;
    team_name: string;
    job_title: string;
    departments: string[];
    permissions: string[];
  };
}

export interface UserContext {
  user_id: string;
  organization_id: string;
  email: string;
  name: string;
  role: string;
  highest_clearance: string;
  teams: Array<{
    team_id: string;
    team_name: string;
    team_type: string;
    role: string;
    clearance_level: string;
    departments: string[];
    job_title: string;
    joined_at: number;
  }>;
  team_count: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get authentication headers with Bearer token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || ''}`,
  };
};

/**
 * Make authenticated API call
 */
async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired - redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/enterprise/auth/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// TEAM MANAGEMENT API
// ============================================================================

export const teamApi = {
  /**
   * Create a new team
   */
  async createTeam(data: {
    name: string;
    team_type: string;
    description?: string;
    parent_team_id?: string;
    settings?: any;
  }): Promise<{ success: boolean; team_id: string; team: Team }> {
    return apiCall(`${TEAM_API_BASE}/teams`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get team by ID
   */
  async getTeam(teamId: string): Promise<{ success: boolean; team: Team }> {
    return apiCall(`${TEAM_API_BASE}/teams/${teamId}`, {
      method: 'GET',
    });
  },

  /**
   * List teams with optional filters
   */
  async listTeams(filters?: {
    status?: string;
    team_type?: string;
  }): Promise<{ success: boolean; teams: Team[]; count: number }> {
    const params = new URLSearchParams(filters as any);
    return apiCall(`${TEAM_API_BASE}/teams?${params.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * Update team
   */
  async updateTeam(
    teamId: string,
    updates: Partial<Team>
  ): Promise<{ success: boolean; team: Team }> {
    return apiCall(`${TEAM_API_BASE}/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete team (soft delete by default)
   */
  async deleteTeam(
    teamId: string,
    hardDelete: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    return apiCall(
      `${TEAM_API_BASE}/teams/${teamId}?hard_delete=${hardDelete}`,
      {
        method: 'DELETE',
      }
    );
  },

  /**
   * Add member to team
   */
  async addMember(
    teamId: string,
    memberData: {
      user_id: string;
      role: string;
      clearance_level: string;
      departments?: string[];
      job_title?: string;
      employment_type: string;
      permissions?: string[];
    }
  ): Promise<{ success: boolean }> {
    return apiCall(`${TEAM_API_BASE}/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  /**
   * Remove member from team
   */
  async removeMember(
    teamId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    return apiCall(`${TEAM_API_BASE}/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// PERMISSION & ACCESS CONTROL API
// ============================================================================

export const permissionApi = {
  /**
   * Create access control policy
   */
  async createPolicy(data: {
    policy_name: string;
    policy_type: string;
    description?: string;
    rules?: any[];
    applies_to?: any;
  }): Promise<{ success: boolean; policy_id: string; policy: Policy }> {
    return apiCall(`${PERMISSION_API_BASE}/policies`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get policy by ID
   */
  async getPolicy(policyId: string): Promise<{ success: boolean; policy: Policy }> {
    return apiCall(`${PERMISSION_API_BASE}/policies/${policyId}`, {
      method: 'GET',
    });
  },

  /**
   * List policies with optional filters
   */
  async listPolicies(filters?: {
    policy_type?: string;
  }): Promise<{ success: boolean; policies: Policy[]; count: number }> {
    const params = new URLSearchParams(filters as any);
    return apiCall(`${PERMISSION_API_BASE}/policies?${params.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * Update policy
   */
  async updatePolicy(
    policyId: string,
    updates: Partial<Policy>
  ): Promise<{ success: boolean; policy: Policy }> {
    return apiCall(`${PERMISSION_API_BASE}/policies/${policyId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete policy
   */
  async deletePolicy(
    policyId: string,
    hardDelete: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    return apiCall(
      `${PERMISSION_API_BASE}/policies/${policyId}?hard_delete=${hardDelete}`,
      {
        method: 'DELETE',
      }
    );
  },

  /**
   * Check if user can access a resource
   */
  async checkAccess(data: {
    user_id?: string;
    resource: {
      resource_id: string;
      team_id: string;
      sensitivity_level: string;
      need_to_know_departments?: string[];
    };
    action: string;
  }): Promise<{ success: boolean; access_check: AccessCheckResult }> {
    return apiCall(`${PERMISSION_API_BASE}/access-check`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Check if user has sufficient clearance
   */
  async checkClearance(data: {
    user_id?: string;
    required_sensitivity: string;
  }): Promise<{
    success: boolean;
    clearance_check: {
      has_clearance: boolean;
      user_clearance: string;
      required_sensitivity: string;
      reason: string;
    };
  }> {
    return apiCall(`${PERMISSION_API_BASE}/clearance-check`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get user permissions across all teams
   */
  async getUserPermissions(
    userId: string,
    teamId?: string
  ): Promise<{ success: boolean; permissions: UserPermissions }> {
    const params = teamId ? `?team_id=${teamId}` : '';
    return apiCall(`${PERMISSION_API_BASE}/users/${userId}/permissions${params}`, {
      method: 'GET',
    });
  },
};

// ============================================================================
// ENTERPRISE PORTAL API
// ============================================================================

export const enterpriseApi = {
  /**
   * Get user context (teams, permissions, clearance)
   */
  async getUserContext(): Promise<{ success: boolean; user_context: UserContext }> {
    return apiCall(`${AUTH_API_BASE}/enterprise/user-context`, {
      method: 'GET',
    });
  },

  /**
   * List organization teams
   */
  async listOrganizationTeams(organizationId: string, filters?: {
    team_type?: string;
    status?: string;
  }): Promise<{ success: boolean; teams: Team[]; count: number }> {
    const params = new URLSearchParams({ organization_id: organizationId, ...filters } as any);
    return apiCall(`${AUTH_API_BASE}/enterprise/teams?${params.toString()}`, {
      method: 'GET',
    });
  },
};

// ============================================================================
// CLEARANCE LEVEL UTILITIES
// ============================================================================

export const clearanceLevels = {
  guest: {
    label: 'Guest',
    description: 'External contractors, limited access',
    color: 'gray',
    numeric: 1,
  },
  standard: {
    label: 'Standard',
    description: 'Regular employees',
    color: 'blue',
    numeric: 2,
  },
  senior: {
    label: 'Senior',
    description: 'Senior employees, team leads',
    color: 'green',
    numeric: 3,
  },
  management: {
    label: 'Management',
    description: 'Managers, directors',
    color: 'orange',
    numeric: 4,
  },
  executive: {
    label: 'Executive',
    description: 'C-suite, board members',
    color: 'red',
    numeric: 5,
  },
};

export const sensitivityLevels = {
  public: {
    label: 'Public',
    description: 'Publicly shareable information',
    numeric: 1,
  },
  internal: {
    label: 'Internal',
    description: 'Internal company information',
    numeric: 2,
  },
  confidential: {
    label: 'Confidential',
    description: 'Sensitive business information',
    numeric: 3,
  },
  restricted: {
    label: 'Restricted',
    description: 'Highly sensitive management information',
    numeric: 4,
  },
  executive: {
    label: 'Executive',
    description: 'Executive-level strategic information',
    numeric: 5,
  },
};

/**
 * Check if user clearance is sufficient for resource sensitivity
 */
export function hasSufficientClearance(
  userClearance: keyof typeof clearanceLevels,
  resourceSensitivity: keyof typeof sensitivityLevels
): boolean {
  return (
    clearanceLevels[userClearance].numeric >=
    sensitivityLevels[resourceSensitivity].numeric
  );
}
