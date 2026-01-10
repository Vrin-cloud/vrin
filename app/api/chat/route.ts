import { NextRequest } from 'next/server';
import { API_CONFIG } from '@/config/api';

// CRITICAL: Tell Next.js this route supports streaming
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if streaming is requested
    const isStreaming = body.stream === true || request.headers.get('accept')?.includes('text/event-stream');

    // Use RAG Lambda Function URL with /query endpoint
    const backendUrl = `${API_CONFIG.RAG_BASE_URL}/query`;
    console.log('🌐 Proxying chat request to Lambda Function URL:', {
      url: backendUrl,
      streaming: isStreaming,
      hasSession: !!body.session_id,
      query: body.query?.substring(0, 50),
      userId: body.user_id
    });

    // Proxy to chat backend (no retry - fast processing means docs are ready)
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
        ...(isStreaming && { 'Accept': 'text/event-stream' })
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('❌ Chat backend error:', {
        status: response.status,
        statusText: response.statusText,
        url: backendUrl
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON (e.g., 504 from API Gateway)
        errorData = {
          error: `HTTP ${response.status}: ${response.statusText}`,
          message: response.status === 504
            ? 'Request timeout - the server took too long to respond. Please try again.'
            : 'An error occurred while processing your request.'
        };
      }

      console.error('Error details:', errorData);
      return new Response(JSON.stringify(errorData), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If streaming, pass through the FastAPI stream directly
    if (isStreaming && response.body) {
      console.log('✅ Streaming mode detected - passing through FastAPI stream');

      // With Lambda Web Adapter + FastAPI, the response is truly streaming!
      // No buffering - just pass it through directly to the client
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // Non-streaming: return JSON as before
    console.log('📦 Non-streaming mode - returning full response');
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('💥 Chat proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
