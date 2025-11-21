// Enterprise Chat Session Hook
// Manages chat state for enterprise users with streaming support
// Adapts the individual user chat session hook for enterprise authentication

import { useState, useCallback, useEffect, useRef } from 'react';
import { enterpriseChatAPI, EnterpriseAuthContext } from '@/lib/services/enterprise-chat-api';
import type { ChatMessage, ChatSession, ResponseMode, SourceDocument } from '@/types/chat';

interface UseEnterpriseChatSessionReturn {
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  sendMessage: (message: string, mode?: ResponseMode, enableStreaming?: boolean) => Promise<void>;
  cancelStreaming: () => void;
  startNewSession: () => Promise<void>;
  endSession: () => Promise<void>;
  clearError: () => void;
  loadMessages: (sessionId: string, messages: ChatMessage[]) => void;
}

export const useEnterpriseChatSession = (
  auth: EnterpriseAuthContext | null
): UseEnterpriseChatSessionReturn => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Streaming accumulator using ref pattern (prevent stale closures)
  const streamingBufferRef = useRef<string>('');

  // Use requestAnimationFrame for smooth updates tied to browser render cycle
  const rafIdRef = useRef<number | null>(null);
  const isStreamingActiveRef = useRef<boolean>(false);

  // Initialize on mount
  useEffect(() => {
    if (!auth) return;

    console.log('[Enterprise Chat Session] Initialized for org:', auth.organizationId);
    setIsLoading(false);
    setIsStreaming(false);
  }, [auth]);

  const startNewSession = useCallback(async () => {
    if (!auth) {
      setError('Authentication required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('[Enterprise Chat Session] Starting new session');

      // Clear current session state
      setSession(null);
      setMessages([]);

      const response = await enterpriseChatAPI.startConversation(auth);

      const newSession: ChatSession = {
        session_id: response.session_id,
        conversation_turn: 0,
        created_at: Date.now(),
        last_activity: Date.now(),
        messages: []
      };

      setSession(newSession);
      console.log('[Enterprise Chat Session] New session created:', response.session_id);
    } catch (err: any) {
      console.error('[Enterprise Chat Session] Failed to start session:', err);
      setError(err.message || 'Failed to start new conversation');
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  const sendMessage = useCallback(async (
    message: string,
    mode: ResponseMode = 'chat',
    enableStreaming: boolean = true
  ) => {
    console.log('[Enterprise Chat Session] sendMessage called');
    console.log('  Auth:', auth ? `org=${auth.organizationId}` : 'MISSING');
    console.log('  Session:', session?.session_id || 'No active session');
    console.log('  Message:', message.substring(0, 50) + '...');
    console.log('  Streaming:', enableStreaming);

    if (!auth) {
      const error = 'Authentication required';
      console.error('[Enterprise Chat Session]', error);
      setError(error);
      return;
    }

    if (!message.trim()) {
      console.warn('[Enterprise Chat Session] Empty message, ignoring');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    console.log('[Enterprise Chat Session] Adding user message to UI');
    setMessages(prev => [...prev, userMessage]);

    try {
      // STREAMING MODE
      if (enableStreaming) {
        console.log('[Enterprise Chat Session] Using streaming mode');
        setStreamingContent('');
        streamingBufferRef.current = '';
        isStreamingActiveRef.current = false;

        // Create abort controller for cancellation
        abortControllerRef.current = new AbortController();

        let contentChunkCounter = 0;
        let finalMetadata: any = null;
        let finalSources: SourceDocument[] = [];
        let finalSessionId: string | undefined;
        let reasoningSummary: string | undefined;

        // RAF update function for smooth streaming display
        const updateStreamingDisplay = () => {
          if (isStreamingActiveRef.current) {
            setStreamingContent(streamingBufferRef.current);
            rafIdRef.current = requestAnimationFrame(updateStreamingDisplay);
          }
        };

        await enterpriseChatAPI.sendMessageStreaming(
          auth,
          message,
          session?.session_id,
          {
            onMetadata: (metadata) => {
              console.log('[Enterprise Chat Session] Metadata received:', metadata);
              finalMetadata = metadata;
              finalSessionId = metadata.session_id;
              if (metadata.sources) {
                finalSources = metadata.sources;
              }
              if (metadata.reasoning_summary) {
                reasoningSummary = metadata.reasoning_summary;
              }
            },
            onContent: (content) => {
              contentChunkCounter++;

              // Start RAF loop on first content chunk
              if (!isStreamingActiveRef.current) {
                console.log('[Enterprise Chat Session] First content chunk - starting streaming display');
                setIsLoading(false);
                setIsStreaming(true);
                isStreamingActiveRef.current = true;
                rafIdRef.current = requestAnimationFrame(updateStreamingDisplay);
              }

              streamingBufferRef.current += content;
            },
            onReasoning: (reasoning) => {
              reasoningSummary = reasoning;
            },
            onSources: (sources) => {
              finalSources = sources;
            },
            onDone: (doneData) => {
              console.log('[Enterprise Chat Session] Stream done:', doneData);

              // Stop RAF loop
              isStreamingActiveRef.current = false;
              if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
              }

              // Merge done data with metadata
              if (doneData) {
                finalMetadata = { ...finalMetadata, ...doneData };
              }

              // Create final assistant message
              const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: streamingBufferRef.current,
                timestamp: Date.now(),
                sources: finalSources,
                metadata: {
                  ...finalMetadata,
                  reasoning_summary: reasoningSummary,
                  thinking_steps: finalMetadata?.thinking_steps || [],
                  reasoning_tokens: finalMetadata?.reasoning_tokens || doneData?.reasoning_tokens,
                }
              };

              setMessages(prev => [...prev, assistantMessage]);
              setStreamingContent('');
              setIsStreaming(false);

              // Update session if we got a new session_id
              if (finalSessionId && !session?.session_id) {
                setSession(prev => ({
                  ...prev,
                  session_id: finalSessionId!,
                  conversation_turn: (prev?.conversation_turn || 0) + 1,
                  last_activity: Date.now(),
                } as ChatSession));
              }

              console.log('[Enterprise Chat Session] Message complete, chunks:', contentChunkCounter);
            },
            onError: (errorMsg) => {
              console.error('[Enterprise Chat Session] Stream error:', errorMsg);
              setError(errorMsg);
              setIsStreaming(false);
              setIsLoading(false);
              isStreamingActiveRef.current = false;
            }
          },
          abortControllerRef.current.signal,
          mode
        );
      } else {
        // NON-STREAMING MODE
        console.log('[Enterprise Chat Session] Using non-streaming mode');

        const response = await enterpriseChatAPI.sendMessage(
          auth,
          message,
          session?.session_id,
          mode
        );

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.summary || response.answer || '',
          timestamp: Date.now(),
          sources: response.sources || [],
          metadata: {
            total_facts: response.total_facts,
            total_chunks: response.total_chunks,
            search_time: response.search_time,
            model: response.model,
          }
        };

        setMessages(prev => [...prev, assistantMessage]);

        if (response.session_id && !session?.session_id) {
          setSession(prev => ({
            ...prev,
            session_id: response.session_id,
            conversation_turn: (prev?.conversation_turn || 0) + 1,
            last_activity: Date.now(),
          } as ChatSession));
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[Enterprise Chat Session] Error:', err);
        setError(err.message || 'Failed to send message');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [auth, session]);

  const cancelStreaming = useCallback(() => {
    console.log('[Enterprise Chat Session] Cancelling streaming');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Stop RAF loop
    isStreamingActiveRef.current = false;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // If we have partial content, save it as a message
    if (streamingBufferRef.current) {
      const partialMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: streamingBufferRef.current + '\n\n*[Response cancelled]*',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, partialMessage]);
    }

    setIsStreaming(false);
    setIsLoading(false);
    setStreamingContent('');
    streamingBufferRef.current = '';
  }, []);

  const endSession = useCallback(async () => {
    console.log('[Enterprise Chat Session] Ending session');
    setSession(null);
    setMessages([]);
    setStreamingContent('');
    streamingBufferRef.current = '';
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadMessages = useCallback((sessionId: string, loadedMessages: ChatMessage[]) => {
    console.log('[Enterprise Chat Session] Loading messages for session:', sessionId);

    setSession({
      session_id: sessionId,
      conversation_turn: loadedMessages.length,
      created_at: Date.now(),
      last_activity: Date.now(),
      messages: loadedMessages
    });

    setMessages(loadedMessages);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    session,
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    cancelStreaming,
    startNewSession,
    endSession,
    clearError,
    loadMessages,
  };
};
