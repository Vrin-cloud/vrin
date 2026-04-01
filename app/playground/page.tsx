"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Zap,
  ArrowRight,
  Network,
  FileText,
  MessageSquare,
  Send,
} from "lucide-react"
import { DEMO_QUERIES, type DemoQuery } from "@/lib/playground/demo-data"
import { QueryPanel } from "@/components/playground/query-panel"
import { ResultPanel } from "@/components/playground/result-panel"
import { StatsComparison } from "@/components/playground/stats-comparison"
import { ComparisonDialog } from "@/components/playground/comparison-dialog"

export interface ProgressStep {
  stage: string
  label: string
  detail: string
  step: number
  total_steps: number
  elapsed_ms: number
}

export interface QueryResult {
  answer: string
  facts: Array<{
    subject: string
    predicate: string
    object: string
    confidence?: number
    hop_distance?: number
    source_document?: string
  }>
  chunks: Array<{
    content: string
    score: number
    title?: string
    source_document?: string
  }>
  progressSteps: ProgressStep[]
  totalFacts: number
  totalChunks: number
  searchTime: string
  confidence?: number
  retrievalMode: string
}

export type QueryState = "idle" | "loading" | "done" | "error"

export default function PlaygroundPage() {
  const [selectedQuery, setSelectedQuery] = useState<DemoQuery | null>(null)
  const [customQuery, setCustomQuery] = useState("")
  const [ragState, setRagState] = useState<QueryState>("idle")
  const [vrinState, setVrinState] = useState<QueryState>("idle")
  const [ragResult, setRagResult] = useState<QueryResult | null>(null)
  const [vrinResult, setVrinResult] = useState<QueryResult | null>(null)
  const [ragProgress, setRagProgress] = useState<ProgressStep[]>([])
  const [vrinProgress, setVrinProgress] = useState<ProgressStep[]>([])
  const [ragStreamingAnswer, setRagStreamingAnswer] = useState("")
  const [vrinStreamingAnswer, setVrinStreamingAnswer] = useState("")
  const [showComparison, setShowComparison] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const parseSSEStream = useCallback(
    async (
      query: string,
      retrievalMode: "full" | "vector_only",
      onProgress: (step: ProgressStep) => void,
      onAnswerChunk: (chunk: string) => void,
      onComplete: (result: QueryResult) => void,
      onError: (error: string) => void,
    ) => {
      try {
        const response = await fetch("/api/playground/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, retrieval_mode: retrievalMode }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          onError(errorData.error || `HTTP ${response.status}`)
          return
        }

        const reader = response.body?.getReader()
        if (!reader) {
          onError("No response body")
          return
        }

        const decoder = new TextDecoder()
        let buffer = ""
        const progressSteps: ProgressStep[] = []
        let fullAnswer = ""
        let finalResult: any = null
        let metadataEvent: any = null
        const startTime = Date.now()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr || jsonStr === "[DONE]") continue

            try {
              const event = JSON.parse(jsonStr)

              if (event.type === "progress") {
                const step = event.data as ProgressStep
                progressSteps.push(step)
                onProgress(step)
              } else if (event.type === "token") {
                // vector_only path sends full answer as token
                const token = event.data?.token || ""
                fullAnswer = token
                onAnswerChunk(fullAnswer)
              } else if (event.type === "content") {
                // Full pipeline streams tokens incrementally
                const delta = event.data?.delta || ""
                fullAnswer += delta
                onAnswerChunk(fullAnswer)
              } else if (event.type === "metadata") {
                metadataEvent = event.data
              } else if (event.type === "complete" || event.type === "result") {
                finalResult = event.data
              } else if (event.type === "error") {
                onError(event.data?.error || "Unknown error")
                return
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }

        // Build result from final event + metadata event
        // vector_only: facts/chunks come from result event
        // full pipeline: facts/chunks come from metadata event (graph_facts_preview, vector_chunks_preview)
        const facts = finalResult?.graph_facts
          || metadataEvent?.graph_facts_preview
          || []
        const chunks = finalResult?.vector_results
          || metadataEvent?.vector_chunks_preview
          || []

        const result: QueryResult = {
          answer: finalResult?.summary || finalResult?.answer || fullAnswer || "No answer generated.",
          facts,
          chunks,
          progressSteps,
          totalFacts: finalResult?.total_facts || metadataEvent?.total_facts || 0,
          totalChunks: finalResult?.total_chunks || metadataEvent?.total_chunks || 0,
          searchTime: finalResult?.search_time
            || (metadataEvent?.pipeline_trace?.total_time_s
              ? `${metadataEvent.pipeline_trace.total_time_s}s`
              : `${((Date.now() - startTime) / 1000).toFixed(1)}s`),
          confidence: metadataEvent?.retrieval_confidence?.overall || finalResult?.confidence_score,
          retrievalMode,
        }
        onComplete(result)
      } catch (error: any) {
        onError(error.message || "Network error")
      }
    },
    []
  )

  const runQuery = useCallback(
    (queryText: string) => {
      // Reset state
      setRagState("loading")
      setVrinState("loading")
      setRagResult(null)
      setVrinResult(null)
      setRagProgress([])
      setVrinProgress([])
      setRagStreamingAnswer("")
      setVrinStreamingAnswer("")

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 200)

      // Run both queries in parallel
      // Standard RAG (vector_only)
      parseSSEStream(
        queryText,
        "vector_only",
        (step) => setRagProgress((prev) => [...prev, step]),
        (answer) => setRagStreamingAnswer(answer),
        (result) => {
          setRagResult(result)
          setRagState("done")
        },
        (error) => {
          console.error("RAG error:", error)
          setRagState("error")
        }
      )

      // Vrin Deep Reasoning (full)
      parseSSEStream(
        queryText,
        "full",
        (step) => setVrinProgress((prev) => [...prev, step]),
        (answer) => setVrinStreamingAnswer(answer),
        (result) => {
          setVrinResult(result)
          setVrinState("done")
        },
        (error) => {
          console.error("Vrin error:", error)
          setVrinState("error")
        }
      )
    },
    [parseSSEStream]
  )

  const handleDemoQuery = (query: DemoQuery) => {
    setSelectedQuery(query)
    setCustomQuery("")
    runQuery(query.question)
  }

  const handleCustomQuery = () => {
    if (!customQuery.trim()) return
    setSelectedQuery(null)
    runQuery(customQuery.trim())
  }

  const isRunning = ragState === "loading" || vrinState === "loading"
  const hasResults = ragState !== "idle" || vrinState !== "idle"
  const bothDone = ragState === "done" && vrinState === "done"

  return (
    <>
    <ComparisonDialog
      isOpen={showComparison}
      onClose={() => setShowComparison(false)}
      selectedQuery={selectedQuery}
      ragResult={ragResult}
      vrinResult={vrinResult}
    />
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Minimal header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <Image src="/dark-icon.svg" alt="Vrin" width={28} height={28} />
            <span className="font-semibold">Vrin</span>
            <span className="text-white/40 mx-2">/</span>
            <span className="text-white/60">Playground</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-[#8DAA9D] border-[#8DAA9D]/30 bg-[#8DAA9D]/5">
            Interactive Demo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            See Why Retrieval Is Not Reasoning
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Same question. Same documents. Different architecture.
            Watch what happens when a query requires connecting facts across 6 documents.
          </p>
        </div>
      </section>

      {/* Query Panel */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <QueryPanel
            queries={DEMO_QUERIES}
            selectedQuery={selectedQuery}
            customQuery={customQuery}
            onSelectQuery={handleDemoQuery}
            onCustomQueryChange={setCustomQuery}
            onSubmitCustomQuery={handleCustomQuery}
            isRunning={isRunning}
          />
        </div>
      </section>

      {/* Results */}
      <div ref={resultsRef}>
        <AnimatePresence>
          {hasResults && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="px-6 pb-8"
            >
              <div className="max-w-7xl mx-auto">
                {/* Stats comparison bar */}
                <StatsComparison
                  ragResult={ragResult}
                  vrinResult={vrinResult}
                  ragState={ragState}
                  vrinState={vrinState}
                  selectedQuery={selectedQuery}
                />

                {/* Side-by-side panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Standard RAG */}
                  <ResultPanel
                    title="Standard RAG"
                    subtitle="Vector similarity search"
                    icon={<Search className="w-5 h-5" />}
                    accentColor="#ef4444"
                    state={ragState}
                    result={ragResult}
                    progressSteps={ragProgress}
                    streamingAnswer={ragStreamingAnswer}
                    isVrin={false}
                  />

                  {/* Vrin Deep Reasoning */}
                  <ResultPanel
                    title="Vrin Deep Reasoning"
                    subtitle="Graph traversal + multi-hop reasoning"
                    icon={<Network className="w-5 h-5" />}
                    accentColor="#8DAA9D"
                    state={vrinState}
                    result={vrinResult}
                    progressSteps={vrinProgress}
                    streamingAnswer={vrinStreamingAnswer}
                    isVrin={true}
                  />
                </div>

                {/* "Why is Vrin better?" button — shown when both done for pre-loaded queries */}
                {bothDone && selectedQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                  >
                    <Button
                      onClick={() => setShowComparison(true)}
                      variant="outline"
                      className="border-[#8DAA9D]/30 text-[#8DAA9D] hover:bg-[#8DAA9D]/10 px-6"
                    >
                      Why is Vrin&apos;s answer better?
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <section className="px-6 py-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to reason over your own data?</h2>
          <p className="text-white/60 mb-6">
            Vrin ingests your documents, builds a knowledge graph, and reasons across them.
            Every answer is traceable back to source facts.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-[#8DAA9D] text-black hover:bg-[#8DAA9D]/90 font-semibold px-6">
                Start Free
              </Button>
            </Link>
            <Link href="https://cal.com/vedant-patel-vrin/30min">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6">
                Talk to Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
