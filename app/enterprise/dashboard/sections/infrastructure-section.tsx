'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Cloud,
  Shield,
  Save,
  CheckCircle,
  Info,
  ExternalLink,
  Database,
  Search,
  Brain,
  Key,
  HardDrive,
  Zap
} from 'lucide-react'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { useConfiguration } from '@/hooks/useEnterprise'
import { toast } from 'react-hot-toast'
import { EndpointHealthIndicator } from '@/components/enterprise/endpoint-health-indicator'
import { EnterpriseValidationService, ValidationResult } from '@/lib/enterprise-validation'

function InfrastructureConfigurationContent() {
  const { user } = useEnterpriseAuth()
  const organizationId = user?.organizationId
  const searchParams = useSearchParams()
  const editConfigId = searchParams.get('config_id')
  
  const {
    configuration: enterpriseConfiguration,
    loading: isLoadingConfig,
    error: configError,
    validationResult,
    saveConfiguration: saveEnterpriseConfiguration,
    validateConfiguration
  } = useConfiguration(organizationId)

  const [selectedProvider, setSelectedProvider] = useState('azure')
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)
  
  // Simplified form data - only essential fields
  const [formData, setFormData] = useState({
    organizationName: '',
    cloudProvider: 'azure',
    
    // Azure Configuration - Minimal Required
    azureCosmosDbEndpoint: '',
    azureCognitiveSearchEndpoint: '',
    azureCognitiveSearchApiKey: '',
    azureStorageAccount: '',
    
    // AWS Configuration - Minimal Required  
    awsNeptuneEndpoint: '',
    awsOpenSearchEndpoint: '',
    awsRegion: 'us-east-1',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    
    // Google Cloud Configuration - Minimal Required
    gcpProjectId: '',
    gcpVertexAiLocation: 'us-central1',
    gcpServiceAccountKey: ''
  })

  // Endpoint health states
  const [endpointHealth, setEndpointHealth] = useState<{
    database: { status: 'healthy' | 'unhealthy' | 'testing' | 'unknown' | 'error', lastChecked?: Date, error?: string }
    vectorStore: { status: 'healthy' | 'unhealthy' | 'testing' | 'unknown' | 'error', lastChecked?: Date, error?: string }
    llm: { status: 'healthy' | 'unhealthy' | 'testing' | 'unknown' | 'error', lastChecked?: Date, error?: string }
  }>({
    database: { status: 'unknown' },
    vectorStore: { status: 'unknown' },
    llm: { status: 'unknown' }
  })

  // Load configuration data if in edit mode
  useEffect(() => {
    const loadConfigurationForEdit = async () => {
      if (!editConfigId || !organizationId) return

      try {
        const authToken = localStorage.getItem('enterprise_token')
        if (!authToken) return

        // Fetch all configurations and find the one to edit
        const response = await fetch('/api/enterprise/configurations', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            const configToEdit = data.configurations.find((config: any) => config.config_id === editConfigId)
            if (configToEdit) {
              // Pre-fill form with existing configuration data
              setSelectedProvider(configToEdit.cloud_provider)
              setFormData(prev => ({
                ...prev,
                organizationName: user?.organizationName || '',
                cloudProvider: configToEdit.cloud_provider,
                
                // Azure fields
                azureCosmosDbEndpoint: configToEdit.infrastructure?.database?.endpoint || '',
                azureCognitiveSearchEndpoint: configToEdit.infrastructure?.vector_store?.endpoint || '',
                azureCognitiveSearchApiKey: configToEdit.infrastructure?.vector_store?.auth || '',
                azureStorageAccount: configToEdit.azure?.storage_account || '',
                
                // AWS fields
                awsNeptuneEndpoint: configToEdit.infrastructure?.database?.endpoint || '',
                awsOpenSearchEndpoint: configToEdit.infrastructure?.vector_store?.endpoint || '',
                awsRegion: configToEdit.aws?.region || 'us-east-1',
                awsAccessKeyId: configToEdit.aws?.access_key_id || '',
                awsSecretAccessKey: configToEdit.aws?.secret_access_key || '',
                
                // GCP fields
                gcpProjectId: configToEdit.gcp?.project_id || '',
                gcpVertexAiLocation: configToEdit.gcp?.location || 'us-central1',
                gcpServiceAccountKey: configToEdit.gcp?.service_account_key || ''
              }))
            }
          }
        }
      } catch (error) {
        console.error('Error loading configuration for edit:', error)
        toast.error('Failed to load configuration data')
      }
    }

    loadConfigurationForEdit()
  }, [editConfigId, organizationId, user?.organizationName])

  // Populate form with existing configuration
  useEffect(() => {
    if (enterpriseConfiguration) {
      setFormData(prev => ({
        ...prev,
        organizationName: enterpriseConfiguration.organizationName || '',
        cloudProvider: enterpriseConfiguration.provider || 'azure',
        
        // Azure fields
        azureCosmosDbEndpoint: enterpriseConfiguration.infrastructure?.database?.endpoint || '',
        azureCognitiveSearchEndpoint: enterpriseConfiguration.infrastructure?.vectorStore?.endpoint || '',
        azureCognitiveSearchApiKey: enterpriseConfiguration.infrastructure?.vectorStore?.auth || '',
        azureStorageAccount: '',
        
        // AWS fields
        awsNeptuneEndpoint: '',
        awsOpenSearchEndpoint: '',
        awsRegion: 'us-east-1',
        awsAccessKeyId: '',
        awsSecretAccessKey: '',
        
        // GCP fields
        gcpProjectId: '',
        gcpVertexAiLocation: 'us-central1',
        gcpServiceAccountKey: ''
      }))
      
      setSelectedProvider(enterpriseConfiguration.provider || 'azure')
    }
  }, [enterpriseConfiguration])

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveConfiguration = async () => {
    if (!organizationId) {
      toast.error('Organization ID is required')
      return
    }

    try {
      let configData: any = {
        deployment_mode: 'vpc_isolated',
        cloud_provider: selectedProvider,
        organization_name: formData.organizationName
      }

      // Build configuration based on selected provider
      switch (selectedProvider) {
        case 'azure':
          configData = {
            ...configData,
            database: {
              type: 'cosmos_db',
              endpoint: formData.azureCosmosDbEndpoint,
              ssl: true
            },
            vector_store: {
              type: 'azure_search',
              endpoint: formData.azureCognitiveSearchEndpoint,
              auth: formData.azureCognitiveSearchApiKey
            },
            llm: {
              provider: 'vrin_proxy',
              endpoint: 'https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev/openai-proxy'
            },
            azure: {
              storage_account: formData.azureStorageAccount
            }
          }
          break
          
        case 'aws':
          configData = {
            ...configData,
            database: {
              type: 'neptune',
              endpoint: formData.awsNeptuneEndpoint,
              ssl: true
            },
            vector_store: {
              type: 'opensearch',
              endpoint: formData.awsOpenSearchEndpoint
            },
            llm: {
              provider: 'bedrock',
              region: formData.awsRegion
            },
            aws: {
              region: formData.awsRegion,
              access_key_id: formData.awsAccessKeyId,
              secret_access_key: formData.awsSecretAccessKey
            }
          }
          break
          
        case 'gcp':
          configData = {
            ...configData,
            database: {
              type: 'neo4j', // or other GCP compatible graph db
              endpoint: `${formData.gcpProjectId}.neo4j.database.gcp.com`
            },
            vector_store: {
              type: 'vertex_ai_search',
              project_id: formData.gcpProjectId,
              location: formData.gcpVertexAiLocation
            },
            llm: {
              provider: 'vertex_ai',
              project_id: formData.gcpProjectId,
              location: formData.gcpVertexAiLocation
            },
            gcp: {
              project_id: formData.gcpProjectId,
              service_account_key: formData.gcpServiceAccountKey
            }
          }
          break
      }

      // Validate configuration first
      const validation = await validateConfiguration(configData)
      
      if (!validation.valid) {
        const errorMessage = validation.errors?.map((e: any) => e.message).join(', ') || 'Validation failed'
        toast.error(`Configuration validation failed: ${errorMessage}`)
        return
      }

      // Save configuration
      const result = await saveEnterpriseConfiguration(configData)
      
      setSavedSuccessfully(true)
      
      // Check if this is edit mode vs create mode
      if (editConfigId) {
        toast.success('✅ Configuration updated successfully! Your infrastructure settings have been saved.', {
          duration: 3000
        })
        
        // For edits, redirect faster since workflow is simpler
        setTimeout(() => {
          toast.success('Returning to your dashboard...')
        }, 1500)
        
        setTimeout(() => {
          window.location.href = '/enterprise/dashboard'
        }, 2500)
      } else {
        // For new configurations
        if (result.auto_activated) {
          toast.success('🎉 Configuration created and activated! Your infrastructure is ready. You can now generate API keys!', {
            duration: 4000
          })
          
          setTimeout(() => {
            toast.success('🚀 Taking you to your dashboard to create your first API key...')
          }, 2500)
        } else {
          toast.success('✅ Configuration created successfully! Next: Activate it from "Manage Configurations" to enable API key generation.', {
            duration: 4000
          })
          
          setTimeout(() => {
            toast.success('Redirecting to your dashboard...')
          }, 2500)
        }
        
        // Longer delay for new configurations to let users read the success messages
        setTimeout(() => {
          window.location.href = '/enterprise/dashboard'
        }, result.auto_activated ? 4000 : 3500)
      }
      
    } catch (error: any) {
      console.error('Save configuration error:', error)
      toast.error(error.message || 'Failed to save configuration')
    }
  }

  const handleTestConnection = async (service: 'database' | 'vector-store' | 'llm') => {
    setEndpointHealth(prev => ({
      ...prev,
      [service === 'vector-store' ? 'vectorStore' : service]: { status: 'testing' }
    }))
    
    try {
      let result: ValidationResult
      
      switch (service) {
        case 'database':
          if (selectedProvider === 'azure') {
            result = await EnterpriseValidationService.testDatabaseConnection({
              type: 'cosmos_db',
              endpoint: formData.azureCosmosDbEndpoint,
              port: 443,
              ssl: true
            })
          } else if (selectedProvider === 'aws') {
            result = await EnterpriseValidationService.testDatabaseConnection({
              type: 'neptune',
              endpoint: formData.awsNeptuneEndpoint,
              port: 8182,
              ssl: true
            })
          } else {
            throw new Error('GCP database testing not implemented yet')
          }
          break
          
        case 'vector-store':
          if (selectedProvider === 'azure') {
            result = await EnterpriseValidationService.testVectorStoreConnection({
              type: 'azure_search',
              endpoint: formData.azureCognitiveSearchEndpoint,
              authToken: formData.azureCognitiveSearchApiKey,
              index: 'vrin-knowledge'
            })
          } else if (selectedProvider === 'aws') {
            result = await EnterpriseValidationService.testVectorStoreConnection({
              type: 'opensearch',
              endpoint: formData.awsOpenSearchEndpoint,
              authToken: '',
              index: 'vrin-knowledge'
            })
          } else {
            throw new Error('GCP vector store testing not implemented yet')
          }
          break
          
        case 'llm':
          if (selectedProvider === 'azure') {
            result = await EnterpriseValidationService.testLLMConnection({
              provider: 'vrin_proxy',
              model: 'gpt-4o-mini',
              endpoint: 'https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev/openai-proxy',
              apiKeyLocation: 'vrin_managed'
            })
          } else if (selectedProvider === 'aws') {
            result = await EnterpriseValidationService.testLLMConnection({
              provider: 'bedrock',
              model: 'claude-3',
              endpoint: '',
              apiKeyLocation: 'aws_credentials'
            })
          } else {
            throw new Error('GCP LLM testing not implemented yet')
          }
          break
          
        default:
          toast.error(`Unknown service: ${service}`)
          return
      }
      
      const healthKey = service === 'vector-store' ? 'vectorStore' : service
      setEndpointHealth(prev => ({
        ...prev,
        [healthKey]: {
          status: result.status,
          lastChecked: new Date(),
          error: result.success ? undefined : result.message
        }
      }))
      
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      
    } catch (error: any) {
      const healthKey = service === 'vector-store' ? 'vectorStore' : service
      setEndpointHealth(prev => ({
        ...prev,
        [healthKey]: {
          status: 'error',
          lastChecked: new Date(),
          error: error.message
        }
      }))
      toast.error(`Connection test failed: ${error.message}`)
    }
  }

  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading configuration...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {editConfigId ? 'Edit Infrastructure Configuration' : 'Infrastructure Setup'}
              </h1>
              <p className="text-gray-600 mt-1">
                {editConfigId
                  ? 'Update your cloud infrastructure configuration'
                  : 'Connect VRIN to your cloud infrastructure in 3 simple steps'
                }
              </p>
            </div>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={isLoadingConfig}
              size="lg"
            >
              {isLoadingConfig ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editConfigId ? 'Update Configuration' : 'Save Configuration'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {savedSuccessfully && (
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <Alert className="border-gray-200 bg-gray-50">
            <CheckCircle className="w-4 h-4 text-gray-700" />
            <AlertDescription className="text-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  {editConfigId ? (
                    <>
                      <strong>✅ Configuration Updated!</strong> Your infrastructure settings have been saved and will take effect immediately.
                    </>
                  ) : (
                    <>
                      <strong>🎉 Configuration Created!</strong> VRIN is now connected to your infrastructure. 
                      {/* Auto-activation status will be shown in toast messages */}
                    </>
                  )}
                </div>
                {!editConfigId && (
                  <div className="text-sm text-gray-700 ml-4 font-medium">
                    🚀 Next step: Generate your first API key!
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Organization Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                value={formData.organizationName}
                onChange={(e) => updateField('organizationName', e.target.value)}
                placeholder="Enter your organization name"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Cloud Provider Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Choose Your Cloud Provider
            </CardTitle>
            <CardDescription>
              Select your cloud provider and configure the essential services that VRIN needs to access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedProvider} onValueChange={setSelectedProvider} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger 
                  value="azure" 
                  className="flex items-center gap-2"
                  onClick={() => updateField('cloudProvider', 'azure')}
                >
                  <Cloud className="w-4 h-4" />
                  Microsoft Azure
                </TabsTrigger>
                <TabsTrigger 
                  value="aws" 
                  className="flex items-center gap-2"
                  onClick={() => updateField('cloudProvider', 'aws')}
                >
                  <Cloud className="w-4 h-4" />
                  Amazon AWS
                </TabsTrigger>
                <TabsTrigger 
                  value="gcp" 
                  className="flex items-center gap-2"
                  onClick={() => updateField('cloudProvider', 'gcp')}
                >
                  <Cloud className="w-4 h-4" />
                  Google Cloud
                </TabsTrigger>
              </TabsList>

              {/* Azure Configuration */}
              <TabsContent value="azure" className="space-y-6">
                <Alert className="border-gray-200 bg-gray-50">
                  <Info className="w-4 h-4 text-gray-600" />
                  <AlertDescription className="text-gray-800">
                    <strong>What you&apos;ll need:</strong> Azure Cosmos DB endpoint, Azure Cognitive Search endpoint with API key, 
                    and an Azure Storage account name. AI services are provided by VRIN.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Database */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Database className="w-5 h-5" />
                        Azure Cosmos DB
                      </CardTitle>
                      <CardDescription>
                        Your graph database for knowledge storage
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="azureCosmosDb">Cosmos DB Gremlin Endpoint *</Label>
                        <Input
                          id="azureCosmosDb"
                          value={formData.azureCosmosDbEndpoint}
                          onChange={(e) => updateField('azureCosmosDbEndpoint', e.target.value)}
                          placeholder="wss://your-cosmos.gremlin.cosmos.azure.com:443"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Find this in Azure Portal → Cosmos DB → Keys → Gremlin Endpoint
                        </p>
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

                  {/* Vector Store */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Search className="w-5 h-5" />
                        Azure Cognitive Search
                      </CardTitle>
                      <CardDescription>
                        Your vector search service for AI embeddings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="azureSearch">Search Service Endpoint *</Label>
                        <Input
                          id="azureSearch"
                          value={formData.azureCognitiveSearchEndpoint}
                          onChange={(e) => updateField('azureCognitiveSearchEndpoint', e.target.value)}
                          placeholder="https://your-search.search.windows.net"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="azureSearchKey">Admin API Key *</Label>
                        <Input
                          id="azureSearchKey"
                          type="password"
                          value={formData.azureCognitiveSearchApiKey}
                          onChange={(e) => updateField('azureCognitiveSearchApiKey', e.target.value)}
                          placeholder="Your search admin API key"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Find this in Azure Portal → Search Service → Keys → Primary admin key
                        </p>
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

                  {/* AI Service - Now Provided by VRIN */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="w-5 h-5" />
                        AI Services
                      </CardTitle>
                      <CardDescription>
                        Powered by VRIN&apos;s OpenAI proxy service
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-gray-700" />
                          <span className="font-medium text-gray-900">Automatically Configured</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          VRIN provides OpenAI services through our secure proxy. No additional setup required.
                        </p>
                        <div className="mt-3 text-xs text-gray-600">
                          <div>• GPT-4o & GPT-4o-mini models available</div>
                          <div>• Secure, enterprise-grade access</div>
                          <div>• No API keys needed from your side</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Storage */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <HardDrive className="w-5 h-5" />
                        Azure Storage
                      </CardTitle>
                      <CardDescription>
                        Your file storage for documents and logs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="azureStorage">Storage Account Name *</Label>
                        <Input
                          id="azureStorage"
                          value={formData.azureStorageAccount}
                          onChange={(e) => updateField('azureStorageAccount', e.target.value)}
                          placeholder="yourstorageaccount"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Just the account name, not the full URL
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* AWS Configuration */}
              <TabsContent value="aws" className="space-y-6">
                <Alert className="border-orange-200 bg-orange-50">
                  <Info className="w-4 h-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>What you&apos;ll need:</strong> Neptune cluster endpoint, OpenSearch domain endpoint, 
                    and AWS access credentials with appropriate permissions.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Database className="w-5 h-5" />
                        Amazon Neptune
                      </CardTitle>
                      <CardDescription>Graph database service</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="awsNeptune">Neptune Cluster Endpoint *</Label>
                        <Input
                          id="awsNeptune"
                          value={formData.awsNeptuneEndpoint}
                          onChange={(e) => updateField('awsNeptuneEndpoint', e.target.value)}
                          placeholder="your-cluster.cluster-xyz.us-east-1.neptune.amazonaws.com"
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Search className="w-5 h-5" />
                        Amazon OpenSearch
                      </CardTitle>
                      <CardDescription>Search and analytics service</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="awsOpenSearch">OpenSearch Domain Endpoint *</Label>
                        <Input
                          id="awsOpenSearch"
                          value={formData.awsOpenSearchEndpoint}
                          onChange={(e) => updateField('awsOpenSearchEndpoint', e.target.value)}
                          placeholder="https://search-your-domain.us-east-1.es.amazonaws.com"
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Key className="w-5 h-5" />
                        AWS Credentials
                      </CardTitle>
                      <CardDescription>Access credentials for AWS services</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="awsAccessKey">Access Key ID *</Label>
                        <Input
                          id="awsAccessKey"
                          value={formData.awsAccessKeyId}
                          onChange={(e) => updateField('awsAccessKeyId', e.target.value)}
                          placeholder="AKIA..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="awsSecretKey">Secret Access Key *</Label>
                        <Input
                          id="awsSecretKey"
                          type="password"
                          value={formData.awsSecretAccessKey}
                          onChange={(e) => updateField('awsSecretAccessKey', e.target.value)}
                          placeholder="Your secret key"
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Google Cloud Configuration */}
              <TabsContent value="gcp" className="space-y-6">
                <Alert className="border-gray-200 bg-gray-50">
                  <Info className="w-4 h-4 text-gray-600" />
                  <AlertDescription className="text-gray-800">
                    <strong>Coming Soon:</strong> Google Cloud Platform integration is in development.
                    Please use Azure or AWS for now.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardContent className="p-12 text-center">
                    <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">GCP Integration Coming Soon</h3>
                    <p className="text-gray-600">
                      We&apos;re working on Google Cloud Platform support. It will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Getting Started Guide */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Setup Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-700 font-semibold">1</span>
                </div>
                <h4 className="font-medium mb-2">Configure Services</h4>
                <p className="text-sm text-gray-600">
                  Enter your cloud service endpoints and credentials
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-700 font-semibold">2</span>
                </div>
                <h4 className="font-medium mb-2">Test Connections</h4>
                <p className="text-sm text-gray-600">
                  Verify VRIN can connect to your infrastructure
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-700 font-semibold">3</span>
                </div>
                <h4 className="font-medium mb-2">Generate API Keys</h4>
                <p className="text-sm text-gray-600">
                  Create secure keys linked to your infrastructure
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-center">
                <Button asChild variant="outline">
                  <a href="/enterprise/api-keys" className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Generate API Keys
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function InfrastructureConfigurationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <InfrastructureConfigurationContent />
    </Suspense>
  )
}