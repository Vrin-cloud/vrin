'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Settings,
  Key,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  Zap,
  Activity,
  Plus,
  ExternalLink,
  Clock
} from 'lucide-react'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Configuration {
  config_id: string
  status: 'active' | 'inactive' | 'draft'
  cloud_provider: string
  deployment_mode: string
  created_at: number
  activated_at?: number
  infrastructure: {
    database: { type: string; endpoint: string }
    vector_store: { type: string; endpoint: string }
    llm: { provider: string }
  }
}

export default function EnterpriseDashboard() {
  const { user, isAuthenticated, loading } = useEnterpriseAuth()
  const [activeConfiguration, setActiveConfiguration] = useState<Configuration | null>(null)
  const [configurationCount, setConfigurationCount] = useState(0)
  const [loadingConfig, setLoadingConfig] = useState(true)

  const loadConfigurationStatus = async () => {
    if (!user?.organizationId) return

    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) return

      // Load all configurations
      const response = await fetch('/api/enterprise/configurations', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const configurations = data.configurations || []
          setConfigurationCount(configurations.length)
          
          // Find active configuration
          const active = configurations.find((config: Configuration) => config.status === 'active')
          setActiveConfiguration(active || null)
        }
      }
    } catch (error) {
      console.error('Error loading configuration status:', error)
    } finally {
      setLoadingConfig(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.organizationId) {
      loadConfigurationStatus()
    }
  }, [isAuthenticated, user?.organizationId])

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
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/enterprise/auth/login'
    }
    return null
  }

  const hasActiveConfiguration = !!activeConfiguration
  const canCreateApiKeys = hasActiveConfiguration

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}
              </h1>
              <p className="text-gray-600 mt-1">
                Enterprise VRIN Dashboard - {user.organizationName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={hasActiveConfiguration ? "default" : "secondary"} className="px-3 py-1">
                {hasActiveConfiguration ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Configuration Active
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-1" />
                    Setup Required
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>

        {/* Configuration Status Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Infrastructure Configuration</h2>
          
          {loadingConfig ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading configuration...</span>
                </div>
              </CardContent>
            </Card>
          ) : hasActiveConfiguration ? (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  Active Configuration
                </CardTitle>
                <CardDescription className="text-green-700">
                  Your infrastructure is configured and ready for API key generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-2">Configuration Details</p>
                    <div className="space-y-1 text-sm text-green-800">
                      <p><strong>Cloud Provider:</strong> {activeConfiguration.cloud_provider.toUpperCase()}</p>
                      <p><strong>Deployment:</strong> {activeConfiguration.deployment_mode.replace('_', ' ')}</p>
                      <p><strong>Database:</strong> {activeConfiguration.infrastructure.database.type.replace('_', ' ')}</p>
                      <p><strong>Vector Store:</strong> {activeConfiguration.infrastructure.vector_store.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-2">Status</p>
                    <div className="space-y-1 text-sm text-green-800">
                      <p><strong>Activated:</strong> {formatDistanceToNow(new Date(activeConfiguration.activated_at! * 1000), { addSuffix: true })}</p>
                      <p><strong>Total Configurations:</strong> {configurationCount}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4 bg-green-200" />
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-700">
                    ✅ Ready to generate API keys and start using VRIN Enterprise
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="border-green-200 text-green-700 hover:bg-green-100">
                      <Link href="/enterprise/configurations">
                        <Settings className="w-4 h-4 mr-1" />
                        Manage Configurations
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                  Configuration Required
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Set up your infrastructure configuration to start using VRIN Enterprise
                </CardDescription>
              </CardHeader>
              <CardContent>
                {configurationCount > 0 ? (
                  <div className="space-y-4">
                    <p className="text-amber-800">
                      You have {configurationCount} configuration{configurationCount !== 1 ? 's' : ''} but none are active. 
                      Activate a configuration to enable API key generation.
                    </p>
                    <div className="flex gap-3">
                      <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/enterprise/configurations">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Configurations
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="border-amber-200 text-amber-700 hover:bg-amber-100">
                        <Link href="/enterprise/infrastructure">
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Configuration
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-amber-800">
                      Get started by creating your first infrastructure configuration. This will set up your cloud resources and enable VRIN services.
                    </p>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                      <Link href="/enterprise/infrastructure">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Configuration
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* API Keys Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">API Key Management</h2>
          
          <Card className={!canCreateApiKeys ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Enterprise API Keys
              </CardTitle>
              <CardDescription>
                Generate and manage API keys for your VRIN enterprise integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {canCreateApiKeys ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        🎉 You&apos;re all set! Your infrastructure is configured and ready.
                      </p>
                      <p className="text-xs text-blue-700">
                        Generate your first API key to start using VRIN services with your private infrastructure.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/enterprise/api-keys">
                        <Plus className="w-4 h-4 mr-2" />
                        Generate Your First API Key
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/enterprise/api-keys">
                        <Key className="w-4 h-4 mr-2" />
                        Manage API Keys
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="text-amber-800">
                      API key generation is disabled. Please configure and activate your infrastructure first.
                    </AlertDescription>
                  </Alert>
                  <div className="text-sm text-gray-500">
                    <p><strong>Required steps:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 mt-2">
                      <li>Configure your cloud infrastructure (Azure, AWS, or GCP)</li>
                      <li>Activate the configuration</li>
                      <li>Generate API keys for your applications</li>
                    </ol>
                  </div>
                  <Button disabled variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Manage API Keys (Disabled)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <Link href="/enterprise/infrastructure" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Infrastructure Setup</p>
                    <p className="text-sm text-gray-600">Configure cloud resources</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <Link href="/enterprise/configurations" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Configurations</p>
                    <p className="text-sm text-gray-600">Manage all configurations</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </Link>
              </CardContent>
            </Card>

            <Card className={`hover:shadow-md transition-shadow ${canCreateApiKeys ? 'cursor-pointer' : 'opacity-60'}`}>
              <CardContent className="p-4">
                {canCreateApiKeys ? (
                  <Link href="/enterprise/api-keys" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">API Keys</p>
                      <p className="text-sm text-gray-600">Generate & manage keys</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">API Keys</p>
                      <p className="text-sm text-gray-400">Requires active configuration</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}