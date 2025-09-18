import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, endpoint, port, username, password, ssl } = body

    // Validate required fields
    if (!type || !endpoint) {
      return NextResponse.json(
        { error: 'Database type and endpoint are required' },
        { status: 400 }
      )
    }

    console.log(`Testing ${type} database connection to ${endpoint}:${port}`)

    // Handle different database types
    switch (type.toLowerCase()) {
      case 'cosmos_db':
        return await testCosmosDB(endpoint, port, ssl)
      case 'neptune':
        return await testNeptune(endpoint, port, ssl)
      case 'janusgraph':
        return await testJanusGraph(endpoint, port, username, password, ssl)
      default:
        return NextResponse.json(
          { error: `Unsupported database type: ${type}` },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { error: error.message || 'Database connection test failed' },
      { status: 500 }
    )
  }
}

async function testCosmosDB(endpoint: string, port: number = 443, ssl: boolean = true) {
  try {
    // Azure Cosmos DB Gremlin endpoint testing
    // Extract account name from endpoint if it's a full URL
    let cosmosEndpoint = endpoint
    if (endpoint.includes('.gremlin.cosmos.azure.com')) {
      // Already a proper Cosmos DB endpoint
      cosmosEndpoint = endpoint
    } else if (endpoint.includes('.gremlin.cosmos')) {
      // Partial endpoint, construct full URL
      cosmosEndpoint = `wss://${endpoint}/gremlin`
    } else {
      // Assume it's just the account name
      cosmosEndpoint = `wss://${endpoint}.gremlin.cosmos.azure.com:443/gremlin`
    }

    console.log(`Testing Cosmos DB connection to: ${cosmosEndpoint}`)

    // For Cosmos DB, we'll do a basic connectivity test
    // In a real implementation, you'd use the Gremlin client
    
    // Extract the account name and construct HTTPS URL for basic connectivity test
    let testUrl: string
    if (cosmosEndpoint.includes('.gremlin.cosmos.azure.com')) {
      const accountName = cosmosEndpoint.split('.')[0].replace('wss://', '').replace('https://', '')
      testUrl = `https://${accountName}.documents.azure.com/`
    } else {
      // Fallback - try to construct a basic HTTPS endpoint
      testUrl = `https://${endpoint.replace('wss://', '').replace('ws://', '')}`
    }
    
    // Simple HTTP HEAD request to test connectivity
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'VRIN-Enterprise-Test/1.0'
        }
      })
      
      clearTimeout(timeoutId)
      
      // Even if we get a 401/403, it means the endpoint is reachable
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          success: true,
          status: 'healthy',
          message: 'Cosmos DB endpoint is reachable (authentication required for full test)',
          details: {
            endpoint: cosmosEndpoint,
            responseStatus: response.status
          }
        })
      }

      return NextResponse.json({
        success: true,
        status: 'healthy',
        message: 'Cosmos DB connection test successful',
        details: {
          endpoint: cosmosEndpoint,
          responseStatus: response.status
        }
      })

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Cosmos DB connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      // Network errors typically mean endpoint is not reachable
      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach Cosmos DB endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `Cosmos DB test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}

async function testNeptune(endpoint: string, port: number = 8182, ssl: boolean = true) {
  try {
    const protocol = ssl ? 'wss' : 'ws'
    const neptuneUrl = `${protocol}://${endpoint}:${port}/gremlin`
    
    console.log(`Testing Neptune connection to: ${neptuneUrl}`)

    // For Neptune, test HTTPS endpoint first
    const testUrl = `https://${endpoint}:${port}/status`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'VRIN-Enterprise-Test/1.0'
        }
      })
      
      clearTimeout(timeoutId)

      return NextResponse.json({
        success: true,
        status: 'healthy',
        message: 'Neptune endpoint is reachable',
        details: {
          endpoint: neptuneUrl,
          responseStatus: response.status
        }
      })

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'Neptune connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach Neptune endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `Neptune test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}

async function testJanusGraph(endpoint: string, port: number = 8182, username?: string, password?: string, ssl: boolean = true) {
  try {
    const protocol = ssl ? 'wss' : 'ws'
    const janusUrl = `${protocol}://${endpoint}:${port}/gremlin`
    
    console.log(`Testing JanusGraph connection to: ${janusUrl}`)

    // Basic connectivity test
    const testUrl = `http${ssl ? 's' : ''}://${endpoint}:${port}/`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      return NextResponse.json({
        success: true,
        status: 'healthy',
        message: 'JanusGraph endpoint is reachable',
        details: {
          endpoint: janusUrl,
          responseStatus: response.status
        }
      })

    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          status: 'unhealthy',
          message: 'JanusGraph connection timeout',
          errorCode: 'TIMEOUT'
        }, { status: 408 })
      }

      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        message: `Cannot reach JanusGraph endpoint: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }, { status: 503 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: `JanusGraph test failed: ${error.message}`,
      errorCode: 'CONNECTION_ERROR'
    }, { status: 500 })
  }
}