'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Check, Loader2 } from 'lucide-react'

interface ProgressStep {
  stage: string
  label: string
  detail: string
  step: number
  total_steps: number
  elapsed_ms: number
}

interface ReasoningChainProps {
  progressSteps: ProgressStep[]
  thinkingContent: string
  reasoningSummary?: string
  isActive: boolean
  thinkingTokens?: number
}

export function ReasoningChain({
  progressSteps,
  thinkingContent,
  reasoningSummary,
  isActive,
  thinkingTokens,
}: ReasoningChainProps) {
  const [isExpanded, setIsExpanded] = useState(isActive)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Track elapsed time while active
  useEffect(() => {
    if (!isActive) return
    setElapsedSeconds(0)
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive])

  // Auto-collapse when done
  useEffect(() => {
    if (!isActive && (progressSteps.length > 0 || thinkingContent)) {
      const timer = setTimeout(() => setIsExpanded(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isActive, progressSteps.length, thinkingContent])

  // Nothing to show
  if (progressSteps.length === 0 && !thinkingContent && !reasoningSummary) {
    return null
  }

  const latestStep = progressSteps[progressSteps.length - 1]
  const totalFacts = latestStep?.detail?.match(/(\d+) facts/)?.[1]
  const isThinking = isActive && thinkingContent && !reasoningSummary

  // Collapsed summary line
  const summaryText = isActive
    ? (isThinking
      ? 'Thinking...'
      : latestStep
        ? `${latestStep.label} (${latestStep.step}/${latestStep.total_steps})`
        : 'Starting...')
    : `Retrieved ${totalFacts || progressSteps.length} facts${thinkingContent ? ` -- Thought for ${elapsedSeconds}s` : ` -- ${elapsedSeconds}s`}`

  // All possible stages for showing pending items
  const allStages = [
    'analyzing', 'extracting_entities', 'graph_traversal',
    'vector_search', 'scoring', 'reasoning', 'generating'
  ]

  const currentStageIndex = latestStep ? allStages.indexOf(latestStep.stage) : -1

  return (
    <div className="my-3 mx-1">
      {/* Toggle header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
      >
        <span className="text-gray-500">
          {isExpanded
            ? <ChevronDown className="w-3.5 h-3.5" />
            : <ChevronRight className="w-3.5 h-3.5" />}
        </span>

        {isActive && (
          <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin flex-shrink-0" />
        )}

        <span className="text-sm text-gray-600 flex-1 truncate">
          {summaryText}
        </span>

        <span className="text-xs text-gray-400 font-mono">
          {elapsedSeconds}s
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 space-y-1.5">
              {/* Pipeline progress steps */}
              {progressSteps.map((step, idx) => (
                <div key={step.stage} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-700">{step.label}</span>
                    <span className="text-xs text-gray-400 ml-2 font-mono">
                      {(step.elapsed_ms / 1000).toFixed(1)}s
                    </span>
                    {step.detail && (
                      <p className="text-xs text-gray-500 truncate">{step.detail}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Pending stages (shown as gray dots while active) */}
              {isActive && allStages
                .filter((_, i) => i > currentStageIndex)
                .slice(0, 3)
                .map(stage => (
                  <div key={stage} className="flex items-start gap-2 opacity-40">
                    <span className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    </span>
                    <span className="text-sm text-gray-400 capitalize">
                      {stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              }

              {/* LLM thinking content */}
              {thinkingContent && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {isActive ? 'Thinking...' : 'Thought process'}
                  </div>
                  <div className="text-sm text-gray-600 bg-purple-50/50 rounded-lg p-2.5 max-h-48 overflow-y-auto border border-purple-100/50">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {thinkingContent}
                      {isActive && <span className="inline-block w-1.5 h-4 bg-purple-400 ml-0.5 animate-pulse" />}
                    </div>
                  </div>
                </div>
              )}

              {/* OpenAI reasoning summary (one-shot, not streamed) */}
              {reasoningSummary && !thinkingContent && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">Reasoning summary</div>
                  <div className="text-sm text-gray-600 bg-purple-50/50 rounded-lg p-2.5 max-h-48 overflow-y-auto border border-purple-100/50">
                    <div className="whitespace-pre-wrap leading-relaxed">{reasoningSummary}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
