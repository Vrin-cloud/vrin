"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { ForceGraphData } from "@/lib/utils/graph-transform"

interface Props {
  data: ForceGraphData
  className?: string
}

export function GraphLegend({ data, className }: Props) {
  const top = data.communityIndex.slice(0, 8)
  if (!top.length) return null
  return (
    <div
      className={cn(
        "absolute bottom-3 right-3 max-w-[240px] rounded-lg border border-border/60 bg-surface-2/95 backdrop-blur p-3 shadow-sm",
        className
      )}
    >
      <p className="eyebrow text-[10px] text-muted-foreground mb-2">Clusters</p>
      <ul className="space-y-1.5">
        {top.map((c) => (
          <li key={c.id} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="flex-1 truncate capitalize">{c.topType || `Group ${c.id}`}</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">{c.size}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
