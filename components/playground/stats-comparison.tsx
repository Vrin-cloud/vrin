"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Loader2, Network, FileText, Shield, Clock } from "lucide-react"
import type { QueryResult, QueryState } from "@/app/playground/page"
import type { DemoQuery } from "@/lib/playground/demo-data"

interface StatsComparisonProps {
  ragResult: QueryResult | null
  vrinResult: QueryResult | null
  ragState: QueryState
  vrinState: QueryState
  selectedQuery: DemoQuery | null
}

function StatCard({
  label,
  ragValue,
  vrinValue,
  ragLoading,
  vrinLoading,
  highlight,
}: {
  label: string
  ragValue: string
  vrinValue: string
  ragLoading: boolean
  vrinLoading: boolean
  highlight?: "vrin" | "rag" | "none"
}) {
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-white/[0.02]">
      <span className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-medium">
        {label}
      </span>
      <div className="flex items-center gap-4 text-sm">
        {/* RAG value */}
        <div className="text-center min-w-[60px]">
          {ragLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-white/30" />
          ) : (
            <span className={highlight === "rag" ? "text-red-400 font-semibold" : "text-white/50"}>
              {ragValue}
            </span>
          )}
        </div>

        <span className="text-white/10">vs</span>

        {/* Vrin value */}
        <div className="text-center min-w-[60px]">
          {vrinLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-white/30" />
          ) : (
            <span className={highlight === "vrin" ? "text-[#8DAA9D] font-semibold" : "text-white/50"}>
              {vrinValue}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function StatsComparison({
  ragResult,
  vrinResult,
  ragState,
  vrinState,
  selectedQuery,
}: StatsComparisonProps) {
  const ragLoading = ragState === "loading"
  const vrinLoading = vrinState === "loading"

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      {/* Label row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 uppercase tracking-wider font-medium">
            Comparison
          </span>
        </div>
        <div className="flex items-center gap-6 text-[10px] text-white/30">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400/60" /> Standard RAG
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#8DAA9D]" /> Vrin
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Facts Connected"
          ragValue={ragResult ? String(ragResult.totalFacts) : "--"}
          vrinValue={vrinResult ? String(vrinResult.totalFacts) : "--"}
          ragLoading={ragLoading}
          vrinLoading={vrinLoading}
          highlight={
            ragResult && vrinResult
              ? vrinResult.totalFacts > ragResult.totalFacts
                ? "vrin"
                : "none"
              : "none"
          }
        />
        <StatCard
          label="Chunks Retrieved"
          ragValue={ragResult ? String(ragResult.totalChunks) : "--"}
          vrinValue={vrinResult ? String(vrinResult.totalChunks) : "--"}
          ragLoading={ragLoading}
          vrinLoading={vrinLoading}
        />
        <StatCard
          label="Docs Connected"
          ragValue="0"
          vrinValue={
            vrinResult
              ? `${new Set(vrinResult.facts.map(f => f.source_document).filter(Boolean)).size || "multiple"}`
              : "--"
          }
          ragLoading={ragLoading}
          vrinLoading={vrinLoading}
          highlight="vrin"
        />
        <StatCard
          label="Response Time"
          ragValue={ragResult?.searchTime || "--"}
          vrinValue={vrinResult?.searchTime || "--"}
          ragLoading={ragLoading}
          vrinLoading={vrinLoading}
        />
      </div>

      {/* Why RAG fails callout */}
      {selectedQuery && (ragState === "done" || vrinState === "done") && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10"
        >
          <p className="text-xs text-red-400/70 leading-relaxed">
            <span className="font-semibold text-red-400">Why vector search fails here: </span>
            {selectedQuery.whyRagFails}
          </p>
        </motion.div>
      )}
    </div>
  )
}
