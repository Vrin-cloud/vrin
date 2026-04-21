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
  /**
   * Community → metadata, ordered by community size desc.
   *
   * - `topType`: dominant node.type within the community (useful when the
   *   graph has meaningful entity typing, mostly a fallback here).
   * - `exemplars`: names of the highest-degree members — used as the
   *   cluster's human label in the legend (e.g. "RAG · HippoRAG ·
   *   Self-RAG"). Far more informative than `topType` when every node in
   *   the dataset shares the same default type.
   */
  communityIndex: Array<{
    id: number
    color: string
    size: number
    topType?: string
    exemplars: string[]
  }>
  colorFor: (nodeId: string) => string
}

/**
 * Display-side filter for nodes that are technically present in the graph
 * but shouldn't appear in the dashboard UI.
 *
 * What this catches:
 *   1. The backend's `_literal_values_{user_id}` placeholder vertex. The
 *      fact-extraction pipeline creates one per user to funnel non-entity
 *      literal values (monetary amounts, percentages, bare years) instead
 *      of creating a vertex per literal — a sensible internal design, but
 *      the placeholder itself is an ops artifact that shouldn't be rendered.
 *   2. Entity vertices whose name is a bare literal that slipped past the
 *      backend's `_is_literal_value` regex: booleans, yes/no, n/a, very
 *      short tokens, etc. These show up as high-degree hubs of meaninglessness.
 *
 * This is purely display-side. The underlying Neptune data is untouched —
 * the backend still reads / writes these nodes for its own query needs.
 * Removing this filter is a one-line change if a pattern is too aggressive.
 */
const LITERAL_LIKE_NAMES = new Set([
  "true",
  "false",
  "yes",
  "no",
  "n/a",
  "na",
  "none",
  "null",
  "unknown",
  "undefined",
  "n",
  "y",
])

function isDisplayHiddenNode(n: Node): boolean {
  const name = (n.name || "").trim()
  // Backend-generated literal-values placeholder (one per user).
  if (name.startsWith("_literal_values_")) return true
  // Any node whose type is explicitly marked as a literal placeholder.
  if (n.type === "literal_placeholder") return true
  // Bare-literal names that escaped the ingestion regex.
  const lower = name.toLowerCase()
  if (LITERAL_LIKE_NAMES.has(lower)) return true
  // Super-short names (1–2 chars) are almost never real entities. Keep 3+
  // so acronyms like "RAG", "LLM", "API" survive.
  if (name.length > 0 && name.length < 3) return true
  return false
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

  // Drop hidden nodes AND any edge that touches one. This happens BEFORE
  // degree / community computation so hubs that only exist because of
  // literal-value edges don't inflate the visible graph's stats.
  const hiddenIds = new Set<string>()
  const visibleNodes: Node[] = []
  for (const n of nodes) {
    if (isDisplayHiddenNode(n)) {
      hiddenIds.add(n.id)
    } else {
      visibleNodes.push(n)
    }
  }
  const visibleEdges =
    hiddenIds.size === 0
      ? edges
      : edges.filter((e) => !hiddenIds.has(e.from) && !hiddenIds.has(e.to))

  const degree = computeDegreeMap(visibleNodes, visibleEdges)
  const communities = computeCommunities(visibleNodes, visibleEdges)

  const nodeIds = new Set(visibleNodes.map((n) => n.id))

  const fgNodes: ForceGraphNode[] = visibleNodes.map((n) => ({
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
  for (const e of visibleEdges) {
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

  // Build community index with size, dominant type, and exemplar names.
  //
  // Exemplars are the highest-degree members within each community — they
  // act as a one-glance "what is this cluster about" label. We pick the
  // top 3 so legends stay compact. Ties broken by name for stability.
  const sizeByCommunity = new Map<number, number>()
  const typeTallyByCommunity = new Map<number, Map<string, number>>()
  const membersByCommunity = new Map<number, ForceGraphNode[]>()
  for (const n of fgNodes) {
    if (n.communityId === null) continue
    sizeByCommunity.set(n.communityId, (sizeByCommunity.get(n.communityId) ?? 0) + 1)
    if (!typeTallyByCommunity.has(n.communityId)) typeTallyByCommunity.set(n.communityId, new Map())
    const t = typeTallyByCommunity.get(n.communityId)!
    t.set(n.type, (t.get(n.type) ?? 0) + 1)
    if (!membersByCommunity.has(n.communityId)) membersByCommunity.set(n.communityId, [])
    membersByCommunity.get(n.communityId)!.push(n)
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
    const members = membersByCommunity.get(id) ?? []
    const exemplars = members
      .slice()
      .sort((a, b) => (b.degree - a.degree) || a.name.localeCompare(b.name))
      .slice(0, 3)
      .map((m) => m.name)
    return {
      id,
      color: communities.colorForCommunity(id),
      size: sizeByCommunity.get(id) ?? 0,
      topType,
      exemplars,
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
