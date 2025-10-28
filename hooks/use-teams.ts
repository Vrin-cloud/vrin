/**
 * useTeams Hook
 *
 * React hook for managing teams in the enterprise portal.
 * Provides methods for CRUD operations, member management, and state management.
 */

import { useState, useCallback } from 'react';
import { teamApi, Team, TeamMember } from '@/lib/services/enterprise-api';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch teams with optional filters
   */
  const fetchTeams = useCallback(async (filters?: { status?: string; team_type?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teamApi.listTeams(filters);
      setTeams(response.teams);
      return response.teams;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teams');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single team by ID
   */
  const fetchTeam = useCallback(async (teamId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teamApi.getTeam(teamId);
      setCurrentTeam(response.team);
      return response.team;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new team
   */
  const createTeam = useCallback(async (data: {
    name: string;
    team_type: string;
    description?: string;
    parent_team_id?: string;
    settings?: any;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teamApi.createTeam(data);

      // Add to teams list
      setTeams(prev => [...prev, response.team]);

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing team
   */
  const updateTeam = useCallback(async (teamId: string, updates: Partial<Team>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teamApi.updateTeam(teamId, updates);

      // Update in teams list
      setTeams(prev =>
        prev.map(team => (team.team_id === teamId ? response.team : team))
      );

      // Update current team if it's the one being updated
      if (currentTeam?.team_id === teamId) {
        setCurrentTeam(response.team);
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTeam]);

  /**
   * Delete a team
   */
  const deleteTeam = useCallback(async (teamId: string, hardDelete: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teamApi.deleteTeam(teamId, hardDelete);

      // Remove from teams list if hard delete, otherwise mark as inactive
      if (hardDelete) {
        setTeams(prev => prev.filter(team => team.team_id !== teamId));
      } else {
        setTeams(prev =>
          prev.map(team =>
            team.team_id === teamId ? { ...team, status: 'inactive' as const } : team
          )
        );
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to delete team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a member to a team
   */
  const addMember = useCallback(async (
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
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teamApi.addMember(teamId, memberData);

      // Increment member count in teams list
      setTeams(prev =>
        prev.map(team =>
          team.team_id === teamId
            ? { ...team, member_count: team.member_count + 1 }
            : team
        )
      );

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove a member from a team
   */
  const removeMember = useCallback(async (teamId: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await teamApi.removeMember(teamId, userId);

      // Decrement member count in teams list
      setTeams(prev =>
        prev.map(team =>
          team.team_id === teamId
            ? { ...team, member_count: Math.max(0, team.member_count - 1) }
            : team
        )
      );

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to remove member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    teams,
    currentTeam,
    loading,
    error,
    fetchTeams,
    fetchTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
  };
}
