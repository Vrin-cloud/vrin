// Custom hook for managing VRIN chat sessions
// Handles state management, API calls, and localStorage persistence

import { useState, useCallback, useEffect, useRef } from 'react';
import { chatAPI } from '@/lib/services/chat-api';
import type { ChatMessage, ChatSession, ResponseMode } from '@/types/chat';

interface UseChatSessionReturn {
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  sendMessage: (message: string, mode?: ResponseMode, enableStreaming?: boolean, webSearchEnabled?: boolean) => Promise<void>;
  cancelStreaming: () => void;
  startNewSession: () => Promise<void>;
  endSession: () => Promise<void>;
  clearError: () => void;
  loadMessages: (sessionId: string, messages: ChatMessage[]) => void;
}

export const useChatSession = (apiKey: string): UseChatSessionReturn => {
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

  // Initialize on mount - restore session from localStorage if available
  useEffect(() => {
    if (!apiKey) return;

    console.log('🔄 Chat session initialized with API key');

    // Restore session_id from localStorage for conversation continuity
    const storedSessionId = localStorage.getItem('vrin_chat_session_id');
    if (storedSessionId && !session) {
      console.log('📌 Restoring session from localStorage:', storedSessionId);
      const restoredSession: ChatSession = {
        session_id: storedSessionId,
        conversation_turn: 0,
        created_at: Date.now(),
        last_activity: Date.now(),
        messages: []
      };
      setSession(restoredSession);
    }

    setIsLoading(false);
    setIsStreaming(false);
  }, [apiKey]);

  const startNewSession = useCallback(async () => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🆕 Starting new session');

      // Clear current session state and localStorage
      setSession(null);
      setMessages([]);
      localStorage.removeItem('vrin_chat_session_id');

      const response = await chatAPI.startConversation(apiKey);

      const newSession: ChatSession = {
        session_id: response.session_id,
        conversation_turn: 0,
        created_at: Date.now(),
        last_activity: Date.now(),
        messages: []
      };

      setSession(newSession);
      console.log('✅ New session created:', response.session_id);
    } catch (err: any) {
      console.error('Failed to start session:', err);
      setError(err.message || 'Failed to start new conversation');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const sendMessage = useCallback(async (
    message: string,
    mode: ResponseMode = 'chat',
    enableStreaming: boolean = true,
    webSearchEnabled: boolean = false
  ) => {
    console.log('=== sendMessage called ===');
    console.log('API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');
    console.log('Session:', session?.session_id || 'No active session');
    console.log('Message:', message.substring(0, 50) + '...');
    console.log('Streaming enabled:', enableStreaming);
    console.log('Web search enabled:', webSearchEnabled);

    if (!apiKey) {
      const error = 'API key is required';
      console.error('❌', error);
      setError(error);
      return;
    }

    if (!message.trim()) {
      console.warn('Empty message, ignoring');
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

    console.log('Adding user message to UI');
    setMessages(prev => [...prev, userMessage]);

    try {
      const requestPayload = {
        message,
        session_id: session?.session_id,
        include_sources: true,
        response_mode: mode,
        web_search_enabled: webSearchEnabled
      };

      // STREAMING MODE
      if (enableStreaming) {
        console.log('🌊 Using streaming mode');
        // DON'T set isStreaming yet - wait for first content to arrive
        // This ensures loading indicator stays visible during backend processing
        setStreamingContent('');

        // Create abort controller for cancellation
        abortControllerRef.current = new AbortController();

        let streamedMessage = '';
        let contentChunkCounter = 0;
        let finalMetadata: any = null;
        let finalSources: any[] = [];
        let finalSessionId: string | undefined;
        let finalTurn: number | undefined;
        let finalExpertAnalysis: any = null;
        let reasoningSummary: string | undefined = undefined;  // NEW: Store LLM reasoning summary

        // Use existing session_id if available, otherwise backend will create one
        if (session?.session_id) {
          finalSessionId = session.session_id;
          console.log('📌 Using existing session ID:', finalSessionId);
        } else {
          console.log('🆕 First query - backend will create and return session ID');
        }

        try {
          await chatAPI.sendMessageStreaming(
            requestPayload,
            apiKey,
            {
              onMetadata: (metadata) => {
                console.log('📊 Streaming metadata received:', metadata);

                // Store metadata (streaming state transition happens in onContent)
                finalMetadata = metadata;
                // RAG endpoint doesn't return session_id in metadata, use existing or generated
                if (metadata.session_id) {
                  finalSessionId = metadata.session_id;
                }
                finalTurn = metadata.conversation_turn || (session?.conversation_turn || 0) + 1;

                // Transform RAG backend format to chat format
                // RAG returns graph_facts and vector_results, we need to transform to sources
                const graphFacts = metadata.graph_facts || [];
                const vectorResults = metadata.vector_results || [];

                // Combine facts and chunks into sources format
                const transformedSources = [
                  ...graphFacts.map((fact: any) => ({
                    content: `${fact.subject} ${fact.predicate} ${fact.object}`,
                    type: 'fact',
                    confidence: fact.confidence,
                    source_id: fact.source_id
                  })),
                  ...vectorResults.map((chunk: any) => ({
                    content: chunk.content || chunk.text,
                    type: 'chunk',
                    metadata: chunk.metadata
                  }))
                ];

                finalSources = transformedSources.length > 0 ? transformedSources : metadata.sources || [];
                finalExpertAnalysis = metadata.expert_analysis;

                // Capture reasoning metadata (thinking steps) from metadata event
                if (metadata.reasoning_metadata) {
                  console.log('🧠 Reasoning metadata found:', metadata.reasoning_metadata);
                  finalMetadata = {
                    ...finalMetadata,
                    ...metadata.reasoning_metadata,  // Spread thinking_steps and other reasoning data
                    model: metadata.model || 'gpt-5-mini'
                  };
                } else {
                  console.log('⚠️ No reasoning_metadata in metadata event');
                }
              },
              onContent: (delta) => {
                // On FIRST content chunk, transition from loading to streaming
                if (contentChunkCounter === 0) {
                  console.log('🎬 First content chunk received - transitioning to streaming');
                  setIsLoading(false);
                  setIsStreaming(true);

                  // Initialize streaming buffer and animation loop
                  streamingBufferRef.current = '';
                  isStreamingActiveRef.current = true;

                  // Start requestAnimationFrame loop for smooth updates
                  const updateLoop = () => {
                    if (isStreamingActiveRef.current) {
                      // Update UI with latest buffered content
                      setStreamingContent(streamingBufferRef.current);
                      // Schedule next frame
                      rafIdRef.current = requestAnimationFrame(updateLoop);
                    }
                  };
                  rafIdRef.current = requestAnimationFrame(updateLoop);
                }

                // Accumulate tokens in buffer
                // requestAnimationFrame loop will handle UI updates
                streamedMessage += delta;
                streamingBufferRef.current = streamedMessage;

                contentChunkCounter++;
                if (contentChunkCounter <= 10 || contentChunkCounter % 100 === 0) {
                  console.log(`📝 [${contentChunkCounter}] Buffered: ${streamedMessage.length} chars`);
                }
              },
              onReasoning: (summary) => {
                // NEW: Capture LLM reasoning summary
                console.log('🧠 Reasoning summary received:', summary.substring(0, 100) + '...');
                reasoningSummary = summary;
              },
              onDone: (data) => {
                console.log('✅ Streaming completed:', data);
                console.log('📊 Final metadata before reasoning tokens:', finalMetadata);

                // Stop the animation frame loop
                isStreamingActiveRef.current = false;
                if (rafIdRef.current) {
                  cancelAnimationFrame(rafIdRef.current);
                  rafIdRef.current = null;
                }

                // Final update with complete content
                setStreamingContent(streamedMessage);
                console.log(`📝 Final update: ${streamedMessage.length} chars`);

                // Capture reasoning tokens from done event
                if (data.reasoning_tokens) {
                  finalMetadata = {
                    ...finalMetadata,
                    reasoning_tokens: data.reasoning_tokens,
                    total_tokens: data.total_tokens
                  };
                  console.log('✅ Reasoning tokens captured:', data.reasoning_tokens);
                } else {
                  console.warn('⚠️ No reasoning_tokens in done event. Available keys:', Object.keys(data));
                }

                // Add reasoning summary to metadata if available
                if (reasoningSummary) {
                  finalMetadata = {
                    ...finalMetadata,
                    reasoning_summary: reasoningSummary
                  };
                  console.log('✅ Reasoning summary added to metadata:', reasoningSummary.length, 'chars');
                }

                // Update session if new one was created
                if (finalSessionId) {
                  if (!session || finalSessionId !== session.session_id) {
                    console.log('Creating new session from stream:', finalSessionId);
                    const newSession: ChatSession = {
                      session_id: finalSessionId,
                      conversation_turn: finalTurn || 0,
                      created_at: Date.now(),
                      last_activity: Date.now(),
                      messages: []
                    };
                    setSession(newSession);
                    localStorage.setItem('vrin_chat_session_id', finalSessionId);
                  } else {
                    console.log('Updating session turn count:', finalTurn);
                    setSession(prev => prev ? {
                      ...prev,
                      conversation_turn: finalTurn || prev.conversation_turn,
                      last_activity: Date.now()
                    } : null);
                  }
                }

                // Add final AI message to messages array
                const aiMessage: ChatMessage = {
                  id: `ai-${Date.now()}`,
                  role: 'assistant',
                  content: streamedMessage,
                  timestamp: Date.now(),
                  sources: finalSources,
                  metadata: finalMetadata,
                  expert_analysis: finalExpertAnalysis
                };

                console.log('Adding streamed AI message to UI');
                console.log('📋 Message metadata:', {
                  has_reasoning_tokens: !!finalMetadata?.reasoning_tokens,
                  reasoning_tokens: finalMetadata?.reasoning_tokens,
                  has_thinking_steps: !!finalMetadata?.thinking_steps,
                  thinking_steps_count: finalMetadata?.thinking_steps?.length || 0,
                  has_sources: finalSources.length > 0,
                  sources_count: finalSources.length
                });
                setMessages(prev => [...prev, aiMessage]);

                // Clear streaming state
                setIsStreaming(false);
                setStreamingContent('');
              },
              onError: (error) => {
                console.error('❌ Streaming error:', error);
                throw error;
              }
            },
            abortControllerRef.current.signal
          );
        } catch (streamError: any) {
          // If session expired during streaming, clear and retry
          if (streamError.message?.includes('Session not found or expired')) {
            console.log('⚠️ Session expired during streaming, clearing and retrying...');
            localStorage.removeItem('vrin_chat_session_id');
            localStorage.removeItem('vrin_chat_messages');
            setSession(null);
            setIsStreaming(false);
            setStreamingContent('');

            // Retry without session_id
            return sendMessage(message, mode, enableStreaming);
          }
          throw streamError;
        }

        console.log('=== sendMessage (streaming) completed successfully ===');
      }
      // NON-STREAMING MODE (backward compatible)
      else {
        console.log('📦 Using non-streaming mode');
        let response;

        try {
          response = await chatAPI.sendMessage(requestPayload, apiKey);
        } catch (sessionError: any) {
          // If session expired, clear it and retry without session_id
          if (sessionError.message?.includes('Session not found or expired')) {
            console.log('⚠️ Session expired, clearing and creating new session...');
            localStorage.removeItem('vrin_chat_session_id');
            localStorage.removeItem('vrin_chat_messages');
            setSession(null);

            // Retry without session_id (backend will create new one)
            response = await chatAPI.sendMessage(
              {
                message,
                session_id: undefined,
                include_sources: true,
                response_mode: mode
              },
              apiKey
            );
          } else {
            throw sessionError;
          }
        }

        console.log('✅ Chat API response received:', {
          sessionId: response.session_id,
          turn: response.conversation_turn,
          messageLength: response.message?.length,
          sourcesCount: response.sources?.length
        });

        // Update session if new one was created OR update turn count
        if (!session || response.session_id !== session.session_id) {
          console.log('Creating new session:', response.session_id);
          const newSession: ChatSession = {
            session_id: response.session_id,
            conversation_turn: response.conversation_turn,
            created_at: Date.now(),
            last_activity: Date.now(),
            messages: []
          };
          setSession(newSession);
          localStorage.setItem('vrin_chat_session_id', response.session_id);
        } else {
          // Update existing session with new turn count
          console.log('Updating session turn count:', response.conversation_turn);
          setSession(prev => prev ? {
            ...prev,
            conversation_turn: response.conversation_turn,
            last_activity: Date.now()
          } : null);
        }

        // Add AI message
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
          sources: response.sources,
          metadata: response.metadata,
          expert_analysis: response.expert_analysis
        };

        console.log('Adding AI message to UI');
        setMessages(prev => {
          const newMessages = [...prev, aiMessage];
          console.log('Current messages count:', newMessages.length);
          return newMessages;
        });
        console.log('=== sendMessage (non-streaming) completed successfully ===');
      }
    } catch (err: any) {
      // Don't show error if user cancelled the request
      if (err.name === 'AbortError') {
        console.log('⚠️ Streaming cancelled by user');
        setError(null);
      } else {
        console.error('❌ Failed to send message:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        });
        setError(err.message || 'Failed to send message');
      }

      // Remove user message on error (except for cancellation)
      if (err.name !== 'AbortError') {
        setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      }

      // Clear streaming state on error
      isStreamingActiveRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setIsStreaming(false);
      setStreamingContent('');
      streamingBufferRef.current = '';
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiKey, session]);

  const cancelStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('🛑 Cancelling streaming...');
      abortControllerRef.current.abort();

      isStreamingActiveRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      setIsStreaming(false);
      setStreamingContent('');
      setIsLoading(false);
      abortControllerRef.current = null;
      streamingBufferRef.current = '';
    }
  }, []);

  const endSession = useCallback(async () => {
    if (!session || !apiKey) return;

    try {
      await chatAPI.endConversation(session.session_id, apiKey);

      setSession(null);
      setMessages([]);
      localStorage.removeItem('vrin_chat_session_id');
      localStorage.removeItem('vrin_chat_messages');
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  }, [session, apiKey]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadMessages = useCallback((sessionId: string, loadedMessages: ChatMessage[]) => {
    console.log('📥 Loading messages from backend:', sessionId, 'Count:', loadedMessages.length);

    // Create session from loaded data
    const loadedSession: ChatSession = {
      session_id: sessionId,
      conversation_turn: loadedMessages.filter(m => m.role === 'user').length,
      created_at: Date.now(),
      last_activity: Date.now(),
      messages: []
    };

    // Update state with loaded conversation (from backend DynamoDB)
    setSession(loadedSession);
    setMessages(loadedMessages);

    console.log('✅ Loaded', loadedMessages.length, 'messages from backend for session:', sessionId);
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
    loadMessages
  };
};
