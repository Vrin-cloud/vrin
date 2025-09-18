import { useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiCall } from '@/config/api'
import type { EnterpriseConfiguration, ValidationResult } from '@/types/enterprise'

interface InfrastructureConfigHook {
  // Configuration management
  configuration: EnterpriseConfiguration | null
  isLoading: boolean
  error: string | null
  
  // Actions
  saveConfiguration: (config: Partial<EnterpriseConfiguration>) => Promise<void>
  validateConfiguration: (config: Partial<EnterpriseConfiguration>) => Promise<ValidationResult>
  testConnection: (service: string, config: any) => Promise<{ success: boolean; message: string }>
  
  // Status
  isSaving: boolean
  isValidating: boolean
  isTesting: Record<string, boolean>
  validationResult: ValidationResult | null
}

export const useInfrastructureConfig = (organizationId?: string): InfrastructureConfigHook => {
  const queryClient = useQueryClient()
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({})

  // Fetch current configuration
  const {
    data: configuration,
    isLoading,
    error: queryError
  } = useQuery({
    queryKey: ['infrastructure-config', organizationId],
    queryFn: async () => {
      if (!organizationId) return null
      
      try {
        const response = await apiCall(`/enterprise/infrastructure/${organizationId}`)
        return response.data as EnterpriseConfiguration
      } catch (error: any) {
        if (error.message.includes('404')) {
          return null // No configuration exists yet
        }
        throw error
      }
    },
    enabled: !!organizationId
  })

  // Save configuration mutation
  const saveConfigMutation = useMutation({
    mutationFn: async (config: Partial<EnterpriseConfiguration>) => {
      const endpoint = organizationId 
        ? `/enterprise/infrastructure/${organizationId}`
        : '/enterprise/infrastructure'
      
      const payload = {
        ...config,
        organizationId: organizationId || config.organizationId,
        updatedAt: new Date().toISOString()
      }
      
      const response = await apiCall(endpoint, {
        method: organizationId ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      })
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save configuration')
      }
      
      return response.data
    },
    onSuccess: (data) => {
      // Update the cache
      queryClient.setQueryData(['infrastructure-config', organizationId], data)
      queryClient.invalidateQueries({ queryKey: ['infrastructure-configs'] })
    }
  })

  // Validate configuration mutation
  const validateConfigMutation = useMutation({
    mutationFn: async (config: Partial<EnterpriseConfiguration>): Promise<ValidationResult> => {
      const response = await apiCall('/enterprise/infrastructure/validate', {
        method: 'POST',
        body: JSON.stringify({
          configuration: config,
          organizationId
        })
      })
      
      if (!response.success) {
        throw new Error(response.error || 'Validation failed')
      }
      
      return response.data as ValidationResult
    },
    onSuccess: (result) => {
      setValidationResult(result)
    }
  })

  // Test connection function
  const testConnection = useCallback(async (service: string, config: any) => {
    const testKey = `${service}-${Date.now()}`
    setIsTesting(prev => ({ ...prev, [service]: true }))
    
    try {
      let endpoint = ''
      let payload: any = { organizationId }
      
      switch (service) {
        case 'database':
          endpoint = '/enterprise/infrastructure/test/database'
          payload = {
            ...payload,
            type: config.type,
            endpoint: config.endpoint,
            port: parseInt(config.port) || 8182,
            username: config.username,
            password: config.password,
            ssl: config.ssl
          }
          break
          
        case 'vector-store':
          endpoint = '/enterprise/infrastructure/test/vector-store'
          payload = {
            ...payload,
            type: config.type,
            endpoint: config.endpoint,
            authToken: config.authToken,
            index: config.index
          }
          break
          
        case 'llm':
          endpoint = '/enterprise/infrastructure/test/llm'
          payload = {
            ...payload,
            provider: config.provider,
            model: config.model,
            apiKeyLocation: config.apiKeyLocation,
            endpoint: config.endpoint
          }
          break
          
        default:
          throw new Error(`Unknown service: ${service}`)
      }
      
      const response = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      
      return {
        success: response.success,
        message: response.message || (response.success ? 'Connection successful' : 'Connection failed')
      }
      
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Connection test failed'
      }
    } finally {
      setIsTesting(prev => {
        const newState = { ...prev }
        delete newState[service]
        return newState
      })
    }
  }, [organizationId])

  return {
    // Data
    configuration: configuration || null,
    isLoading,
    error: queryError?.message || null,
    validationResult,
    
    // Actions
    saveConfiguration: saveConfigMutation.mutateAsync,
    validateConfiguration: validateConfigMutation.mutateAsync,
    testConnection,
    
    // Status
    isSaving: saveConfigMutation.isPending,
    isValidating: validateConfigMutation.isPending,
    isTesting
  }
}

// Hook for listing all infrastructure configurations (admin view)
export const useInfrastructureConfigs = () => {
  return useQuery({
    queryKey: ['infrastructure-configs'],
    queryFn: async () => {
      const response = await apiCall('/enterprise/infrastructure')
      return response.data as EnterpriseConfiguration[]
    }
  })
}

// Hook for configuration templates
export const useConfigurationTemplates = () => {
  return useQuery({
    queryKey: ['configuration-templates'],
    queryFn: async () => {
      const response = await apiCall('/enterprise/infrastructure/templates')
      return response.data as {
        id: string
        name: string
        description: string
        provider: string
        deploymentMode: string
        template: Partial<EnterpriseConfiguration>
      }[]
    }
  })
}

// Hook for cost estimation
export const useInfrastructureCostEstimate = () => {
  return useMutation({
    mutationFn: async (config: Partial<EnterpriseConfiguration>) => {
      const response = await apiCall('/enterprise/infrastructure/estimate-cost', {
        method: 'POST',
        body: JSON.stringify({ configuration: config })
      })
      
      return response.data as {
        monthlyEstimate: number
        yearlyEstimate: number
        currency: string
        breakdown: Array<{
          service: string
          monthlyCost: number
          description: string
        }>
        confidence: number
      }
    }
  })
}