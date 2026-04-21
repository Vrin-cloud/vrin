/**
 * Shared Louvain-based community detection for dashboard graph views.
 *
 * Lifted from the legacy cosmos-graph so both the 3D and 2D force-graph
 * components — and the overview KPI that counts clusters — share one
 * source of truth and colour palette.
 *
 * M5 `community_id` exposure on the Neptune side is a future backend
 * extension; until then we run Louvain client-side.
 */

import type { Node, Edge } from "@/types/knowledge-graph"

/** Deep, saturated palette. Fewer colours = more visible cluster separation. */
export const COMMUNITY_COLORS = [
  "#8DAA9D", // vrin sage
  "#3b82f6", // blue
  "#a855f7", // violet
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#ec4899", // pink
  "#10b981", // emerald
  "#f97316", // orange
  "#6366f1", // indigo
  "#ef4444", // red
  "#14b8a6", // teal
  "#84cc16", // lime
] as const

export interface CommunityResult {
  /** node id → community id (numeric). */
  assignments: Record<string, number>
  /** Sorted ids, largest community first. */
  ordered: number[]
  /** node id → hex colour. */
  colorFor: (nodeId: string) => string
  /** community id → hex colour. */
  colorForCommunity: (communityId: number) => string
  /** total distinct communities. */
  count: number
}

const FALLBACK: CommunityResult = {
  assignments: {},
  ordered: [],
  colorFor: () => COMMUNITY_COLORS[0],
  colorForCommunity: () => COMMUNITY_COLORS[0],
  count: 0,
}

/**
 * Compute communities synchronously. Returns a fallback (all nodes one color)
 * if graphology is missing or the algorithm throws.
 */
export function computeCommunities(nodes: Node[], edges: Edge[]): CommunityResult {
  if (!nodes?.length) return FALLBACK

  try {
    // Require guards keep this tree-shakeable and safe on the server.
    const Graph = require("graphology")
    const louvain = require("graphology-communities-louvain")

    const g = new Graph()
    for (const n of nodes) g.addNode(n.id)

    const ids = new Set(nodes.map((n) => n.id))
    for (const e of edges) {
      if (e.from && e.to && e.from !== e.to && ids.has(e.from) && ids.has(e.to)) {
        try {
          g.addEdge(e.from, e.to)
        } catch {
          // Duplicate edge — graphology refuses; that's fine, skip.
        }
      }
    }

    const assignments: Record<string, number> = louvain(g, { resolution: 1.2 })

    // Order communities by membership count (largest first) so the palette
    // stays stable: dominant clusters get earlier, richer colors.
    const counts = new Map<number, number>()
    for (const v of Object.values(assignments)) counts.set(v, (counts.get(v) || 0) + 1)
    const ordered = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)

    const paletteIndex = new Map<number, number>()
    ordered.forEach((id, i) => paletteIndex.set(id, i % COMMUNITY_COLORS.length))

    const colorForCommunity = (communityId: number) =>
      COMMUNITY_COLORS[paletteIndex.get(communityId) ?? 0]

    const colorFor = (nodeId: string) => {
      const cid = assignments[nodeId]
      return cid === undefined ? COMMUNITY_COLORS[0] : colorForCommunity(cid)
    }

    return {
      assignments,
      ordered,
      colorFor,
      colorForCommunity,
      count: ordered.length,
    }
  } catch (err) {
    console.warn("computeCommunities: falling back to single-color grouping", err)
    return FALLBACK
  }
}

/** Build a node-id → degree map once; used for sizing across views. */
export function computeDegreeMap(nodes: Node[], edges: Edge[]): Map<string, number> {
  const deg = new Map<string, number>()
  for (const n of nodes) deg.set(n.id, 0)
  for (const e of edges) {
    if (e.from) deg.set(e.from, (deg.get(e.from) || 0) + 1)
    if (e.to) deg.set(e.to, (deg.get(e.to) || 0) + 1)
  }
  return deg
}
