'use client';

import { useQuery } from '@tanstack/react-query';
import type { KnowledgeGraphResponse } from '@/types/knowledge-graph';

// Mock API function for demonstration
const fetchKnowledgeGraph = async (): Promise<KnowledgeGraphResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response with sample data
  return {
    success: true,
    data: {
      nodes: [
        {
          id: 'marie-curie',
          name: 'Marie Curie',
          type: 'Person',
          confidence: 0.95,
          connections: 8,
          timestamp: new Date(),
          position: { x: 200, y: 150 }
        },
        {
          id: 'pierre-curie',
          name: 'Pierre Curie',
          type: 'Person',
          confidence: 0.92,
          connections: 6,
          timestamp: new Date(),
          position: { x: 350, y: 200 }
        },
        {
          id: 'nobel-prize',
          name: 'Nobel Prize in Physics',
          type: 'Award',
          confidence: 0.98,
          connections: 12,
          timestamp: new Date(),
          position: { x: 300, y: 80 }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          from: 'marie-curie',
          to: 'pierre-curie',
          label: 'married to',
          type: 'relationship',
          confidence: 0.96,
          timestamp: new Date()
        },
        {
          id: 'edge-2',
          from: 'marie-curie',
          to: 'nobel-prize',
          label: 'won',
          type: 'achievement',
          confidence: 0.98,
          timestamp: new Date()
        }
      ],
      triples: [
        {
          subject: 'Marie Curie',
          predicate: 'married to',
          object: 'Pierre Curie',
          id: 'triple-1',
          confidence: 0.96,
          timestamp: new Date(),
          status: 'active'
        }
      ],
      statistics: {
        nodeCount: 1247,
        edgeCount: 3891,
        tripleCount: 5638,
        density: 0.73,
        averageConnections: 6.2,
        clusters: 12,
        confidence: {
          average: 0.87,
          min: 0.34,
          max: 0.98,
          distribution: {
            'high': 64,
            'medium': 28,
            'low': 8
          }
        },
        temporal: {
          recentUpdates: 23,
          conflictedFacts: 3,
          averageFactAge: 45.2
        },
        domains: {
          'Science': 387,
          'Technology': 298,
          'Healthcare': 156,
          'Finance': 89,
          'Legal': 67,
          'Other': 250
        }
      }
    },
    timestamp: new Date(),
    version: '1.0.0'
  };
};

export function useKnowledgeGraph() {
  return useQuery({
    queryKey: ['knowledge-graph'],
    queryFn: fetchKnowledgeGraph,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
  });
} 