'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Settings,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Calendar,
  Database,
  Zap,
  AlertTriangle
} from 'lucide-react'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Configuration {
  config_id: string
  organization_id: string
  deployment_mode: string
  cloud_provider: string
  status: 'active' | 'inactive' | 'draft'
  created_at: number
  updated_at: number
  activated_at?: number
  infrastructure: {
    database: {
      type: string
      endpoint: string
    }
    vector_store: {
      type: string
      endpoint: string
    }
    llm: {
      provider: string
      endpoint: string
    }
  }
}

export default function ConfigurationsPage() {
  const { user } = useEnterpriseAuth()
  const organizationId = user?.organizationId

  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activating, setActivating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const loadConfigurations = async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/enterprise/configurations', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setConfigurations(data.configurations || [])
      } else {
        setError(data.error || 'Failed to load configurations')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load configurations')
    } finally {
      setLoading(false)
    }
  }

  const activateConfiguration = async (configId: string) => {
    if (!organizationId) return

    setActivating(configId)

    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`/api/enterprise/configurations/${configId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Configuration activated successfully!')
        await loadConfigurations() // Reload to update statuses
      } else {
        toast.error(data.error || 'Failed to activate configuration')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to activate configuration')
    } finally {
      setActivating(null)
    }
  }

  const deleteConfiguration = async (configId: string) => {
    if (!organizationId) return

    setDeleting(configId)

    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`/api/enterprise/configurations/${configId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Configuration deleted successfully!')
        await loadConfigurations() // Reload to update list
        setShowDeleteConfirm(null)
      } else {
        toast.error(data.error || 'Failed to delete configuration')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete configuration')
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    if (organizationId) {
      loadConfigurations()
    } else {
      setLoading(false)
    }
  }, [organizationId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'inactive':
        return <XCircle className="w-4 h-4" />
      case 'draft':
        return <Clock className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
    }
  }

  const getCloudProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'azure':
        return '☁️'
      case 'aws':
        return '🌩️'
      case 'gcp':
        return '⛅'
      default:
        return '☁️'
    }
  }

  const activeConfiguration = configurations.find(config => config.status === 'active')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading configurations...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Infrastructure Configuration</h1>
              <p className="text-gray-600 mt-1">
                Manage your enterprise cloud infrastructure
              </p>
            </div>
            {configurations.length === 0 ? (
              <Button asChild>
                <Link href="/enterprise/infrastructure" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Configure Infrastructure
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={`/enterprise/infrastructure?config_id=${configurations[0]?.config_id}`} className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Configuration
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Active Configuration Summary */}
        {activeConfiguration && (
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Activity className="w-5 h-5" />
                Active Configuration
              </CardTitle>
              <CardDescription className="text-gray-600">
                This configuration is currently being used for API key operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getCloudProviderIcon(activeConfiguration.cloud_provider)}</div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activeConfiguration.cloud_provider.toUpperCase()} - {activeConfiguration.deployment_mode.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Activated {formatDistanceToNow(new Date(activeConfiguration.activated_at! * 1000), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {configurations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No infrastructure configured yet</h3>
              <p className="text-gray-600 text-center mb-4 max-w-md">
                Connect VRIN to your cloud infrastructure to get started. You&apos;ll need your service endpoints
                and an IAM cross-account role.
              </p>
              <Button asChild>
                <Link href="/enterprise/infrastructure">
                  <Plus className="w-4 h-4 mr-2" />
                  Configure Infrastructure
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {configurations.map((config) => (
              <Card key={config.config_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{getCloudProviderIcon(config.cloud_provider)}</div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {config.cloud_provider.toUpperCase()} — {config.deployment_mode.replace('_', ' ')}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(config.status)}>
                              {getStatusIcon(config.status)}
                              <span className="ml-1 capitalize">{config.status}</span>
                            </Badge>
                            {config.activated_at && (
                              <span className="text-xs text-gray-500">
                                Activated {formatDistanceToNow(new Date(config.activated_at * 1000), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Database className="w-4 h-4" />
                          {config.infrastructure?.database?.type?.replace('_', ' ').toUpperCase() || 'Database'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Zap className="w-4 h-4" />
                          {config.infrastructure?.vector_store?.type?.replace('_', ' ').toUpperCase() || 'Vector Store'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Created {formatDistanceToNow(new Date(config.created_at * 1000), { addSuffix: true })}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p><strong>Database:</strong> {config.infrastructure?.database?.endpoint || 'Not set'}</p>
                        <p><strong>Vector Store:</strong> {config.infrastructure?.vector_store?.endpoint || 'Not set'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {config.status !== 'active' && (
                        <Button
                          onClick={() => activateConfiguration(config.config_id)}
                          disabled={activating === config.config_id}
                          className="bg-gray-900 hover:bg-gray-800"
                        >
                          {activating === config.config_id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Activating...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/enterprise/infrastructure?config_id=${config.config_id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(config.config_id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Configuration</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this configuration? This will permanently remove all settings and cannot be recovered.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1"
                disabled={deleting === showDeleteConfirm}
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteConfiguration(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={deleting === showDeleteConfirm}
              >
                {deleting === showDeleteConfirm ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Configuration'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}