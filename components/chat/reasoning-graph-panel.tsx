'use client'

import * as React from 'react'
import { X, Brain, Target, GitBranch } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import type {
  ReasoningChain,
  ReasoningChainEdge,
  ReasoningChainNode,
} from '@/types/chat'
import { ForceGraph2DView } from '@/components/dashboard/v2/graph/force-graph-2d'
import type { ForceGraphData } from '@/lib/utils/graph-transform'

interface ReasoningGraphPanelProps {
  isOpen: boolean
  onClose: () => void
  chain: ReasoningChain | null
  question?: string
}

// Hop -> color. Seed entities (hop 0) get the brand purple; further-out hops
// fade through cooler tones so the visual hierarchy reads at a glance.
const HOP_COLORS = [
  '#7c3aed', // hop 0 — seed
  '#3b82f6', // hop 1
  '#10b981', // hop 2
  '#f59e0b', // hop 3
  '#ef4444', // hop 4+
]

function colorForHop(hop: number): string {
  return HOP_COLORS[Math.min(Math.max(hop, 0), HOP_COLORS.length - 1)]
}

/**
 * Project a backend reasoning_chain payload into the ForceGraphData shape
 * react-force-graph-2d expects. Done inline rather than via the shared
 * graph-transform helper because the dashboard transform expects the
 * Node/Edge types from the dashboard's knowledge-graph data model — the
 * reasoning chain has its own simpler shape and its own color semantics
 * (color by hop_distance, not by Louvain community).
 *
 * `revealedHops` controls progressive reveal during the entry animation:
 * only nodes whose hop_distance ≤ revealedHops are returned, and only
 * edges between revealed nodes. The force simulation re-settles smoothly
 * as new nodes appear.
 */
function transformChain(
  chain: ReasoningChain,
  revealedHops: number
): ForceGraphData {
  const visibleNodeIds = new Set<string>()
  for (const group of chain.hop_groups) {
    if (group.hop <= revealedHops) {
      for (const id of group.node_ids) visibleNodeIds.add(id)
    }
  }

  // Compute per-node degree from the visible edge subset so the graph
  // sizes nodes by their local connectivity in this chain (not their
  // total Neptune degree, which would dwarf the seed entities here).
  const nodeDegree = new Map<string, number>()
  const visibleEdges = chain.edges.filter(
    (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
  )
  for (const e of visibleEdges) {
    nodeDegree.set(e.source, (nodeDegree.get(e.source) ?? 0) + 1)
    nodeDegree.set(e.target, (nodeDegree.get(e.target) ?? 0) + 1)
  }

  const nodes = chain.nodes
    .filter((n) => visibleNodeIds.has(n.id))
    .map((n: ReasoningChainNode) => ({
      id: n.id,
      name: n.name,
      type: n.is_seed ? 'seed' : `hop_${n.hop_distance}`,
      degree: nodeDegree.get(n.id) ?? 0,
      communityId: n.hop_distance,
      color: colorForHop(n.hop_distance),
      // raw is typed as the dashboard's Node — the reasoning chain node
      // shape isn't compatible, but consumers only read `name` / `id`
      // off raw via tooltips. Cast to satisfy the structural type.
      raw: n as unknown as ForceGraphData['nodes'][number]['raw'],
    }))

  const links = visibleEdges.map((e: ReasoningChainEdge) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.predicate,
    weight: e.confidence,
    raw: e as unknown as ForceGraphData['links'][number]['raw'],
  }))

  const types = Array.from(new Set(nodes.map((n) => n.type))).sort()

  const hopsPresent = Array.from(
    new Set(nodes.map((n) => n.communityId as number))
  ).sort((a, b) => a - b)
  const communityIndex = hopsPresent.map((hop) => {
    const members = nodes.filter((n) => n.communityId === hop)
    return {
      id: hop,
      color: colorForHop(hop),
      size: members.length,
      topType: hop === 0 ? 'seed' : `hop ${hop}`,
      exemplars: members
        .slice()
        .sort((a, b) => b.degree - a.degree)
        .slice(0, 3)
        .map((n) => n.name),
    }
  })

  return {
    nodes,
    links,
    types,
    communityIndex,
    colorFor: (id: string) => nodes.find((n) => n.id === id)?.color ?? '#94a3b8',
  }
}

export function ReasoningGraphPanel({
  isOpen,
  onClose,
  chain,
  question,
}: ReasoningGraphPanelProps) {
  // Progressive reveal. We unroll hop groups one at a time so the user
  // visually watches Vrin's traversal expand outward from the seed
  // entities, instead of the whole graph appearing at once. This is the
  // "feels real-time" affordance — the data is fully available the
  // moment retrieval completes, but the reveal makes the reasoning path
  // legible.
  const [revealedHops, setRevealedHops] = React.useState(0)

  React.useEffect(() => {
    if (!isOpen || !chain) {
      setRevealedHops(0)
      return
    }
    setRevealedHops(0)
    const maxHop = chain.stats?.max_hop ?? 0
    if (maxHop === 0) return
    const intervalId = window.setInterval(() => {
      setRevealedHops((h) => {
        if (h >= maxHop) {
          window.clearInterval(intervalId)
          return h
        }
        return h + 1
      })
    }, 350)
    return () => window.clearInterval(intervalId)
  }, [isOpen, chain])

  const data = React.useMemo(() => {
    if (!chain) return null
    return transformChain(chain, revealedHops)
  }, [chain, revealedHops])

  const stats = chain?.stats
  const hasData = !!data && data.nodes.length > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Side panel — wider than SourcesPanel because the graph needs
              real estate. Mirrors SourcesPanel's spring transition so the
              two panels feel like siblings to the user. */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[680px] max-w-[95vw] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Reasoning chain
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {stats ? (
                    <>
                      {stats.total_nodes} entities · {stats.total_edges} facts ·{' '}
                      {stats.max_hop} {stats.max_hop === 1 ? 'hop' : 'hops'}
                      {stats.documents_traversed > 0 && (
                        <> · {stats.documents_traversed}{' '}
                          {stats.documents_traversed === 1 ? 'source' : 'sources'}
                        </>
                      )}
                      {stats.truncated && (
                        <span className="text-amber-600"> · truncated</span>
                      )}
                    </>
                  ) : (
                    'No reasoning data'
                  )}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Close reasoning graph"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Graph viewport */}
            <div className="flex-1 min-h-0 p-3">
              {hasData ? (
                <ForceGraph2DView
                  data={data!}
                  highlightId={null}
                  searchTerm=""
                  onNodeClick={() => {
                    /* future: open per-node fact list */
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  <div className="text-center">
                    <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No traversal to visualize</p>
                    <p className="text-xs mt-2 max-w-xs mx-auto">
                      Vrin returned this answer without multi-hop graph
                      traversal — usually means the answer came directly from
                      a single source.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer — hop legend + question recap */}
            {chain && chain.hop_groups.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700">
                  {chain.hop_groups.map((g) => (
                    <div key={g.hop} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colorForHop(g.hop) }}
                      />
                      <span>
                        {g.hop === 0 ? 'Seed' : `Hop ${g.hop}`} ({g.node_count})
                      </span>
                    </div>
                  ))}
                </div>
                {question && (
                  <p className="text-xs text-gray-500 mt-2 truncate flex items-center gap-1">
                    <Target className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{question}</span>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
