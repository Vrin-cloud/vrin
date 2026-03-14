// SSE (Server-Sent Events) Streaming Utility for VRIN
// Handles progressive response streaming from backend

export interface StreamEvent {
  type: 'metadata' | 'content' | 'reasoning' | 'progress' | 'thinking' | 'done' | 'error';
  data?: any;
  delta?: string;
  reasoning_tokens?: number;
  total_tokens?: number;
}

export interface StreamCallbacks {
  onMetadata?: (metadata: any) => void;
  onContent?: (delta: string) => void;
  onReasoning?: (reasoningSummary: string) => void;  // NEW: Handle reasoning summary
  onProgress?: (progressEvent: any) => void;    // Pipeline progress events
  onThinking?: (delta: string) => void;          // LLM thinking stream
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
  console.log('🌊 handleStreamingResponse called');
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    callbacks.onError?.(error);
    throw error;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    const error = new Error('Response body is not readable');
    console.error('❌ Response body is not readable!');
    callbacks.onError?.(error);
    throw error;
  }

  console.log('✅ Got readable stream reader');

  const decoder = new TextDecoder();
  let buffer = '';
  let chunkCount = 0;
  let contentChunkCount = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('✅ Stream complete. Total chunks:', chunkCount, 'Content chunks:', contentChunkCount);
        break;
      }

      chunkCount++;

      // Decode chunk and add to buffer
      const decodedChunk = decoder.decode(value, { stream: true });
      buffer += decodedChunk;

      if (chunkCount <= 3) {
        console.log(`📦 Chunk ${chunkCount} received (${decodedChunk.length} bytes):`, decodedChunk.substring(0, 100));
      }

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
                console.log('📊 Metadata event received');
                callbacks.onMetadata?.(event.data);
                break;

              case 'content':
                // Delta is in event.data.delta (SSE format from backend)
                const delta = event.data?.delta || event.delta;
                if (delta) {
                  contentChunkCount++;
                  if (contentChunkCount <= 5) {
                    console.log(`✍️ Content delta ${contentChunkCount}:`, delta);
                  }
                  callbacks.onContent?.(delta);
                }
                break;

              case 'reasoning':
                // NEW: Handle LLM reasoning summary
                console.log('🧠 Reasoning event received');
                const reasoningSummary = event.data?.reasoning_summary;
                if (reasoningSummary) {
                  console.log(`🧠 Reasoning summary (${reasoningSummary.length} chars):`, reasoningSummary.substring(0, 100) + '...');
                  callbacks.onReasoning?.(reasoningSummary);
                }
                break;

              case 'progress':
                console.log('Progress event:', event.data?.stage);
                callbacks.onProgress?.(event.data);
                break;

              case 'thinking':
                const thinkingDelta = event.data?.delta;
                if (thinkingDelta) {
                  callbacks.onThinking?.(thinkingDelta);
                }
                break;

              case 'done':
                console.log('✅ Done event received');
                callbacks.onDone?.({
                  reasoning_tokens: event.reasoning_tokens || event.data?.reasoning_tokens,
                  total_tokens: event.total_tokens || event.data?.total_tokens,
                  ...event.data
                });
                break;

              case 'error':
                console.error('❌ Error event received:', event.data);
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
    console.error('💥 Streaming error:', error);
    callbacks.onError?.(error as Error);
    throw error;
  } finally {
    reader.releaseLock();
    console.log('🔓 Stream reader released');
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
