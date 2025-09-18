import { EnterpriseAPIService } from './enterprise-api'

export interface ValidationResult {
  success: boolean
  status: 'healthy' | 'unhealthy' | 'error' | 'testing'
  message: string
  errorCode?: string
  details?: any
}

export class EnterpriseValidationService {
  
  // Test database connectivity
  static async testDatabaseConnection(config: {
    type: string
    endpoint: string
    port: number
    username?: string
    password?: string
    ssl: boolean
  }): Promise<ValidationResult> {
    try {
      // This would call your backend validation endpoint
      const response = await fetch('/api/enterprise/test/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        const error = await response.text()
        return this.mapBackendError(error)
      }

      const result = await response.json()
      return {
        success: result.success,
        status: result.status,
        message: result.message,
        details: result.details
      }

    } catch (error: any) {
      return this.mapConnectionError(error, 'database')
    }
  }

  // Test vector store connectivity  
  static async testVectorStoreConnection(config: {
    type: string
    endpoint: string
    authToken: string
    index: string
  }): Promise<ValidationResult> {
    try {
      const response = await fetch('/api/enterprise/test/vector-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        const error = await response.text()
        return this.mapBackendError(error)
      }

      const result = await response.json()
      return {
        success: result.success,
        status: result.status,
        message: result.message,
        details: result.details
      }

    } catch (error: any) {
      return this.mapConnectionError(error, 'vector-store')
    }
  }

  // Test LLM connectivity
  static async testLLMConnection(config: {
    provider: string
    model: string
    endpoint?: string
    apiKeyLocation: string
  }): Promise<ValidationResult> {
    try {
      const response = await fetch('/api/enterprise/test/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        const error = await response.text()
        return this.mapBackendError(error)
      }

      const result = await response.json()
      return {
        success: result.success,
        status: result.status,
        message: result.message,
        details: result.details
      }

    } catch (error: any) {
      return this.mapConnectionError(error, 'llm')
    }
  }

  // Validate enterprise API key
  static async validateApiKey(apiKey: string): Promise<ValidationResult> {
    try {
      // Check API key format first
      if (!this.isValidEnterpriseApiKey(apiKey)) {
        return {
          success: false,
          status: 'error',
          message: 'Invalid enterprise API key format',
          errorCode: 'INVALID_FORMAT'
        }
      }

      // Test API key against backend
      const response = await fetch('/api/enterprise/validate-key', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      })

      if (!response.ok) {
        const error = await response.text()
        return this.mapBackendError(error)
      }

      const result = await response.json()
      return {
        success: true,
        status: 'healthy',
        message: 'API key is valid and active',
        details: result
      }

    } catch (error: any) {
      return this.mapConnectionError(error, 'api-key')
    }
  }

  // Test Azure services (Key Vault, Functions, Storage)
  static async testAzureService(config: {
    type: string
    endpoint: string
    authToken?: string
    resourceGroup?: string
    subscriptionId?: string
  }): Promise<ValidationResult> {
    try {
      const response = await fetch('/api/enterprise/test/azure-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        const error = await response.text()
        return this.mapBackendError(error)
      }

      const result = await response.json()
      return {
        success: result.success,
        status: result.status,
        message: result.message,
        details: result.details
      }

    } catch (error: any) {
      return this.mapConnectionError(error, `azure-${config.type}`)
    }
  }

  // Check if API key has valid enterprise format
  static isValidEnterpriseApiKey(apiKey: string): boolean {
    const enterprisePatterns = [
      /^vrin_ent_airgap_[a-zA-Z0-9]{32}$/,
      /^vrin_ent_vpc_[a-zA-Z0-9]{32}$/,
      /^vrin_ent_hybrid_[a-zA-Z0-9]{32}$/
    ]
    
    return enterprisePatterns.some(pattern => pattern.test(apiKey))
  }

  // Map backend error messages to user-friendly responses
  private static mapBackendError(error: string): ValidationResult {
    const errorMappings = {
      'API key not found in enterprise database': {
        success: false,
        status: 'error' as const,
        message: 'API key not found in system',
        errorCode: 'KEY_NOT_FOUND'
      },
      'Infrastructure configuration not found': {
        success: false,
        status: 'error' as const,
        message: 'Infrastructure configuration missing',
        errorCode: 'CONFIG_NOT_FOUND'
      },
      'Database connectivity test timed out': {
        success: false,
        status: 'unhealthy' as const,
        message: 'Database connection timeout',
        errorCode: 'CONNECTION_TIMEOUT'
      },
      'Lambda functions have improper database permissions': {
        success: false,
        status: 'error' as const,
        message: 'Permission denied - check IAM roles',
        errorCode: 'PERMISSION_DENIED'
      },
      'DNS resolution failed: [Errno 8] nodename nor servname provided': {
        success: false,
        status: 'unhealthy' as const,
        message: 'DNS resolution failed - check endpoint URL',
        errorCode: 'DNS_FAILURE'
      }
    }

    for (const [backendError, result] of Object.entries(errorMappings)) {
      if (error.includes(backendError)) {
        return result
      }
    }

    // Default error response
    return {
      success: false,
      status: 'error',
      message: error || 'Unknown validation error',
      errorCode: 'UNKNOWN_ERROR'
    }
  }

  // Map network/connection errors
  private static mapConnectionError(error: any, type: string): ValidationResult {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        status: 'unhealthy',
        message: `Cannot reach ${type} endpoint`,
        errorCode: 'NETWORK_ERROR'
      }
    }

    if (error.name === 'AbortError') {
      return {
        success: false,
        status: 'unhealthy', 
        message: `${type} connection timeout`,
        errorCode: 'TIMEOUT'
      }
    }

    return {
      success: false,
      status: 'error',
      message: error.message || `${type} connection failed`,
      errorCode: 'CONNECTION_ERROR'
    }
  }

  // Test all endpoints for a configuration
  static async validateFullConfiguration(organizationId: string, config: any): Promise<{
    overall: ValidationResult
    database: ValidationResult
    vectorStore: ValidationResult
    llm: ValidationResult
    apiKeys: ValidationResult[]
  }> {
    const [database, vectorStore, llm] = await Promise.all([
      this.testDatabaseConnection(config.database),
      this.testVectorStoreConnection(config.vectorStore),
      this.testLLMConnection(config.llm)
    ])

    // Test API keys if available
    const apiKeys: ValidationResult[] = []
    if (config.apiKeys?.length > 0) {
      for (const key of config.apiKeys) {
        const keyResult = await this.validateApiKey(key.key)
        apiKeys.push(keyResult)
      }
    }

    // Determine overall health
    const allTests = [database, vectorStore, llm, ...apiKeys]
    const hasErrors = allTests.some(test => test.status === 'error')
    const hasUnhealthy = allTests.some(test => test.status === 'unhealthy')

    let overall: ValidationResult
    if (hasErrors) {
      overall = {
        success: false,
        status: 'error',
        message: 'Configuration has errors that need attention'
      }
    } else if (hasUnhealthy) {
      overall = {
        success: false,
        status: 'unhealthy',
        message: 'Some endpoints are not accessible'
      }
    } else {
      overall = {
        success: true,
        status: 'healthy',
        message: 'All endpoints are healthy and accessible'
      }
    }

    return {
      overall,
      database,
      vectorStore,
      llm,
      apiKeys
    }
  }
}