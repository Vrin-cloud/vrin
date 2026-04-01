"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { DemoQuery } from "@/lib/playground/demo-data"
import type { QueryResult } from "@/app/playground/page"

interface ComparisonDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedQuery: DemoQuery | null
  ragResult: QueryResult | null
  vrinResult: QueryResult | null
}

/** What Vrin found that RAG missed, per demo query */
const QUERY_INSIGHTS: Record<string, {
  summary: string
  ragMissed: string[]
  vrinFound: string[]
}> = {
  'leadership-transition': {
    summary: 'Standard RAG found the CEO change and policy updates. Vrin traced the full chain: CEO transition, customer advisory board pricing negotiations, AWS strategic partnership, board approvals, revenue impact, and policy implementation.',
    ragMissed: [
      'Customer advisory board tiered pricing compromise',
      'AWS Strategic Collaboration Agreement details',
      'Subscription revenue breakdown ($38.7M, 127% YoY)',
      'MAP credits and EDP discounts offsetting cloud costs',
      'Connection between Flexible First policy and $4.2M facilities savings',
    ],
    vrinFound: [
      'Connected Sarah Chen to 6 downstream changes across separate documents',
      'Traced pricing model from CAB meeting through board approval to Q3 revenue',
      'Linked AWS partnership terms to specific financial line items',
      'Connected HR policy savings to overall cost structure',
    ],
  },
  'infrastructure-migration': {
    summary: 'Standard RAG identified the affected teams and the ZenConnect outage. Vrin connected the full story: DBA pre-assessment findings, AWS TAM involvement, vendor credits, customer complaints, and financial outcomes.',
    ragMissed: [
      'DBA team AMBER readiness status and delay recommendation',
      'AWS credits: $750K MAP, $612K EDP, $34.2K Phase 3',
      'SCA migration protection clause expiring Dec 31, 2025',
      'AWS TAM David Kimura engagement during DMS throttling',
      'Nextera Solutions and Brightpath Health customer complaints',
      'Jessica Wong engineering escalation coordination',
      'Cost savings achieved from month one (ahead of Q1 2026 projection)',
    ],
    vrinFound: [
      'Connected DBA pre-assessment to why Phase 3 went smoothly',
      'Traced AWS vendor relationship from SCA signing to specific credit amounts',
      'Linked customer complaints to the ZenConnect outage timeline',
      'Connected migration costs to financial outcomes across 4 documents',
    ],
  },
  'thornton-financial-impact': {
    summary: 'Standard RAG found the Thornton escalation details but could not trace the financial chain. Vrin connected the escalation through warranty claims, legal review, ASC 606 contra-revenue treatment, and its combined effect with the loyalty discount on Q3 subscription revenue.',
    ragMissed: [
      '$94K total Make-Whole credits across Thornton + Cascade in Q3',
      'ASC 606 contra-revenue treatment reducing reported subscription revenue',
      'Combined $312K subscription revenue reduction (Make-Whole + 8% loyalty discount)',
      'Lisa Patel proposed 15% ACV cap to limit future Make-Whole exposure',
      'Connection between Thornton escalation and the CAB pricing compromise',
    ],
    vrinFound: [
      'Traced Thornton $50,391 credit through legal memo to finance revenue impact',
      'Connected Make-Whole credits to Q3 subscription revenue of $38.7M (which is AFTER deductions)',
      'Linked the escalation to the proposed policy cap for Q1 2026',
      'Found the Cascade Financial parallel case that doubled the financial exposure',
    ],
  },
  'customer-issues-ceo-strategy': {
    summary: 'Standard RAG found documents about customer issues and CEO changes separately. Vrin traced the chain from specific customer escalations through financial impact to the pricing negotiations Sarah Chen initiated, revealing how customer problems informed the CEO strategic pivot.',
    ragMissed: [
      'Thornton and Cascade escalations drove $94K in warranty costs',
      'These costs reduced the subscription revenue Sarah was trying to grow',
      'The CAB pricing compromise (tiered Options A/B/C) was partly a response to customer concerns',
      'The 8% Diamond loyalty discount was created at the same CAB meeting',
      'AWS partnership credits partially offset the customer-driven revenue reduction',
    ],
    vrinFound: [
      'Connected customer warranty costs to Q3 subscription revenue to CEO growth targets',
      'Traced the Diamond loyalty discount from CAB meeting to its revenue impact in Q3',
      'Linked Sarah Chen strategic priorities to the financial pressure from customer escalations',
      'Found that customer issues and CEO strategy changes are causally connected, not independent events',
    ],
  },
  'diamond-tier-q3-problems': {
    summary: 'Standard RAG returned the Diamond tier definition document. Vrin found the actual incidents: two separate customer escalations, an infrastructure outage that specifically impacted Diamond batch jobs, the financial exposure from Make-Whole provisions, and the proposed policy changes to prevent recurrence.',
    ragMissed: [
      'Thornton Industries ($50,391 Make-Whole) and Cascade Financial ($875K ACV) escalations',
      'DBA pre-assessment flagged Diamond-tier batch jobs causing replication lag',
      'ZenConnect outage specifically impacted Diamond customer support workflows',
      'Combined $94K Make-Whole exposure triggered a legal review',
      'Lisa Patel proposed 15% ACV annual cap on Make-Whole provisions',
      'Finance team flagged ASC 606 revenue recognition impact',
    ],
    vrinFound: [
      'Connected Diamond tier definition to two real escalations happening in Q3',
      'Linked the DBA migration assessment to Diamond batch job scheduling concerns',
      'Traced the financial chain: escalations to Make-Whole credits to revenue recognition',
      'Found the proposed policy fix (15% cap) that connects legal, finance, and customer success',
    ],
  },
}

export function ComparisonDialog({
  isOpen,
  onClose,
  selectedQuery,
  ragResult,
  vrinResult,
}: ComparisonDialogProps) {
  if (!selectedQuery || !ragResult || !vrinResult) return null

  const insights = QUERY_INSIGHTS[selectedQuery.id]
  if (!insights) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[700px] bg-[#141414] border border-white/10 rounded-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white/90">Why is Vrin&apos;s answer better?</h3>
                <p className="text-xs text-white/40 mt-0.5">Same documents, different architecture</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Summary */}
              <p className="text-sm text-white/70 leading-relaxed">
                {insights.summary}
              </p>

              {/* Stats comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-center">
                  <p className="text-[10px] text-red-400/60 uppercase tracking-wider mb-1">Standard RAG</p>
                  <p className="text-lg font-semibold text-red-400/80">{ragResult.totalFacts} facts</p>
                  <p className="text-xs text-white/30">{ragResult.totalChunks} chunks retrieved</p>
                </div>
                <div className="p-3 rounded-lg bg-[#8DAA9D]/5 border border-[#8DAA9D]/10 text-center">
                  <p className="text-[10px] text-[#8DAA9D]/60 uppercase tracking-wider mb-1">Vrin</p>
                  <p className="text-lg font-semibold text-[#8DAA9D]">{vrinResult.totalFacts} facts</p>
                  <p className="text-xs text-white/30">{vrinResult.totalChunks} chunks retrieved</p>
                </div>
              </div>

              {/* What RAG missed */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-4 h-4 text-red-400/60" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    What standard RAG missed
                  </span>
                </div>
                <div className="space-y-1.5">
                  {insights.ragMissed.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 text-sm text-white/50"
                    >
                      <span className="text-red-400/40 mt-0.5">-</span>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* What Vrin connected */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-[#8DAA9D]" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    How Vrin connected the dots
                  </span>
                </div>
                <div className="space-y-1.5">
                  {insights.vrinFound.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.3 }}
                      className="flex items-start gap-2 text-sm text-white/60"
                    >
                      <ArrowRight className="w-3 h-3 text-[#8DAA9D] mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom line */}
              <div className="p-4 rounded-lg bg-[#8DAA9D]/5 border border-[#8DAA9D]/10">
                <p className="text-xs text-[#8DAA9D]/80 leading-relaxed">
                  Vector search retrieves text fragments that look similar to your question. Vrin extracts structured facts, builds a knowledge graph, and reasons across documents to find connections that similarity search structurally cannot discover.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
