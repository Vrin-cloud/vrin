// Enterprise Conversations Hook
// Manages conversation history for enterprise users with organization-scoped access

import { useState, useCallback, useEffect } from 'react';
import { enterpriseChatAPI, EnterpriseAuthContext, ConversationListItem, ConversationResponse } from '@/lib/services/enterprise-chat-api';

interface UseEnterpriseConversationsReturn {
  conversations: ConversationListItem[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  loadConversation: (sessionId: string) => Promise<ConversationResponse | null>;
  deleteConversation: (sessionId: string) => Promise<boolean>;
  renameConversation: (sessionId: string, title: string) => Promise<boolean>;
  refreshConversations: () => Promise<void>;
}

export const useEnterpriseConversations = (
  auth: EnterpriseAuthContext | null
): UseEnterpriseConversationsReturn => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!auth) {
      console.log('[Enterprise Conversations] No auth context, skipping fetch');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('[Enterprise Conversations] Fetching conversations for org:', auth.organizationId);

      const convos = await enterpriseChatAPI.getConversations(auth);

      // Sort by updated_at descending (most recent first)
      const sorted = convos.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      setConversations(sorted);
      console.log('[Enterprise Conversations] Loaded', sorted.length, 'conversations');
    } catch (err: any) {
      console.error('[Enterprise Conversations] Fetch error:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  const loadConversation = useCallback(async (sessionId: string): Promise<ConversationResponse | null> => {
    if (!auth) {
      console.error('[Enterprise Conversations] No auth context');
      return null;
    }

    try {
      console.log('[Enterprise Conversations] Loading conversation:', sessionId);

      const conversation = await enterpriseChatAPI.loadConversation(auth, sessionId);
      console.log('[Enterprise Conversations] Loaded conversation with', conversation.messages?.length || 0, 'messages');

      return conversation;
    } catch (err: any) {
      console.error('[Enterprise Conversations] Load error:', err);
      setError(err.message || 'Failed to load conversation');
      return null;
    }
  }, [auth]);

  const deleteConversation = useCallback(async (sessionId: string): Promise<boolean> => {
    if (!auth) {
      console.error('[Enterprise Conversations] No auth context');
      return false;
    }

    try {
      console.log('[Enterprise Conversations] Deleting conversation:', sessionId);

      await enterpriseChatAPI.deleteConversation(auth, sessionId);

      // Update local state
      setConversations(prev => prev.filter(c => c.session_id !== sessionId));
      console.log('[Enterprise Conversations] Deleted successfully');

      return true;
    } catch (err: any) {
      console.error('[Enterprise Conversations] Delete error:', err);
      setError(err.message || 'Failed to delete conversation');
      return false;
    }
  }, [auth]);

  const renameConversation = useCallback(async (sessionId: string, title: string): Promise<boolean> => {
    if (!auth) {
      console.error('[Enterprise Conversations] No auth context');
      return false;
    }

    try {
      console.log('[Enterprise Conversations] Renaming conversation:', sessionId, 'to:', title);

      await enterpriseChatAPI.updateConversationTitle(auth, sessionId, title);

      // Update local state
      setConversations(prev => prev.map(c =>
        c.session_id === sessionId ? { ...c, title } : c
      ));
      console.log('[Enterprise Conversations] Renamed successfully');

      return true;
    } catch (err: any) {
      console.error('[Enterprise Conversations] Rename error:', err);
      setError(err.message || 'Failed to rename conversation');
      return false;
    }
  }, [auth]);

  const refreshConversations = useCallback(async () => {
    await fetchConversations();
  }, [fetchConversations]);

  // Auto-fetch conversations on mount and auth change
  useEffect(() => {
    if (auth) {
      fetchConversations();
    }
  }, [auth, fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    loadConversation,
    deleteConversation,
    renameConversation,
    refreshConversations,
  };
};
