'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import type { KnowledgeGraphResponse } from '@/types/knowledge-graph';
import { VRINService } from '@/lib/services/vrin-service';

// Real API function using VRIN service - Single Knowledge Graph per Account
const fetchKnowledgeGraph = async (apiKey: string): Promise<KnowledgeGraphResponse> => {
  if (!apiKey) {
    throw new Error('API key required to fetch knowledge graph');
  }

  const vrinService = new VRINService(apiKey);
  
  try {
    // Get the unified knowledge graph for the account
    const result = await vrinService.getKnowledgeGraph();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch knowledge graph');
    }

    return {
      success: true,
      data: result.data || {
        nodes: [],
        edges: [],
        triples: [],
        statistics: {
          nodeCount: 0,
          edgeCount: 0,
          tripleCount: 0,
          density: 0,
          averageConnections: 0,
          clusters: 0,
          confidence: {
            average: 0,
            min: 0,
            max: 0,
            distribution: {}
          },
          temporal: {
            recentUpdates: 0,
            conflictedFacts: 0,
            averageFactAge: 0
          },
          domains: {}
        }
      },
      timestamp: new Date(),
      version: '0.3.2'
    };
  } catch (error) {
    console.error('Knowledge graph fetch error:', error);
    throw error;
  }
};

// Updated hook for unified Knowledge Graph per account (v0.3.2)
export function useKnowledgeGraph(apiKey?: string) {
  return useQuery({
    queryKey: ['knowledge-graph-unified', apiKey], // Updated key for single KG per account
    queryFn: () => fetchKnowledgeGraph(apiKey!),
    enabled: !!apiKey, // Only run query if API key is provided
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for real-time updates
    refetchOnWindowFocus: true,
    retry: 3, // Retry failed requests
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}

// Helper hook to get the user's API key and return unified graph
export function useAccountKnowledgeGraph() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Get API key from localStorage
    const storedApiKey = localStorage.getItem('vrin_api_key');
    setApiKey(storedApiKey);
  }, []);

  const graphQuery = useKnowledgeGraph(apiKey || undefined);

  return {
    ...graphQuery,
    hasApiKey: !!apiKey,
    // Single unified knowledge graph for the entire account
    // All API keys associated with the account contribute to this single graph
    isAccountGraph: true
  };
} 