'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useStytchB2BClient, useStytchMemberSession } from '@stytch/nextjs/b2b';
import type { KnowledgeGraphResponse } from '@/types/knowledge-graph';
import { VRINService } from '@/lib/services/vrin-service';

// Real API function using VRIN service - Single Knowledge Graph per Account.
// Accepts either a raw API key (SDK / legacy path) or a Stytch session JWT
// (dashboard path). VRINService prefers the session JWT internally.
const fetchKnowledgeGraph = async (
  credential: { apiKey: string | null; sessionJwt: string | null },
  options?: { limit?: number }
): Promise<KnowledgeGraphResponse> => {
  if (!credential.apiKey && !credential.sessionJwt) {
    throw new Error('Credential required to fetch knowledge graph');
  }

  const vrinService = new VRINService(credential);
  
  try {
    const credKind = credential.sessionJwt ? 'stytch-jwt' : 'api-key';
    console.log(`🔍 Fetching knowledge graph via ${credKind}, options:`, options);
    
    // Get the unified knowledge graph for the account
    const result = await vrinService.getKnowledgeGraph(options?.limit);
    
    console.log('📊 Knowledge graph service result:', result);
    console.log('📊 Result success:', result.success);
    console.log('📊 Result data nodes count:', result.data?.nodes?.length);
    console.log('📊 Result data edges count:', result.data?.edges?.length);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch knowledge graph');
    }

    const response = {
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

    console.log('🎯 Final hook response:', response);
    console.log('🎯 Final nodes count:', response.data?.nodes?.length);
    console.log('🎯 Final edges count:', response.data?.edges?.length);
    
    // If there's an error in the response, log it but don't throw
    if ('error' in response && response.error) {
      console.warn('⚠️ Knowledge graph warning:', response.error);
    }

    return response;
  } catch (error) {
    console.error('Knowledge graph fetch error:', error);
    throw error;
  }
};

// Updated hook for unified Knowledge Graph per account (v0.3.2).
// Accepts either a raw API key or a Stytch session JWT (or both — if both
// are provided, VRINService will prefer the session JWT).
export function useKnowledgeGraph(
  credential: { apiKey?: string | null; sessionJwt?: string | null },
  options?: { limit?: number }
) {
  const apiKey = credential.apiKey || null;
  const sessionJwt = credential.sessionJwt || null;
  const hasCredential = !!(apiKey || sessionJwt);

  return useQuery({
    // Key on the prefix to avoid leaking secrets into cache keys while still
    // segmenting across credentials.
    queryKey: ['knowledge-graph-unified', apiKey?.slice(0, 12) || sessionJwt?.slice(0, 12), options?.limit],
    queryFn: () => fetchKnowledgeGraph({ apiKey, sessionJwt }, options),
    enabled: hasCredential,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000)
  });
}

// Helper hook: resolves the current credential (Stytch session JWT first,
// localStorage api_key fallback) and returns the unified account graph.
export function useAccountKnowledgeGraph(options?: { limit?: number }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const stytchClient = useStytchB2BClient();
  const { isInitialized: stytchInitialized } = useStytchMemberSession();

  useEffect(() => {
    const storedApiKey = localStorage.getItem('vrin_api_key');
    setApiKey(storedApiKey);
  }, []);

  // Read the session JWT fresh on each render so rotation is transparent.
  const sessionJwt = stytchInitialized
    ? (stytchClient?.session?.getTokens?.()?.session_jwt || null)
    : null;

  const graphQuery = useKnowledgeGraph({ apiKey, sessionJwt }, options);

  return {
    ...graphQuery,
    hasApiKey: !!(apiKey || sessionJwt),
    isAccountGraph: true
  };
} 