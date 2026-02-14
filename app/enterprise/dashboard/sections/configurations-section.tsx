'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Settings,
  Cloud,
  Shield,
  Save,
  CheckCircle,
  Info,
  Database,
  Search,
  Brain,
  Key,
  HardDrive,
  Zap,
  Pencil,
  ArrowLeft,
  Calendar,
  Activity,
  AlertTriangle,
} from 'lucide-react'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { useConfiguration } from '@/hooks/useEnterprise'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { EndpointHealthIndicator } from '@/components/enterprise/endpoint-health-indicator'
import { EnterpriseValidationService, ValidationResult } from '@/lib/enterprise-validation'

interface ConfigurationData {
  config_id: string
  organization_id: string
  deployment_mode: string
  cloud_provider: string
  status: string
  created_at: number
  updated_at: number
  activated_at?: number
  infrastructure: {
    database: { type: string; endpoint: string; port?: number; region?: string }
    vector_store: { type: string; endpoint: string }
    llm: { provider: string }
    iam?: { role_arn: string; external_id: string; region?: string }
    storage?: { bucket?: string; s3_bucket?: string; region?: string }
  }
}

export default function ConfigurationsPage() {
  const { user } = useEnterpriseAuth()
  const organizationId = user?.organizationId

  const {
    loading: isLoadingHook,
    saveConfiguration: saveEnterpriseConfiguration,
    validateConfiguration,
  } = useConfiguration(organizationId)

  // State
  const [config, setConfig] = useState<ConfigurationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'view' | 'form'>('view')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Form state
  const [selectedProvider, setSelectedProvider] = useState('aws')
  const [formData, setFormData] = useState({
    organizationName: '',
    // AWS
    awsNeptuneEndpoint: '',
    awsNeptunePort: '8182',
    awsOpenSearchEndpoint: '',
    awsS3Bucket: '',
    awsRegion: 'us-east-1',
    awsRoleArn: '',
    awsExternalId: '',
    // Azure
    azureCosmosDbEndpoint: '',
    azureCognitiveSearchEndpoint: '',
    azureCognitiveSearchApiKey: '',
    azureStorageAccount: '',
  })

  // Endpoint health states
  const [endpointHealth, setEndpointHealth] = useState<{
    database: { status: 'healthy' | 'unhealthy' | 'testing' | 'unknown' | 'error'; lastChecked?: Date; error?: string }
    vectorStore: { status: 'healthy' | 'unhealthy' | 'testing' | 'unknown' | 'error'; lastChecked?: Date; error?: string }
  }>({
    database: { status: 'unknown' },
    vectorStore: { status: 'unknown' },
  })

  // Load configuration
  const loadConfiguration = async () => {
    if (!organizationId) return

    setLoading(true)
    setError(null)

    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) throw new Error('Not authenticated')

      const response = await fetch(`/api/enterprise/configurations?organization_id=${organizationId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success && data.configurations?.length > 0) {
        setConfig(data.configurations[0])
        setMode('view')
      } else {
        setConfig(null)
        setMode('form')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load configuration')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (organizationId) {
      loadConfiguration()
    } else {
      setLoading(false)
    }
  }, [organizationId])

  // Populate form from existing config when entering edit mode
  const enterEditMode = () => {
    if (config) {
      const infra = config.infrastructure
      setSelectedProvider(config.cloud_provider || 'aws')
      setFormData({
        organizationName: '',
        awsNeptuneEndpoint: infra?.database?.endpoint || '',
        awsNeptunePort: String(infra?.database?.port || '8182'),
        awsOpenSearchEndpoint: infra?.vector_store?.endpoint || '',
        awsS3Bucket: infra?.storage?.bucket || infra?.storage?.s3_bucket || '',
        awsRegion: infra?.iam?.region || infra?.database?.region || 'us-east-1',
        awsRoleArn: infra?.iam?.role_arn || '',
        awsExternalId: infra?.iam?.external_id || '',
        azureCosmosDbEndpoint: infra?.database?.endpoint || '',
        azureCognitiveSearchEndpoint: infra?.vector_store?.endpoint || '',
        azureCognitiveSearchApiKey: '',
        azureStorageAccount: '',
      })
    }
    setMode('form')
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Save configuration
  const handleSave = async () => {
    if (!organizationId) {
      toast.error('Organization ID is required')
      return
    }

    setSaving(true)

    try {
      let configData: any = {
        deployment_mode: 'vpc_isolated',
        cloud_provider: selectedProvider,
        organization_name: formData.organizationName || undefined,
      }

      if (selectedProvider === 'aws') {
        configData = {
          ...configData,
          database: {
            type: 'neptune',
            provider: 'neptune',
            endpoint: formData.awsNeptuneEndpoint,
            port: parseInt(formData.awsNeptunePort) || 8182,
            region: formData.awsRegion,
            ssl: true,
          },
          vector_store: {
            type: 'opensearch',
            provider: 'opensearch',
            endpoint: formData.awsOpenSearchEndpoint,
          },
          llm: {
            provider: 'bedrock',
            bedrock_region: formData.awsRegion,
          },
          storage: {
            type: 's3',
            bucket: formData.awsS3Bucket,
            region: formData.awsRegion,
          },
          iam: {
            role_arn: formData.awsRoleArn,
            external_id: formData.awsExternalId,
            region: formData.awsRegion,
          },
        }
      } else if (selectedProvider === 'azure') {
        configData = {
          ...configData,
          database: {
            type: 'cosmos_db',
            endpoint: formData.azureCosmosDbEndpoint,
            ssl: true,
          },
          vector_store: {
            type: 'azure_search',
            endpoint: formData.azureCognitiveSearchEndpoint,
            auth: formData.azureCognitiveSearchApiKey,
          },
          llm: {
            provider: 'vrin_proxy',
            endpoint: 'https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev/openai-proxy',
          },
          azure: {
            storage_account: formData.azureStorageAccount,
          },
        }
      }

      // Validate first
      const validation = await validateConfiguration(configData)
      if (!validation.valid) {
        const errorMessage = validation.errors?.map((e: any) => e.message).join(', ') || 'Validation failed'
        toast.error(`Validation failed: ${errorMessage}`)
        setSaving(false)
        return
      }

      // Save (backend handles create vs update)
      const result = await saveEnterpriseConfiguration(configData)

      if (result.updated) {
        toast.success('Configuration updated successfully!')
      } else {
        toast.success('Configuration saved and activated!')
      }

      // Reload and switch to view mode
      await loadConfiguration()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  // Delete configuration
  const handleDelete = async () => {
    if (!config) return

    setDeleting(true)

    try {
      const authToken = localStorage.getItem('enterprise_token')
      if (!authToken) throw new Error('Not authenticated')

      const response = await fetch(`/api/enterprise/configurations/${config.config_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Configuration deleted')
        setShowDeleteConfirm(false)
        setConfig(null)
        setMode('form')
      } else {
        toast.error(data.error || 'Failed to delete configuration')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  // Test connection
  const handleTestConnection = async (service: 'database' | 'vector-store') => {
    const healthKey = service === 'vector-store' ? 'vectorStore' : 'database'
    setEndpointHealth((prev) => ({ ...prev, [healthKey]: { status: 'testing' } }))

    try {
      let result: ValidationResult

      if (service === 'database') {
        if (selectedProvider === 'aws') {
          result = await EnterpriseValidationService.testDatabaseConnection({
            type: 'neptune',
            endpoint: formData.awsNeptuneEndpoint,
            port: 8182,
            ssl: true,
          })
        } else {
          result = await EnterpriseValidationService.testDatabaseConnection({
            type: 'cosmos_db',
            endpoint: formData.azureCosmosDbEndpoint,
            port: 443,
            ssl: true,
          })
        }
      } else {
        if (selectedProvider === 'aws') {
          result = await EnterpriseValidationService.testVectorStoreConnection({
            type: 'opensearch',
            endpoint: formData.awsOpenSearchEndpoint,
            authToken: '',
            index: 'vrin-knowledge',
          })
        } else {
          result = await EnterpriseValidationService.testVectorStoreConnection({
            type: 'azure_search',
            endpoint: formData.azureCognitiveSearchEndpoint,
            authToken: formData.azureCognitiveSearchApiKey,
            index: 'vrin-knowledge',
          })
        }
      }

      setEndpointHealth((prev) => ({
        ...prev,
        [healthKey]: {
          status: result.status,
          lastChecked: new Date(),
          error: result.success ? undefined : result.message,
        },
      }))

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      setEndpointHealth((prev) => ({
        ...prev,
        [healthKey]: { status: 'error', lastChecked: new Date(), error: error.message },
      }))
      toast.error(`Connection test failed: ${error.message}`)
    }
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="text-gray-600">Loading configuration...</span>
        </div>
      </div>
    )
  }

  // --- VIEW MODE: Show active configuration ---
  if (mode === 'view' && config) {
    const infra = config.infrastructure
    const isAWS = config.cloud_provider === 'aws'

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Infrastructure Configuration</h2>
            <p className="text-gray-600 mt-1">Your cloud infrastructure connected to VRIN</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={enterEditMode}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Configuration
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Status Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {config.cloud_provider.toUpperCase()} &mdash; {config.deployment_mode.replace('_', ' ')}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                    {config.activated_at && (
                      <span className="text-sm text-gray-500">
                        Activated {formatDistanceToNow(new Date(config.activated_at * 1000), { addSuffix: true })}
                      </span>
                    )}
                    <span className="text-sm text-gray-400">
                      Updated {formatDistanceToNow(new Date(config.updated_at * 1000), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Database */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="w-4 h-4" />
                {isAWS ? 'Amazon Neptune' : 'Cosmos DB'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 font-mono break-all">
                {infra?.database?.endpoint || 'Not configured'}
              </p>
              {infra?.database?.port && (
                <p className="text-xs text-gray-400 mt-1">Port: {infra.database.port}</p>
              )}
            </CardContent>
          </Card>

          {/* Vector Store */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="w-4 h-4" />
                {isAWS ? 'Amazon OpenSearch' : 'Azure Cognitive Search'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 font-mono break-all">
                {infra?.vector_store?.endpoint || 'Not configured'}
              </p>
            </CardContent>
          </Card>

          {/* AI Services */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-4 h-4" />
                AI Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Managed by VRIN</span>
              </div>
            </CardContent>
          </Card>

          {/* IAM (AWS only) */}
          {isAWS && infra?.iam?.role_arn && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="w-4 h-4" />
                  IAM Cross-Account Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm text-gray-600 font-mono break-all">{infra.iam.role_arn}</p>
                <p className="text-xs text-gray-400">External ID: {infra.iam.external_id}</p>
              </CardContent>
            </Card>
          )}

          {/* Storage */}
          {isAWS && (infra?.storage?.bucket || infra?.storage?.s3_bucket) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HardDrive className="w-4 h-4" />
                  Amazon S3
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 font-mono">
                  {infra.storage?.bucket || infra.storage?.s3_bucket}
                </p>
                {infra.storage?.region && (
                  <p className="text-xs text-gray-400 mt-1">Region: {infra.storage.region}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Danger Zone */}
        <Card className="border-red-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Configuration</p>
              <p className="text-xs text-gray-500">Remove this configuration. You can reconfigure afterwards.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:border-red-300"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>

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
                Are you sure? This will permanently remove your infrastructure configuration. You will need to reconfigure before using API keys.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1" disabled={deleting}>
                  Cancel
                </Button>
                <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700" disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete Configuration'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // --- FORM MODE: Setup / Edit configuration ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            {config && (
              <Button variant="ghost" size="sm" onClick={() => setMode('view')}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {config ? 'Edit Configuration' : 'Infrastructure Setup'}
              </h2>
              <p className="text-gray-600 mt-1">
                {config ? 'Update your cloud infrastructure settings' : 'Connect VRIN to your cloud infrastructure'}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Cloud Provider Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Cloud Provider
          </CardTitle>
          <CardDescription>Select your cloud provider and enter your infrastructure endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedProvider} onValueChange={setSelectedProvider} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aws" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Amazon AWS
              </TabsTrigger>
              <TabsTrigger value="azure" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Microsoft Azure
              </TabsTrigger>
              <TabsTrigger value="gcp" className="flex items-center gap-2" disabled>
                <Cloud className="w-4 h-4" />
                Google Cloud (Soon)
              </TabsTrigger>
            </TabsList>

            {/* ========== AWS ========== */}
            <TabsContent value="aws" className="space-y-6">
              <Alert className="border-orange-200 bg-orange-50">
                <Info className="w-4 h-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>What you need:</strong> Neptune cluster endpoint, OpenSearch domain endpoint,
                  an IAM Role ARN with cross-account trust, an External ID, and an S3 bucket name.
                  Your data never leaves your AWS account.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Neptune */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Database className="w-5 h-5" />
                      Amazon Neptune
                    </CardTitle>
                    <CardDescription>Graph database for knowledge storage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="awsNeptune">Cluster Endpoint *</Label>
                      <Input
                        id="awsNeptune"
                        value={formData.awsNeptuneEndpoint}
                        onChange={(e) => updateField('awsNeptuneEndpoint', e.target.value)}
                        placeholder="your-cluster.cluster-xyz.us-east-1.neptune.amazonaws.com"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        AWS Console &rarr; Neptune &rarr; Clusters &rarr; Cluster endpoint
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="awsNeptunePort">Port</Label>
                      <Input
                        id="awsNeptunePort"
                        value={formData.awsNeptunePort}
                        onChange={(e) => updateField('awsNeptunePort', e.target.value)}
                        placeholder="8182"
                        className="mt-1"
                      />
                    </div>
                    <EndpointHealthIndicator
                      type="database"
                      endpoint={formData.awsNeptuneEndpoint}
                      status={endpointHealth.database.status}
                      lastChecked={endpointHealth.database.lastChecked}
                      error={endpointHealth.database.error}
                      onTest={() => handleTestConnection('database')}
                    />
                  </CardContent>
                </Card>

                {/* OpenSearch */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Search className="w-5 h-5" />
                      Amazon OpenSearch
                    </CardTitle>
                    <CardDescription>Vector search for AI embeddings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="awsOpenSearch">Domain Endpoint *</Label>
                      <Input
                        id="awsOpenSearch"
                        value={formData.awsOpenSearchEndpoint}
                        onChange={(e) => updateField('awsOpenSearchEndpoint', e.target.value)}
                        placeholder="https://search-your-domain.us-east-1.es.amazonaws.com"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        AWS Console &rarr; OpenSearch &rarr; Domains &rarr; Domain endpoint
                      </p>
                    </div>
                    <EndpointHealthIndicator
                      type="vector-store"
                      endpoint={formData.awsOpenSearchEndpoint}
                      status={endpointHealth.vectorStore.status}
                      lastChecked={endpointHealth.vectorStore.lastChecked}
                      error={endpointHealth.vectorStore.error}
                      onTest={() => handleTestConnection('vector-store')}
                    />
                  </CardContent>
                </Card>

                {/* S3 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <HardDrive className="w-5 h-5" />
                      Amazon S3
                    </CardTitle>
                    <CardDescription>Document storage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="awsS3Bucket">S3 Bucket Name *</Label>
                      <Input
                        id="awsS3Bucket"
                        value={formData.awsS3Bucket}
                        onChange={(e) => updateField('awsS3Bucket', e.target.value)}
                        placeholder="your-org-vrin-data"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Just the bucket name, not the full ARN</p>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Brain className="w-5 h-5" />
                      AI Services
                    </CardTitle>
                    <CardDescription>Provided by VRIN</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-gray-700" />
                        <span className="font-medium text-gray-900">Automatically Configured</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        VRIN provides all AI and embedding services. No setup needed.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* IAM Role */}
                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="w-5 h-5" />
                      IAM Cross-Account Access
                    </CardTitle>
                    <CardDescription>
                      VRIN accesses your resources via an IAM role in your account &mdash; no long-lived credentials stored
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50">
                      <Info className="w-4 h-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 text-sm">
                        Create an IAM Role that trusts VRIN&apos;s account (<code className="bg-blue-100 px-1 rounded">859271276727</code>).
                      </AlertDescription>
                    </Alert>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="awsRegion">AWS Region *</Label>
                        <Select value={formData.awsRegion} onValueChange={(value) => updateField('awsRegion', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                            <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                            <SelectItem value="eu-central-1">Europe (Frankfurt)</SelectItem>
                            <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="awsRoleArn">IAM Role ARN *</Label>
                        <Input
                          id="awsRoleArn"
                          value={formData.awsRoleArn}
                          onChange={(e) => updateField('awsRoleArn', e.target.value)}
                          placeholder="arn:aws:iam::123456789012:role/VRINDataAccessRole"
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="awsExternalId">External ID *</Label>
                      <Input
                        id="awsExternalId"
                        value={formData.awsExternalId}
                        onChange={(e) => updateField('awsExternalId', e.target.value)}
                        placeholder="vrin-yourcompany-123456789012"
                        className="mt-1 font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must match the role&apos;s trust policy condition. Prevents confused deputy attacks.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ========== Azure ========== */}
            <TabsContent value="azure" className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>What you need:</strong> Azure Cosmos DB endpoint, Azure Cognitive Search endpoint with API key,
                  and an Azure Storage account name. AI services are provided by VRIN.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Database className="w-5 h-5" />
                      Azure Cosmos DB
                    </CardTitle>
                    <CardDescription>Graph database for knowledge storage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Cosmos DB Gremlin Endpoint *</Label>
                      <Input
                        value={formData.azureCosmosDbEndpoint}
                        onChange={(e) => updateField('azureCosmosDbEndpoint', e.target.value)}
                        placeholder="wss://your-cosmos.gremlin.cosmos.azure.com:443"
                        className="mt-1"
                      />
                    </div>
                    <EndpointHealthIndicator
                      type="database"
                      endpoint={formData.azureCosmosDbEndpoint}
                      status={endpointHealth.database.status}
                      lastChecked={endpointHealth.database.lastChecked}
                      error={endpointHealth.database.error}
                      onTest={() => handleTestConnection('database')}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Search className="w-5 h-5" />
                      Azure Cognitive Search
                    </CardTitle>
                    <CardDescription>Vector search for AI embeddings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Search Service Endpoint *</Label>
                      <Input
                        value={formData.azureCognitiveSearchEndpoint}
                        onChange={(e) => updateField('azureCognitiveSearchEndpoint', e.target.value)}
                        placeholder="https://your-search.search.windows.net"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Admin API Key *</Label>
                      <Input
                        type="password"
                        value={formData.azureCognitiveSearchApiKey}
                        onChange={(e) => updateField('azureCognitiveSearchApiKey', e.target.value)}
                        placeholder="Your search admin API key"
                        className="mt-1"
                      />
                    </div>
                    <EndpointHealthIndicator
                      type="vector-store"
                      endpoint={formData.azureCognitiveSearchEndpoint}
                      status={endpointHealth.vectorStore.status}
                      lastChecked={endpointHealth.vectorStore.lastChecked}
                      error={endpointHealth.vectorStore.error}
                      onTest={() => handleTestConnection('vector-store')}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Brain className="w-5 h-5" />
                      AI Services
                    </CardTitle>
                    <CardDescription>Provided by VRIN</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-gray-700" />
                        <span className="font-medium text-gray-900">Automatically Configured</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        VRIN provides OpenAI services through our secure proxy. No setup needed.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <HardDrive className="w-5 h-5" />
                      Azure Storage
                    </CardTitle>
                    <CardDescription>Document storage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label>Storage Account Name *</Label>
                      <Input
                        value={formData.azureStorageAccount}
                        onChange={(e) => updateField('azureStorageAccount', e.target.value)}
                        placeholder="yourstorageaccount"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Just the account name, not the full URL</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gcp">
              <Card>
                <CardContent className="p-12 text-center">
                  <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">GCP Integration Coming Soon</h3>
                  <p className="text-gray-600">Please use AWS or Azure for now.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
