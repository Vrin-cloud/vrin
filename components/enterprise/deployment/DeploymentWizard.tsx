'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnterpriseProgress } from '@/components/ui/progress'
import { EnterpriseConfiguration, DeploymentStatus, Deployment, DeploymentStep } from '@/types/enterprise'
// Simple inline utility functions
const formatDuration = (seconds: number) => `${seconds}s`
const calculateProgress = (completed: number, total: number) => Math.round((completed / total) * 100)
import {
  Rocket,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Download,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Info,
  Zap,
  Shield,
  Database,
  Network
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface DeploymentWizardProps {
  config: EnterpriseConfiguration
  onComplete: (deployment: Deployment) => void
  onCancel?: () => void
}

const DEPLOYMENT_STEPS: DeploymentStep[] = [
  {
    id: 'validation',
    name: 'Configuration Validation',
    description: 'Validating configuration parameters and dependencies',
    status: 'pending',
    dependencies: []
  },
  {
    id: 'template-generation',
    name: 'Template Generation',
    description: 'Generating CloudFormation templates for your infrastructure',
    status: 'pending',
    dependencies: ['validation']
  },
  {
    id: 'resource-creation',
    name: 'AWS Resources',
    description: 'Creating VPC, security groups, and networking components',
    status: 'pending',
    dependencies: ['template-generation']
  },
  {
    id: 'database-setup',
    name: 'Neptune Database',
    description: 'Provisioning Neptune cluster and configuring access',
    status: 'pending',
    dependencies: ['resource-creation']
  },
  {
    id: 'vector-store',
    name: 'OpenSearch Setup',
    description: 'Creating OpenSearch domain and configuring indexes',
    status: 'pending',
    dependencies: ['resource-creation']
  },
  {
    id: 'lambda-deployment',
    name: 'Lambda Functions',
    description: 'Deploying VRIN processing functions and API handlers',
    status: 'pending',
    dependencies: ['database-setup', 'vector-store']
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'Setting up API endpoints and authentication',
    status: 'pending',
    dependencies: ['lambda-deployment']
  },
  {
    id: 'monitoring',
    name: 'Monitoring Setup',
    description: 'Configuring CloudWatch dashboards and alerts',
    status: 'pending',
    dependencies: ['api-gateway']
  },
  {
    id: 'verification',
    name: 'Health Verification',
    description: 'Running health checks and integration tests',
    status: 'pending',
    dependencies: ['monitoring']
  }
]

export function DeploymentWizard({ config, onComplete, onCancel }: DeploymentWizardProps) {
  const [deployment, setDeployment] = useState<Deployment>({
    id: `deploy_${Date.now()}`,
    organizationId: config.organizationId,
    configVersion: config.configVersion,
    status: 'idle' as DeploymentStatus,
    timestamp: new Date(),
    template: '',
    templateType: 'cloudformation',
    progress: {
      totalSteps: DEPLOYMENT_STEPS.length,
      completedSteps: 0,
      currentStep: '',
      stepDetails: [...DEPLOYMENT_STEPS]
    },
    resources: [],
    logs: []
  })

  const [showDetails, setShowDetails] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState(0)

  useEffect(() => {
    // Calculate estimated deployment time
    const baseTime = 15 // Base 15 minutes
    let additionalTime = 0

    // Add time based on configuration complexity
    if (config.network.vpcId) additionalTime += 5
    if (config.network.privateLink) additionalTime += 8
    if (config.network.vpnConnection) additionalTime += 12
    if (config.compliance.frameworks.length > 2) additionalTime += 5

    setEstimatedTime(baseTime + additionalTime)
  }, [config])

  const startDeployment = async () => {
    setDeployment(prev => ({
      ...prev,
      status: 'deploying',
      timestamp: new Date()
    }))

    toast.success('Deployment started! This will take approximately ' + estimatedTime + ' minutes.')

    try {
      // Generate deployment template
      const templateResponse = await fetch('/api/deployment/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      })

      if (!templateResponse.ok) {
        throw new Error('Failed to generate deployment template')
      }

      const { template } = await templateResponse.json()

      setDeployment(prev => ({
        ...prev,
        template
      }))

      // Start actual deployment
      const deployResponse = await fetch('/api/deployment/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deploymentId: deployment.id,
          config,
          template
        })
      })

      if (!deployResponse.ok) {
        throw new Error('Failed to start deployment')
      }

      // Start polling for status updates
      pollDeploymentStatus()

    } catch (error) {
      console.error('Deployment error:', error)
      toast.error('Deployment failed to start: ' + (error as Error).message)
      setDeployment(prev => ({
        ...prev,
        status: 'failed',
        error: (error as Error).message
      }))
    }
  }

  const pollDeploymentStatus = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/deployment/status/${deployment.id}`)
        const statusData = await response.json()

        if (response.ok) {
          setDeployment(prev => ({
            ...prev,
            ...statusData,
            progress: {
              ...prev.progress,
              ...statusData.progress
            }
          }))

          // Check if deployment is complete
          if (statusData.status === 'completed') {
            clearInterval(pollInterval)
            toast.success('Deployment completed successfully!')
            onComplete(statusData)
          } else if (statusData.status === 'failed') {
            clearInterval(pollInterval)
            toast.error('Deployment failed: ' + statusData.error)
          }
        }
      } catch (error) {
        console.error('Status polling error:', error)
        // Continue polling even if there's a temporary error
      }
    }, 5000) // Poll every 5 seconds

    // Cleanup interval after maximum expected deployment time
    setTimeout(() => {
      clearInterval(pollInterval)
    }, (estimatedTime + 10) * 60 * 1000) // Add 10 minutes buffer
  }

  const retryDeployment = () => {
    setDeployment(prev => ({
      ...prev,
      status: 'idle',
      error: undefined,
      progress: {
        ...prev.progress,
        completedSteps: 0,
        currentStep: '',
        stepDetails: DEPLOYMENT_STEPS.map(step => ({ ...step, status: 'pending' }))
      }
    }))
  }

  const downloadTemplate = () => {
    if (!deployment.template) return

    const blob = new Blob([deployment.template], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vrin-enterprise-${config.organizationName}-${deployment.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: DeploymentStatus) => {
    switch (status) {
      case 'deploying': return <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStepIcon = (stepId: string) => {
    const iconMap: Record<string, any> = {
      'validation': Shield,
      'template-generation': FileText,
      'resource-creation': Network,
      'database-setup': Database,
      'vector-store': Database,
      'lambda-deployment': Zap,
      'api-gateway': Network,
      'monitoring': Info,
      'verification': CheckCircle
    }
    return iconMap[stepId] || Info
  }

  const currentProgress = calculateProgress(deployment.progress.completedSteps, deployment.progress.totalSteps)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Deploy Enterprise Infrastructure</CardTitle>
                <CardDescription>
                  Deploy VRIN to your AWS account: {config.organizationName}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(deployment.status)}
              <Badge variant={deployment.status === 'completed' ? 'secondary' : deployment.status === 'failed' ? 'destructive' : deployment.status === 'deploying' ? 'outline' : 'default'}>
                {deployment.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{estimatedTime} min</p>
              <p className="text-sm text-gray-600">Estimated Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{deployment.progress.totalSteps}</p>
              <p className="text-sm text-gray-600">Total Steps</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{deployment.progress.completedSteps}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>

          <EnterpriseProgress
            value={currentProgress}
            status={deployment.status === 'validating' ? 'pending' : deployment.status}
            animated={deployment.status === 'deploying'}
            className="mb-4"
          />

          <div className="flex justify-center gap-3">
            {deployment.status === 'idle' && (
              <Button
                onClick={startDeployment}
                variant="default"
                size="lg"
                className="min-w-[160px]"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Start Deployment
              </Button>
            )}

            {deployment.status === 'failed' && (
              <Button
                onClick={retryDeployment}
                variant="outline"
                size="lg"
                className="min-w-[160px]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Deployment
              </Button>
            )}

            {deployment.template && (
              <Button
                onClick={downloadTemplate}
                variant="outline"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            )}

            {onCancel && deployment.status !== 'deploying' && (
              <Button
                onClick={onCancel}
                variant="outline"
                size="lg"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Deployment Progress</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployment.progress.stepDetails.map((step, index) => {
              const StepIcon = getStepIcon(step.id)
              const isActive = deployment.progress.currentStep === step.name
              const isCompleted = step.status === 'completed'
              const isFailed = step.status === 'failed'
              const isInProgress = step.status === 'in_progress'

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center p-4 rounded-lg border-2 transition-all duration-300
                    ${isActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-50'
                        : isFailed
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-white'
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mr-4
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : isCompleted 
                        ? 'bg-green-500 text-white'
                        : isFailed
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isFailed ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : isInProgress ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : isFailed ? 'text-red-900' : 'text-gray-900'}`}>
                        {step.name}
                      </h4>
                      {step.duration && (
                        <Badge variant="outline" className="text-xs">
                          {formatDuration(step.duration)}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : isFailed ? 'text-red-700' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                    
                    {showDetails && step.logs && step.logs.length > 0 && (
                      <div className="mt-2 p-3 bg-gray-50 rounded border">
                        <div className="space-y-1">
                          {step.logs.slice(-3).map((log, logIndex) => (
                            <p key={logIndex} className="text-xs text-gray-600 font-mono">
                              {log}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      <AnimatePresence>
        {deployment.status === 'deploying' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">Deployment in Progress</p>
                    <p className="text-sm text-blue-700">
                      {deployment.progress.currentStep || 'Initializing deployment...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {deployment.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 mb-2">Deployment Completed Successfully! 🎉</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Your VRIN enterprise infrastructure is now ready to use.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access Dashboard
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Documentation
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {deployment.status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 mb-2">Deployment Failed</h4>
                    <p className="text-sm text-red-700 mb-2">
                      {deployment.error || 'An unexpected error occurred during deployment.'}
                    </p>
                    <p className="text-xs text-red-600 mb-3">
                      Don&apos;t worry - no charges will be incurred for failed deployments.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={retryDeployment} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry Deployment
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}