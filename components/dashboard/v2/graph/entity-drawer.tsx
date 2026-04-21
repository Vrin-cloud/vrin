"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, X, ArrowRight, ArrowLeft, Network } from "lucide-react"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ForceGraphData, ForceGraphNode } from "@/lib/utils/graph-transform"

interface Props {
  data: ForceGraphData
  node: ForceGraphNode | null
  onClose: () => void
  /** Kept for backward compat but no longer used — the drawer is a peek;
      the wiki detail page is the place to navigate through relationships. */
  onJump?: (nodeId: string) => void
}

/**
 * Quick-peek drawer shown when a user clicks a node in the 2D / 3D graph.
 * Intentionally minimal: summary stats + metadata + jump-to-wiki. The full
 * relationship browse experience lives on /dashboard/knowledge/wiki/[id].
 */
export function EntityDrawer({ data, node, onClose }: Props) {
  const counts = React.useMemo(() => {
    if (!node) return { inbound: 0, outbound: 0 }
    let inbound = 0
    let outbound = 0
    for (const link of data.links) {
      const s = typeof link.source === "string" ? link.source : (link.source as { id: string }).id
      const t = typeof link.target === "string" ? link.target : (link.target as { id: string }).id
      if (s === node.id) outbound += 1
      else if (t === node.id) inbound += 1
    }
    return { inbound, outbound }
  }, [node, data.links])

  // Community label: prefer the dominant type within the cluster since users
  // understand "Paper cluster" / "Person cluster" better than "Group 3".
  const community = React.useMemo(() => {
    if (!node || node.communityId === null || node.communityId === undefined) return null
    return data.communityIndex.find((c) => c.id === node.communityId) || null
  }, [node, data.communityIndex])

  return (
    <Sheet open={!!node} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="p-0 w-full sm:max-w-[380px]">
        <SheetTitle className="sr-only">Entity detail</SheetTitle>
        {node && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="eyebrow text-[10px] text-muted-foreground capitalize">{node.type}</p>
                  <h2 className="text-base font-semibold leading-snug break-words">{node.name}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-3 flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-5 py-4 space-y-5">
                {/* Quick stats */}
                <section className="grid grid-cols-2 gap-2">
                  <Stat
                    icon={<ArrowLeft className="w-3.5 h-3.5" />}
                    label="Incoming"
                    value={counts.inbound}
                  />
                  <Stat
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    label="Outgoing"
                    value={counts.outbound}
                  />
                </section>

                {/* Community */}
                {community && (
                  <section>
                    <p className="eyebrow text-[10px] text-muted-foreground mb-1.5">Cluster</p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border/60">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: community.color }}
                      />
                      <span className="text-sm capitalize flex-1">
                        {community.topType || `Community ${community.id}`}
                      </span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {community.size} members
                      </span>
                    </div>
                  </section>
                )}

                {/* Description — only when it's actually present */}
                {node.raw.description && (
                  <section>
                    <p className="eyebrow text-[10px] text-muted-foreground mb-1">Description</p>
                    <p className="text-sm leading-relaxed">{node.raw.description}</p>
                  </section>
                )}

                {/* Metadata (other properties) */}
                {node.raw.metadata && Object.keys(node.raw.metadata).length > 0 && (
                  <section>
                    <p className="eyebrow text-[10px] text-muted-foreground mb-1.5">Metadata</p>
                    <dl className="grid grid-cols-3 gap-y-1.5 text-xs">
                      {Object.entries(node.raw.metadata)
                        .filter(([, v]) => v !== null && v !== undefined && typeof v !== "object")
                        .slice(0, 8)
                        .map(([k, v]) => (
                          <React.Fragment key={k}>
                            <dt className="text-muted-foreground truncate">{k}</dt>
                            <dd className="col-span-2 truncate">{String(v)}</dd>
                          </React.Fragment>
                        ))}
                    </dl>
                  </section>
                )}
              </div>
            </ScrollArea>

            {/* Sticky footer CTA — the "drill down" entry point */}
            <div className="px-5 py-3 border-t border-border/60 bg-surface">
              <Link
                href={`/dashboard/knowledge/wiki/${encodeURIComponent(node.id)}`}
                className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90"
              >
                Open in wiki <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <p className="mt-2 text-[11px] text-center text-muted-foreground">
                See full relationships and source citations
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 rounded-md border border-border/60">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-display text-xl leading-none tracking-heading mono-num">
        {value}
      </span>
    </div>
  )
}
