"use client"

import * as React from "react"
import { Boxes, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type GraphViewMode = "3d" | "2d"

interface Props {
  mode: GraphViewMode
  onModeChange: (m: GraphViewMode) => void
  search: string
  onSearchChange: (v: string) => void
  types: string[]
  activeTypes: Set<string>
  onToggleType: (t: string) => void
  className?: string
  stats?: { nodes: number; edges: number; clusters: number }
}

export function GraphControls({
  mode,
  onModeChange,
  search,
  onSearchChange,
  types,
  activeTypes,
  onToggleType,
  className,
  stats,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-surface-2/70 backdrop-blur px-3 py-2",
        className
      )}
    >
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(v) => v && onModeChange(v as GraphViewMode)}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="3d" aria-label="3D view" className="gap-1.5">
          <Boxes className="w-3.5 h-3.5" />
          3D
        </ToggleGroupItem>
        <ToggleGroupItem value="2d" aria-label="2D view" className="gap-1.5">
          2D
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

      <div className="relative flex-1 min-w-[180px] max-w-[320px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search entities…"
          className="w-full h-9 pl-8 pr-8 rounded-md border border-border/80 bg-background text-sm outline-none focus:border-foreground/40"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {types.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {types.map((t) => {
            const active = activeTypes.has(t)
            return (
              <button
                key={t}
                onClick={() => onToggleType(t)}
                className={cn(
                  "inline-flex items-center h-7 px-2 rounded-md text-[11px] font-medium transition-colors capitalize",
                  active
                    ? "bg-foreground text-background"
                    : "bg-surface-3 text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            )
          })}
        </div>
      )}

      {stats && (
        <div className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground tabular-nums">
          <span>
            <span className="text-foreground font-medium">{stats.nodes}</span> nodes
          </span>
          <span>
            <span className="text-foreground font-medium">{stats.edges}</span> links
          </span>
          <span>
            <span className="text-foreground font-medium">{stats.clusters}</span> clusters
          </span>
        </div>
      )}
    </div>
  )
}
