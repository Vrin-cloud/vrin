import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    // Check if streaming is requested
    const isStreaming = body.stream === true || request.headers.get('accept') === 'text/event-stream';

    // Use RAG Lambda Function URL (not Chat API Gateway) to avoid 30s timeout
    const backendUrl = API_CONFIG.RAG_BASE_URL;
    console.log('Proxying chat request to Lambda Function URL:', {
      url: backendUrl,
      streaming: isStreaming,
      hasSession: !!body.session_id,
      query: body.query?.substring(0, 50),
      userId: body.user_id
    });

    // Proxy to chat backend (Lambda Function URL - no timeout limit)
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
        ...(isStreaming && { 'Accept': 'text/event-stream' })
      },
      body: JSON.stringify(body),
      // No timeout - Lambda Function URLs support long-running requests
    });

    if (!response.ok) {
      console.error('Chat backend error:', {
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
      return NextResponse.json(errorData, { status: response.status });
    }

    // If streaming, forward the stream
    if (isStreaming && response.body) {
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming: return JSON as before
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
