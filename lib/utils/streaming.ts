// SSE (Server-Sent Events) Streaming Utility for VRIN
// Handles progressive response streaming from backend

export interface StreamEvent {
  type: 'metadata' | 'content' | 'done' | 'error';
  data?: any;
  delta?: string;
  reasoning_tokens?: number;
  total_tokens?: number;
}

export interface StreamCallbacks {
  onMetadata?: (metadata: any) => void;
  onContent?: (delta: string) => void;
  onDone?: (finalData: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Handle streaming SSE response from VRIN backend
 *
 * @param response - Fetch Response object
 * @param callbacks - Callbacks for different event types
 */
export async function handleStreamingResponse(
  response: Response,
  callbacks: StreamCallbacks
): Promise<void> {
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    callbacks.onError?.(error);
    throw error;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    const error = new Error('Response body is not readable');
    callbacks.onError?.(error);
    throw error;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines in buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim() || line.startsWith(':')) {
          // Skip empty lines and comments
          continue;
        }

        // Parse SSE format: "data: {...}"
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6); // Remove "data: " prefix

          try {
            const event: StreamEvent = JSON.parse(jsonStr);

            // Handle different event types
            switch (event.type) {
              case 'metadata':
                callbacks.onMetadata?.(event.data);
                break;

              case 'content':
                // Delta is in event.data.delta (SSE format from backend)
                const delta = event.data?.delta || event.delta;
                if (delta) {
                  callbacks.onContent?.(delta);
                }
                break;

              case 'done':
                callbacks.onDone?.({
                  reasoning_tokens: event.reasoning_tokens || event.data?.reasoning_tokens,
                  total_tokens: event.total_tokens || event.data?.total_tokens,
                  ...event.data
                });
                break;

              case 'error':
                const error = new Error(event.data?.message || 'Streaming error');
                callbacks.onError?.(error);
                break;
            }
          } catch (parseError) {
            console.error('Failed to parse SSE event:', jsonStr, parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    callbacks.onError?.(error as Error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

/**
 * Simple wrapper for streaming with promise
 * Returns accumulated content and final metadata
 */
export async function streamToCompletion(
  response: Response
): Promise<{ content: string; metadata?: any }> {
  let content = '';
  let metadata: any = null;

  await handleStreamingResponse(response, {
    onMetadata: (data) => {
      metadata = data;
    },
    onContent: (delta) => {
      content += delta;
    },
    onDone: (data) => {
      metadata = { ...metadata, ...data };
    },
  });

  return { content, metadata };
}
