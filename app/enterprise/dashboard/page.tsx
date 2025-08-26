'use client'

import React from 'react'
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

// Mock data - in real implementation, this would come from API
const mockData = {
  deployments: [
    { id: '1', name: 'Production VPC', status: 'completed', lastUpdated: '2 hours ago', cost: 1250 },
    { id: '2', name: 'Staging Environment', status: 'deploying', lastUpdated: '15 minutes ago', cost: 650 },
    { id: '3', name: 'Dev Environment', status: 'pending', lastUpdated: '1 day ago', cost: 450 }
  ],
  metrics: {
    totalDeployments: 3,
    activeAPIKeys: 8,
    monthlySpend: 2350,
    uptime: 99.9,
    lastIncident: '45 days ago'
  },
  recentActivity: [
    { action: 'API key created', user: 'John Doe', time: '5 minutes ago', type: 'info' },
    { action: 'Deployment completed', user: 'System', time: '2 hours ago', type: 'success' },
    { action: 'Security scan passed', user: 'System', time: '6 hours ago', type: 'success' },
    { action: 'User invited', user: 'Jane Smith', time: '1 day ago', type: 'info' }
  ]
}

export default function EnterpriseOverviewPage() {
  // Mock user data for demonstration
  const user = { firstName: 'Admin' }

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
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
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
                  <p className="text-3xl font-bold text-gray-900">{mockData.metrics.totalDeployments}</p>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    2 new this month
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
                  <p className="text-3xl font-bold text-gray-900">{mockData.metrics.activeAPIKeys}</p>
                  <p className="text-sm text-blue-600 flex items-center mt-2">
                    <Key className="w-3 h-3 mr-1" />
                    3 created today
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
                    {formatCurrency(mockData.metrics.monthlySpend)}
                  </p>
                  <p className="text-sm text-orange-600 flex items-center mt-2">
                    <DollarSign className="w-3 h-3 mr-1" />
                    +12% from last month
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
                  <p className="text-3xl font-bold text-gray-900">{mockData.metrics.uptime}%</p>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <Activity className="w-3 h-3 mr-1" />
                    All systems operational
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
              <div className="space-y-4">
                {mockData.deployments.map((deployment, index) => (
                  <motion.div
                    key={deployment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${deployment.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : deployment.status === 'deploying'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {deployment.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : deployment.status === 'deploying' ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{deployment.name}</h4>
                        <p className="text-sm text-gray-500">Updated {deployment.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(deployment.cost)}/month
                        </p>
                        <Badge
                          variant={
                            deployment.status === 'completed' 
                              ? 'secondary' 
                              : deployment.status === 'deploying'
                                ? 'outline'
                                : 'default'
                          }
                          className="text-xs"
                        >
                          {deployment.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
              <Button className="w-full justify-start" variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Generate API Key
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
              <div className="space-y-3">
                {mockData.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={`
                      w-2 h-2 rounded-full mt-2 flex-shrink-0
                      ${activity.type === 'success' 
                        ? 'bg-green-500' 
                        : activity.type === 'info'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                      }
                    `} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">All Systems Operational</h4>
                  <p className="text-sm text-green-700">
                    Last security incident: {mockData.metrics.lastIncident} • 99.9% uptime this month
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Healthy</Badge>
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Status Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}