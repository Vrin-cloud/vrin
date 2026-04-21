"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import type { ForceGraphData, ForceGraphNode } from "@/lib/utils/graph-transform"

// Dynamic import — Three.js touches window on import, so SSR must be off.
// The package is chunk-split so the overview/wiki pages don't pay for it.
// Typed as a loose component to sidestep react-force-graph's generic parameters;
// our accessors operate on ForceGraphNode at runtime which is superset-compatible.
const ForceGraph3D = dynamic(() => import("react-force-graph-3d").then((m) => m.default), {
  ssr: false,
  loading: () => null,
}) as unknown as React.ComponentType<Record<string, unknown> & { ref?: React.Ref<unknown> }>

interface Props {
  data: ForceGraphData
  highlightId: string | null
  searchTerm: string
  onNodeClick: (node: ForceGraphNode) => void
}

export function ForceGraph3DView({ data, highlightId, searchTerm, onNodeClick }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const graphRef = React.useRef<{
    zoomToFit?: (ms: number, padding?: number) => void
    controls?: () => { minDistance?: number; maxDistance?: number }
  } | null>(null)
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const [hovered, setHovered] = React.useState<ForceGraphNode | null>(null)
  const hoverXYRef = React.useRef<{ x: number; y: number } | null>(null)
  const [, forceTooltipTick] = React.useState(0)

  // Track container size — react-force-graph needs explicit width/height.
  React.useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const ro = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight })
    })
    ro.observe(el)
    setSize({ width: el.clientWidth, height: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Track pointer position for the DOM tooltip (we use a DOM overlay instead
  // of Three.js text sprites — cheaper and always crisp).
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      hoverXYRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (hovered) forceTooltipTick((t) => t + 1)
    }
    el.addEventListener("pointermove", onMove)
    return () => el.removeEventListener("pointermove", onMove)
  }, [hovered])

  // After initial layout, fit camera to the graph ONCE per dataset. Do not
  // re-fit on every engine stop — the simulation re-cools whenever a node
  // is hovered/dragged, and re-fitting there jumps the camera away from
  // what the user is looking at.
  //
  // Padding controls default zoom: higher padding = more empty space around
  // the graph bounds = camera sits farther back. 140 lands the graph
  // comfortably in the viewport without filling it edge-to-edge.
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        graphRef.current?.zoomToFit?.(500, 180)
      } catch {
        // fg not ready yet — harmless.
      }
    }, 1200)
    return () => clearTimeout(t)
  }, [data.nodes.length])

  // Constrain how far the user can zoom in / out. Without this, it's easy
  // to end up inside a node or spiralling into infinite space. Limits are
  // applied on the OrbitControls exposed by react-force-graph-3d.
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        const controls = graphRef.current?.controls?.() as
          | { minDistance?: number; maxDistance?: number }
          | undefined
        if (controls) {
          controls.minDistance = 80
          controls.maxDistance = 3000
        }
      } catch {
        // ignore — controls not ready yet
      }
    }, 500)
    return () => clearTimeout(t)
  }, [])

  const matchesSearch = React.useCallback(
    (n: ForceGraphNode) => {
      if (!searchTerm) return true
      return n.name.toLowerCase().includes(searchTerm.toLowerCase())
    },
    [searchTerm]
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-xl border border-border/60 overflow-hidden"
      style={{ background: "#0a0a0c" }}
    >
      {size.width > 0 && size.height > 0 && (
        <ForceGraph3D
          ref={graphRef as unknown as React.Ref<unknown>}
          graphData={data}
          width={size.width}
          height={size.height}
          backgroundColor="#0a0a0c"
          showNavInfo={false}
          nodeRelSize={4}
          nodeVal={(n: ForceGraphNode) => Math.log2((n.degree || 0) + 1) + 1}
          nodeColor={(n: ForceGraphNode) => {
            if (highlightId && n.id === highlightId) return "#ffffff"
            if (!matchesSearch(n)) return "#3a3a3d"
            return n.color
          }}
          nodeOpacity={0.92}
          linkColor={() => "rgba(255, 255, 255, 0.12)"}
          linkOpacity={0.4}
          linkWidth={(l: { weight?: number }) => Math.min(l.weight ?? 1, 3) * 0.4}
          enableNodeDrag={false}
          warmupTicks={40}
          cooldownTicks={120}
          onNodeHover={(n: ForceGraphNode | null) => {
            setHovered(n)
            if (containerRef.current) containerRef.current.style.cursor = n ? "pointer" : "grab"
          }}
          onBackgroundClick={() => {
            setHovered(null)
          }}
          onNodeClick={(n: ForceGraphNode) => onNodeClick(n)}
        />
      )}

      {hovered && hoverXYRef.current && (
        <div
          className="pointer-events-none absolute z-10 px-2.5 py-1.5 rounded-md text-xs bg-black/80 text-white border border-white/10 backdrop-blur"
          style={{ left: hoverXYRef.current.x + 12, top: hoverXYRef.current.y + 12 }}
        >
          <div className="font-medium">{hovered.name}</div>
          <div className="text-[10px] text-white/60">
            {hovered.type} · {hovered.degree} {hovered.degree === 1 ? "link" : "links"}
          </div>
        </div>
      )}
    </div>
  )
}
