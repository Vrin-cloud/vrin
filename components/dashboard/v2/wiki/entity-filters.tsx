"use client"

import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface Props {
  search: string
  onSearchChange: (v: string) => void
  types: string[]
  activeTypes: Set<string>
  onToggleType: (t: string) => void
  minDegree: number
  onMinDegreeChange: (n: number) => void
  className?: string
}

export function EntityFilters({
  search,
  onSearchChange,
  types,
  activeTypes,
  onToggleType,
  minDegree,
  onMinDegreeChange,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-surface-2/60 px-3 py-2",
        className
      )}
    >
      <div className="relative flex-1 min-w-[200px] max-w-[360px]">
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

      <div className="flex items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">Min links</span>
        <input
          type="range"
          min={0}
          max={20}
          value={minDegree}
          onChange={(e) => onMinDegreeChange(Number(e.target.value))}
          className="w-24"
        />
        <span className="tabular-nums w-5 text-right text-foreground font-medium">{minDegree}</span>
      </div>

      {types.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap ml-auto">
          {types.map((t) => {
            const active = activeTypes.has(t)
            return (
              <button
                key={t}
                onClick={() => onToggleType(t)}
                className={cn(
                  "inline-flex items-center h-7 px-2 rounded-md text-[11px] font-medium capitalize transition-colors",
                  active ? "bg-foreground text-background" : "bg-surface-3 text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
