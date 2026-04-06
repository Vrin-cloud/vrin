"use client"

import { motion } from "framer-motion"
import { Search, ArrowRight, FileText, GitBranch, Network, ChevronRight } from "lucide-react"
import type { DemoQuery } from "@/lib/playground/demo-data"

interface ReasoningPathProps {
  selectedQuery: DemoQuery
}

export function ReasoningPath({ selectedQuery }: ReasoningPathProps) {
  const chain = selectedQuery.documentChain

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white/80">How each system found its answer</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        {/* RAG Path */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-medium text-red-400/80">Standard RAG</span>
          </div>

          {/* Flat retrieval */}
          <div className="flex items-center gap-2 mb-4">
            <div className="px-2.5 py-1.5 rounded-md bg-red-400/10 border border-red-400/15 text-[11px] text-red-400/80 font-medium">
              Query
            </div>
            <ArrowRight className="w-3 h-3 text-white/15" />
            <div className="px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/8 text-[11px] text-white/40">
              Embed
            </div>
            <ArrowRight className="w-3 h-3 text-white/15" />
            <div className="px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/8 text-[11px] text-white/40">
              Similarity Search
            </div>
          </div>

          {/* Disconnected chunks */}
          <div className="space-y-1.5 ml-1">
            {chain.slice(0, 3).map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <FileText className="w-3 h-3 text-white/15" />
                <span className="text-[11px] text-white/25 truncate">{doc}</span>
                {i === 0 && (
                  <span className="text-[9px] text-red-400/40 ml-auto whitespace-nowrap">best match</span>
                )}
              </motion.div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-white/15 italic ml-5">
                ...remaining {Math.max(chain.length - 3, 0)} documents not retrieved (below similarity threshold)
              </span>
            </div>
          </div>

          {/* No connections indicator */}
          <div className="mt-4 px-3 py-2 rounded-lg bg-red-400/5 border border-red-400/10">
            <p className="text-[10px] text-red-400/50">
              No connections between chunks. Each retrieved independently by cosine similarity.
            </p>
          </div>
        </div>

        {/* Vrin Path */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-3.5 h-3.5 text-[#8DAA9D]" />
            <span className="text-xs font-medium text-[#8DAA9D]/80">Vrin Knowledge Graph</span>
          </div>

          {/* Graph traversal pipeline */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="px-2.5 py-1.5 rounded-md bg-[#8DAA9D]/10 border border-[#8DAA9D]/15 text-[11px] text-[#8DAA9D]/80 font-medium">
              Query
            </div>
            <ArrowRight className="w-3 h-3 text-white/15" />
            <div className="px-2.5 py-1.5 rounded-md bg-[#8DAA9D]/5 border border-[#8DAA9D]/10 text-[11px] text-[#8DAA9D]/60">
              Extract Entities
            </div>
            <ArrowRight className="w-3 h-3 text-white/15" />
            <div className="px-2.5 py-1.5 rounded-md bg-[#8DAA9D]/5 border border-[#8DAA9D]/10 text-[11px] text-[#8DAA9D]/60">
              Traverse Graph
            </div>
            <ArrowRight className="w-3 h-3 text-white/15" />
            <div className="px-2.5 py-1.5 rounded-md bg-[#8DAA9D]/5 border border-[#8DAA9D]/10 text-[11px] text-[#8DAA9D]/60">
              Reason
            </div>
          </div>

          {/* Connected document chain */}
          <div className="space-y-0 ml-1">
            {chain.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.12 }}
              >
                <div className="flex items-center gap-2">
                  <GitBranch className="w-3 h-3 text-[#8DAA9D]/50" />
                  <span className="text-[11px] text-[#8DAA9D]/70 font-medium truncate">{doc}</span>
                  <span className="text-[9px] text-[#8DAA9D]/30 ml-auto whitespace-nowrap">hop {i + 1}</span>
                </div>
                {i < chain.length - 1 && (
                  <div className="ml-1.5 border-l border-dashed border-[#8DAA9D]/15 h-3" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Connected indicator */}
          <div className="mt-4 px-3 py-2 rounded-lg bg-[#8DAA9D]/5 border border-[#8DAA9D]/10">
            <p className="text-[10px] text-[#8DAA9D]/50">
              {chain.length} documents connected via entity relationships. Each hop follows a named connection in the knowledge graph.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
