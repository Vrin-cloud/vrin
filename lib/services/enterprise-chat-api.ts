// Enterprise Chat API Service
// Handles chat operations for enterprise users with organization-scoped authentication
// Routes to enterprise infrastructure via vrin_ent_ API keys
//
// IMPORTANT: This service now uses the same /api/chat proxy as individual chat
// to avoid CORS issues and ensure consistent behavior.

import { API_CONFIG } from '@/config/api';
import type { ChatMessage, ResponseMode, SourceDocument } from '@/types/chat';

interface EnterpriseAuthContext {
  token: string;
  organizationId: string;
  userId: string;
  apiKey?: string; // Organization's enterprise API key (vrin_ent_*)
}

interface StreamingCallbacks {
  onMetadata?: (metadata: any) => void;
  onContent?: (content: string) => void;
  onReasoning?: (reasoning: string) => void;
  onSources?: (sources: SourceDocument[]) => void;
  onDone?: (finalData: any) => void;
  onError?: (error: string) => void;
}

interface ConversationResponse {
  session_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    metadata?: any;
  }>;
  title?: string;
  preview?: string;
  created_at?: string;
  updated_at?: string;
}

interface ConversationListItem {
  session_id: string;
  title: string;
  preview: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get the enterprise API key for the current organization.
 * Checks localStorage for stored enterprise API key.
 */
function getStoredEnterpriseApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('enterprise_api_key');
}

/**
 * Store the enterprise API key for use in chat.
 * Called when user selects/generates an API key.
 */
export function setEnterpriseApiKey(apiKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('enterprise_api_key', apiKey);
    console.log('[Enterprise Chat] API key stored for chat use');
  }
}

/**
 * Clear the stored enterprise API key.
 */
export function clearEnterpriseApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('enterprise_api_key');
  }
}

class EnterpriseChatAPI {
  private getAuthHeaders(auth: EnterpriseAuthContext): HeadersInit {
    // Use enterprise API key if available, otherwise fall back to token
    const authValue = auth.apiKey || auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authValue}`,
      'X-Organization-ID': auth.organizationId,
      'X-User-ID': auth.userId,
    };
  }

  /**
   * Start a new conversation for an enterprise user
   */
  async startConversation(auth: EnterpriseAuthContext): Promise<{ session_id: string }> {
    const response = await fetch(`${API_CONFIG.CHAT_BASE_URL}/conversations/start`, {
      method: 'POST',
      headers: this.getAuthHeaders(auth),
      body: JSON.stringify({
        organization_id: auth.organizationId,
        user_id: auth.userId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to start conversation: ${error}`);
    }

    return response.json();
  }

  /**
   * Send a message with streaming response (SSE)
   * Uses /api/chat proxy to avoid CORS issues (same as individual chat)
   *
   * IMPORTANT: For browser-based enterprise chat, we use the SESSION TOKEN
   * (enterprise_token from localStorage) for authentication, NOT API keys.
   * API keys are designed for SDK/programmatic access, not browser sessions.
   */
  async sendMessageStreaming(
    auth: EnterpriseAuthContext,
    message: string,
    sessionId: string | undefined,
    callbacks: StreamingCallbacks,
    signal?: AbortSignal,
    responseMode: ResponseMode = 'chat',
    webSearchEnabled: boolean = false
  ): Promise<void> {
    // For browser-based enterprise chat, use the session token (same as dashboard auth)
    // API keys should only be used for SDK/programmatic access
    const authToken = auth.token;

    if (!authToken) {
      callbacks.onError?.('No session token available. Please log in to your enterprise account.');
      throw new Error('No session token available');
    }

    // Build request body matching the individual chat format (RAG endpoint format)
    const requestBody = {
      query: message,
      user_id: auth.userId,
      session_id: sessionId,
      include_sources: true,
      response_mode: responseMode,
      stream: true,
      maintain_context: true,  // CRITICAL: Enable conversation persistence
      organization_id: auth.organizationId,
      web_search_enabled: webSearchEnabled,  // Enable web search for brainstorm mode
    };

    console.log('[Enterprise Chat] Sending streaming message via /api/chat proxy:', {
      sessionId: sessionId || 'NEW SESSION',
      messagePreview: message.substring(0, 50),
      organizationId: auth.organizationId,
      userId: auth.userId,
      tokenPrefix: authToken.substring(0, 20) + '...',
    });

    try {
      // Use /api/chat proxy (same as individual chat) to avoid CORS
      // Enterprise chat uses session token for auth (not API keys)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(requestBody),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Enterprise Chat] Streaming request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Streaming request failed: ${response.status} - ${errorText}`);
      }

      console.log('[Enterprise Chat] Streaming response received, processing SSE...');

      // Process SSE stream
      await this.handleStreamingResponse(response, callbacks);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('[Enterprise Chat] Streaming cancelled by user');
        return;
      }
      console.error('[Enterprise Chat] Streaming error:', error);
      callbacks.onError?.(error.message || 'Streaming failed');
      throw error;
    }
  }

  /**
   * Process SSE streaming response
   */
  private async handleStreamingResponse(
    response: Response,
    callbacks: StreamingCallbacks
  ): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('[Enterprise Chat] Stream complete');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              this.processStreamEvent(parsed, callbacks);
            } catch (e) {
              // Skip malformed JSON
              console.warn('[Enterprise Chat] Failed to parse SSE data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Process individual stream events
   */
  private processStreamEvent(event: any, callbacks: StreamingCallbacks): void {
    const { type, data } = event;

    switch (type) {
      case 'metadata':
        callbacks.onMetadata?.(data);
        // Extract sources from metadata if present
        if (data.sources) {
          callbacks.onSources?.(data.sources);
        }
        break;

      case 'content':
        if (data.delta) {
          callbacks.onContent?.(data.delta);
        }
        break;

      case 'reasoning':
        if (data.content) {
          callbacks.onReasoning?.(data.content);
        }
        break;

      case 'done':
        callbacks.onDone?.(data);
        break;

      case 'error':
        callbacks.onError?.(data.message || 'Stream error');
        break;

      default:
        console.log('[Enterprise Chat] Unknown event type:', type);
    }
  }

  /**
   * Send a non-streaming message
   * Uses /api/chat proxy to avoid CORS issues (same as individual chat)
   */
  async sendMessage(
    auth: EnterpriseAuthContext,
    message: string,
    sessionId: string | undefined,
    responseMode: ResponseMode = 'chat'
  ): Promise<any> {
    // Priority: explicit apiKey > stored enterprise key > token
    const apiKey = auth.apiKey || getStoredEnterpriseApiKey() || auth.token;

    if (!apiKey) {
      throw new Error('No API key available. Please generate an enterprise API key first.');
    }

    // Build request body matching the individual chat format (RAG endpoint format)
    const requestBody = {
      query: message,
      user_id: auth.userId,
      session_id: sessionId,
      include_sources: true,
      response_mode: responseMode,
      stream: false,
      maintain_context: true,  // CRITICAL: Enable conversation persistence
      organization_id: auth.organizationId,
    };

    console.log('[Enterprise Chat] Sending non-streaming message via /api/chat proxy:', {
      sessionId: sessionId || 'NEW SESSION',
      messagePreview: message.substring(0, 50),
      organizationId: auth.organizationId,
      userId: auth.userId,
    });

    // Use /api/chat proxy (same as individual chat) to avoid CORS
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Enterprise Chat] Non-streaming request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Message send failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Transform RAG response format to chat format (same as individual chat)
    return {
      session_id: data.session_id,
      conversation_turn: data.conversation_turn || 1,
      summary: data.summary,
      answer: data.answer || data.summary,
      sources: data.sources || [],
      total_facts: data.total_facts,
      total_chunks: data.total_chunks,
      search_time: data.search_time,
      model: data.model,
    };
  }

  /**
   * Get list of conversations for the enterprise user
   * Uses Next.js API proxy to avoid CORS issues
   */
  async getConversations(
    auth: EnterpriseAuthContext,
    limit: number = 50
  ): Promise<ConversationListItem[]> {
    // Use session token for browser-based enterprise auth
    const authToken = auth.token;

    const response = await fetch(
      `/api/conversations?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch conversations: ${error}`);
    }

    const data = await response.json();
    return data.conversations || [];
  }

  /**
   * Load a specific conversation
   * Uses Next.js API proxy to avoid CORS issues
   */
  async loadConversation(
    auth: EnterpriseAuthContext,
    sessionId: string
  ): Promise<ConversationResponse> {
    // Use session token for browser-based enterprise auth
    const authToken = auth.token;

    const response = await fetch(
      `/api/conversations/${sessionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to load conversation: ${error}`);
    }

    return response.json();
  }

  /**
   * Update conversation title
   * Uses Next.js API proxy to avoid CORS issues
   */
  async updateConversationTitle(
    auth: EnterpriseAuthContext,
    sessionId: string,
    title: string
  ): Promise<void> {
    const authToken = auth.token;

    const response = await fetch(
      `/api/conversations/${sessionId}/title`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update title: ${error}`);
    }
  }

  /**
   * Delete a conversation
   * Uses Next.js API proxy to avoid CORS issues
   */
  async deleteConversation(
    auth: EnterpriseAuthContext,
    sessionId: string
  ): Promise<void> {
    const authToken = auth.token;

    const response = await fetch(
      `/api/conversations/${sessionId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete conversation: ${error}`);
    }
  }

  /**
   * Upload a file for knowledge ingestion
   */
  async uploadFile(
    auth: EnterpriseAuthContext,
    file: File
  ): Promise<{ upload_id: string; status: string }> {
    const apiKey = auth.apiKey || auth.token;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('organization_id', auth.organizationId);
    formData.append('user_id', auth.userId);

    const response = await fetch(`${API_CONFIG.CHAT_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Organization-ID': auth.organizationId,
        'X-User-ID': auth.userId,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`File upload failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Get upload status
   */
  async getUploadStatus(
    auth: EnterpriseAuthContext,
    uploadId: string
  ): Promise<{ status: string; progress?: number; facts_extracted?: number }> {
    const apiKey = auth.apiKey || auth.token;

    const response = await fetch(
      `${API_CONFIG.CHAT_BASE_URL}/upload/${uploadId}/status`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-Organization-ID': auth.organizationId,
          'X-User-ID': auth.userId,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get upload status: ${error}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const enterpriseChatAPI = new EnterpriseChatAPI();
export type { EnterpriseAuthContext, StreamingCallbacks, ConversationResponse, ConversationListItem };
