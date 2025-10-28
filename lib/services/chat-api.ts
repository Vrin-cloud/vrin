// Chat API Service for VRIN
// Handles all chat-related API calls to the backend

import { API_CONFIG } from '@/config/api';
import { handleStreamingResponse, type StreamCallbacks } from '@/lib/utils/streaming';
import type {
  SendMessageRequest,
  SendMessageResponse,
  StartConversationResponse,
  EndConversationResponse,
  UploadFileResponse,
  FileUpload
} from '@/types/chat';

class ChatAPI {
  private baseURL: string;

  constructor() {
    // Use RAG Lambda Function URL (not Chat API Gateway) to avoid 30s timeout
    this.baseURL = API_CONFIG.RAG_BASE_URL;
  }

  private getHeaders(apiKey: string): HeadersInit {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
        console.error('📛 API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorJson
        });
      } catch {
        errorMessage = errorText || errorMessage;
        console.error('📛 API Error (non-JSON):', {
          status: response.status,
          statusText: response.statusText,
          text: errorText
        });
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Send a chat message (non-streaming)
   * Transforms chat parameters to RAG endpoint format
   */
  async sendMessage(
    request: SendMessageRequest,
    apiKey: string
  ): Promise<SendMessageResponse> {
    // Use local API proxy to avoid CORS
    const url = '/api/chat';

    // Get user_id from localStorage
    const user = localStorage.getItem('vrin_user');
    const userId = user ? JSON.parse(user).user_id : undefined;

    if (!userId) {
      console.error('❌ No user_id found in localStorage. User:', user);
      throw new Error('User authentication required. Please log in again.');
    }

    // Transform chat parameters to RAG endpoint format
    const ragRequest = {
      query: request.message,           // message → query
      user_id: userId,                   // Required by RAG endpoint
      session_id: request.session_id,    // For conversation context
      stream: false                      // Non-streaming mode
    };

    // CRITICAL: Log the exact request being sent to backend
    console.log('🌐 === CHAT API REQUEST (RAG Format) ===');
    console.log('URL:', url, '(proxied to Lambda Function URL)');
    console.log('Method: POST');
    console.log('API Key:', apiKey.substring(0, 15) + '...');
    console.log('Request Body:', JSON.stringify(ragRequest, null, 2));
    console.log('⚠️ SESSION ID:', ragRequest.session_id || '❌ NEW SESSION');
    console.log('=========================================');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(apiKey),
        body: JSON.stringify(ragRequest)  // Send RAG-formatted request
      });

      console.log('🌐 === CHAT API RESPONSE ===');
      console.log('Status:', response.status, response.statusText);
      console.log('OK:', response.ok);

      const data = await this.handleResponse<any>(response);

      // Transform RAG response format to chat format
      const transformedData: SendMessageResponse = {
        session_id: data.session_id || `session-${crypto.randomUUID()}`,
        conversation_turn: data.conversation_turn || 1,
        message: data.summary || data.message || '', // RAG returns 'summary', chat expects 'message'
        response_mode: data.response_mode || 'chat',
        sources: data.sources || [],
        metadata: data.metadata || {},
        expert_analysis: data.expert_analysis
      };

      console.log('📥 Response Data (transformed):', {
        session_id: transformedData.session_id,
        conversation_turn: transformedData.conversation_turn,
        message_length: transformedData.message?.length,
        sources_count: transformedData.sources?.length,
        had_summary: !!data.summary,
        had_message: !!data.message
      });
      console.log('============================');

      return transformedData;
    } catch (error) {
      console.error('🌐 Chat API Network Error:', error);
      throw error;
    }
  }

  /**
   * Send a chat message with streaming support
   * Returns a promise that resolves when streaming is complete
   */
  async sendMessageStreaming(
    request: SendMessageRequest,
    apiKey: string,
    callbacks: StreamCallbacks,
    abortSignal?: AbortSignal
  ): Promise<void> {
    // Use local API proxy to avoid CORS
    const url = '/api/chat';

    // Get user_id from localStorage
    const user = localStorage.getItem('vrin_user');
    const userId = user ? JSON.parse(user).user_id : undefined;

    if (!userId) {
      console.error('❌ No user_id found in localStorage. User:', user);
      throw new Error('User authentication required. Please log in again.');
    }

    // Transform chat parameters to RAG endpoint format
    const ragRequest = {
      query: request.message,           // message → query
      user_id: userId,                   // Required by RAG endpoint
      session_id: request.session_id,    // For conversation context
      stream: true                       // Enable streaming
    };

    console.log('🌊 === STREAMING CHAT REQUEST (RAG Format) ===');
    console.log('URL:', url, '(proxied to Lambda Function URL)');
    console.log('API Key:', apiKey.substring(0, 15) + '...');
    console.log('Request Body:', JSON.stringify(ragRequest, null, 2));
    console.log('Session ID:', ragRequest.session_id || '❌ NEW SESSION');
    console.log('===============================================');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.getHeaders(apiKey),
          'Accept': 'text/event-stream', // Request streaming
        },
        body: JSON.stringify(ragRequest),  // Send RAG-formatted request
        signal: abortSignal  // Support cancellation
      });

      console.log('🌊 Streaming response received, status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle SSE streaming
      await handleStreamingResponse(response, callbacks);

      console.log('✅ Streaming completed');
    } catch (error) {
      console.error('🌊 Streaming error:', error);
      callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Start a new conversation
   */
  async startConversation(
    apiKey: string,
    initialContext?: string
  ): Promise<StartConversationResponse> {
    // Use local API proxy to avoid CORS
    const response = await fetch('/api/chat/start', {
      method: 'POST',
      headers: this.getHeaders(apiKey),
      body: JSON.stringify({ initial_context: initialContext })
    });

    return this.handleResponse<StartConversationResponse>(response);
  }

  /**
   * End a conversation
   */
  async endConversation(
    sessionId: string,
    apiKey: string
  ): Promise<EndConversationResponse> {
    // Use local API proxy to avoid CORS
    const response = await fetch('/api/chat/end', {
      method: 'POST',
      headers: this.getHeaders(apiKey),
      body: JSON.stringify({ session_id: sessionId })
    });

    return this.handleResponse<EndConversationResponse>(response);
  }

  /**
   * Upload a file for knowledge extraction
   */
  async uploadFile(
    file: File,
    apiKey: string
  ): Promise<UploadFileResponse> {
    console.log('📤 === FILE UPLOAD REQUEST ===');
    console.log('File:', file.name);
    console.log('Size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('Type:', file.type);
    console.log('URL: /api/chat/upload (proxied to backend)');
    console.log('API Key:', apiKey.substring(0, 15) + '...');
    console.log('============================');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use local API proxy to avoid CORS
      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
          // Don't set Content-Type for FormData - browser sets it with boundary
        },
        body: formData
      });

      console.log('📥 === FILE UPLOAD RESPONSE ===');
      console.log('Status:', response.status, response.statusText);
      console.log('OK:', response.ok);
      console.log('================================');

      const result = await this.handleResponse<UploadFileResponse>(response);

      console.log('✅ Upload successful:', result.upload_id);
      return result;
    } catch (error) {
      console.error('❌ FILE UPLOAD ERROR:', error);
      throw error;
    }
  }

  /**
   * Check upload status
   */
  async getUploadStatus(
    uploadId: string,
    apiKey: string
  ): Promise<FileUpload> {
    console.log('🔍 === CHECKING UPLOAD STATUS ===');
    console.log('Upload ID:', uploadId);
    console.log('URL: /api/chat/upload/[uploadId]/status (proxied to backend)');

    try {
      // Use local API proxy to avoid CORS
      const response = await fetch(`/api/chat/upload/${uploadId}/status`, {
        method: 'GET',
        headers: this.getHeaders(apiKey)
      });

      console.log('📥 Status check response:', response.status, response.ok);

      const result = await this.handleResponse<FileUpload>(response);
      console.log('✅ Status result:', result);
      return result;
    } catch (error) {
      console.error('❌ Status check error:', error);
      throw error;
    }
  }

  /**
   * Delete a conversation (soft delete - marks as inactive)
   * Uses Next.js API proxy
   */
  async deleteConversation(
    sessionId: string,
    apiKey: string
  ): Promise<{ session_id: string; message: string }> {
    const url = `/api/conversations/${sessionId}`;

    console.log('🗑️ Deleting conversation:', sessionId);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${apiKey}`, // lowercase to match other proxies
        }
      });

      const result = await this.handleResponse<{ session_id: string; message: string }>(response);
      console.log('✅ Conversation deleted:', result);
      return result;
    } catch (error) {
      console.error('❌ Delete conversation error:', error);
      throw error;
    }
  }

  /**
   * Update conversation title (rename)
   * Uses Next.js API proxy
   */
  async updateConversationTitle(
    sessionId: string,
    newTitle: string,
    apiKey: string
  ): Promise<{ session_id: string; title: string; message: string }> {
    if (!newTitle.trim()) {
      throw new Error('Title cannot be empty');
    }

    const url = `/api/conversations/${sessionId}/title`;

    console.log('✏️ Updating conversation title:', sessionId);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${apiKey}`, // lowercase to match other proxies
        },
        body: JSON.stringify({ title: newTitle })
      });

      const result = await this.handleResponse<{ session_id: string; title: string; message: string }>(response);
      console.log('✅ Title updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Update title error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatAPI = new ChatAPI();
