'use client';

/**
 * Team Detail Page
 *
 * Displays comprehensive team information including members, settings, and nested teams.
 * Follows the design from FRONTEND_IMPLEMENTATION_GUIDE.md
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeams } from '@/hooks/use-teams';
import { clearanceLevels } from '@/lib/services/enterprise-api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Users,
  Settings,
  UserPlus,
  Edit2,
  Trash2,
  Mail,
  Briefcase,
  Shield,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;

  const { currentTeam, loading, error, fetchTeam, removeMember } = useTeams();

  const [removingMember, setRemovingMember] = useState<string | null>(null);

  // Fetch team on mount
  useEffect(() => {
    if (teamId) {
      loadTeam();
    }
  }, [teamId]);

  const loadTeam = async () => {
    try {
      await fetchTeam(teamId);
    } catch (err) {
      console.error('Failed to load team:', err);
    }
  };

  const handleBack = () => {
    router.push('/enterprise/teams');
  };

  const handleEdit = () => {
    router.push(`/enterprise/teams/${teamId}/edit`);
  };

  const handleAddMember = () => {
    router.push(`/enterprise/teams/${teamId}/add-member`);
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to remove ${userName} from this team?`)) {
      setRemovingMember(userId);
      try {
        await removeMember(teamId, userId);
        await loadTeam(); // Reload team data
      } catch (err) {
        console.error('Failed to remove member:', err);
        alert('Failed to remove member');
      } finally {
        setRemovingMember(null);
      }
    }
  };

  const getClearanceBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      guest: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      standard: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      senior: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      management: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      executive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[level] || colors.standard;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading team...</p>
        </div>
      </div>
    );
  }

  if (error || !currentTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 max-w-md">
          <p className="text-red-800 dark:text-red-300">
            {error || 'Team not found'}
          </p>
          <Button onClick={handleBack} className="mt-4">
            Back to Teams
          </Button>
        </Card>
      </div>
    );
  }

  // Mock members data (in production, this would come from the API)
  const members = currentTeam.members || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {currentTeam.name}
                </h1>
                <Badge
                  variant={currentTeam.status === 'active' ? 'default' : 'secondary'}
                  className={
                    currentTeam.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : ''
                  }
                >
                  {currentTeam.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {currentTeam.team_type}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {currentTeam.description || 'No description provided'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Team
              </Button>
              <Button
                onClick={handleAddMember}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Members */}
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Team Members
                    </h2>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentTeam.member_count} members
                  </span>
                </div>
              </div>

              <div className="p-6">
                {members.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No members yet
                    </p>
                    <Button onClick={handleAddMember} variant="outline">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First Member
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Clearance</TableHead>
                        <TableHead>Departments</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member: any) => (
                        <TableRow key={member.user_id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {member.first_name} {member.last_name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {member.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {member.role.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getClearanceBadgeColor(member.clearance_level)}>
                              {clearanceLevels[member.clearance_level as keyof typeof clearanceLevels]?.label || member.clearance_level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {member.departments?.map((dept: string) => (
                                <Badge key={dept} variant="secondary" className="text-xs">
                                  {dept}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.user_id, `${member.first_name} ${member.last_name}`)}
                              disabled={removingMember === member.user_id}
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Info */}
            <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Team Information
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Created</div>
                  <div className="text-gray-900 dark:text-white">
                    {formatDate(currentTeam.created_at)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</div>
                  <div className="text-gray-900 dark:text-white">
                    {formatDate(currentTeam.updated_at)}
                  </div>
                </div>

                {currentTeam.parent_team_id && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Parent Team</div>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-indigo-600 dark:text-indigo-400"
                      onClick={() => router.push(`/enterprise/teams/${currentTeam.parent_team_id}`)}
                    >
                      View Parent Team
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Team Settings */}
            <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Settings
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Default Clearance
                  </div>
                  <Badge className={getClearanceBadgeColor(currentTeam.settings.default_clearance)}>
                    {clearanceLevels[currentTeam.settings.default_clearance as keyof typeof clearanceLevels]?.label || currentTeam.settings.default_clearance}
                  </Badge>
                </div>

                {currentTeam.settings.max_members && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Max Members
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      {currentTeam.settings.max_members}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Auto-Approve Members
                  </div>
                  <Badge variant={currentTeam.settings.auto_approve_members ? 'default' : 'secondary'}>
                    {currentTeam.settings.auto_approve_members ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
