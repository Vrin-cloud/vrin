"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  ArrowRight,
  GitBranch,
  Layers,
} from "lucide-react"
import type { QueryResult, ProgressStep, QueryState } from "@/app/playground/page"

interface ResultPanelProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  accentColor: string
  state: QueryState
  result: QueryResult | null
  progressSteps: ProgressStep[]
  streamingAnswer: string
  isVrin: boolean
}

export function ResultPanel({
  title,
  subtitle,
  icon,
  accentColor,
  state,
  result,
  progressSteps,
  streamingAnswer,
  isVrin,
}: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<"answer" | "context">("answer")

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white/90">{title}</h3>
          <p className="text-xs text-white/40">{subtitle}</p>
        </div>
        {state === "done" && result?.searchTime && (
          <Badge
            variant="outline"
            className="ml-auto text-xs"
            style={{ color: accentColor, borderColor: `${accentColor}40` }}
          >
            {result.searchTime}
          </Badge>
        )}
      </div>

      {/* Progress / reasoning chain */}
      {state === "loading" && (
        <div className="px-5 py-4 border-b border-white/5">
          <div className="space-y-2">
            {progressSteps.map((step, i) => (
              <motion.div
                key={`${step.stage}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm"
              >
                <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                <span className="text-white/70">{step.label}</span>
                <span className="text-white/30 text-xs ml-auto">
                  {(step.elapsed_ms / 1000).toFixed(1)}s
                </span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-white/50"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" style={{ color: accentColor }} />
              <span>
                {progressSteps.length === 0
                  ? "Starting..."
                  : streamingAnswer
                    ? "Generating answer..."
                    : "Processing..."}
              </span>
            </motion.div>
          </div>
        </div>
      )}

      {/* Tab bar (Answer / Context) */}
      {(state === "done" || (state === "loading" && streamingAnswer)) && (
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTab("answer")}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
              activeTab === "answer"
                ? "text-white/90 border-b-2"
                : "text-white/40 hover:text-white/60"
            }`}
            style={activeTab === "answer" ? { borderColor: accentColor } : {}}
          >
            Answer
          </button>
          <button
            onClick={() => setActiveTab("context")}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "context"
                ? "text-white/90 border-b-2"
                : "text-white/40 hover:text-white/60"
            }`}
            style={activeTab === "context" ? { borderColor: accentColor } : {}}
          >
            <Layers className="w-3 h-3" />
            Retrieved Context
          </button>
        </div>
      )}

      {/* Content area */}
      <div className="px-5 py-4 flex-1 min-h-[200px] max-h-[500px] overflow-y-auto">
        {state === "idle" && (
          <p className="text-white/20 text-sm italic">Select a query to see results...</p>
        )}

        {state === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Failed to get results. Please try again.</span>
          </div>
        )}

        {/* ANSWER TAB */}
        {activeTab === "answer" && (state === "loading" || state === "done") && (
          <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap pr-2">
            {state === "done" && result?.answer
              ? result.answer
              : streamingAnswer || (
                  <span className="text-white/30 italic">Waiting for answer...</span>
                )}
          </div>
        )}

        {/* CONTEXT TAB */}
        {activeTab === "context" && state === "done" && result && (
          <div className="space-y-3">
            {isVrin ? (
              // === VRIN: Facts + Chunks ===
              <>
                {/* Facts section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-3.5 h-3.5 text-[#8DAA9D]" />
                    <span className="text-xs text-white/50">
                      Showing {Math.min(result.facts.length, 15)} of {result.totalFacts} structured facts
                      {result.confidence !== undefined && result.confidence > 0 && (
                        <> &middot; confidence: {(result.confidence * 100).toFixed(0)}%</>
                      )}
                    </span>
                  </div>
                  {result.facts.length > 0 ? (
                    <div className="space-y-1.5">
                      {result.facts.slice(0, 15).map((fact, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="p-2.5 rounded-lg bg-[#8DAA9D]/5 border border-[#8DAA9D]/10"
                        >
                          <div className="flex items-center gap-1.5 flex-wrap text-xs">
                            <span className="text-[#8DAA9D] font-medium">{fact.subject}</span>
                            <ArrowRight className="w-3 h-3 text-white/15" />
                            <span className="text-white/40 italic">{fact.predicate}</span>
                            <ArrowRight className="w-3 h-3 text-white/15" />
                            <span className="text-[#8DAA9D] font-medium">{fact.object}</span>
                          </div>
                          {(fact.hop_distance !== undefined && fact.hop_distance > 0 || fact.confidence !== undefined) && (
                            <div className="mt-1 flex items-center gap-2">
                              {fact.hop_distance !== undefined && fact.hop_distance > 0 && (
                                <Badge variant="outline" className="text-[9px] text-[#8DAA9D]/60 border-[#8DAA9D]/20 px-1.5 py-0">
                                  hop {fact.hop_distance}
                                </Badge>
                              )}
                              {fact.confidence !== undefined && (
                                <span className="text-[9px] text-white/20">
                                  {(fact.confidence * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/30 italic">
                      Knowledge graph is still being populated with facts.
                    </p>
                  )}
                </div>

                {/* Chunks section (Vrin also retrieves chunks) */}
                {result.chunks.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-3.5 h-3.5 text-[#8DAA9D]/60" />
                      <span className="text-xs text-white/40">
                        Showing {Math.min(result.chunks.length, 5)} of {result.totalChunks} supporting passages
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {result.chunks.slice(0, 5).map((chunk, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-white/30 font-medium truncate max-w-[200px]">
                              {chunk.title || `Passage ${i + 1}`}
                            </span>
                            {chunk.score !== undefined && (
                              <span className="text-[10px] text-white/20">
                                {chunk.score?.toFixed(3)}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/35 leading-relaxed line-clamp-2">
                            {chunk.content?.substring(0, 200) || "No content"}
                            {(chunk.content?.length || 0) > 200 ? "..." : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // === STANDARD RAG: Disconnected chunks only ===
              <>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-3.5 h-3.5 text-red-400/60" />
                  <span className="text-xs text-white/50">
                    Showing {Math.min(result.chunks.length, 10)} of {result.totalChunks} chunks retrieved by similarity
                  </span>
                </div>
                {result.chunks.length > 0 ? (
                  <div className="space-y-1.5">
                    {result.chunks.slice(0, 10).map((chunk, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3 h-3 text-white/20" />
                            <span className="text-[10px] text-white/35 font-medium truncate max-w-[200px]">
                              {chunk.title || `Chunk ${i + 1}`}
                            </span>
                          </div>
                          {chunk.score !== undefined && (
                            <span className="text-[10px] text-white/20">
                              sim: {chunk.score?.toFixed(3)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed line-clamp-3">
                          {chunk.content?.substring(0, 250) || "No content"}
                          {(chunk.content?.length || 0) > 250 ? "..." : ""}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/30 italic">No chunks retrieved.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
