"use client"

import * as React from "react"
import { Network } from "lucide-react"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { EmptyState } from "@/components/dashboard/v2/primitives/empty-state"
import { ErrorState } from "@/components/dashboard/v2/primitives/error-state"
import { GraphSkeleton } from "@/components/dashboard/v2/graph/graph-skeleton"
import { GraphControls, type GraphViewMode } from "@/components/dashboard/v2/graph/graph-controls"
import { ForceGraph3DView } from "@/components/dashboard/v2/graph/force-graph-3d"
import { ForceGraph2DView } from "@/components/dashboard/v2/graph/force-graph-2d"
import { EntityDrawer } from "@/components/dashboard/v2/graph/entity-drawer"
import { GraphLegend } from "@/components/dashboard/v2/graph/legend"
import { useAccountKnowledgeGraph } from "@/hooks/use-knowledge-graph"
import { toForceGraphData, type ForceGraphNode } from "@/lib/utils/graph-transform"
import { STORAGE_KEYS, storage } from "@/lib/storage-keys"

export default function KnowledgeGraphPage() {
  const { data: response, isLoading, error, refetch } = useAccountKnowledgeGraph({ limit: 2000 })

  const [mode, setMode] = React.useState<GraphViewMode>("3d")
  const [hydrated, setHydrated] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [activeTypes, setActiveTypes] = React.useState<Set<string>>(new Set())
  const [selected, setSelected] = React.useState<ForceGraphNode | null>(null)

  // Load persisted view mode once on mount.
  React.useEffect(() => {
    const v = storage.get(STORAGE_KEYS.VRIN_GRAPH_VIEW_MODE)
    if (v === "2d" || v === "3d") setMode(v)
    setHydrated(true)
  }, [])

  const setModePersisted = React.useCallback((m: GraphViewMode) => {
    setMode(m)
    storage.set(STORAGE_KEYS.VRIN_GRAPH_VIEW_MODE, m)
  }, [])

  const nodes = response?.data?.nodes || []
  const edges = response?.data?.edges || []

  const graphData = React.useMemo(() => toForceGraphData(nodes, edges), [nodes, edges])

  // Once types are known, initialize all as active.
  React.useEffect(() => {
    if (!graphData.types.length) return
    setActiveTypes((prev) => (prev.size === 0 ? new Set(graphData.types) : prev))
  }, [graphData.types])

  const toggleType = React.useCallback((t: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }, [])

  // Apply filters to produce the dataset fed into the graph views.
  const filtered = React.useMemo(() => {
    if (activeTypes.size === 0 || activeTypes.size === graphData.types.length) return graphData
    const keep = new Set(graphData.nodes.filter((n) => activeTypes.has(n.type)).map((n) => n.id))
    return {
      ...graphData,
      nodes: graphData.nodes.filter((n) => keep.has(n.id)),
      links: graphData.links.filter((l) => {
        const s = typeof l.source === "string" ? l.source : (l.source as { id: string }).id
        const t = typeof l.target === "string" ? l.target : (l.target as { id: string }).id
        return keep.has(s) && keep.has(t)
      }),
    }
  }, [graphData, activeTypes])

  const handleJump = React.useCallback(
    (nodeId: string) => {
      const next = graphData.nodes.find((n) => n.id === nodeId) || null
      setSelected(next)
    },
    [graphData.nodes]
  )

  // Render body depending on state.
  let body: React.ReactNode
  if (isLoading || !hydrated) {
    body = <GraphSkeleton />
  } else if (error) {
    body = <ErrorState title="Couldn't load your graph" description={(error as Error).message} onRetry={() => refetch()} />
  } else if (!nodes.length) {
    body = (
      <EmptyState
        icon={Network}
        title="Your graph is empty"
        description="Upload a document or connect a source — entities and relationships will appear here."
        action={{ label: "Upload a document", href: "/dashboard/knowledge/uploads" }}
      />
    )
  } else {
    body =
      mode === "3d" ? (
        <ForceGraph3DView data={filtered} highlightId={selected?.id ?? null} searchTerm={search} onNodeClick={setSelected} />
      ) : (
        <ForceGraph2DView data={filtered} highlightId={selected?.id ?? null} searchTerm={search} onNodeClick={setSelected} />
      )
  }

  return (
    <PageShell
      eyebrow="Graph"
      title="Knowledge graph"
      description="3D and Obsidian-style 2D views over your entities and relationships."
      bleed
    >
      <div className="h-[calc(100vh-10rem)] min-h-[560px] flex flex-col gap-3 p-6 pt-4">
        <GraphControls
          mode={mode}
          onModeChange={setModePersisted}
          search={search}
          onSearchChange={setSearch}
          types={graphData.types}
          activeTypes={activeTypes}
          onToggleType={toggleType}
          stats={{ nodes: filtered.nodes.length, edges: filtered.links.length, clusters: graphData.communityIndex.length }}
        />

        <div className="flex-1 relative min-h-0">
          {body}
          {!isLoading && !!nodes.length && <GraphLegend data={graphData} />}
        </div>
      </div>

      <EntityDrawer data={graphData} node={selected} onClose={() => setSelected(null)} onJump={handleJump} />
    </PageShell>
  )
}
