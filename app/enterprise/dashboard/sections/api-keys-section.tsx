'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  Shield,
  Activity,
  Calendar,
  Download,
  MessageSquare,
  Settings,
  Database
} from 'lucide-react'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { useApiKeys } from '@/hooks/useEnterprise'
import { setEnterpriseApiKey } from '@/lib/services/enterprise-chat-api'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ApiKeyData {
  id: string
  name: string
  key: string
  prefix: string
  deploymentMode: string
  status: 'active' | 'revoked' | 'expired'
  createdAt: Date
  lastUsed?: Date
  expiresAt?: Date
  permissions: string[]
  description?: string
}

export default function ApiKeysPage() {
  const { user } = useEnterpriseAuth()
  // Handle both camelCase and snake_case field names from backend
  const organizationId = (user as any)?.organizationId || (user as any)?.organization_id
  const { apiKeys, loading, createApiKey, revokeApiKey } = useApiKeys(organizationId)

  const [hasActiveConfig, setHasActiveConfig] = useState<boolean | null>(null)
  const [configLoading, setConfigLoading] = useState(true)

  // Check if an active infrastructure configuration exists
  useEffect(() => {
    const checkConfiguration = async () => {
      if (!organizationId) {
        setConfigLoading(false)
        return
      }

      try {
        const authToken = localStorage.getItem('enterprise_token')
        if (!authToken) {
          setConfigLoading(false)
          return
        }

        const response = await fetch(`/api/enterprise/configurations?organization_id=${organizationId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()

        if (data.success && data.configurations) {
          const active = data.configurations.some((c: any) => c.status === 'active')
          setHasActiveConfig(active)
        } else {
          setHasActiveConfig(false)
        }
      } catch {
        setHasActiveConfig(false)
      } finally {
        setConfigLoading(false)
      }
    }

    checkConfiguration()
  }, [organizationId])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState<{[key: string]: boolean}>({})
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: ['read', 'write'],
    expiresIn: '90' // days
  })

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('API key copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleCreateApiKey = async () => {
    if (!formData.name.trim()) {
      toast.error('API key name is required')
      return
    }

    try {
      // Get user_id from the authenticated user (handle both camelCase and snake_case)
      const userId = (user as any)?.user_id || (user as any)?.userId
      if (!userId) {
        toast.error('User ID not found. Please log in again.')
        return
      }

      const keyData = {
        name: formData.name,
        description: formData.description,
        deployment_mode: 'hybrid_explicit',
        permissions: formData.permissions,
        expires_in_days: parseInt(formData.expiresIn),
        user_id: userId
      }

      const result = await createApiKey(keyData)
      
      if (result.success) {
        // Show the generated API key to the user
        setNewlyCreatedKey(result.api_key)
        setShowNewKeyModal(true)
        setShowCreateForm(false)
        setFormData({
          name: '',
          description: '',
          permissions: ['read', 'write'],
          expiresIn: '90'
        })

        // Automatically set this API key for enterprise chat use
        if (result.api_key) {
          setEnterpriseApiKey(result.api_key)
        }

        // Show success message for the new API key being added to the list
        setTimeout(() => {
          toast.success('✅ New API key has been added to your keys list and is now active for Enterprise Chat!')
        }, 2000)
      } else {
        toast.error(result.error || 'Failed to create API key')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create API key')
    }
  }

  const handleRevokeApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return
    }

    try {
      const result = await revokeApiKey(keyId)
      
      if (result.success) {
        toast.success('API key revoked successfully')
      } else {
        toast.error(result.error || 'Failed to revoke API key')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to revoke API key')
    }
  }


  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gray-100 text-gray-800'
      case 'revoked':
        return 'bg-gray-200 text-gray-600'
      case 'expired':
        return 'bg-gray-200 text-gray-600'
      case 'unknown':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }


  if (loading || configLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading API keys...</span>
        </div>
      </div>
    )
  }

  // Gate: require an active infrastructure configuration before allowing API key operations
  if (!hasActiveConfig) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">API Key Management</h1>
              <p className="text-gray-600 mt-1">
                Generate and manage enterprise API keys for your infrastructure
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Infrastructure required</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                You need to configure and activate your cloud infrastructure before generating API keys.
                API keys are tied to your infrastructure configuration for secure routing.
              </p>
              <Button asChild>
                <Link href="/enterprise/dashboard?section=configurations">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Infrastructure
                </Link>
              </Button>
            </CardContent>
          </Card>
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
              <h1 className="text-2xl font-bold text-gray-900">API Key Management</h1>
              <p className="text-gray-600 mt-1">
                Generate and manage enterprise API keys for your infrastructure
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
              <Plus className="w-4 h-4 mr-2" />
              Generate API Key
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Create API Key Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Generate New API Key
              </CardTitle>
              <CardDescription>
                Create a new enterprise API key for your infrastructure deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">API Key Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Production API Key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresIn">Expires In</Label>
                  <Select
                    value={formData.expiresIn}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, expiresIn: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="0">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this API key will be used for..."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateApiKey}>
                  <Key className="w-4 h-4 mr-2" />
                  Generate API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Keys List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your API Keys</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {apiKeys?.length || 0} total keys
              </Badge>
            </div>
          </div>

          {!apiKeys || !Array.isArray(apiKeys) || apiKeys.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Key className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Generate your first enterprise API key to start using VRIN with your infrastructure.
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate First API Key
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {apiKeys
                .filter((apiKey: any) => {
                  // Filter out invalid API key entries
                  const isValid = apiKey && typeof apiKey === 'object';
                  return isValid;
                }) // Filter out invalid entries
                .map((apiKey: any, index: number) => (
                <Card key={apiKey.id || apiKey.api_key_id || `api-key-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{apiKey.name || 'Unnamed API Key'}</h3>
                          <Badge className={getStatusColor(apiKey.status || 'unknown')}>
                            {apiKey.status || 'unknown'}
                          </Badge>
                        </div>

                        {apiKey.description && (
                          <p className="text-gray-600 mb-3">{apiKey.description}</p>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                          <Label className="text-sm font-medium">API Key:</Label>
                          <div className="flex items-center gap-2 font-mono text-sm bg-gray-50 px-3 py-2 rounded border">
                            <span>
                              {(() => {
                                const keyId = apiKey.id || apiKey.api_key_id;
                                const keyValue = apiKey.key || apiKey.api_key;
                                const keyPrefix = apiKey.key_prefix || apiKey.prefix;
                                
                                // If we have a full key, show it masked/unmasked
                                if (keyValue && keyValue.length > 20) {
                                  return showApiKey[keyId] 
                                    ? keyValue
                                    : `${keyValue.substring(0, 12)}...${keyValue.substring(keyValue.length - 8)}`;
                                }
                                
                                // If we only have a prefix or partial key, show it masked
                                if (keyPrefix) {
                                  return `${keyPrefix}...••••••••••••••••••••••••••••••••••••••••`;
                                }
                                
                                return `vrin_ent_••••••••••••••••••••••••••••••••••••••••`;
                              })()}
                            </span>
                            {/* Only show toggle if we have the actual key value */}
                            {(apiKey.key || apiKey.api_key) && (apiKey.key || apiKey.api_key).length > 20 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const keyId = apiKey.id || apiKey.api_key_id;
                                  toggleApiKeyVisibility(keyId);
                                }}
                                className="h-6 w-6 p-0"
                                title={showApiKey[apiKey.id || apiKey.api_key_id] ? "Hide API key" : "Show API key"}
                              >
                                {showApiKey[apiKey.id || apiKey.api_key_id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </Button>
                            )}
                            {/* Only show copy if we have the actual key value */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const keyValue = apiKey.key || apiKey.api_key;
                                if (keyValue && keyValue.length > 20) {
                                  copyToClipboard(keyValue);
                                } else {
                                  toast.error('Full API key not available for copying. Please regenerate if needed.');
                                }
                              }}
                              disabled={!(apiKey.key || apiKey.api_key) || (apiKey.key || apiKey.api_key).length <= 20}
                              className="h-6 w-6 p-0"
                              title={(apiKey.key || apiKey.api_key) && (apiKey.key || apiKey.api_key).length > 20 ? "Copy API key" : "API key not available for copying"}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Created {apiKey.created_at ? formatDistanceToNow(new Date(apiKey.created_at), { addSuffix: true }) : 'Unknown'}
                          </div>
                          {apiKey.last_used && (
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              Used {formatDistanceToNow(new Date(apiKey.last_used), { addSuffix: true })}
                            </div>
                          )}
                          {apiKey.expires_at && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Expires {formatDistanceToNow(new Date(apiKey.expires_at), { addSuffix: true })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {apiKey.status === 'active' && (
                          <>
                            {/* Use for Chat button - stores API key for enterprise chat */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const keyValue = apiKey.key || apiKey.api_key;
                                if (keyValue && keyValue.length > 20) {
                                  setEnterpriseApiKey(keyValue);
                                  toast.success(`API key "${apiKey.name}" is now active for Enterprise Chat`);
                                } else {
                                  toast.error('Full API key not available. Please regenerate if needed.');
                                }
                              }}
                              disabled={!(apiKey.key || apiKey.api_key) || (apiKey.key || apiKey.api_key).length <= 20}
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                              title="Set this API key as the active key for Enterprise Chat"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Use for Chat
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeApiKey(apiKey.id || apiKey.api_key_id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Revoke
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Usage Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              How Enterprise API Keys Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Key Format</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">vrin_ent_*</code>
                    <span className="text-gray-600">Enterprise API key prefix</span>
                  </div>
                  <p className="text-gray-500 mt-2">
                    The <code className="text-xs bg-gray-100 px-1 rounded">vrin_ent_</code> prefix routes requests through your configured cloud infrastructure via cross-account IAM access.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Security</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Keys are tied to your infrastructure configuration</li>
                  <li>• Data stays in your cloud account at all times</li>
                  <li>• Cross-account access via IAM role assumption</li>
                  <li>• Configurable expiration and revocation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New API Key Modal */}
      {showNewKeyModal && newlyCreatedKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">API Key Created Successfully!</h3>
                <p className="text-sm text-gray-600">Please copy and save this key securely</p>
              </div>
            </div>
            
            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-700">Your API Key:</Label>
              <div className="mt-1 relative">
                <Input
                  type="text"
                  value={newlyCreatedKey}
                  readOnly
                  className="pr-10 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(newlyCreatedKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <Alert className="mb-4">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription className="text-sm">
                <strong>Important:</strong> This API key will only be shown once. Please copy and store it securely.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3">
              <Button
                onClick={() => copyToClipboard(newlyCreatedKey)}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Key
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewKeyModal(false)
                  setNewlyCreatedKey(null)
                }}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}