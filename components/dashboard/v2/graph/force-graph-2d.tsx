"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import type { ForceGraphData, ForceGraphNode, ForceGraphLink } from "@/lib/utils/graph-transform"

const ForceGraph2D = dynamic(() => import("react-force-graph-2d").then((m) => m.default), {
  ssr: false,
  loading: () => null,
}) as unknown as React.ComponentType<Record<string, unknown> & { ref?: React.Ref<unknown> }>

interface Props {
  data: ForceGraphData
  highlightId: string | null
  searchTerm: string
  onNodeClick: (node: ForceGraphNode) => void
}

export function ForceGraph2DView({ data, highlightId, searchTerm, onNodeClick }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const graphRef = React.useRef<any>(null)
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const [hovered, setHovered] = React.useState<ForceGraphNode | null>(null)

  React.useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const ro = new ResizeObserver(() => setSize({ width: el.clientWidth, height: el.clientHeight }))
    ro.observe(el)
    setSize({ width: el.clientWidth, height: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Neighbour set for hover fade — Obsidian-style.
  const neighbours = React.useMemo(() => {
    if (!hovered) return new Set<string>()
    const set = new Set<string>([hovered.id])
    for (const l of data.links) {
      const s = typeof l.source === "string" ? l.source : (l.source as { id: string }).id
      const t = typeof l.target === "string" ? l.target : (l.target as { id: string }).id
      if (s === hovered.id) set.add(t)
      if (t === hovered.id) set.add(s)
    }
    return set
  }, [hovered, data.links])

  const matchesSearch = React.useCallback(
    (n: ForceGraphNode) => !searchTerm || n.name.toLowerCase().includes(searchTerm.toLowerCase()),
    [searchTerm]
  )

  return (
    <div ref={containerRef} className="relative w-full h-full rounded-xl border border-border/60 bg-surface overflow-hidden">
      {size.width > 0 && size.height > 0 && (
        <ForceGraph2D
          ref={graphRef as unknown as React.MutableRefObject<unknown>}
          graphData={data}
          width={size.width}
          height={size.height}
          nodeRelSize={4}
          backgroundColor="transparent"
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          cooldownTicks={160}
          enableNodeDrag
          onNodeClick={(n: ForceGraphNode) => onNodeClick(n)}
          onNodeHover={(n: ForceGraphNode | null) => setHovered(n)}
          onBackgroundClick={() => setHovered(null)}
          linkColor={(l: ForceGraphLink) => {
            if (!hovered) return "rgba(141,170,157,0.3)"
            const s = typeof l.source === "string" ? l.source : (l.source as { id: string }).id
            const t = typeof l.target === "string" ? l.target : (l.target as { id: string }).id
            return s === hovered.id || t === hovered.id ? "rgba(32,30,30,0.45)" : "rgba(141,170,157,0.08)"
          }}
          linkWidth={(l: ForceGraphLink) => {
            if (!hovered) return 0.6
            const s = typeof l.source === "string" ? l.source : (l.source as { id: string }).id
            const t = typeof l.target === "string" ? l.target : (l.target as { id: string }).id
            return s === hovered.id || t === hovered.id ? 1.4 : 0.3
          }}
          nodeCanvasObject={(node: ForceGraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const n = node as ForceGraphNode & { x?: number; y?: number }
            if (n.x == null || n.y == null) return

            const isHovered = hovered?.id === n.id
            const isNeighbour = hovered ? neighbours.has(n.id) : true
            const isMatch = matchesSearch(n)
            const isHighlighted = highlightId === n.id

            const baseAlpha = isHovered || isHighlighted ? 1 : isNeighbour && isMatch ? 0.9 : 0.15
            const radius = Math.max(2.2, Math.sqrt(n.degree + 1) * 2.2) + (isHovered ? 1 : 0)

            ctx.globalAlpha = baseAlpha
            ctx.beginPath()
            ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI, false)
            ctx.fillStyle = isHighlighted ? "#201E1E" : n.color
            ctx.fill()

            // Label — Obsidian shows at zoom > ~0.8, fades as you zoom out.
            if (globalScale > 0.8 && (isHovered || isHighlighted || globalScale > 1.6)) {
              const label = n.name.length > 30 ? `${n.name.slice(0, 30)}…` : n.name
              const fontSize = Math.max(9, 10 / globalScale)
              ctx.font = `${fontSize}px var(--font-geist-sans), system-ui, sans-serif`
              ctx.textAlign = "center"
              ctx.textBaseline = "top"
              ctx.fillStyle = isHovered ? "#201E1E" : "rgba(32,30,30,0.75)"
              ctx.fillText(label, n.x, n.y + radius + 2)
            }

            ctx.globalAlpha = 1
          }}
          nodePointerAreaPaint={(node: ForceGraphNode, color: string, ctx: CanvasRenderingContext2D) => {
            const n = node as ForceGraphNode & { x?: number; y?: number }
            if (n.x == null || n.y == null) return
            const radius = Math.max(4, Math.sqrt(n.degree + 1) * 2.8)
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI, false)
            ctx.fill()
          }}
        />
      )}
    </div>
  )
}
