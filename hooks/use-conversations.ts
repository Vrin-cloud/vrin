// Hook for managing conversation history
import { useState, useCallback } from 'react';
import { API_CONFIG } from '@/config/api';

export interface ConversationListItem {
  session_id: string;
  title: string;
  created_at: string;
  last_updated: string;
  turn_count: number;
  message_count: number;
  preview: string;
  is_active: boolean;
  archived?: boolean;
}

export interface ConversationDetail {
  session_id: string;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
  turn_count: number;
  created_at: string;
  last_updated: string;
}

interface UseConversationsReturn {
  conversations: ConversationListItem[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  loadConversation: (sessionId: string) => Promise<ConversationDetail | null>;
  refreshConversations: () => Promise<void>;
}

export const useConversations = (apiKey: string): UseConversationsReturn => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!apiKey) {
      console.warn('No API key provided for fetchConversations');
      return;
    }

    console.log('📜 Fetching conversation list...');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.CONVERSATION_BASE_URL}/conversations?limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Fetched conversations:', data.total);

      // Sort by last_updated descending (newest first)
      const sortedConversations = (data.conversations || []).sort((a: ConversationListItem, b: ConversationListItem) => {
        return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
      });

      setConversations(sortedConversations);
    } catch (err: any) {
      console.error('❌ Failed to fetch conversations:', err);
      setError(err.message || 'Failed to fetch conversations');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const loadConversation = useCallback(async (sessionId: string): Promise<ConversationDetail | null> => {
    if (!apiKey) {
      console.error('No API key provided for loadConversation');
      return null;
    }

    console.log('📖 Loading conversation:', sessionId);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.CONVERSATION_BASE_URL}/conversations/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load conversation: ${response.status}`);
      }

      const conversation = await response.json();
      console.log('✅ Loaded conversation with', conversation.messages?.length || 0, 'messages');

      return conversation;
    } catch (err: any) {
      console.error('❌ Failed to load conversation:', err);
      setError(err.message || 'Failed to load conversation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const refreshConversations = useCallback(async () => {
    console.log('🔄 Refreshing conversation list...');
    await fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    loadConversation,
    refreshConversations
  };
};
