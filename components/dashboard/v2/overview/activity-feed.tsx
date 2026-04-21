"use client"

import * as React from "react"
import { Activity, Zap, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { useRealTimeUpdates } from "@/hooks/use-real-time-updates"
import type { GraphUpdate } from "@/types/knowledge-graph"

interface FeedEvent {
  id: string
  kind: "update" | "conflict"
  title: string
  detail?: string
  at: Date
}

function labelFor(update: GraphUpdate): { kind: FeedEvent["kind"]; title: string; detail?: string } {
  const t = update.type
  const isConflict = t === "conflict_detected" || t === "conflict_resolved"
  const raw = update.data as unknown
  const detail =
    raw && typeof raw === "object" && "name" in raw && typeof (raw as { name?: unknown }).name === "string"
      ? (raw as { name: string }).name
      : undefined
  return {
    kind: isConflict ? "conflict" : "update",
    title: humanize(t),
    detail,
  }
}

function humanize(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
}

export function ActivityFeed({ className }: { className?: string }) {
  const [events, setEvents] = React.useState<FeedEvent[]>([])

  useRealTimeUpdates({
    enabled: true,
    onUpdate: (u) => {
      const { kind, title, detail } = labelFor(u)
      const ev: FeedEvent = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind,
        title,
        detail,
        at: new Date(),
      }
      setEvents((prev) => [ev, ...prev].slice(0, 10))
    },
  })

  if (!events.length) {
    return (
      <div className={cn("rounded-xl border border-border/60 bg-surface-2/40 p-6 text-center", className)}>
        <Activity className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">All quiet</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time events (ingestions, conflicts, stats) will appear here as they happen.
        </p>
      </div>
    )
  }

  return (
    <ul className={cn("divide-y divide-border/60 rounded-xl border border-border/60 bg-surface-2/40 overflow-hidden", className)}>
      {events.map((ev) => {
        const Icon = ev.kind === "conflict" ? AlertCircle : Zap
        return (
          <li key={ev.id} className="flex items-start gap-3 px-4 py-3">
            <Icon className={cn("w-4 h-4 mt-0.5", ev.kind === "conflict" ? "text-amber-500" : "text-muted-foreground")} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{ev.title}</p>
              {ev.detail && <p className="text-xs text-muted-foreground truncate">{ev.detail}</p>}
            </div>
            <time className="text-[11px] text-muted-foreground tabular-nums">{formatRelative(ev.at)}</time>
          </li>
        )
      })}
    </ul>
  )
}

function formatRelative(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 5) return "just now"
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ago`
}
