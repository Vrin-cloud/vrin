'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DatabaseConfig, 
  VectorStoreConfig, 
  NetworkConfig,
  ValidationError,
  LLMConfig 
} from '@/types/enterprise'
import { formatCurrency } from '@/lib/utils'
import {
  Database,
  Search,
  Network,
  Shield,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2,
  ExternalLink,
  HelpCircle,
  Zap
} from 'lucide-react'

// Simple validation functions
const validateNeptuneEndpoint = (endpoint: string) => {
  return endpoint && endpoint.includes('neptune') && endpoint.includes('amazonaws.com')
}

const validateOpenSearchEndpoint = (endpoint: string) => {
  return endpoint && (endpoint.includes('es.amazonaws.com') || endpoint.includes('opensearch'))
}

const validateVpcId = (vpcId: string) => {
  return vpcId && vpcId.startsWith('vpc-') && vpcId.length > 8
}

const validateSubnetId = (subnetId: string) => {
  return subnetId && subnetId.startsWith('subnet-') && subnetId.length > 12
}

const estimateMonthlyCost = (config: AWSConfig) => {
  // Simple cost estimation based on configuration
  let cost = 500 // Base VRIN license
  cost += 180 // Neptune base cost
  cost += 120 // OpenSearch base cost
  cost += 50 // Lambda costs
  return cost
}

interface AWSConfig {
  provider: 'aws'
  region: string
  database: DatabaseConfig
  vectorStore: VectorStoreConfig
  llm: LLMConfig
  network: NetworkConfig
  estimatedCost: number
}

interface AWSConfigBuilderProps {
  onComplete: (config: AWSConfig) => void
  onBack?: () => void
  initialConfig?: Partial<AWSConfig>
}

const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)', popular: true },
  { value: 'us-west-2', label: 'US West (Oregon)', popular: true },
  { value: 'eu-west-1', label: 'Europe (Ireland)', popular: true },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
]

const NEPTUNE_INSTANCE_TYPES = [
  { value: 'db.r5.large', label: 'db.r5.large (2 vCPU, 16 GB RAM)', cost: 0.348, recommended: 'Small workloads' },
  { value: 'db.r5.xlarge', label: 'db.r5.xlarge (4 vCPU, 32 GB RAM)', cost: 0.696, recommended: 'Most popular' },
  { value: 'db.r5.2xlarge', label: 'db.r5.2xlarge (8 vCPU, 64 GB RAM)', cost: 1.392, recommended: 'High performance' },
  { value: 'db.r5.4xlarge', label: 'db.r5.4xlarge (16 vCPU, 128 GB RAM)', cost: 2.784, recommended: 'Enterprise' }
]

const OPENSEARCH_INSTANCE_TYPES = [
  { value: 't3.small.search', label: 't3.small.search (1 vCPU, 2 GB RAM)', cost: 0.036, recommended: 'Development' },
  { value: 't3.medium.search', label: 't3.medium.search (2 vCPU, 4 GB RAM)', cost: 0.072, recommended: 'Most popular' },
  { value: 't3.large.search', label: 't3.large.search (2 vCPU, 8 GB RAM)', cost: 0.144, recommended: 'Production' },
  { value: 'm5.large.search', label: 'm5.large.search (2 vCPU, 8 GB RAM)', cost: 0.192, recommended: 'High performance' }
]

export function AWSConfigBuilder({ onComplete, onBack, initialConfig }: AWSConfigBuilderProps) {
  const [config, setConfig] = useState<AWSConfig>({
    provider: 'aws',
    region: initialConfig?.region || 'us-east-1',
    database: {
      type: 'neptune',
      endpoint: initialConfig?.database?.endpoint || '',
      port: initialConfig?.database?.port || 8182,
      auth: initialConfig?.database?.auth || 'iam_role',
      ssl: true,
      backup: {
        enabled: true,
        schedule: 'daily',
        retention: 30
      }
    },
    vectorStore: {
      type: 'opensearch',
      endpoint: initialConfig?.vectorStore?.endpoint || '',
      auth: initialConfig?.vectorStore?.auth || 'iam_role',
      index: 'knowledge_chunks',
      dimensions: 1536,
      settings: {
        shards: 1,
        replicas: 1,
        refreshInterval: '1s'
      }
    },
    llm: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKeyLocation: 'secrets_manager',
      maxTokens: 4000,
      temperature: 0.1,
      backup: {
        enabled: true,
        fallbackProvider: 'bedrock',
        fallbackModel: 'claude-3-sonnet'
      }
    },
    network: {
      vpcId: initialConfig?.network?.vpcId || '',
      subnetIds: initialConfig?.network?.subnetIds || [],
      securityGroups: initialConfig?.network?.securityGroups || [],
      privateLink: true,
      vpnConnection: false,
      directConnect: false,
      allowedIpRanges: ['10.0.0.0/8'],
      dnsConfig: {
        customDomain: '',
        certificateArn: '',
        route53ZoneId: ''
      }
    },
    estimatedCost: 0
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError>>({})
  const [validating, setValidating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id: 'region', title: 'Region & Basics', icon: Database },
    { id: 'database', title: 'Neptune Database', icon: Database },
    { id: 'vectorstore', title: 'OpenSearch', icon: Search },
    { id: 'network', title: 'Network Config', icon: Network },
    { id: 'security', title: 'Security & LLM', icon: Shield },
    { id: 'review', title: 'Review & Cost', icon: DollarSign }
  ]

  // Calculate estimated cost whenever config changes
  useEffect(() => {
    const cost = calculateEstimatedCost(config)
    setConfig(prev => ({ ...prev, estimatedCost: cost }))
  }, [config.database, config.vectorStore, config.network])

  const calculateEstimatedCost = (cfg: AWSConfig): number => {
    let monthlyCost = 0

    // Neptune cost (24/7 * 30 days)
    const neptuneInstanceType = cfg.database.endpoint.includes('large') ? 'db.r5.large' : 'db.r5.xlarge'
    const neptuneType = NEPTUNE_INSTANCE_TYPES.find(t => t.value === neptuneInstanceType)
    if (neptuneType) {
      monthlyCost += neptuneType.cost * 24 * 30
    }

    // OpenSearch cost
    const osInstanceType = cfg.vectorStore.endpoint.includes('medium') ? 't3.medium.search' : 't3.medium.search'
    const osType = OPENSEARCH_INSTANCE_TYPES.find(t => t.value === osInstanceType)
    if (osType) {
      monthlyCost += osType.cost * 24 * 30
    }

    // Additional services
    monthlyCost += 50 // Lambda functions
    monthlyCost += 25 // DynamoDB
    monthlyCost += 30 // CloudWatch monitoring
    
    if (cfg.network.privateLink) monthlyCost += 45 // VPC endpoints
    if (cfg.network.vpnConnection) monthlyCost += 36 // VPN Gateway
    if (cfg.network.directConnect) monthlyCost += 216 // Direct Connect

    return Math.round(monthlyCost)
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    setValidating(true)
    const errors: Record<string, ValidationError> = {}

    switch (steps[currentStep].id) {
      case 'region':
        if (!config.region) {
          errors.region = { field: 'region', message: 'Please select a region', severity: 'error' }
        }
        break

      case 'database':
        if (!config.database.endpoint) {
          errors.database = { field: 'database.endpoint', message: 'Neptune endpoint is required', severity: 'error' }
        } else if (!validateNeptuneEndpoint(config.database.endpoint)) {
          errors.database = { 
            field: 'database.endpoint', 
            message: 'Invalid Neptune endpoint format. Should be like: cluster-name.cluster-xxxxx.region.neptune.amazonaws.com',
            severity: 'error',
            suggestions: ['Ensure you\'re using the cluster endpoint, not the instance endpoint', 'Check that the region in the endpoint matches your selected region']
          }
        }
        
        // Test connectivity
        try {
          const testResult = await testNeptuneConnection(config.database.endpoint)
          if (!testResult.success) {
            errors.database = { 
              field: 'database.endpoint', 
              message: `Cannot connect to Neptune: ${testResult.error}`, 
              severity: 'warning',
              suggestions: ['Ensure your VPC security groups allow connections', 'Verify the cluster is running and accessible']
            }
          }
        } catch (e) {
          // Connection test failed, but don't block - might be network issue
        }
        break

      case 'vectorstore':
        if (!config.vectorStore.endpoint) {
          errors.vectorstore = { field: 'vectorStore.endpoint', message: 'OpenSearch endpoint is required', severity: 'error' }
        } else if (!validateOpenSearchEndpoint(config.vectorStore.endpoint)) {
          errors.vectorstore = { 
            field: 'vectorStore.endpoint', 
            message: 'Invalid OpenSearch endpoint format',
            severity: 'error'
          }
        }
        break

      case 'network':
        if (config.network.vpcId && !validateVpcId(config.network.vpcId)) {
          errors.network = { field: 'network.vpcId', message: 'Invalid VPC ID format', severity: 'error' }
        }
        
        if (config.network.subnetIds) {
          for (const subnetId of config.network.subnetIds) {
            if (subnetId && !validateSubnetId(subnetId)) {
              errors.network = { field: 'network.subnetIds', message: `Invalid subnet ID: ${subnetId}`, severity: 'error' }
              break
            }
          }
        }
        break
    }

    setValidationErrors(errors)
    setValidating(false)
    return Object.keys(errors).length === 0
  }

  const testNeptuneConnection = async (endpoint: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/config/validate-neptune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: 'Network error during validation' }
    }
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete(config)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else if (onBack) {
      onBack()
    }
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'region':
        return <RegionStep config={config} setConfig={setConfig} errors={validationErrors} />
      case 'database':
        return <DatabaseStep config={config} setConfig={setConfig} errors={validationErrors} />
      case 'vectorstore':
        return <VectorStoreStep config={config} setConfig={setConfig} errors={validationErrors} />
      case 'network':
        return <NetworkStep config={config} setConfig={setConfig} errors={validationErrors} />
      case 'security':
        return <SecurityStep config={config} setConfig={setConfig} errors={validationErrors} />
      case 'review':
        return <ReviewStep config={config} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AWS Configuration</h2>
              <p className="text-gray-600">Configure your private AWS infrastructure for VRIN</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Est. {formatCurrency(config.estimatedCost)}/month
            </Badge>
          </div>
          
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              const hasError = validationErrors[step.id]

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isActive 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'border-green-600 bg-green-600 text-white'
                        : hasError
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-300 bg-gray-100 text-gray-600'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : hasError ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-1 ml-4 mr-4 rounded-full transition-colors
                      ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={validating}
            >
              Back
            </Button>
            <div className="flex items-center gap-4">
              {validating && (
                <div className="flex items-center text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Validating...
                </div>
              )}
              <Button
                variant="default"
                onClick={handleNext}
                disabled={validating}
              >
                {currentStep === steps.length - 1 ? 'Complete Configuration' : 'Continue'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Step Components
function RegionStep({ config, setConfig, errors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          AWS Region & Basics
        </CardTitle>
        <CardDescription>
          Choose the AWS region closest to your users for optimal performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            AWS Region
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AWS_REGIONS.map((region) => (
              <div
                key={region.value}
                onClick={() => setConfig({ ...config, region: region.value })}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-colors
                  ${config.region === region.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{region.value}</p>
                    <p className="text-sm text-gray-600">{region.label}</p>
                  </div>
                  {region.popular && (
                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          {errors.region && (
            <p className="text-red-500 text-sm mt-2">{errors.region.message}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Region Selection Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Choose a region close to your users for lower latency</li>
                <li>• Ensure your existing AWS resources are in the same region</li>
                <li>• Consider data residency requirements for compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DatabaseStep({ config, setConfig, errors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Neptune Graph Database
        </CardTitle>
        <CardDescription>
          Configure your Neptune cluster for knowledge graph storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Neptune Cluster Endpoint
          </label>
          <Input
            value={config.database.endpoint}
            onChange={(e) => setConfig({
              ...config,
              database: { ...config.database, endpoint: e.target.value }
            })}
            placeholder="your-cluster.cluster-xxxxx.us-east-1.neptune.amazonaws.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            Use the cluster endpoint (not instance endpoint) for high availability
          </p>
          {errors.database?.suggestions && (
            <div className="mt-2 space-y-1">
              {errors.database.suggestions.map((suggestion: string, index: number) => (
                <p key={index} className="text-xs text-blue-600 flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  {suggestion}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port
            </label>
            <Input
              type="number"
              value={config.database.port}
              onChange={(e) => setConfig({
                ...config,
                database: { ...config.database, port: parseInt(e.target.value) }
              })}
              placeholder="8182"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authentication
            </label>
            <select
              value={config.database.auth}
              onChange={(e) => setConfig({
                ...config,
                database: { ...config.database, auth: e.target.value }
              })}
              className="w-full h-10 px-3 border border-gray-300 rounded-md"
            >
              <option value="iam_role">IAM Role</option>
              <option value="credentials">Username/Password</option>
            </select>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <HelpCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-1">Don&apos;t have a Neptune cluster?</h4>
              <p className="text-sm text-yellow-800 mb-2">
                We can automatically create one for you as part of the deployment process.
              </p>
              <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Setup Guide
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VectorStoreStep({ config, setConfig, errors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          OpenSearch Vector Store
        </CardTitle>
        <CardDescription>
          Configure OpenSearch for semantic similarity search
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenSearch Domain Endpoint
          </label>
          <Input
            value={config.vectorStore.endpoint}
            onChange={(e) => setConfig({
              ...config,
              vectorStore: { ...config.vectorStore, endpoint: e.target.value }
            })}
            placeholder="your-domain.us-east-1.es.amazonaws.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Index Name
            </label>
            <Input
              value={config.vectorStore.index}
              onChange={(e) => setConfig({
                ...config,
                vectorStore: { ...config.vectorStore, index: e.target.value }
              })}
              placeholder="knowledge_chunks"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vector Dimensions
            </label>
            <select
              value={config.vectorStore.dimensions}
              onChange={(e) => setConfig({
                ...config,
                vectorStore: { ...config.vectorStore, dimensions: parseInt(e.target.value) }
              })}
              className="w-full h-10 px-3 border border-gray-300 rounded-md"
            >
              <option value={1536}>1536 (OpenAI)</option>
              <option value={768}>768 (Sentence Transformers)</option>
              <option value={384}>384 (MiniLM)</option>
            </select>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <Zap className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900 mb-1">Performance Optimization</h4>
              <p className="text-sm text-green-800">
                We&apos;ll automatically configure optimal shard and replica settings based on your expected data volume.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NetworkStep({ config, setConfig, errors }: any) {
  const updateSubnets = (value: string) => {
    const subnetIds = value.split(',').map(s => s.trim()).filter(s => s.length > 0)
    setConfig({
      ...config,
      network: { ...config.network, subnetIds }
    })
  }

  const updateSecurityGroups = (value: string) => {
    const securityGroups = value.split(',').map(s => s.trim()).filter(s => s.length > 0)
    setConfig({
      ...config,
      network: { ...config.network, securityGroups }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Network Configuration
        </CardTitle>
        <CardDescription>
          Configure VPC, subnets, and networking options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VPC ID (Optional)
          </label>
          <Input
            value={config.network.vpcId}
            onChange={(e) => setConfig({
              ...config,
              network: { ...config.network, vpcId: e.target.value }
            })}
            placeholder="vpc-0123456789abcdef"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to create a new VPC automatically
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Private Subnet IDs (Optional)
          </label>
          <Input
            value={config.network.subnetIds?.join(', ') || ''}
            onChange={(e) => updateSubnets(e.target.value)}
            placeholder="subnet-abc123, subnet-def456"
          />
          <p className="text-sm text-gray-500 mt-1">
            Comma-separated list of private subnet IDs
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Security Group IDs (Optional)
          </label>
          <Input
            value={config.network.securityGroups?.join(', ') || ''}
            onChange={(e) => updateSecurityGroups(e.target.value)}
            placeholder="sg-123456, sg-789012"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Network Options</h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.network.privateLink}
                onChange={(e) => setConfig({
                  ...config,
                  network: { ...config.network, privateLink: e.target.checked }
                })}
                className="mr-3"
              />
              <div>
                <p className="text-sm font-medium">Enable PrivateLink Endpoints</p>
                <p className="text-xs text-gray-500">Connect to AWS services without internet access (+$45/month)</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.network.vpnConnection}
                onChange={(e) => setConfig({
                  ...config,
                  network: { ...config.network, vpnConnection: e.target.checked }
                })}
                className="mr-3"
              />
              <div>
                <p className="text-sm font-medium">VPN Gateway</p>
                <p className="text-xs text-gray-500">Site-to-site VPN connectivity (+$36/month)</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.network.directConnect}
                onChange={(e) => setConfig({
                  ...config,
                  network: { ...config.network, directConnect: e.target.checked }
                })}
                className="mr-3"
              />
              <div>
                <p className="text-sm font-medium">AWS Direct Connect</p>
                <p className="text-xs text-gray-500">Dedicated network connection (+$216/month)</p>
              </div>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SecurityStep({ config, setConfig, errors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security & LLM Configuration
        </CardTitle>
        <CardDescription>
          Configure encryption, access controls, and AI model settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">LLM Configuration</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Provider
              </label>
              <select
                value={config.llm.provider}
                onChange={(e) => setConfig({
                  ...config,
                  llm: { ...config.llm, provider: e.target.value }
                })}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              >
                <option value="openai">OpenAI</option>
                <option value="bedrock">AWS Bedrock</option>
                <option value="azure_openai">Azure OpenAI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={config.llm.model}
                onChange={(e) => setConfig({
                  ...config,
                  llm: { ...config.llm, model: e.target.value }
                })}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              >
                {config.llm.provider === 'openai' && (
                  <>
                    <option value="gpt-4o-mini">GPT-4o Mini (Recommended)</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </>
                )}
                {config.llm.provider === 'bedrock' && (
                  <>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key Storage
          </label>
          <select
            value={config.llm.apiKeyLocation}
            onChange={(e) => setConfig({
              ...config,
              llm: { ...config.llm, apiKeyLocation: e.target.value }
            })}
            className="w-full h-10 px-3 border border-gray-300 rounded-md"
          >
            <option value="secrets_manager">AWS Secrets Manager (Recommended)</option>
            <option value="key_vault">Azure Key Vault</option>
            <option value="env_var">Environment Variables</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.llm.backup?.enabled}
              onChange={(e) => setConfig({
                ...config,
                llm: {
                  ...config.llm,
                  backup: { ...config.llm.backup, enabled: e.target.checked }
                }
              })}
              className="mr-3"
            />
            <div>
              <p className="text-sm font-medium">Enable LLM Fallback</p>
              <p className="text-xs text-gray-500">Automatically switch to backup provider if primary fails</p>
            </div>
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Security Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• All data encrypted at rest with AWS KMS</li>
                <li>• TLS 1.3 encryption for data in transit</li>
                <li>• IAM-based access controls</li>
                <li>• Comprehensive audit logging</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewStep({ config }: { config: AWSConfig }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Configuration Review
          </CardTitle>
          <CardDescription>
            Review your AWS configuration before deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Infrastructure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Region:</span>
                  <span className="font-medium">{config.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Neptune:</span>
                  <span className="font-medium">{config.database.endpoint || 'Auto-create'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">OpenSearch:</span>
                  <span className="font-medium">{config.vectorStore.endpoint || 'Auto-create'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VPC:</span>
                  <span className="font-medium">{config.network.vpcId || 'Auto-create'}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Security & AI</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">LLM Provider:</span>
                  <span className="font-medium">{config.llm.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{config.llm.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PrivateLink:</span>
                  <span className="font-medium">{config.network.privateLink ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VPN Gateway:</span>
                  <span className="font-medium">{config.network.vpnConnection ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Cost Estimate
          </CardTitle>
          <CardDescription>
            Estimated monthly cost for your configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(config.estimatedCost)}/month
              </p>
              <p className="text-sm text-green-700">
                Estimated monthly cost (excluding data transfer)
              </p>
            </div>
            <Badge variant="secondary">Enterprise Rate</Badge>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">VRIN Enterprise License:</span>
              <span>$500/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Neptune Database:</span>
              <span>~$250/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">OpenSearch Domain:</span>
              <span>~$150/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lambda Functions:</span>
              <span>~$50/month</span>
            </div>
            {config.network.privateLink && (
              <div className="flex justify-between">
                <span className="text-gray-600">PrivateLink Endpoints:</span>
                <span>~$45/month</span>
              </div>
            )}
            {config.network.vpnConnection && (
              <div className="flex justify-between">
                <span className="text-gray-600">VPN Gateway:</span>
                <span>~$36/month</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}