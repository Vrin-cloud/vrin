"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Network } from "lucide-react"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { ErrorState } from "@/components/dashboard/v2/primitives/error-state"
import { EmptyState } from "@/components/dashboard/v2/primitives/empty-state"
import { SectionHeader } from "@/components/dashboard/v2/primitives/section-header"
import { MiniGraph } from "@/components/dashboard/v2/wiki/mini-graph"
import { useEntity } from "@/hooks/use-entity"

export default function EntityDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const entityId = params?.id ? decodeURIComponent(params.id) : null

  const { node, incoming, outgoing, neighbourhood, graph, isLoading, error, refetch } = useEntity(entityId)

  if (isLoading) {
    return (
      <PageShell eyebrow="Entity" title="Loading…" description="Retrieving the entity detail.">
        <div className="h-48 rounded-xl border border-border/60 bg-surface-2/40 animate-pulse" />
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell eyebrow="Entity" title="Couldn't load entity">
        <ErrorState title="Entity not available" description={error.message} onRetry={refetch} />
      </PageShell>
    )
  }

  if (!node) {
    return (
      <PageShell eyebrow="Entity" title="Entity not found">
        <EmptyState
          icon={Network}
          title="This entity isn't in your graph"
          description="It may have been removed, or your graph response is truncated. Try the wiki search."
          action={{ label: "Back to wiki", href: "/dashboard/knowledge/wiki" }}
        />
      </PageShell>
    )
  }

  const metadataEntries = Object.entries(node.raw.metadata || {})
    .filter(([, v]) => v !== null && v !== undefined && typeof v !== "object")
    .slice(0, 20)

  return (
    <PageShell
      eyebrow={node.type}
      title={node.name}
      description={node.raw.description || `${node.degree} ${node.degree === 1 ? "relationship" : "relationships"} in your graph.`}
      actions={
        <>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm hover:bg-surface-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <Link
            href="/dashboard/knowledge"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-foreground text-background text-sm hover:opacity-90"
          >
            Open in graph <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-border/60 bg-surface-2/40">
            <SectionHeader title="Relationships" description={`${outgoing.length + incoming.length} total`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RelationshipList title="Outgoing" items={outgoing} />
              <RelationshipList title="Incoming" items={incoming} />
            </div>
          </div>

          {metadataEntries.length > 0 && (
            <div className="p-5 rounded-xl border border-border/60 bg-surface-2/40">
              <SectionHeader title="Properties" />
              <dl className="grid grid-cols-3 gap-y-2 text-sm">
                {metadataEntries.map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt className="text-muted-foreground text-xs truncate">{k}</dt>
                    <dd className="col-span-2 truncate">{String(v)}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Richer entity data (descriptions, source citations) will land once the backend exposes a dedicated{" "}
            <code className="font-mono text-[11px] bg-surface-3 px-1 py-0.5 rounded">/entity/:id</code> endpoint.
          </p>
        </section>

        <aside className="space-y-3">
          <SectionHeader title="Neighbourhood" description="1-hop subgraph around this entity." />
          <div className="rounded-xl border border-border/60 bg-surface-2/40 p-2">
            <MiniGraph
              data={neighbourhood.nodes.length ? neighbourhood : graph}
              focusId={node.id}
              onNodeClick={(n) => router.push(`/dashboard/knowledge/wiki/${encodeURIComponent(n.id)}`)}
            />
          </div>
        </aside>
      </div>
    </PageShell>
  )
}

function RelationshipList({
  title,
  items,
}: {
  title: string
  items: Array<{ other: { id: string; name: string; color: string; type: string }; label: string }>
}) {
  if (!items.length) {
    return (
      <div>
        <p className="eyebrow text-[10px] text-muted-foreground mb-2">{title}</p>
        <p className="text-xs text-muted-foreground italic">None</p>
      </div>
    )
  }
  return (
    <div>
      <p className="eyebrow text-[10px] text-muted-foreground mb-2">
        {title} · {items.length}
      </p>
      <ul className="space-y-1">
        {items.slice(0, 50).map((it, i) => (
          <li key={`${it.other.id}-${i}`}>
            <Link
              href={`/dashboard/knowledge/wiki/${encodeURIComponent(it.other.id)}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-3 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: it.other.color }} />
              <span className="text-sm truncate">{it.other.name}</span>
              <span className="ml-auto text-[10px] text-muted-foreground truncate max-w-[140px]">{it.label}</span>
            </Link>
          </li>
        ))}
        {items.length > 50 && <li className="text-[11px] text-muted-foreground px-2">+{items.length - 50} more</li>}
      </ul>
    </div>
  )
}
