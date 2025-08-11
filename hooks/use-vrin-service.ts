'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VRINService, AuthService } from '../lib/services/vrin-service';
import type { VRINInsertResult, VRINQueryResult } from '../lib/services/vrin-service';

interface UseVRINServiceProps {
  apiKey?: string | null;
}

export function useVRINService({ apiKey }: UseVRINServiceProps = {}) {
  const [service, setService] = useState<VRINService | null>(null);
  const queryClient = useQueryClient();

  // Initialize service when API key changes
  useEffect(() => {
    if (apiKey) {
      setService(new VRINService(apiKey));
    } else {
      setService(null);
    }
  }, [apiKey]);

  // Query for knowledge graph data
  const {
    data: graphData,
    isLoading: isLoadingGraph,
    error: graphError,
    refetch: refetchGraph
  } = useQuery({
    queryKey: ['knowledge-graph', apiKey],
    queryFn: async () => {
      if (!service) throw new Error('VRIN service not initialized');
      return await service.getKnowledgeGraph();
    },
    enabled: !!service && !!apiKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Insert knowledge mutation
  const insertMutation = useMutation({
    mutationFn: async ({ content, title, tags }: {
      content: string;
      title?: string;
      tags?: string[];
    }) => {
      if (!service) throw new Error('VRIN service not initialized');
      return await service.insertKnowledge(content, title, tags);
    },
    onSuccess: (data) => {
      console.log('Knowledge inserted successfully:', data);
      // Invalidate and refetch graph data
      queryClient.invalidateQueries({ queryKey: ['knowledge-graph'] });
    },
    onError: (error) => {
      console.error('Failed to insert knowledge:', error);
    },
  });

  // Query knowledge mutation
  const queryMutation = useMutation({
    mutationFn: async ({ query, includeSummary = true }: {
      query: string;
      includeSummary?: boolean;
    }) => {
      if (!service) throw new Error('VRIN service not initialized');
      return await service.queryKnowledge(query, includeSummary);
    },
    onError: (error) => {
      console.error('Failed to query knowledge:', error);
    },
  });

  // NEW: Specialization mutation (v0.3.2)
  const specializationMutation = useMutation({
    mutationFn: async ({ 
      customPrompt, 
      reasoningFocus, 
      analysisDepth, 
      confidenceThreshold, 
      maxReasoningChains 
    }: {
      customPrompt: string;
      reasoningFocus?: string[];
      analysisDepth?: 'surface' | 'detailed' | 'expert';
      confidenceThreshold?: number;
      maxReasoningChains?: number;
    }) => {
      if (!service) throw new Error('VRIN service not initialized');
      return await service.configureSpecialization(
        customPrompt,
        reasoningFocus,
        analysisDepth,
        confidenceThreshold,
        maxReasoningChains
      );
    },
    onSuccess: (data) => {
      console.log('AI specialization configured:', data);
    },
    onError: (error) => {
      console.error('Failed to configure specialization:', error);
    },
  });

  // Query current specialization
  const {
    data: specializationData,
    isLoading: isLoadingSpecialization,
    error: specializationError,
    refetch: refetchSpecialization
  } = useQuery({
    queryKey: ['specialization', apiKey],
    queryFn: async () => {
      if (!service) throw new Error('VRIN service not initialized');
      return await service.getSpecializationInfo();
    },
    enabled: !!service && !!apiKey,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  // Insert knowledge function
  const insertKnowledge = async (
    content: string,
    title?: string,
    tags?: string[]
  ): Promise<VRINInsertResult> => {
    const result = await insertMutation.mutateAsync({ content, title, tags });
    return result;
  };

  // Query knowledge function
  const queryKnowledge = async (
    query: string,
    includeSummary: boolean = true
  ): Promise<VRINQueryResult> => {
    const result = await queryMutation.mutateAsync({ query, includeSummary });
    return result;
  };

  // NEW: Configure AI specialization function (v0.3.2)
  const configureSpecialization = async (
    customPrompt: string,
    reasoningFocus?: string[],
    analysisDepth?: 'surface' | 'detailed' | 'expert',
    confidenceThreshold?: number,
    maxReasoningChains?: number
  ) => {
    const result = await specializationMutation.mutateAsync({
      customPrompt,
      reasoningFocus,
      analysisDepth,
      confidenceThreshold,
      maxReasoningChains
    });
    return result;
  };

  // Utility function to check service status
  const isServiceReady = () => {
    return !!service && !!apiKey;
  };

  // Get service statistics
  const getServiceInfo = () => {
    return {
      isReady: isServiceReady(),
      hasApiKey: !!apiKey,
      hasService: !!service,
      version: '0.3.2',
      features: [
        'Smart Deduplication',
        'Hybrid RAG Search',
        'Fact Extraction',
        'Knowledge Graph',
        'Storage Optimization',
        'User-Defined AI Specialization', // NEW
        'Multi-hop Reasoning', // NEW
        'Cross-document Synthesis' // NEW
      ]
    };
  };

  return {
    // Service instance
    service,
    
    // Graph data
    graphData: graphData?.success ? graphData.data : null,
    isLoadingGraph,
    graphError,
    refetchGraph,
    
    // Insert knowledge
    insertKnowledge,
    isInserting: insertMutation.isPending,
    insertError: insertMutation.error,
    insertResult: insertMutation.data,
    
    // Query knowledge
    queryKnowledge,
    isQuerying: queryMutation.isPending,
    queryError: queryMutation.error,
    queryResult: queryMutation.data,
    
    // NEW: AI Specialization (v0.3.2)
    configureSpecialization,
    specializationData,
    isLoadingSpecialization,
    specializationError,
    refetchSpecialization,
    isConfiguringSpecialization: specializationMutation.isPending,
    specializationConfigError: specializationMutation.error,
    
    // Utility functions
    isServiceReady,
    getServiceInfo,
    
    // Raw mutations for advanced usage
    insertMutation,
    queryMutation,
    specializationMutation,
  };
}

// Hook for managing API keys
export function useApiKeys() {
  const authService = new AuthService();
  const queryClient = useQueryClient();

  // Query for API keys list
  const {
    data: apiKeys,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const result = await authService.listApiKeys();
      if (result.success) {
        return result.api_keys || [];
      } else {
        throw new Error(result.error || 'Failed to fetch API keys');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Create API key mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const result = await authService.createApiKey();
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Failed to create API key');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch API keys
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  // Create API key function
  const createApiKey = async () => {
    return await createMutation.mutateAsync();
  };

  return {
    // API keys data
    apiKeys: apiKeys || [],
    isLoading,
    error,
    refetch,
    
    // Create API key
    createApiKey,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    
    // Raw mutation for advanced usage
    createMutation,
  };
}

// Legacy compatibility hook
export function useRealKnowledgeGraph() {
  const authService = new AuthService();
  const apiKey = authService.getStoredApiKey();
  const vrinService = useVRINService({ apiKey });

  return {
    data: vrinService.graphData ? {
      success: true,
      data: vrinService.graphData,
    } : null,
    isLoading: vrinService.isLoadingGraph,
    error: vrinService.graphError,
    refetch: vrinService.refetchGraph,
    
    // Legacy insert/retrieve functions
    insertRecord: async ({ text, title, tags }: {
      text: string;
      title?: string;
      tags?: string[];
    }) => {
      return await vrinService.insertKnowledge(text, title, tags);
    },
    
    retrieveAndSummarize: async ({ query }: { query: string }) => {
      return await vrinService.queryKnowledge(query);
    },
    
    isInserting: vrinService.isInserting,
    isRetrieving: vrinService.isQuerying,
  };
}