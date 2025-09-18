'use client'

import React, { useEffect } from 'react'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { useOrganization, useApiKeys } from '@/hooks/useEnterprise'
import { EndpointStatusBadge } from '@/components/enterprise/endpoint-health-indicator'
import { ApiKeyHealthDashboard } from '@/components/enterprise/api-key-health-dashboard'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import {
  Rocket,
  Database,
  Shield,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Cloud,
  Key,
  Monitor,
  Zap,
  DollarSign,
  Globe,
  Settings,
  Plus
} from 'lucide-react'

// Real data will come from API calls

export default function EnterpriseOverviewPage() {
  const { user, loading, isAuthenticated } = useEnterpriseAuth()
  const organizationId = user?.organizationId

  // Use real data hooks
  const { organization, loading: orgLoading } = useOrganization(organizationId)
  const { apiKeys, loading: keysLoading } = useApiKeys(organizationId)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/enterprise/auth/login'
    }
  }, [loading, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your enterprise VRIN infrastructure and deployments
          </p>
          {user?.organizationName && (
            <p className="text-sm text-gray-500 mt-1">
              Organization: {user.organizationName}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href="/enterprise/infrastructure">
              <Settings className="w-4 h-4 mr-2" />
              Configure Infrastructure
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/enterprise/infrastructure/status">
              <Monitor className="w-4 h-4 mr-2" />
              View Status
            </a>
          </Button>
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            New Deployment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Deployments</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500 flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    No deployments yet
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">API Keys</p>
                  <p className="text-3xl font-bold text-gray-900">{apiKeys?.length || 0}</p>
                  <p className="text-sm text-gray-500 flex items-center mt-2">
                    <Key className="w-3 h-3 mr-1" />
                    {apiKeys?.length ? `${apiKeys.length} active keys` : 'No keys created'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Spend</p>
                  <p className="text-3xl font-bold text-gray-900">
                    $0
                  </p>
                  <p className="text-sm text-gray-500 flex items-center mt-2">
                    <DollarSign className="w-3 h-3 mr-1" />
                    No spending yet
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">System Uptime</p>
                  <p className="text-3xl font-bold text-gray-900">--</p>
                  <p className="text-sm text-gray-500 flex items-center mt-2">
                    <Activity className="w-3 h-3 mr-1" />
                    No deployments
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Recent Deployments
                  </CardTitle>
                  <CardDescription>Your latest infrastructure deployments</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deployments yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Get started by configuring your infrastructure and creating your first deployment.
                </p>
                <Button asChild>
                  <a href="/enterprise/infrastructure">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Deployment
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Deployment
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/enterprise/api-keys">
                  <Key className="w-4 h-4 mr-2" />
                  Generate API Key
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Security Scan
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Activity className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  No recent activity yet
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* API Keys Health Dashboard - Only show if there are API keys */}
      {apiKeys && apiKeys.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ApiKeyHealthDashboard
            apiKeys={apiKeys}
            organizationId={organizationId!}
            onRefresh={() => window.location.reload()} // TODO: Replace with proper refresh
          />
        </motion.div>
      )}

      {/* Getting Started Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Ready to get started?</h4>
                  <p className="text-sm text-blue-700">
                    Configure your infrastructure to deploy your first VRIN environment
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="/enterprise/infrastructure">
                    <Settings className="w-4 h-4 mr-2" />
                    Get Started
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}