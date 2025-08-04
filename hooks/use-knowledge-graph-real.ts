'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { KnowledgeGraphResponse } from '../types/knowledge-graph';
import { API_CONFIG, apiCall } from '../config/api';
import { useAuth } from './use-auth';

// Real data fetching function
const fetchKnowledgeGraph = async (apiKey: string): Promise<KnowledgeGraphResponse> => {
  try {
    console.log('fetchKnowledgeGraph - fetching with apiKey:', apiKey.substring(0, 8) + '...');
    const response = await apiCall(API_CONFIG.ENDPOINTS.KNOWLEDGE_GRAPH, {}, apiKey);
    console.log('fetchKnowledgeGraph - raw response:', response);
    console.log('fetchKnowledgeGraph - response.data.nodes length:', response.data?.nodes?.length);
    console.log('fetchKnowledgeGraph - response.data.edges length:', response.data?.edges?.length);
    
    // Transform the VRIN API response to our expected format
    const nodes = response.data?.nodes || [];
    const edges = response.data?.edges || [];
    
    // Use nodes directly since they're already in the correct format
    const transformedNodes = nodes.map((node: any) => ({
      id: node.id || `node_${Math.random()}`,
      name: node.name,
      type: node.type || 'entity',
      description: node.description || node.name,
      confidence: node.confidence || 0.8,
      timestamp: node.timestamp ? new Date(node.timestamp) : new Date(),
      connections: node.connections || 0,
    }));
    
    // Transform edges to the expected format
    const transformedEdges = edges.map((edge: any) => ({
      id: edge.id || `edge_${Math.random()}`,
      from: edge.from,
      to: edge.to,
      label: edge.label,
      type: edge.type || 'relationship',
      weight: edge.weight || 1.0,
      confidence: edge.confidence || 0.8,
      timestamp: edge.timestamp ? new Date(edge.timestamp) : new Date(),
    }));
    
    // Use API statistics if available, otherwise create basic ones
    const apiStatistics = response.data?.statistics;
    const statistics = apiStatistics || {
      nodeCount: transformedNodes.length,
      edgeCount: transformedEdges.length,
      tripleCount: transformedEdges.length,
      density: 0,
      averageConnections: 0,
      clusters: 0,
      confidence: {
        average: 0.8,
        min: 0.8,
        max: 0.8,
        distribution: {
          'high': transformedNodes.length,
          'medium': 0,
          'low': 0
        }
      },
      temporal: {
        recentUpdates: 0,
        conflictedFacts: 0,
        averageFactAge: 0
      },
      domains: {}
    };
    
    const result = {
      success: true,
      data: {
        nodes: transformedNodes,
        edges: transformedEdges,
        triples: [],
        statistics
      },
      timestamp: new Date(),
      version: '1.0.0'
    };
    
    console.log('fetchKnowledgeGraph - transformed result:', result);
    console.log('fetchKnowledgeGraph - transformed nodes count:', result.data.nodes.length);
    
    return result;
  } catch (error) {
    console.error('Failed to fetch knowledge graph:', error);
    throw error;
  }
};

// Insert knowledge data
const insertRecord = async (record: { text: string }, apiKey: string): Promise<void> => {
  try {
    await apiCall(API_CONFIG.ENDPOINTS.INSERT_KNOWLEDGE, {
      method: 'POST',
      body: JSON.stringify(record)
    }, apiKey);
  } catch (error) {
    console.error('Failed to insert knowledge:', error);
    throw error;
  }
};

// Update knowledge data  
const updateRecord = async ({ recordId, updates, apiKey }: { recordId: string; updates: any; apiKey: string }): Promise<void> => {
  try {
    await apiCall(API_CONFIG.ENDPOINTS.INSERT_KNOWLEDGE, {
      method: 'POST',
      body: JSON.stringify({ text: `Update for ${recordId}: ${JSON.stringify(updates)}` })
    }, apiKey);
  } catch (error) {
    console.error('Failed to update knowledge:', error);
    throw error;
  }
};

// Query knowledge data
const retrieveAndSummarize = async ({ query, apiKey }: { query: string; apiKey: string }): Promise<any> => {
  try {
    return await apiCall(API_CONFIG.ENDPOINTS.QUERY_BASIC, {
      method: 'POST',
      body: JSON.stringify({ query })
    }, apiKey);
  } catch (error) {
    console.error('Failed to retrieve knowledge:', error);
    throw error;
  }
};

export function useRealKnowledgeGraph() {
  const queryClient = useQueryClient();
  const { apiKey, isAuthenticated } = useAuth();
  
  console.log('useRealKnowledgeGraph - apiKey:', apiKey ? `${apiKey.substring(0, 8)}...` : null, 'isAuthenticated:', isAuthenticated);

  const query = useQuery({
    queryKey: ['real-knowledge-graph', apiKey],
    queryFn: () => fetchKnowledgeGraph(apiKey!),
    enabled: !!apiKey && isAuthenticated,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  console.log('useRealKnowledgeGraph - query state:', {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
    enabled: !!apiKey && isAuthenticated
  });

  const insertMutation = useMutation({
    mutationFn: ({ text }: { text: string }) => insertRecord({ text }, apiKey!),
    onSuccess: () => {
      // Invalidate and refetch the graph data
      queryClient.invalidateQueries({ queryKey: ['real-knowledge-graph'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ recordId, updates }: { recordId: string; updates: any }) =>
      updateRecord({ recordId, updates, apiKey: apiKey! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-knowledge-graph'] });
    },
  });

  const retrieveMutation = useMutation({
    mutationFn: ({ query }: { query: string }) => retrieveAndSummarize({ query, apiKey: apiKey! }),
  });

  return {
    // Query state
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    
    // Workflow mutations
    insertRecord: insertMutation.mutate,
    updateRecord: updateMutation.mutate,
    retrieveAndSummarize: retrieveMutation.mutate,
    
    // Mutation states
    isInserting: insertMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRetrieving: retrieveMutation.isPending,
    
    // Results
    retrievalResult: retrieveMutation.data,
  };
} 