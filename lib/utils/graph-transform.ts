/**
 * Convert VRIN's {nodes, edges} graph into the shape react-force-graph
 * (2D and 3D) expects: {nodes, links} with `source`/`target` references.
 *
 * Both dashboard graph views share this transform so the 3D/2D toggle
 * costs nothing — same in-memory dataset.
 */

import type { Node, Edge } from "@/types/knowledge-graph"
import { computeCommunities, computeDegreeMap } from "./graph-communities"

export interface ForceGraphNode {
  id: string
  name: string
  type: string
  degree: number
  communityId: number | null
  color: string
  /** Pass-through to anything that wants raw metadata. */
  raw: Node
}

export interface ForceGraphLink {
  id: string
  source: string
  target: string
  label: string
  weight: number
  raw: Edge
}

export interface ForceGraphData {
  nodes: ForceGraphNode[]
  links: ForceGraphLink[]
  /** Unique node.type values present in this dataset, stable-sorted. */
  types: string[]
  /** Community → list of node ids, ordered by community size desc. */
  communityIndex: Array<{ id: number; color: string; size: number; topType?: string }>
  colorFor: (nodeId: string) => string
}

export function toForceGraphData(nodes: Node[], edges: Edge[]): ForceGraphData {
  if (!nodes?.length) {
    return {
      nodes: [],
      links: [],
      types: [],
      communityIndex: [],
      colorFor: () => "#8DAA9D",
    }
  }

  const degree = computeDegreeMap(nodes, edges)
  const communities = computeCommunities(nodes, edges)

  const nodeIds = new Set(nodes.map((n) => n.id))

  const fgNodes: ForceGraphNode[] = nodes.map((n) => ({
    id: n.id,
    name: n.name || n.id,
    type: n.type || "entity",
    degree: degree.get(n.id) ?? 0,
    communityId: communities.assignments[n.id] ?? null,
    color: communities.colorFor(n.id),
    raw: n,
  }))

  const fgLinks: ForceGraphLink[] = []
  const seenEdgeKeys = new Set<string>()
  for (const e of edges) {
    if (!e.from || !e.to || e.from === e.to) continue
    if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) continue
    // De-duplicate reciprocal entries (a→b and b→a with same label) — still
    // allow multi-edges with distinct labels.
    const key = `${e.from}→${e.to}:${e.label || ""}`
    if (seenEdgeKeys.has(key)) continue
    seenEdgeKeys.add(key)

    fgLinks.push({
      id: e.id || key,
      source: e.from,
      target: e.to,
      label: e.label || "",
      weight: e.weight ?? e.confidence ?? 1,
      raw: e,
    })
  }

  const types = Array.from(new Set(fgNodes.map((n) => n.type))).sort()

  // Build community index with size + dominant type.
  const sizeByCommunity = new Map<number, number>()
  const typeTallyByCommunity = new Map<number, Map<string, number>>()
  for (const n of fgNodes) {
    if (n.communityId === null) continue
    sizeByCommunity.set(n.communityId, (sizeByCommunity.get(n.communityId) ?? 0) + 1)
    if (!typeTallyByCommunity.has(n.communityId)) typeTallyByCommunity.set(n.communityId, new Map())
    const t = typeTallyByCommunity.get(n.communityId)!
    t.set(n.type, (t.get(n.type) ?? 0) + 1)
  }
  const communityIndex = communities.ordered.map((id) => {
    const tally = typeTallyByCommunity.get(id)
    let topType: string | undefined
    let topCount = 0
    if (tally) {
      for (const [type, count] of tally) {
        if (count > topCount) {
          topCount = count
          topType = type
        }
      }
    }
    return {
      id,
      color: communities.colorForCommunity(id),
      size: sizeByCommunity.get(id) ?? 0,
      topType,
    }
  })

  return {
    nodes: fgNodes,
    links: fgLinks,
    types,
    communityIndex,
    colorFor: communities.colorFor,
  }
}

/** Build a neighbourhood subgraph (1-hop) around a given node id. */
export function extractNeighbourhood(
  data: ForceGraphData,
  nodeId: string,
  hops: number = 1
): ForceGraphData {
  if (!data.nodes.length) return data
  const frontier = new Set<string>([nodeId])
  const visited = new Set<string>([nodeId])
  const keptLinks: ForceGraphLink[] = []

  for (let i = 0; i < hops; i++) {
    const next = new Set<string>()
    for (const link of data.links) {
      const s = typeof link.source === "string" ? link.source : (link.source as { id: string }).id
      const t = typeof link.target === "string" ? link.target : (link.target as { id: string }).id
      if (frontier.has(s) || frontier.has(t)) {
        keptLinks.push(link)
        if (!visited.has(s)) next.add(s)
        if (!visited.has(t)) next.add(t)
      }
    }
    next.forEach((id) => visited.add(id))
    frontier.clear()
    next.forEach((id) => frontier.add(id))
    if (!frontier.size) break
  }

  const keptNodes = data.nodes.filter((n) => visited.has(n.id))
  const keptLinkIds = new Set(keptLinks.map((l) => l.id))
  return {
    nodes: keptNodes,
    links: data.links.filter((l) => keptLinkIds.has(l.id)),
    types: data.types,
    communityIndex: data.communityIndex,
    colorFor: data.colorFor,
  }
}
