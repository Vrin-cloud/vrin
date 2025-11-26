'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  Mail,
  Key,
  Settings,
  Database,
  Activity,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import ChatWidget from './chat-widget'

interface OverviewSectionProps {
  user: any
}

interface EnterpriseStats {
  totalUsers: number
  pendingInvitations: number
  activeApiKeys: number
  activeConfigurations: number
  usersChange: number
  invitationsChange: number
  apiKeysChange: number
  configurationsChange: number
}

export default function OverviewSection({ user }: OverviewSectionProps) {
  const router = useRouter()
  // Handle both camelCase and snake_case field names from backend
  const organizationId = user?.organizationId || user?.organization_id

  const [stats, setStats] = useState<EnterpriseStats>({
    totalUsers: 0,
    pendingInvitations: 0,
    activeApiKeys: 0,
    activeConfigurations: 0,
    usersChange: 0,
    invitationsChange: 0,
    apiKeysChange: 0,
    configurationsChange: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    loadEnterpriseStats()
  }, [organizationId])

  const loadEnterpriseStats = async () => {
    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) return

      // Load users count
      const usersResponse = await fetch(`/api/enterprise/users?organization_id=${organizationId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })

      // Load invitations count
      const invitationsResponse = await fetch(`/api/enterprise/users/invitations?organization_id=${organizationId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setStats(prev => ({
          ...prev,
          totalUsers: usersData.users?.length || 0,
          usersChange: 12 // Mock data
        }))
      }

      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json()
        const pendingInvitations = invitationsData.invitations?.filter((inv: any) => inv.status === 'pending').length || 0
        setStats(prev => ({
          ...prev,
          pendingInvitations,
          invitationsChange: 5
        }))
      }

      // Mock data for other stats
      setStats(prev => ({
        ...prev,
        activeApiKeys: 3,
        activeConfigurations: 1,
        apiKeysChange: 0,
        configurationsChange: 0
      }))

    } catch (error) {
      console.error('Error loading enterprise stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleNavigate = (section: string) => {
    router.push(`/enterprise/dashboard?section=${section}`, { scroll: false })
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}
            </h1>
            <p className="text-gray-500 mt-2">
              Your knowledge graph is growing. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm bg-gray-50">
            <Activity className="w-4 h-4 mr-2" />
            {user.organizationName}
          </Badge>
        </div>
      </motion.div>

      {/* Stats Grid - Clean flat design with border */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border border-gray-200 rounded-2xl">
        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleNavigate('team-members')}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs">
              +{stats.usersChange}%
            </Badge>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">
            {loadingStats ? '...' : stats.totalUsers}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Team Members</p>
        </motion.div>

        {/* Pending Invitations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => handleNavigate('team-members')}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 text-xs">
              +{stats.invitationsChange}%
            </Badge>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">
            {loadingStats ? '...' : stats.pendingInvitations}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Pending Invitations</p>
        </motion.div>

        {/* Active API Keys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => handleNavigate('api-keys')}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Key className="w-5 h-5 text-green-600" />
            </div>
            <Badge variant="outline" className="text-gray-500 border-gray-200 bg-gray-50 text-xs">
              {stats.apiKeysChange === 0 ? 'Stable' : `+${stats.apiKeysChange}%`}
            </Badge>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">
            {loadingStats ? '...' : stats.activeApiKeys}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Active API Keys</p>
        </motion.div>

        {/* Infrastructure Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => handleNavigate('infrastructure')}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Database className="w-5 h-5 text-orange-600" />
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">
            {loadingStats ? '...' : stats.activeConfigurations}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Configurations</p>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Knowledge Assistant Chat Widget */}
      <ChatWidget organizationName={user.organizationName} />

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Quick Actions - Clean flat design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border border-gray-200 rounded-2xl">
          {/* Invite Members */}
          <div
            onClick={() => handleNavigate('team-members')}
            className="group cursor-pointer flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Invite Members</h3>
              <p className="text-sm text-gray-500">Add team members</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Manage API Keys */}
          <div
            onClick={() => handleNavigate('api-keys')}
            className="group cursor-pointer flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">API Keys</h3>
              <p className="text-sm text-gray-500">Generate & manage keys</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Infrastructure */}
          <div
            onClick={() => handleNavigate('infrastructure')}
            className="group cursor-pointer flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Infrastructure</h3>
              <p className="text-sm text-gray-500">Configure cloud resources</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Settings */}
          <div
            onClick={() => handleNavigate('configurations')}
            className="group cursor-pointer flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Configurations</h3>
              <p className="text-sm text-gray-500">Manage all configurations</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
