"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Network } from "lucide-react"
import type { DemoQuery } from "@/lib/playground/demo-data"

interface QueryPanelProps {
  queries: DemoQuery[]
  selectedQuery: DemoQuery | null
  customQuery: string
  onSelectQuery: (query: DemoQuery) => void
  onCustomQueryChange: (value: string) => void
  onSubmitCustomQuery: () => void
  isRunning: boolean
  scenarioId?: string
}

const PLACEHOLDER_BY_SCENARIO: Record<string, string> = {
  'enterprise-ops': 'Ask anything about Meridian Corp...',
  'banking-compliance': 'Ask about compliance, risk assessments, or SAR filings...',
  'congressional-intelligence': 'Ask about legislation, committee positions, or lobbying...',
  'healthcare-cdi': 'Ask about patient history, diagnoses, or clinical documentation...',
  'ai-research': 'Ask anything across these 20+ research papers...',
}

export function QueryPanel({
  queries,
  selectedQuery,
  customQuery,
  onSelectQuery,
  onCustomQueryChange,
  onSubmitCustomQuery,
  isRunning,
  scenarioId,
}: QueryPanelProps) {
  const placeholder = PLACEHOLDER_BY_SCENARIO[scenarioId || ''] || 'Ask a question...'
  return (
    <div className="space-y-6">
      {/* Pre-loaded example queries */}
      <div>
        <p className="text-sm text-white/40 uppercase tracking-wider mb-3 font-medium">
          Try a multi-hop question
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {queries.map((query) => {
            const isSelected = selectedQuery?.id === query.id
            return (
              <button
                key={query.id}
                onClick={() => !isRunning && onSelectQuery(query)}
                disabled={isRunning}
                className={`
                  text-left p-4 rounded-xl border transition-all duration-200
                  ${isSelected
                    ? "border-[#8DAA9D] bg-[#8DAA9D]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }
                  ${isRunning ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <p className="text-sm font-medium text-white/90 mb-2 leading-relaxed">
                  {query.question}
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  {query.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom query input */}
      <div>
        <p className="text-sm text-white/40 uppercase tracking-wider mb-3 font-medium">
          Or ask your own question
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => onCustomQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isRunning && onSubmitCustomQuery()}
            placeholder={placeholder}
            disabled={isRunning}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#8DAA9D]/50 transition-colors disabled:opacity-60"
          />
          <Button
            onClick={onSubmitCustomQuery}
            disabled={isRunning || !customQuery.trim()}
            className="bg-[#8DAA9D] text-black hover:bg-[#8DAA9D]/90 font-semibold px-6 rounded-xl disabled:opacity-50"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ask
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
