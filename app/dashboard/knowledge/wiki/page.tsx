"use client"

import * as React from "react"
import { BookOpen } from "lucide-react"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { EmptyState } from "@/components/dashboard/v2/primitives/empty-state"
import { ErrorState } from "@/components/dashboard/v2/primitives/error-state"
import { EntityTable } from "@/components/dashboard/v2/wiki/entity-table"
import { EntityFilters } from "@/components/dashboard/v2/wiki/entity-filters"
import { useEntityList } from "@/hooks/use-entity-list"

export default function KnowledgeWikiPage() {
  const [search, setSearch] = React.useState("")
  const [activeTypes, setActiveTypes] = React.useState<Set<string>>(new Set())
  const [minDegree, setMinDegree] = React.useState(0)

  const state = useEntityList({ search, types: activeTypes, minDegree })

  // Seed "all types selected" once types are known.
  React.useEffect(() => {
    if (!state.allTypes.length) return
    setActiveTypes((prev) => (prev.size === 0 ? new Set(state.allTypes) : prev))
  }, [state.allTypes])

  const toggleType = React.useCallback((t: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }, [])

  return (
    <PageShell
      eyebrow="Browse"
      title="Wiki"
      description="Every entity in your knowledge graph, searchable and sortable."
    >
      <div className="space-y-4">
        {state.isLoading ? (
          <div className="h-48 rounded-xl border border-border/60 bg-surface-2/40 animate-pulse" />
        ) : state.error ? (
          <ErrorState title="Couldn't load entities" description={state.error.message} onRetry={state.refetch} />
        ) : state.graph.nodes.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No entities yet"
            description="Upload documents or connect a data source — entities will populate this wiki automatically."
            action={{ label: "Upload a document", href: "/dashboard/knowledge/uploads" }}
          />
        ) : (
          <>
            <EntityFilters
              search={search}
              onSearchChange={setSearch}
              types={state.allTypes}
              activeTypes={activeTypes}
              onToggleType={toggleType}
              minDegree={minDegree}
              onMinDegreeChange={setMinDegree}
            />
            <EntityTable entities={state.filtered} />
          </>
        )}
      </div>
    </PageShell>
  )
}
