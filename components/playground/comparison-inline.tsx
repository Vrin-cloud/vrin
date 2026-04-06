"use client"

import { motion } from "framer-motion"
import { Clock, ShieldAlert } from "lucide-react"
import type { DemoQuery } from "@/lib/playground/demo-data"
import type { QueryResult } from "@/app/playground/page"

interface ComparisonInlineProps {
  selectedQuery: DemoQuery
  ragResult: QueryResult | null
  vrinResult: QueryResult | null
}

interface ComparisonMetric {
  label: string
  rag: number
  vrin: number
  unit?: string
}

interface QueryInsight {
  headline: string
  metrics: ComparisonMetric[]
  missed: Array<{
    detail: string
    impact: string
  }>
  expertGap: string
}

function ComparisonBar({
  metric,
  index,
}: {
  metric: ComparisonMetric
  index: number
}) {
  const maxVal = Math.max(metric.rag, metric.vrin, 1)
  const ragPct = (metric.rag / maxVal) * 100
  const vrinPct = (metric.vrin / maxVal) * 100
  const improvement = metric.rag > 0
    ? `${((metric.vrin / metric.rag - 1) * 100).toFixed(0)}%`
    : `+${metric.vrin}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50 font-medium">{metric.label}</span>
        <span className="text-xs text-[#8DAA9D] font-semibold">
          {metric.rag > 0 ? `${improvement} more` : `${metric.vrin} found`}
        </span>
      </div>
      {/* RAG bar */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-white/25 w-12 text-right shrink-0">RAG</span>
        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ragPct}%` }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-red-400/50"
          />
        </div>
        <span className="text-[10px] text-white/30 w-8 shrink-0">
          {metric.rag}{metric.unit || ""}
        </span>
      </div>
      {/* Vrin bar */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-[#8DAA9D]/60 w-12 text-right shrink-0">Vrin</span>
        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${vrinPct}%` }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-[#8DAA9D]"
          />
        </div>
        <span className="text-[10px] text-[#8DAA9D] font-medium w-8 shrink-0">
          {metric.vrin}{metric.unit || ""}
        </span>
      </div>
    </motion.div>
  )
}

const QUERY_INSIGHTS: Record<string, QueryInsight> = {
  'leadership-transition': {
    headline: 'Standard RAG found the CEO change. Vrin found how it reshaped pricing, partnerships, headcount, and revenue across 6 departments.',
    metrics: [
      { label: 'Documents connected', rag: 3, vrin: 8 },
      { label: 'Key details surfaced', rag: 5, vrin: 14 },
      { label: 'Named contacts identified', rag: 2, vrin: 7 },
      { label: 'Financial figures cited', rag: 1, vrin: 6 },
    ],
    missed: [
      { detail: 'Customer advisory board pricing compromise (tiered Options A/B/C + 8% loyalty discount)', impact: 'Without this, your team misses that the pricing model changed — affecting every renewal conversation.' },
      { detail: 'AWS Strategic Collaboration Agreement ($750K MAP credits, 12% EDP discount)', impact: 'This partnership directly reduced cloud costs in Q3. Missing it means your cost projections are wrong.' },
      { detail: '$4.2M facilities savings from Flexible First policy', impact: 'This offsets the cloud cost increase. Without both numbers, your CFO sees incomplete financials.' },
    ],
    expertGap: 'A senior analyst would need to separately pull the CAB meeting notes, the AWS contract, the board minutes, and the HR policy — then manually connect the dots. That is 4 separate searches and 30+ minutes of cross-referencing.',
  },
  'infrastructure-migration': {
    headline: 'Standard RAG identified the affected teams and the outage. Vrin found the DBA pre-assessment that prevented a second outage, the AWS credits that offset costs, and the specific customer complaints.',
    metrics: [
      { label: 'Documents connected', rag: 3, vrin: 7 },
      { label: 'Key details surfaced', rag: 6, vrin: 16 },
      { label: 'Named contacts identified', rag: 3, vrin: 8 },
      { label: 'Financial figures cited', rag: 0, vrin: 5 },
    ],
    missed: [
      { detail: 'DBA team rated Phase 3 readiness as AMBER and recommended a delay', impact: 'This pre-assessment is why Phase 3 went smoothly. Without it, your post-mortem is missing the preventive action that worked.' },
      { detail: 'AWS TAM David Kimura responded in 4 minutes during DMS throttling', impact: 'This vendor relationship directly prevented extended downtime. Your vendor review would miss this evidence.' },
      { detail: '$812K in total AWS credits and savings, including $34.2K MAP credit covering Phase 3 costs', impact: 'Your finance team needs these numbers for the migration ROI calculation.' },
    ],
    expertGap: 'A project manager would need to pull the DBA assessment, the after-action report, the AWS SLA review, and the incident report separately — then stitch together the causal chain. That is the kind of cross-team synthesis that typically only happens in a quarterly business review.',
  },
  'thornton-financial-impact': {
    headline: 'Standard RAG found the Thornton escalation details. Vrin traced the financial chain through legal review, ASC 606 treatment, and the combined $312K revenue reduction.',
    metrics: [
      { label: 'Documents connected', rag: 2, vrin: 6 },
      { label: 'Key details surfaced', rag: 4, vrin: 12 },
      { label: 'Financial figures cited', rag: 1, vrin: 7 },
      { label: 'Cross-department links', rag: 1, vrin: 4 },
    ],
    missed: [
      { detail: '$94K total Make-Whole credits across Thornton + Cascade in Q3', impact: 'Your Q3 revenue of $38.7M already has this deducted. Without knowing the breakdown, you cannot forecast Q4 exposure.' },
      { detail: 'Lisa Patel proposed 15% ACV cap on Make-Whole provisions for Q1 2026', impact: 'This policy change is in motion. Your legal and finance teams need to know about it before renewal season.' },
      { detail: 'Combined with the 8% loyalty discount from the CAB meeting, total subscription revenue reduction was $312K', impact: 'Two separate decisions (loyalty discount + Make-Whole credits) compounded. Neither team saw the combined impact.' },
    ],
    expertGap: 'Connecting the Thornton escalation to Q3 revenue requires reading the escalation report, the legal memo, the finance memo, AND the Q3 financials. No single person in the company owns all four documents.',
  },
  'customer-issues-ceo-strategy': {
    headline: 'Standard RAG found customer issues and CEO changes as separate topics. Vrin found they are causally connected — customer warranty costs directly pressured the subscription revenue Sarah Chen was trying to grow.',
    metrics: [
      { label: 'Documents connected', rag: 2, vrin: 7 },
      { label: 'Causal links discovered', rag: 0, vrin: 4 },
      { label: 'Financial figures cited', rag: 1, vrin: 5 },
      { label: 'Strategic insights', rag: 1, vrin: 4 },
    ],
    missed: [
      { detail: 'Thornton and Cascade warranty costs reduced the subscription revenue line Sarah was measured against', impact: 'The CEO growth target and customer escalation costs are hitting the same P&L line. Nobody flagged this conflict.' },
      { detail: 'The CAB pricing compromise (8% loyalty discount) was partly a response to Diamond customer concerns', impact: 'The discount that reduced revenue was created to retain the same customers causing warranty costs. A circular problem.' },
      { detail: 'AWS partnership credits partially offset the customer-driven revenue reduction', impact: 'Without seeing all three numbers together, the board cannot evaluate whether the strategic pivot is working.' },
    ],
    expertGap: 'This is a board-level insight that requires synthesizing customer success data, finance data, sales data, and executive strategy documents. In most companies, this connection surfaces only during annual planning — if at all.',
  },
  'diamond-tier-q3-problems': {
    headline: 'Standard RAG returned the Diamond tier definition. Vrin found the actual incidents: two escalations, an infrastructure outage affecting Diamond batch jobs, $94K in credits, and a proposed policy change.',
    metrics: [
      { label: 'Documents connected', rag: 2, vrin: 7 },
      { label: 'Incidents identified', rag: 1, vrin: 4 },
      { label: 'Financial figures cited', rag: 0, vrin: 4 },
      { label: 'Action items found', rag: 1, vrin: 3 },
    ],
    missed: [
      { detail: 'Thornton ($50K) and Cascade ($875K ACV) both triggered Make-Whole provisions in Q3', impact: 'Two of your highest-value customers hit warranty claims in the same quarter. That is a pattern, not a coincidence.' },
      { detail: 'DBA pre-assessment specifically flagged Diamond-tier batch jobs causing replication lag during migration', impact: 'Your infrastructure decisions directly impacted your most valuable customer tier. The teams were not coordinating.' },
      { detail: 'Lisa Patel proposed a 15% ACV annual cap to limit future Make-Whole exposure', impact: 'A policy fix is in progress. Your customer success team needs to know this before the next Diamond renewal.' },
    ],
    expertGap: 'Answering "what went wrong with Diamond customers" requires pulling from customer success, legal, infrastructure, and finance — four different teams with four different document repositories. This is exactly the question a board member asks that takes a week to answer.',
  },
  'acme-edd-risk-rating': {
    headline: 'Standard RAG correctly identified the EDD triggers. Vrin additionally found the specific deadlines, the responsible officer, the monitoring duration, and a critical gap in your transaction monitoring system.',
    metrics: [
      { label: 'Documents connected', rag: 3, vrin: 6 },
      { label: 'Specific deadlines cited', rag: 1, vrin: 4 },
      { label: 'Named contacts identified', rag: 1, vrin: 3 },
      { label: 'Compliance gaps found', rag: 0, vrin: 2 },
    ],
    missed: [
      { detail: 'AlertPro monitoring thresholds have not been recalibrated since 2023', impact: 'Your transaction monitoring tool might not detect suspicious patterns at Acme\'s new activity level. If an examiner asks "how do you know your system covers this?" — you need an answer.' },
      { detail: 'BO collection within 30 days, risk reassessment within 45 days, enhanced monitoring for 6 months minimum', impact: 'Missing a regulatory deadline turns a routine EDD into an exam finding. These numbers need to be in the case file from day one.' },
      { detail: 'Margaret Chen (BSA Officer) is the named reviewer with a 5 business day turnaround', impact: 'Your analyst needs to route this to the right person with the right SLA. Without the name and timeline, it sits in a queue.' },
    ],
    expertGap: 'A junior analyst gets the basic "yes, do EDD" answer from standard RAG. But the AlertPro insight — questioning whether your own monitoring tool is calibrated for this scenario — is something only a senior compliance officer with exam experience would think to ask. Vrin surfaces it automatically.',
  },
  'ai-model-compliance-gaps': {
    headline: 'Standard RAG found the OCC guidance or the board report, but not both in context. Vrin cross-referenced all regulatory frameworks against each AI tool to identify specific compliance gaps.',
    metrics: [
      { label: 'Regulatory frameworks cross-referenced', rag: 1, vrin: 4 },
      { label: 'AI tools analyzed', rag: 1, vrin: 3 },
      { label: 'Compliance gaps identified', rag: 1, vrin: 5 },
      { label: 'Remediation deadlines cited', rag: 0, vrin: 3 },
    ],
    missed: [
      { detail: 'LendAssist validation is 14 months overdue — SR 11-7 requires annual validation', impact: 'This is a Matter Requiring Attention (MRA) waiting to happen. Every month it stays unvalidated increases exam risk.' },
      { detail: 'BankBot meets the SR 11-7 definition of a "model" but was never classified as one', impact: 'An unclassified model is an ungoverned model. If BankBot gives financial guidance to customers, regulators will ask why it is not in your model inventory.' },
      { detail: 'AlertPro thresholds stale since 2023 may be generating false negatives on structuring', impact: 'If your monitoring tool misses structured transactions because thresholds are outdated, that is a BSA program deficiency — not just a model risk issue.' },
    ],
    expertGap: 'Identifying compliance gaps across 3 AI tools requires reading the OCC guidance, CFPB lending rules, FFIEC technology risk standards, AND your internal board report — then mapping each tool against each framework. That is a 2-day project for a compliance consultant. Vrin does it in one query.',
  },
  'acme-sar-filing-decision': {
    headline: 'Standard RAG found the Acme customer profile. Vrin matched Acme\'s transaction pattern against a previous SAR typology, applied your internal policy, and built the complete regulatory evidence chain for a filing decision.',
    metrics: [
      { label: 'Documents connected', rag: 2, vrin: 5 },
      { label: 'Pattern matches identified', rag: 0, vrin: 3 },
      { label: 'Regulatory citations', rag: 2, vrin: 6 },
      { label: 'Filing requirements cited', rag: 1, vrin: 4 },
    ],
    missed: [
      { detail: 'Global Trade Dynamics SAR typology: structured deposits followed by rapid international wire transfers — Acme shows a similar pattern', impact: 'Your previous SAR established a typology. If Acme\'s pattern matches and you do not file, you have knowledge of a potential pattern and inaction to document.' },
      { detail: 'Internal BSA policy Section 6 requires comparing new activity against prior SAR typologies', impact: 'Your own policy says you must do this comparison. Not doing it is a policy violation, not just a missed best practice.' },
      { detail: 'FinCEN 30-day filing deadline from date of detection, with 90-day continuing activity SARs', impact: 'The clock starts when suspicious activity is "detected." If your analyst flags Acme today, the filing deadline is locked in. Missing it is a violation.' },
    ],
    expertGap: 'Connecting a current customer profile to a previous SAR typology requires an investigator who remembers (or can find) the prior case, recognizes the pattern similarity, then maps it through policy and regulatory requirements. That is senior investigator work — typically 4-8 hours of research. Vrin delivers the complete evidence chain in seconds.',
  },
  // === Congressional Intelligence ===
  'cross-hearing-insulin': {
    headline: 'Standard RAG returned fragments from one hearing. Vrin tracked three senators across Finance and HELP committee hearings, synthesized their positions, and identified where they agree and diverge on insulin pricing.',
    metrics: [
      { label: 'Hearings connected', rag: 1, vrin: 4 },
      { label: 'Members tracked', rag: 1, vrin: 3 },
      { label: 'Position nuances captured', rag: 1, vrin: 5 },
      { label: 'Committee crossovers found', rag: 0, vrin: 2 },
    ],
    missed: [
      { detail: 'Whitfield\'s PBM reform argument from HELP hearing directly supports her insulin cap rationale in Finance — she sees PBM middlemen as the root cause', impact: 'Without connecting both hearings, your client brief misses her legislative strategy. She is building a two-bill approach (S.1847 + S.892) that is stronger together.' },
      { detail: 'Delgado\'s bipartisan substitute amendment passed HELP markup 15-7 with Republican support', impact: 'The compromise framework has bipartisan momentum. Your client needs to know the bill that reaches the floor will look different from the original text.' },
      { detail: 'Nakamura attended the Finance hearing with a noticeably softened tone — "constituent concerns" language replacing his earlier "free market" framing', impact: 'A swing vote is in play. If your client is lobbying Finance Committee members, Nakamura\'s shift changes the vote math.' },
    ],
    expertGap: 'A government affairs associate would need to watch or read 4 separate hearing transcripts, cross-reference each senator\'s statements, and build a position matrix. At 2-3 hours per hearing, that is a full day of work — and most firms only cover the marquee hearings, missing the HELP markup entirely.',
  },
  'nakamura-position-evolution': {
    headline: 'RAG identified the general direction but got the conclusion wrong — calling it a softening toward regulation. Vrin traced the nuance: Nakamura hardened his opposition to price caps specifically while staying open on competition reforms, backed by 4,200+ constituent contacts and specific bill provisions.',
    metrics: [
      { label: 'Specific data points cited', rag: 3, vrin: 12 },
      { label: 'Bill provisions identified', rag: 0, vrin: 4 },
      { label: 'Constituent pressure quantified', rag: 0, vrin: 1 },
      { label: 'Related legislation connected', rag: 1, vrin: 3 },
    ],
    missed: [
      { detail: '4,200+ constituent letters, emails, and phone calls forcing Nakamura to take a clearer public position', impact: 'This is the single most important pressure point. Constituent volume at this level forces a senator to commit — and it tells your lobbying team exactly what lever is working.' },
      { detail: 'S.1847\'s specific provisions: copayment cap starting January 1, 2027, PBM disclosure requirements, manufacturer rebate floor — and projected 72-85% out-of-pocket cost reductions', impact: 'Without knowing the specific mechanisms, your client cannot lobby on individual provisions. Nakamura may support the PBM disclosures while opposing the cap — that is actionable intelligence.' },
      { detail: 'RAG concluded Nakamura was softening toward accepting regulation. Vrin correctly identified the opposite: he hardened his opposition to price caps while remaining engaged on competition reforms', impact: 'Getting the direction wrong is worse than having no analysis. If your client acts on "Nakamura is softening," they misallocate lobbying resources on a senator who is actually digging in on the cap issue.' },
    ],
    expertGap: 'Tracking a senator\'s position evolution requires reading every hearing transcript they participated in over 9 months, cross-referencing bill provisions, and quantifying constituent pressure. Senior government affairs directors do this for 3-5 key senators — it is their full-time job. Vrin gives every user that capability.',
  },
  'insulin-cap-landscape': {
    headline: 'Standard RAG returned the bill summary. Vrin assembled a complete legislative intelligence briefing: CBO scoring, committee vote signals, industry opposition strategy, and client risk assessment — from 5 different document types.',
    metrics: [
      { label: 'Document types synthesized', rag: 1, vrin: 5 },
      { label: 'Stakeholder positions mapped', rag: 1, vrin: 6 },
      { label: 'Risk factors identified', rag: 0, vrin: 4 },
      { label: 'Action items surfaced', rag: 0, vrin: 3 },
    ],
    missed: [
      { detail: 'CBO scored S.1847 at $14.2B savings over 10 years — this strengthens the bill\'s budget reconciliation pathway', impact: 'A favorable CBO score changes the legislative math. If S.1847 qualifies for reconciliation, it needs only 51 votes, not 60. That changes every lobbying strategy.' },
      { detail: 'Archer & Hollis memo reveals Novo Nordisk is considering a preemptive voluntary $35 cap to undercut the legislation', impact: 'If a major manufacturer voluntarily caps prices, the political case for the bill weakens — but your client still faces competitive pressure. The memo is forward-looking intelligence you would not find in hearing transcripts.' },
      { detail: 'PhRMA lobbied Finance Committee members 4 times in Q4 2025 while publicly opposing only the price cap provisions — they actually support the PBM transparency sections', impact: 'The industry position is nuanced. Knowing which provisions they support vs. oppose lets your client find common ground or exploit splits.' },
    ],
    expertGap: 'Building a full legislative landscape briefing requires pulling the bill text, CBO estimate, hearing transcripts, lobbying disclosures, and client intelligence — then synthesizing them into a single narrative. This is the deliverable a $500/hour government affairs consultant produces. Vrin generates a comparable briefing from a single query.',
  },
  'whitfield-legislative-strategy': {
    headline: 'Standard RAG returned Whitfield\'s most prominent hearing statement. Vrin mapped her coordinated two-bill, two-chamber strategy — connecting her PBM reform argument in HELP to her price cap push in Finance and her cross-chamber alliance with Rep. Okafor.',
    metrics: [
      { label: 'Legislative initiatives connected', rag: 1, vrin: 3 },
      { label: 'Cross-chamber links found', rag: 0, vrin: 2 },
      { label: 'Strategic moves identified', rag: 1, vrin: 5 },
      { label: 'Coalition members mapped', rag: 1, vrin: 4 },
    ],
    missed: [
      { detail: 'Whitfield is running a coordinated two-bill strategy: S.1847 (price cap) + S.892 (PBM transparency) designed to address both demand and supply-side pricing', impact: 'If your client only tracks S.1847, they miss half the legislative strategy. The PBM bill could pass independently even if the price cap stalls.' },
      { detail: 'Rep. Okafor\'s PBM hearing in Energy & Commerce directly references Whitfield\'s HELP framework — a cross-chamber coordination that signals broader momentum', impact: 'House and Senate are moving in parallel. This is not a single-committee effort; it is a coordinated campaign across chambers.' },
      { detail: 'Delgado\'s bipartisan substitute in HELP markup was designed to be acceptable to Finance Committee Republicans — a deliberate bridge strategy', impact: 'The compromise is not accidental. It was engineered to clear the Finance Committee where Nakamura and other swing votes sit.' },
    ],
    expertGap: 'Mapping a senator\'s full legislative strategy requires tracking their activity across multiple committees, both chambers, and related legislation. Most government affairs teams assign this to a senior director who manually monitors 3-4 committees. Vrin surfaces the complete strategy map in one query.',
  },
  'pharma-lobbying-effectiveness': {
    headline: 'Standard RAG returned PhRMA\'s spending totals. Vrin cross-referenced the lobbying strategy against actual senator behavior over 9 months — revealing that PhRMA\'s $85K investment in Nakamura is failing to hold his opposition.',
    metrics: [
      { label: 'Lobbying-to-behavior links', rag: 0, vrin: 4 },
      { label: 'Timeline depth', rag: 1, vrin: 4 },
      { label: 'Strategy gaps identified', rag: 0, vrin: 3 },
      { label: 'Documents cross-referenced', rag: 2, vrin: 5 },
    ],
    missed: [
      { detail: 'PhRMA\'s internal strategic memo prioritized "maintain Nakamura\'s opposition" — but his March 2026 hearing language directly contradicts this goal', impact: 'The lobbying strategy is failing on its primary target. This is actionable intelligence for anyone on either side of the issue.' },
      { detail: 'Whitfield declined all but one PhRMA meeting and took $0 in contributions — her immunity to lobbying pressure is a data point, not just an absence', impact: 'Knowing who cannot be influenced is as valuable as knowing who can. It changes where lobbying resources should be allocated.' },
      { detail: 'The Archer & Hollis client memo independently confirms Nakamura\'s shift, suggesting it is visible beyond PhRMA\'s own assessment', impact: 'When third-party analysts are flagging the same shift, it is not speculation — it is market consensus. Your client needs to plan for Nakamura voting yes.' },
    ],
    expertGap: 'Evaluating lobbying effectiveness requires correlating spending data with behavioral outcomes over time — something no single document contains. Lobby firms do this analysis quarterly for premium clients at $10K+ per report. Vrin does it from the source data in seconds.',
  },
  'bipartisan-compromise-path': {
    headline: 'Standard RAG found mentions of "bipartisan" in transcripts. Vrin mapped the actual coalition: Delgado\'s framework in HELP, Okafor\'s Republican support in Energy & Commerce, and Nakamura\'s evolving openness in Finance — a coordinated path across three committees.',
    metrics: [
      { label: 'Committees connected', rag: 1, vrin: 3 },
      { label: 'Coalition members identified', rag: 1, vrin: 5 },
      { label: 'Compromise provisions mapped', rag: 0, vrin: 4 },
      { label: 'Vote signals found', rag: 0, vrin: 3 },
    ],
    missed: [
      { detail: 'Delgado\'s substitute amendment has three specific compromises — phased implementation, R&D tax credit, and sunset clause — each designed to address a specific Republican objection', impact: 'These are not generic "bipartisan" gestures. Each provision maps to a named objection from a specific senator. Your client can lobby on each provision separately.' },
      { detail: 'The HELP markup passed 16-6 with 4 Republican votes — a concrete bipartisan signal, not just rhetoric', impact: 'This is a vote count, not a quote. It tells you the compromise framework has real support, not just talk.' },
      { detail: 'Nakamura\'s staff attended the HELP markup as observers — signaling Finance Committee interest in the compromise framework before it arrives for their consideration', impact: 'Staff observation is a leading indicator. If Nakamura\'s health policy director is watching the HELP compromise, Finance Committee action is being prepared.' },
    ],
    expertGap: 'Tracking a bipartisan coalition across three committees in two chambers requires monitoring hearings, markups, staff movements, and vote counts simultaneously. Most firms assign 2-3 analysts to cover a single major bill. Vrin connects all the signals into one coherent coalition map.',
  },
}

export function ComparisonInline({
  selectedQuery,
  ragResult,
  vrinResult,
}: ComparisonInlineProps) {
  if (!ragResult || !vrinResult) return null

  const insight = QUERY_INSIGHTS[selectedQuery.id]
  if (!insight) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 rounded-xl border border-[#8DAA9D]/20 bg-[#8DAA9D]/[0.03] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#8DAA9D]/10">
        <h3 className="text-base font-semibold text-white/90 mb-2">
          What Vrin found that standard RAG missed
        </h3>
        <p className="text-sm text-white/55 leading-relaxed">
          {insight.headline}
        </p>
      </div>

      {/* Comparison bars */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {insight.metrics.map((metric, i) => (
            <ComparisonBar key={metric.label} metric={metric} index={i} />
          ))}
        </div>
      </div>

      {/* Key missed details */}
      <div className="px-6 py-5 space-y-4">
        <p className="text-xs text-white/30 uppercase tracking-wider font-medium">Details only Vrin surfaced</p>
        {insight.missed.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.15 }}
            className="flex gap-3"
          >
            <div className="mt-0.5 flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-400/70" />
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium leading-relaxed">
                {item.detail}
              </p>
              <p className="text-xs text-white/40 mt-1 leading-relaxed">
                {item.impact}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expert gap */}
      <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5">
        <div className="flex gap-3">
          <Clock className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-white/40 leading-relaxed">
            <span className="text-white/55 font-medium">Without Vrin: </span>
            {insight.expertGap}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
