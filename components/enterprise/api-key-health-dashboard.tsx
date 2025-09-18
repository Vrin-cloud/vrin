'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EndpointHealthIndicator, EndpointStatusBadge } from './endpoint-health-indicator'
import { EnterpriseValidationService, ValidationResult } from '@/lib/enterprise-validation'
import { 
  Key, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Shield,
  Activity,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApiKeyHealthProps {
  apiKeys: Array<{
    id: string
    name: string
    key: string
    environment: 'development' | 'staging' | 'production'
    permissions: string[]
    createdAt: Date
    lastUsed?: Date
    status: 'active' | 'suspended' | 'expired'
  }>
  organizationId: string
  onRefresh?: () => void
}

export function ApiKeyHealthDashboard({ apiKeys, organizationId, onRefresh }: ApiKeyHealthProps) {
  const [keyValidation, setKeyValidation] = useState<Record<string, ValidationResult>>({})
  const [overallHealth, setOverallHealth] = useState<{
    healthy: number
    unhealthy: number
    errors: number
    lastCheck?: Date
  }>({ healthy: 0, unhealthy: 0, errors: 0 })
  const [isValidating, setIsValidating] = useState(false)

  // Validate all API keys
  const validateAllKeys = async () => {
    if (apiKeys.length === 0) return

    setIsValidating(true)
    const validationResults: Record<string, ValidationResult> = {}

    try {
      // Validate keys in parallel
      const validations = apiKeys.map(async (apiKey) => {
        try {
          const result = await EnterpriseValidationService.validateApiKey(apiKey.key)
          validationResults[apiKey.id] = result
          return result
        } catch (error: any) {
          const errorResult: ValidationResult = {
            success: false,
            status: 'error',
            message: error.message || 'Validation failed'
          }
          validationResults[apiKey.id] = errorResult
          return errorResult
        }
      })

      const results = await Promise.all(validations)
      
      // Calculate overall health
      const healthy = results.filter(r => r.status === 'healthy').length
      const unhealthy = results.filter(r => r.status === 'unhealthy').length
      const errors = results.filter(r => r.status === 'error').length

      setOverallHealth({
        healthy,
        unhealthy,
        errors,
        lastCheck: new Date()
      })

      setKeyValidation(validationResults)
    } catch (error) {
      console.error('Validation error:', error)
    } finally {
      setIsValidating(false)
    }
  }

  // Validate individual key
  const validateKey = async (keyId: string, key: string) => {
    try {
      const result = await EnterpriseValidationService.validateApiKey(key)
      setKeyValidation(prev => ({
        ...prev,
        [keyId]: result
      }))
      
      // Recalculate overall health
      const allResults = Object.values({ ...keyValidation, [keyId]: result })
      const healthy = allResults.filter(r => r.status === 'healthy').length
      const unhealthy = allResults.filter(r => r.status === 'unhealthy').length
      const errors = allResults.filter(r => r.status === 'error').length
      
      setOverallHealth(prev => ({
        healthy,
        unhealthy,
        errors,
        lastCheck: new Date()
      }))
      
    } catch (error: any) {
      setKeyValidation(prev => ({
        ...prev,
        [keyId]: {
          success: false,
          status: 'error',
          message: error.message || 'Validation failed'
        }
      }))
    }
  }

  // Auto-validate on mount and when keys change
  useEffect(() => {
    if (apiKeys.length > 0) {
      validateAllKeys()
    }
  }, [apiKeys])

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-red-100 text-red-800'
      case 'staging': return 'bg-yellow-100 text-yellow-800'
      case 'development': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatKeyPreview = (key: string) => {
    if (key.length < 20) return key
    return `${key.substring(0, 12)}...${key.substring(key.length - 8)}`
  }

  if (apiKeys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys found</h3>
          <p className="text-gray-600 text-center mb-4">
            Generate your first enterprise API key to get started with private infrastructure.
          </p>
          {onRefresh && (
            <Button onClick={onRefresh}>
              <Key className="w-4 h-4 mr-2" />
              Generate API Key
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Health Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                API Keys Health Overview
              </CardTitle>
              <CardDescription>
                Real-time validation status of your enterprise API keys
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={validateAllKeys}
              disabled={isValidating}
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isValidating && 'animate-spin')} />
              {isValidating ? 'Validating...' : 'Validate All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Keys */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Keys</p>
                <p className="text-2xl font-semibold text-gray-900">{apiKeys.length}</p>
              </div>
            </div>

            {/* Healthy Keys */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Healthy</p>
                <p className="text-2xl font-semibold text-green-600">{overallHealth.healthy}</p>
              </div>
            </div>

            {/* Unhealthy Keys */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Issues</p>
                <p className="text-2xl font-semibold text-orange-600">{overallHealth.unhealthy}</p>
              </div>
            </div>

            {/* Error Keys */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-semibold text-red-600">{overallHealth.errors}</p>
              </div>
            </div>
          </div>
          
          {overallHealth.lastCheck && (
            <p className="text-xs text-gray-500 mt-4">
              Last validated: {overallHealth.lastCheck.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Individual API Key Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Key Validation Status
          </CardTitle>
          <CardDescription>
            Detailed validation status for each enterprise API key
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => {
              const validation = keyValidation[apiKey.id]
              
              return (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                      <Badge className={getEnvironmentColor(apiKey.environment)}>
                        {apiKey.environment}
                      </Badge>
                      {validation && (
                        <EndpointStatusBadge status={validation.status} />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-mono">{formatKeyPreview(apiKey.key)}</p>
                      <div className="flex items-center gap-4">
                        <span>Created: {apiKey.createdAt.toLocaleDateString()}</span>
                        {apiKey.lastUsed && (
                          <span>Last used: {apiKey.lastUsed.toLocaleDateString()}</span>
                        )}
                        <span>Permissions: {apiKey.permissions.join(', ')}</span>
                      </div>
                    </div>
                    
                    {validation && !validation.success && (
                      <p className="text-sm text-red-600 mt-2">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        {validation.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => validateKey(apiKey.id, apiKey.key)}
                      disabled={isValidating}
                    >
                      <RefreshCw className={cn('w-3 h-3 mr-1', isValidating && 'animate-spin')} />
                      Test
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}