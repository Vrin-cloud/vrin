import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, endpoint, authToken, index } = body

    // Validate required fields
    if (!type || !endpoint) {
      return NextResponse.json(
        { error: 'Vector store type and endpoint are required' },
        { status: 400 }
      )
    }

    console.log(`Testing ${type} vector store connection to ${endpoint}`)

    // Handle different vector store types
    switch (type.toLowerCase()) {
      case 'azure_search':
        return await testAzureCognitiveSearch(endpoint, authToken, index)
      case 'opensearch':
        return await testOpenSearch(endpoint, authToken, index)
      case 'elasticsearch':
        return await testElasticsearch(endpoint, authToken, index)
      case 'pinecone':
        return await testPinecone(endpoint, authToken, index)
      default:
        return NextResponse.json(
          { error: `Unsupported vector store type: ${type}` },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Vector store test error:', error)
    return NextResponse.json(
      { error: error.message || 'Vector store connection test failed' },
      { status: 500 }
    )
  }
}

async function testAzureCognitiveSearch(endpoint: string, authToken?: string, index: string = 'vrin-knowledge') {
  try {
    // Ensure endpoint has proper format
    let searchEndpoint = endpoint
    if (!endpoint.includes('search.windows.net')) {
      return NextResponse.json({
        success: false,
        status: 'error',
        message: 'Invalid Azure Cognitive Search endpoint. Must contain "search.windows.net"',
        errorCode: 'INVALID_ENDPOINT'
      }, { status: 400 })
    }

    // Ensure HTTPS
    if (!searchEndpoint.startsWith('https://')) {
      searchEndpoint = `https://${searchEndpoint.replace(/^https?:\/\//, '')}`
    }

    // Test basic service health
    const healthUrl = `${searchEndpoint}/indexes?api-version=2023-11-01`
    
    console.log(`Testing Azure Cognitive Search connection to: ${healthUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'VRIN-Enterprise-Test/1.0'
    }

    // Add authentication if provided
    if (authToken) {
      headers['api-key'] = authToken
    }

    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      })
      
      clearTimeout(timeoutId)

      if (response.status === 200) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Cognitive Search connection successful',
          details: {
            endpoint: searchEndpoint,
            indexCount: data.value?.length || 0,
            hasIndex: data.value?.some((idx: any) => idx.name === index) || false
          }
        })
      } else if (response.status === 401) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Azure Cognitive Search endpoint is reachable (API key required for full test)',
          errorCode: 'AUTH_REQUIRED',
          details: {
            endpoint: searchEndpoint,
            note: 'Valid API key needed for complete validation'
          }
        })
      } else if (response.status === 403) {
        return NextResponse.json({
          success: true,
          status: 'healthy', 
          message: 'Azure Cognitive Search endpoint is reachable (permissions required for full test)',
          errorCode: 'PERMISSIONS_REQUIRED',
          details: {
            endpoint: searchEndpoint,
            note: 'Valid API key with proper permissions needed'
          }
        })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: `Azure Cognitive Search responded with status ${response.status}: ${errorText}`,
          errorCode: 'HTTP_ERROR'
        }, { status: response.status })
      }

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Azure Cognitive Search connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      // Check for DNS/network errors
      if (fetchError.message.includes('ENOTFOUND') || fetchError.message.includes('ECONNREFUSED')) {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: `Cannot reach Azure Cognitive Search endpoint: ${fetchError.message}`,
          errorCode: 'NETWORK_ERROR'
        }, { status: 503 })
      }

      throw fetchError
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `Azure Cognitive Search test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}

async function testOpenSearch(endpoint: string, authToken?: string, index: string = 'vrin-knowledge') {
  try {
    let searchEndpoint = endpoint
    if (!searchEndpoint.startsWith('https://')) {
      searchEndpoint = `https://${searchEndpoint.replace(/^https?:\/\//, '')}`
    }

    const healthUrl = `${searchEndpoint}/_cluster/health`
    
    console.log(`Testing OpenSearch connection to: ${healthUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'VRIN-Enterprise-Test/1.0'
    }

    if (authToken) {
      headers['Authorization'] = `Basic ${authToken}`
    }

    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      })
      
      clearTimeout(timeoutId)

      if (response.status === 200) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'OpenSearch connection successful',
          details: {
            endpoint: searchEndpoint,
            clusterStatus: data.status,
            numberOfNodes: data.number_of_nodes
          }
        })
      } else if (response.status === 401) {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'OpenSearch authentication failed',
          errorCode: 'AUTH_FAILED'
        }, { status: 401 })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: `OpenSearch responded with status ${response.status}: ${errorText}`,
          errorCode: 'HTTP_ERROR'
        }, { status: response.status })
      }

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'OpenSearch connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach OpenSearch endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `OpenSearch test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}

async function testElasticsearch(endpoint: string, authToken?: string, index: string = 'vrin-knowledge') {
  try {
    let searchEndpoint = endpoint
    if (!searchEndpoint.startsWith('https://')) {
      searchEndpoint = `https://${searchEndpoint.replace(/^https?:\/\//, '')}`
    }

    const healthUrl = `${searchEndpoint}/_cluster/health`
    
    console.log(`Testing Elasticsearch connection to: ${healthUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'VRIN-Enterprise-Test/1.0'
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      })
      
      clearTimeout(timeoutId)

      if (response.status === 200) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Elasticsearch connection successful',
          details: {
            endpoint: searchEndpoint,
            clusterStatus: data.status,
            numberOfNodes: data.number_of_nodes
          }
        })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: `Elasticsearch responded with status ${response.status}: ${errorText}`,
          errorCode: 'HTTP_ERROR'
        }, { status: response.status })
      }

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Elasticsearch connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach Elasticsearch endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `Elasticsearch test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}

async function testPinecone(endpoint: string, authToken?: string, index: string = 'vrin-knowledge') {
  try {
    // Pinecone has a different API structure
    const healthUrl = `${endpoint}/describe_index_stats`
    
    console.log(`Testing Pinecone connection to: ${healthUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'VRIN-Enterprise-Test/1.0'
    }

    if (authToken) {
      headers['Api-Key'] = authToken
    }

    try {
      const response = await fetch(healthUrl, {
        method: 'POST',
        signal: controller.signal,
        headers,
        body: JSON.stringify({})
      })
      
      clearTimeout(timeoutId)

      if (response.status === 200) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Pinecone connection successful',
          details: {
            endpoint: endpoint,
            vectorCount: data.totalVectorCount || 0,
            dimension: data.dimension
          }
        })
      } else if (response.status === 401) {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Pinecone authentication failed',
          errorCode: 'AUTH_FAILED'
        }, { status: 401 })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: `Pinecone responded with status ${response.status}: ${errorText}`,
          errorCode: 'HTTP_ERROR'
        }, { status: response.status })
      }

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Pinecone connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach Pinecone endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `Pinecone test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}