'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  Mail,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  Send,
  Trash2,
  RefreshCw,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

interface TeamMembersSectionProps {
  user: any
}

interface TeamMember {
  user_id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  clearance_level?: string
  department?: string
  joined_at: string
}

interface Invitation {
  invitation_id: string
  email: string
  role: string
  status: string
  clearance_level?: string
  department?: string
  created_at: string
  expires_at: number
}

export default function TeamMembersSection({ user }: TeamMembersSectionProps) {
  // Handle both camelCase and snake_case field names from backend
  const organizationId = user?.organizationId || user?.organization_id

  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [loadingInvitations, setLoadingInvitations] = useState(true)

  // Invite form state
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviteClearance, setInviteClearance] = useState('standard')
  const [inviteDepartment, setInviteDepartment] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [sendingInvite, setSendingInvite] = useState(false)

  useEffect(() => {
    if (organizationId) {
      loadMembers()
      loadInvitations()
    } else {
      setLoadingMembers(false)
      setLoadingInvitations(false)
    }
  }, [organizationId])

  const loadMembers = async () => {
    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) return

      // Try to fetch members from API
      try {
        const response = await fetch(`/api/enterprise/users?organization_id=${organizationId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })

        if (response.ok) {
          const data = await response.json()
          const apiMembers = data.users || []

          // Check if current user is in the list
          const currentUserInList = apiMembers.find((m: TeamMember) => m.user_id === user?.id || m.email === user?.email)

          if (!currentUserInList && user) {
            // Add current user to the list
            const currentUserAsMember: TeamMember = {
              user_id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              status: user.status,
              clearance_level: 'executive', // Default for admins
              department: user.organizationName || 'Management',
              joined_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()
            }
            setMembers([currentUserAsMember, ...apiMembers])
          } else {
            setMembers(apiMembers)
          }
          return
        }
      } catch (apiError) {
        console.log('API not available, showing current user only')
      }

      // Fallback: Show at least the current logged-in user
      if (user) {
        const currentUserAsMember: TeamMember = {
          user_id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
          clearance_level: 'executive',
          department: user.organizationName || 'Management',
          joined_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()
        }
        setMembers([currentUserAsMember])
      }
    } catch (error) {
      console.error('Error loading members:', error)
      // Still show current user even if there's an error
      if (user) {
        const currentUserAsMember: TeamMember = {
          user_id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
          clearance_level: 'executive',
          department: user.organizationName || 'Management',
          joined_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()
        }
        setMembers([currentUserAsMember])
      }
    } finally {
      setLoadingMembers(false)
    }
  }

  const loadInvitations = async () => {
    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) return

      const response = await fetch(`/api/enterprise/users/invitations?organization_id=${organizationId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })

      if (response.ok) {
        const data = await response.json()
        setInvitations(data.invitations || [])
      }
    } catch (error) {
      console.error('Error loading invitations:', error)
      toast.error('Failed to load invitations')
    } finally {
      setLoadingInvitations(false)
    }
  }

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setSendingInvite(true)
    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch('/api/enterprise/users/invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organization_id: organizationId,
          email: inviteEmail,
          role: inviteRole,
          clearance_level: inviteClearance,
          department: inviteDepartment || undefined,
          message: inviteMessage || undefined
        })
      })

      if (response.ok) {
        toast.success(`Invitation email sent to ${inviteEmail}!`)

        // Reset form
        setInviteEmail('')
        setInviteRole('member')
        setInviteClearance('standard')
        setInviteDepartment('')
        setInviteMessage('')
        setShowInviteForm(false)

        // Reload invitations
        loadInvitations()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send invitation')
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      toast.error('Failed to send invitation')
    } finally {
      setSendingInvite(false)
    }
  }

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) return

      const response = await fetch(`/api/enterprise/users/invitations/${invitationId}/resend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      })

      if (response.ok) {
        toast.success('Invitation email resent!')
        loadInvitations()
      } else {
        toast.error('Failed to resend invitation')
      }
    } catch (error) {
      console.error('Error resending invitation:', error)
      toast.error('Failed to resend invitation')
    }
  }

  const handleRevokeInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return

    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) return

      const response = await fetch(`/api/enterprise/users/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      })

      if (response.ok) {
        toast.success('Invitation revoked')
        loadInvitations()
      } else {
        toast.error('Failed to revoke invitation')
      }
    } catch (error) {
      console.error('Error revoking invitation:', error)
      toast.error('Failed to revoke invitation')
    }
  }

  const filteredMembers = members.filter(member =>
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredInvitations = invitations.filter(inv =>
    inv.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Team Members
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your organization&apos;s team members and invitations
            </p>
          </div>
          <Button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Mail className="w-5 h-5" />
                Send Invitation
              </CardTitle>
              <CardDescription className="text-gray-600">
                Invite a new team member to join your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clearance">Clearance Level</Label>
                  <Select value={inviteClearance} onValueChange={setInviteClearance}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="senior_director">Senior Director</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Engineering, Sales, Legal..."
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to the invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="bg-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-blue-700">
                  Invitation will expire in 14 days
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteForm(false)}
                    disabled={sendingInvite}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendInvite}
                    disabled={sendingInvite}
                    className="bg-gray-900 hover:bg-gray-800"
                  >
                    {sendingInvite ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <h3 className="text-3xl font-bold text-gray-900">{members.length}</h3>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Invitations</p>
                <h3 className="text-3xl font-bold text-gray-900">{pendingInvitations.length}</h3>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invitations</p>
                <h3 className="text-3xl font-bold text-gray-900">{invitations.length}</h3>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Search */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'members' ? 'default' : 'outline'}
                onClick={() => setActiveTab('members')}
                className={activeTab === 'members' ? 'bg-gray-900 hover:bg-gray-800' : ''}
              >
                <Users className="w-4 h-4 mr-2" />
                Members ({members.length})
              </Button>
              <Button
                variant={activeTab === 'invitations' ? 'default' : 'outline'}
                onClick={() => setActiveTab('invitations')}
                className={activeTab === 'invitations' ? 'bg-gray-900 hover:bg-gray-800' : ''}
              >
                <Mail className="w-4 h-4 mr-2" />
                Invitations ({invitations.length})
              </Button>
            </div>

            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      {activeTab === 'members' && (
        <Card className="border-gray-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Member</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Clearance</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingMembers ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="text-gray-600">Loading members...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        {searchQuery ? 'No members found' : 'No members added to the organization yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.user_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">
                                  {member.firstName} {member.lastName}
                                </p>
                                {(member.user_id === user?.id || member.email === user?.email) && (
                                  <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50 text-xs">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize">
                            {member.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize">
                            <Shield className="w-3 h-3 mr-1" />
                            {member.clearance_level?.replace('_', ' ') || 'Standard'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.department || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {member.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(member.joined_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invitations Table */}
      {activeTab === 'invitations' && (
        <Card className="border-gray-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Clearance</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sent</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expires</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingInvitations ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="text-gray-600">Loading invitations...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredInvitations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No invitations found
                      </td>
                    </tr>
                  ) : (
                    filteredInvitations.map((invitation) => (
                      <tr key={invitation.invitation_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-900">{invitation.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize">
                            {invitation.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize">
                            {invitation.clearance_level?.replace('_', ' ') || 'Standard'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {invitation.department || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {invitation.status === 'pending' ? (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          ) : invitation.status === 'accepted' ? (
                            <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accepted
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                              {invitation.status}
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(invitation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(invitation.expires_at * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {invitation.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResendInvitation(invitation.invitation_id)}
                                  title="Resend invitation"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRevokeInvitation(invitation.invitation_id)}
                                  title="Revoke invitation"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
