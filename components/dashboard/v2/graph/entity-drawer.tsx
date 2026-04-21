"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, X } from "lucide-react"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ForceGraphData, ForceGraphNode } from "@/lib/utils/graph-transform"

interface Props {
  data: ForceGraphData
  node: ForceGraphNode | null
  onClose: () => void
  onJump: (nodeId: string) => void
}

interface Neighbour {
  node: ForceGraphNode
  label: string
  direction: "in" | "out"
}

export function EntityDrawer({ data, node, onClose, onJump }: Props) {
  const neighbours = React.useMemo<Neighbour[]>(() => {
    if (!node) return []
    const byId = new Map(data.nodes.map((n) => [n.id, n]))
    const out: Neighbour[] = []
    for (const link of data.links) {
      const s = typeof link.source === "string" ? link.source : (link.source as { id: string }).id
      const t = typeof link.target === "string" ? link.target : (link.target as { id: string }).id
      if (s === node.id) {
        const other = byId.get(t)
        if (other) out.push({ node: other, label: link.label, direction: "out" })
      } else if (t === node.id) {
        const other = byId.get(s)
        if (other) out.push({ node: other, label: link.label, direction: "in" })
      }
    }
    return out
  }, [node, data])

  const incoming = neighbours.filter((n) => n.direction === "in")
  const outgoing = neighbours.filter((n) => n.direction === "out")

  return (
    <Sheet open={!!node} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="p-0 w-full sm:max-w-[420px]">
        <SheetTitle className="sr-only">Entity detail</SheetTitle>
        {node && (
          <div className="flex flex-col h-full">
            <div className="px-5 py-4 border-b border-border/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="eyebrow text-[10px] text-muted-foreground">{node.type}</p>
                  <h2 className="text-lg font-semibold truncate">{node.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {node.degree} {node.degree === 1 ? "connection" : "connections"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-3"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 mx-auto" />
                </button>
              </div>
              <Link
                href={`/dashboard/knowledge/wiki/${encodeURIComponent(node.id)}`}
                className="mt-3 inline-flex items-center gap-1 text-xs text-foreground underline underline-offset-4 hover:opacity-80"
              >
                Open in wiki <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-5 py-4 space-y-6">
                {node.raw.description && (
                  <section>
                    <p className="eyebrow text-[10px] text-muted-foreground mb-1">Description</p>
                    <p className="text-sm leading-relaxed">{node.raw.description}</p>
                  </section>
                )}

                {outgoing.length > 0 && (
                  <NeighbourSection title="Outgoing" items={outgoing} onJump={onJump} />
                )}
                {incoming.length > 0 && <NeighbourSection title="Incoming" items={incoming} onJump={onJump} />}

                {node.raw.metadata && Object.keys(node.raw.metadata).length > 0 && (
                  <section>
                    <p className="eyebrow text-[10px] text-muted-foreground mb-1">Metadata</p>
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
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function NeighbourSection({
  title,
  items,
  onJump,
}: {
  title: string
  items: Neighbour[]
  onJump: (id: string) => void
}) {
  return (
    <section>
      <p className="eyebrow text-[10px] text-muted-foreground mb-1.5">
        {title} · {items.length}
      </p>
      <ul className="space-y-1">
        {items.slice(0, 40).map((n, i) => (
          <li key={`${n.direction}-${n.node.id}-${i}`}>
            <button
              onClick={() => onJump(n.node.id)}
              className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-3 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: n.node.color }} />
              <span className="text-xs truncate">{n.node.name}</span>
              <span className="ml-auto text-[10px] text-muted-foreground truncate max-w-[120px]">{n.label}</span>
            </button>
          </li>
        ))}
        {items.length > 40 && (
          <li className="text-[11px] text-muted-foreground px-2">+{items.length - 40} more</li>
        )}
      </ul>
    </section>
  )
}
