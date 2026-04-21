"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ForceGraphNode } from "@/lib/utils/graph-transform"

type SortKey = "name" | "type" | "degree"
interface SortState {
  key: SortKey
  dir: "asc" | "desc"
}

interface Props {
  entities: ForceGraphNode[]
  className?: string
}

const PAGE_SIZE = 50

export function EntityTable({ entities, className }: Props) {
  const [sort, setSort] = React.useState<SortState>({ key: "degree", dir: "desc" })
  const [page, setPage] = React.useState(0)

  // Reset pagination when filters change (entities reference changes).
  React.useEffect(() => {
    setPage(0)
  }, [entities])

  const sorted = React.useMemo(() => {
    const copy = [...entities]
    copy.sort((a, b) => {
      const av = a[sort.key] as string | number
      const bv = b[sort.key] as string | number
      if (typeof av === "number" && typeof bv === "number") return av - bv
      return String(av).localeCompare(String(bv))
    })
    if (sort.dir === "desc") copy.reverse()
    return copy
  }, [entities, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageRows = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key: SortKey) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "degree" ? "desc" : "asc" }))

  return (
    <div className={cn("rounded-xl border border-border/60 bg-surface-2/40 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-3/40 text-xs text-muted-foreground">
            <tr>
              <SortHeader label="Name" keyId="name" sort={sort} onClick={toggleSort} className="w-[45%]" />
              <SortHeader label="Type" keyId="type" sort={sort} onClick={toggleSort} />
              <SortHeader label="Connections" keyId="degree" sort={sort} onClick={toggleSort} align="right" />
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pageRows.map((n) => (
              <tr key={n.id} className="hover:bg-surface-3/40 transition-colors">
                <td className="px-4 py-2.5">
                  <Link
                    href={`/dashboard/knowledge/wiki/${encodeURIComponent(n.id)}`}
                    className="flex items-center gap-2 min-w-0"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: n.color }} />
                    <span className="truncate text-foreground">{n.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center h-5 px-1.5 rounded text-[11px] bg-surface-3 text-muted-foreground capitalize">
                    {n.type}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">{n.degree}</td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/dashboard/knowledge/wiki/${encodeURIComponent(n.id)}`}
                    className="inline-flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={`Open ${n.name}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No entities match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/60 text-xs text-muted-foreground">
          <span>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-7 px-2 rounded-md border border-border hover:bg-surface-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="tabular-nums px-2">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="h-7 px-2 rounded-md border border-border hover:bg-surface-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SortHeader({
  label,
  keyId,
  sort,
  onClick,
  align = "left",
  className,
}: {
  label: string
  keyId: SortKey
  sort: SortState
  onClick: (k: SortKey) => void
  align?: "left" | "right"
  className?: string
}) {
  const active = sort.key === keyId
  const Arrow = sort.dir === "asc" ? ArrowUp : ArrowDown
  return (
    <th
      className={cn("px-4 py-2 font-medium select-none text-left", align === "right" && "text-right", className)}
    >
      <button
        onClick={() => onClick(keyId)}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wider text-[10px]",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span>{label}</span>
        {active && <Arrow className="w-3 h-3" />}
      </button>
    </th>
  )
}
