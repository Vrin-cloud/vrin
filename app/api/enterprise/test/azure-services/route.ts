import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, endpoint, authToken, resourceGroup, subscriptionId } = body

    // Validate required fields
    if (!type || !endpoint) {
      return NextResponse.json(
        { error: 'Service type and endpoint are required' },
        { status: 400 }
      )
    }

    console.log(`Testing ${type} Azure service connection to ${endpoint}`)

    // Handle different Azure service types
    switch (type.toLowerCase()) {
      case 'key_vault':
      case 'keyvault':
        return await testAzureKeyVault(endpoint, authToken)
      case 'function_app':
      case 'functions':
        return await testAzureFunctions(endpoint, authToken)
      case 'storage_account':
      case 'storage':
        return await testAzureStorage(endpoint, authToken)
      default:
        return NextResponse.json(
          { error: `Unsupported Azure service type: ${type}` },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Azure service test error:', error)
    return NextResponse.json(
      { error: error.message || 'Azure service connection test failed' },
      { status: 500 }
    )
  }
}

async function testAzureKeyVault(endpoint: string, authToken?: string) {
  try {
    // Ensure endpoint has proper format
    if (!endpoint.includes('vault.azure.net')) {
      return NextResponse.json({
        success: false,
        status: 'error',
        message: 'Invalid Azure Key Vault endpoint. Must contain "vault.azure.net"',
        errorCode: 'INVALID_ENDPOINT'
      }, { status: 400 })
    }

    // Ensure HTTPS
    let keyVaultUrl = endpoint
    if (!keyVaultUrl.startsWith('https://')) {
      keyVaultUrl = `https://${keyVaultUrl.replace(/^https?:\/\//, '')}`
    }

    // Test Key Vault connectivity
    console.log(`Testing Azure Key Vault connection to: ${keyVaultUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const headers: Record<string, string> = {
      'User-Agent': 'VRIN-Enterprise-Test/1.0'
    }

    // Add authentication if provided
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    try {
      const response = await fetch(keyVaultUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      })
      
      clearTimeout(timeoutId)

      if (response.status === 200) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Key Vault connection successful',
          details: {
            endpoint: keyVaultUrl,
            authenticated: true
          }
        })
      } else if (response.status === 401) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Key Vault endpoint is reachable (authentication required for full test)',
          errorCode: 'AUTH_REQUIRED',
          details: {
            endpoint: keyVaultUrl,
            note: 'Valid access token needed for complete validation'
          }
        })
      } else if (response.status === 403) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Key Vault endpoint is reachable (access permissions required)',
          errorCode: 'PERMISSIONS_REQUIRED',
          details: {
            endpoint: keyVaultUrl,
            note: 'Proper Azure AD permissions needed for full access'
          }
        })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: `Azure Key Vault responded with status ${response.status}: ${errorText}`,
          errorCode: 'HTTP_ERROR'
        }, { status: response.status })
      }

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Azure Key Vault connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach Azure Key Vault endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `Azure Key Vault test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}

async function testAzureFunctions(endpoint: string, authToken?: string) {
  try {
    // Ensure endpoint has proper format
    if (!endpoint.includes('azurewebsites.net')) {
      return NextResponse.json({
        success: false,
        status: 'error',
        message: 'Invalid Azure Functions endpoint. Must contain "azurewebsites.net"',
        errorCode: 'INVALID_ENDPOINT'
      }, { status: 400 })
    }

    // Ensure HTTPS
    let functionsUrl = endpoint
    if (!functionsUrl.startsWith('https://')) {
      functionsUrl = `https://${functionsUrl.replace(/^https?:\/\//, '')}`
    }

    console.log(`Testing Azure Functions connection to: ${functionsUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const headers: Record<string, string> = {
      'User-Agent': 'VRIN-Enterprise-Test/1.0'
    }

    if (authToken) {
      headers['x-functions-key'] = authToken
    }

    try {
      const response = await fetch(functionsUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      })
      
      clearTimeout(timeoutId)

      if (response.status === 200) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Functions connection successful',
          details: {
            endpoint: functionsUrl,
            responsive: true
          }
        })
      } else if (response.status === 401) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Functions endpoint is reachable (function key required for full test)',
          errorCode: 'AUTH_REQUIRED',
          details: {
            endpoint: functionsUrl,
            note: 'Function key needed for API access'
          }
        })
      } else if (response.status === 404) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Functions app is reachable (no functions configured at root)',
          details: {
            endpoint: functionsUrl,
            note: 'Function app is running but may need specific function paths'
          }
        })
      } else {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: `Azure Functions app is reachable (status: ${response.status})`,
          details: {
            endpoint: functionsUrl,
            responseStatus: response.status,
            note: 'Function app is responding'
          }
        })
      }

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Azure Functions connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach Azure Functions endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `Azure Functions test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}

async function testAzureStorage(endpoint: string, authToken?: string) {
  try {
    // Handle both storage account name and full endpoint
    let storageUrl: string
    
    if (endpoint.includes('blob.core.windows.net')) {
      // Full endpoint provided
      storageUrl = endpoint
    } else {
      // Storage account name provided, construct blob endpoint
      storageUrl = `https://${endpoint}.blob.core.windows.net/`
    }

    // Ensure HTTPS
    if (!storageUrl.startsWith('https://')) {
      storageUrl = `https://${storageUrl.replace(/^https?:\/\//, '')}`
    }

    console.log(`Testing Azure Storage connection to: ${storageUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const headers: Record<string, string> = {
      'User-Agent': 'VRIN-Enterprise-Test/1.0'
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    try {
      // Test with a simple list containers operation
      const testUrl = `${storageUrl}?comp=list`
      
      const response = await fetch(testUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      })
      
      clearTimeout(timeoutId)

      if (response.status === 200) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Storage connection successful',
          details: {
            endpoint: storageUrl,
            authenticated: true
          }
        })
      } else if (response.status === 401) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Storage endpoint is reachable (authentication required for full test)',
          errorCode: 'AUTH_REQUIRED',
          details: {
            endpoint: storageUrl,
            note: 'Access key or SAS token needed for complete validation'
          }
        })
      } else if (response.status === 400) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Storage endpoint is reachable (proper API parameters required)',
          details: {
            endpoint: storageUrl,
            responseStatus: response.status,
            note: 'Storage account is accessible but needs proper API call format'
          }
        })
      } else if (response.status === 403) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Storage endpoint is reachable (access permissions required)',
          errorCode: 'PERMISSIONS_REQUIRED',
          details: {
            endpoint: storageUrl,
            note: 'Storage account permissions needed for full access'
          }
        })
      } else {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: `Azure Storage account is reachable (status: ${response.status})`,
          details: {
            endpoint: storageUrl,
            responseStatus: response.status
          }
        })
      }

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Azure Storage connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach Azure Storage endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `Azure Storage test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}