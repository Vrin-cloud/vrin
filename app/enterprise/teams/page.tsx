'use client';

/**
 * Teams List Page
 *
 * Displays all teams in the organization with filtering, search, and management capabilities.
 * Follows the design from FRONTEND_IMPLEMENTATION_GUIDE.md
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeams } from '@/hooks/use-teams';
import { Team } from '@/lib/services/enterprise-api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Building2,
  FolderKanban,
  Crown,
  Plus,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Team type icons
const teamTypeIcons = {
  workspace: Building2,
  department: Users,
  project: FolderKanban,
  executive: Crown,
};

// Team type colors
const teamTypeColors = {
  workspace: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  department: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  project: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  executive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function TeamsListPage() {
  const router = useRouter();
  const { teams, loading, error, fetchTeams, deleteTeam } = useTeams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch teams on mount
  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (typeFilter !== 'all') filters.team_type = typeFilter;
      await fetchTeams(filters);
    } catch (err) {
      console.error('Failed to load teams:', err);
    }
  };

  // Reload teams when filters change
  useEffect(() => {
    if (teams.length > 0 || !loading) {
      loadTeams();
    }
  }, [statusFilter, typeFilter]);

  // Filter teams by search query (client-side)
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = () => {
    router.push('/enterprise/teams/create');
  };

  const handleViewTeam = (teamId: string) => {
    router.push(`/enterprise/teams/${teamId}`);
  };

  const handleEditTeam = (teamId: string) => {
    router.push(`/enterprise/teams/${teamId}/edit`);
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (confirm(`Are you sure you want to delete team "${teamName}"? This will soft-delete the team (mark as inactive).`)) {
      try {
        await deleteTeam(teamId, false);
        loadTeams();
      } catch (err) {
        console.error('Failed to delete team:', err);
        alert('Failed to delete team');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Teams
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage teams across your organization
              </p>
            </div>
            <Button
              onClick={handleCreateTeam}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTeams.length} of {teams.length} teams
          </div>
        </Card>

        {/* Loading State */}
        {loading && teams.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading teams...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </Card>
        )}

        {/* Teams Grid */}
        {!loading && filteredTeams.length === 0 && !error && (
          <Card className="p-12 text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No teams found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first team'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateTeam}>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            )}
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const Icon = teamTypeIcons[team.team_type as keyof typeof teamTypeIcons];
            const colorClass = teamTypeColors[team.team_type as keyof typeof teamTypeColors];

            return (
              <Card
                key={team.team_id}
                className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                onClick={() => handleViewTeam(team.team_id)}
              >
                {/* Team Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleViewTeam(team.team_id);
                      }}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEditTeam(team.team_id);
                      }}>
                        Edit Team
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTeam(team.team_id, team.name);
                        }}
                      >
                        Delete Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Team Name */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {team.name}
                </h3>

                {/* Team Description */}
                {team.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {team.description}
                  </p>
                )}

                {/* Team Metadata */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="capitalize">
                    {team.team_type}
                  </Badge>
                  <Badge
                    variant={team.status === 'active' ? 'default' : 'secondary'}
                    className={
                      team.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : ''
                    }
                  >
                    {team.status}
                  </Badge>
                </div>

                {/* Member Count */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {team.member_count} {team.member_count === 1 ? 'member' : 'members'}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
