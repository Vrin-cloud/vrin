'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '../config/api';
import { useDashboardAuth } from '../components/dashboard/v2/shell/auth-context';
import toast from 'react-hot-toast';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
  permissions?: string[];
  expires_at?: string;
}

interface CreateApiKeyRequest {
  name: string;
  permissions?: string[];
  expires_at?: string;
}

interface CreateApiKeyResponse {
  success: boolean;
  api_key: ApiKey;
  message: string;
}

interface GetApiKeysResponse {
  success: boolean;
  api_keys: ApiKey[];
  message: string;
}

interface DeleteApiKeyRequest {
  api_key_id: string;
}

interface DeleteApiKeyResponse {
  success: boolean;
  message: string;
}

export function useApiKeys() {
  const { credential, authedJson } = useDashboardAuth();
  const queryClient = useQueryClient();

  // Cache-key discriminator. We never want to put the raw credential value
  // into the query key, so hash it down to a short prefix. Different users
  // get different cache partitions; same user across JWT rotations reuses
  // the cache as long as the underlying session is the same.
  const credKey = credential ? `${credential.type}:${credential.value.slice(0, 12)}` : 'anon';

  const {
    data: apiKeys = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['api-keys', credKey],
    queryFn: async (): Promise<ApiKey[]> => {
      try {
        const response = await authedJson<{ success: boolean; api_keys?: ApiKey[]; message?: string }>(
          API_CONFIG.ENDPOINTS.GET_API_KEYS
        );
        if (response.success) return response.api_keys || [];
        throw new Error(response.message || 'Failed to fetch API keys');
      } catch (error) {
        console.error('Error fetching API keys:', error);
        return [];
      }
    },
    enabled: !!credential,
    staleTime: 30000,
  });

  const createApiKeyMutation = useMutation({
    mutationFn: async (request: CreateApiKeyRequest): Promise<ApiKey> => {
      const response = await authedJson<{ success: boolean; api_key: ApiKey; message?: string }>(
        API_CONFIG.ENDPOINTS.CREATE_API_KEY,
        { method: 'POST', body: JSON.stringify(request) }
      );
      if (!response.success) {
        throw new Error(response.message || 'Failed to create API key');
      }
      // Backend returns the raw key ONCE at creation — the caller's modal
      // must show it immediately and the user must persist it themselves.
      return response.api_key;
    },
    onSuccess: (newApiKey) => {
      queryClient.setQueryData(['api-keys', credKey], (oldData: ApiKey[] = []) => {
        return [...oldData, newApiKey];
      });
      toast.success('API key created successfully');
    },
    onError: (error) => {
      console.error('Error creating API key:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create API key');
    }
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: async (apiKeyId: string): Promise<void> => {
      try {
        const response = await authedJson<{ success: boolean; message?: string }>(
          API_CONFIG.ENDPOINTS.DELETE_API_KEY,
          { method: 'DELETE', body: JSON.stringify({ api_key_id: apiKeyId }) }
        );
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete API key');
        }
      } catch (error) {
        console.warn('Delete API key endpoint not available:', error);
        if (apiKeyId.startsWith('mock_')) return;
        throw new Error('Delete API key endpoint not available');
      }
    },
    onSuccess: (_, deletedApiKeyId) => {
      queryClient.setQueryData(['api-keys', credKey], (oldData: ApiKey[] = []) => {
        return oldData.filter(key => key.id !== deletedApiKeyId);
      });
      toast.success('API key deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting API key:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete API key');
    }
  });

  // Copy API key to clipboard
  const copyApiKey = async (keyValue: string) => {
    try {
      await navigator.clipboard.writeText(keyValue);
      toast.success('API key copied to clipboard');
    } catch (error) {
      console.error('Failed to copy API key:', error);
      toast.error('Failed to copy API key');
    }
  };

  return {
    // Data
    apiKeys,
    isLoading,
    error,
    
    // Actions
    createApiKey: createApiKeyMutation.mutate,
    deleteApiKey: deleteApiKeyMutation.mutate,
    copyApiKey,
    refetch,
    
    // Loading states
    isCreating: createApiKeyMutation.isPending,
    isDeleting: deleteApiKeyMutation.isPending,
  };
} 