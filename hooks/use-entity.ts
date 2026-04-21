"use client"

import * as React from "react"
import { useAccountKnowledgeGraph } from "./use-knowledge-graph"
import { toForceGraphData, extractNeighbourhood, type ForceGraphData, type ForceGraphNode, type ForceGraphLink } from "@/lib/utils/graph-transform"

export interface EntityDetail {
  node: ForceGraphNode | null
  incoming: Array<{ other: ForceGraphNode; label: string; link: ForceGraphLink }>
  outgoing: Array<{ other: ForceGraphNode; label: string; link: ForceGraphLink }>
  neighbourhood: ForceGraphData
  graph: ForceGraphData
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useEntity(entityId: string | null): EntityDetail {
  // See note in use-entity-list: 2k is the proven working envelope for the
  // /graph Lambda. Entity-detail pages for nodes beyond this window will
  // show "not found" until we add a dedicated /entity/{id} endpoint.
  const { data: response, isLoading, error, refetch } = useAccountKnowledgeGraph({ limit: 2000 })

  const nodes = response?.data?.nodes || []
  const edges = response?.data?.edges || []

  const graph = React.useMemo(() => toForceGraphData(nodes, edges), [nodes, edges])

  const { node, incoming, outgoing, neighbourhood } = React.useMemo(() => {
    if (!entityId) {
      return {
        node: null as ForceGraphNode | null,
        incoming: [],
        outgoing: [],
        neighbourhood: { nodes: [], links: [], types: [], communityIndex: [], colorFor: graph.colorFor } as ForceGraphData,
      }
    }
    const byId = new Map(graph.nodes.map((n) => [n.id, n]))
    const self = byId.get(entityId) || null
    const incomingOut: Array<{ other: ForceGraphNode; label: string; link: ForceGraphLink }> = []
    const outgoingOut: Array<{ other: ForceGraphNode; label: string; link: ForceGraphLink }> = []
    for (const link of graph.links) {
      const s = typeof link.source === "string" ? link.source : (link.source as { id: string }).id
      const t = typeof link.target === "string" ? link.target : (link.target as { id: string }).id
      if (s === entityId) {
        const other = byId.get(t)
        if (other) outgoingOut.push({ other, label: link.label, link })
      } else if (t === entityId) {
        const other = byId.get(s)
        if (other) incomingOut.push({ other, label: link.label, link })
      }
    }
    const hood = self ? extractNeighbourhood(graph, entityId, 1) : graph
    return { node: self, incoming: incomingOut, outgoing: outgoingOut, neighbourhood: hood }
  }, [entityId, graph])

  return {
    node,
    incoming,
    outgoing,
    neighbourhood,
    graph,
    isLoading,
    error: error ? (error as Error) : null,
    refetch,
  }
}
