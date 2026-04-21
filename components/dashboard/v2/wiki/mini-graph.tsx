"use client"

import * as React from "react"
import { ForceGraph2DView } from "@/components/dashboard/v2/graph/force-graph-2d"
import type { ForceGraphData, ForceGraphNode } from "@/lib/utils/graph-transform"

interface Props {
  data: ForceGraphData
  focusId: string | null
  onNodeClick: (node: ForceGraphNode) => void
  className?: string
}

export function MiniGraph({ data, focusId, onNodeClick, className }: Props) {
  return (
    <div className={className} style={{ height: 320 }}>
      <ForceGraph2DView data={data} highlightId={focusId} searchTerm="" onNodeClick={onNodeClick} />
    </div>
  )
}
