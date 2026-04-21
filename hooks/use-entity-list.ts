"use client"

import * as React from "react"
import { useAccountKnowledgeGraph } from "./use-knowledge-graph"
import { toForceGraphData, type ForceGraphData, type ForceGraphNode } from "@/lib/utils/graph-transform"

export interface EntityListFilters {
  search: string
  types: Set<string>
  minDegree: number
}

export interface EntityListState {
  isLoading: boolean
  error: Error | null
  refetch: () => void
  graph: ForceGraphData
  /** All entities after filters, not paginated. */
  filtered: ForceGraphNode[]
  allTypes: string[]
}

const EMPTY_GRAPH: ForceGraphData = {
  nodes: [],
  links: [],
  types: [],
  communityIndex: [],
  colorFor: () => "#8DAA9D",
}

export function useEntityList(filters: EntityListFilters): EntityListState {
  // The wiki can reasonably ask for more than the graph view's 2k window since
  // Louvain isn't on the critical path here.
  const { data: response, isLoading, error, refetch } = useAccountKnowledgeGraph({ limit: 5000 })

  const nodes = response?.data?.nodes || []
  const edges = response?.data?.edges || []

  const graph = React.useMemo<ForceGraphData>(
    () => (nodes.length ? toForceGraphData(nodes, edges) : EMPTY_GRAPH),
    [nodes, edges]
  )

  const filtered = React.useMemo(() => {
    const term = filters.search.trim().toLowerCase()
    const typesActive = filters.types.size && filters.types.size !== graph.types.length ? filters.types : null
    return graph.nodes.filter((n) => {
      if (typesActive && !typesActive.has(n.type)) return false
      if (n.degree < filters.minDegree) return false
      if (term && !n.name.toLowerCase().includes(term)) return false
      return true
    })
  }, [graph, filters])

  return {
    isLoading,
    error: error ? (error as Error) : null,
    refetch,
    graph,
    filtered,
    allTypes: graph.types,
  }
}
