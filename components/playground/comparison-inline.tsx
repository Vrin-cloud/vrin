"use client"

import { motion } from "framer-motion"
import { Clock, ShieldAlert, MessageSquare, DollarSign } from "lucide-react"
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
  followUpQueries?: string[]
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
  'research-blind-spot': {
    headline: 'Standard RAG identified the gap in 4 papers. Vrin connected 7 — including a vector search engine and a reasoning paper — and proposed a research direction that spans databases, APIs, and graphs, not just text search.',
    metrics: [
      { label: 'Papers connected to the blind spot', rag: 4, vrin: 7 },
      { label: 'Distinct research directions proposed', rag: 1, vrin: 3 },
      { label: 'Cross-domain connections made', rag: 0, vrin: 4 },
      { label: 'Actionable research ideas', rag: 2, vrin: 5 },
    ],
    missed: [
      {
        detail: 'Standard RAG says the gap is: "make your text search smarter — retrieve better, correct bad retrieval, decide when to search." Vrin says the gap is bigger: "your AI doesn\'t just search text. It also queries databases, calls APIs, reads knowledge graphs. Nobody\'s built the brain that coordinates all of them together." Vrin pulled this from entities across the papers that standard RAG ignored entirely — SQL queries, HTTP responses, data pipelines. Same blind spot, but a much bigger version of it.',
        impact: 'A researcher reading the standard RAG answer builds a better retriever. A researcher reading Vrin\'s answer builds a multi-backend orchestration layer. Different research program entirely.',
      },
      {
        detail: 'Standard RAG found the pattern in 4 papers (Adaptive-RAG, CRAG, iterative retrieval, graph retrieval). Vrin found it in 7 — and connected papers you wouldn\'t expect. It pulled in Qdrant (a vector search engine) and showed that even state-of-the-art search technology has this blind spot. It pulled in STaR (a reasoning paper) and showed the same gap from the opposite side. More dots connected = a stronger thesis.',
        impact: 'Standard RAG never mentions specific search technologies. Vrin proves the gap exists even in cutting-edge tools — it\'s not a retrieval quality problem, it\'s a control problem.',
      },
      {
        detail: 'Standard RAG\'s proposed direction: pick a strategy (simple, medium, complex) based on how hard the question looks, then execute. Vrin caught a nuance: that\'s not enough. It specifically identified that Adaptive-RAG picks strategy once at the start, but what if your first search result changes everything? Vrin\'s proposed direction: adapt at every step as you learn new information.',
        impact: 'Adapting once means your first wrong result locks you in. Adapting per-step means the system recovers and course-corrects. Small difference in phrasing, big difference in the research program.',
      },
      {
        detail: 'Standard RAG proposes training a controller with feedback signals. Vrin went further: connect STaR\'s self-improvement idea specifically to search decisions. The system should generate "search rationales" — why it chose to look here and not there — and learn from successful search paths. It\'s the difference between "train a better searcher" and "build a searcher that teaches itself."',
        impact: 'One is a model you train once. The other is a system that improves with every query it runs. That\'s a fundamentally different research agenda.',
      },
      {
        detail: 'Standard RAG mentions hallucination as a general risk. Vrin identified a specific failure mode that standard RAG missed: AI can build perfectly logical arguments on unchecked facts — "self-consistent but ungrounded" — and never know to verify them. Your AI sounds smart. Its logic is flawless. But it\'s reasoning on top of facts it never bothered to double-check.',
        impact: 'Knowing the general risk ("hallucination") doesn\'t help you fix it. Knowing the specific mechanism — confident reasoning over unverified facts — tells you exactly where to add guardrails.',
      },
    ],
    expertGap: 'Standard RAG tells you the blind spot exists. Vrin tells you what to do about it — across text, databases, graphs, and APIs — with concrete components (working memory, action space, verification layer) that a research team could start building tomorrow.',
  },
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
    headline: 'Both systems identified Whitfield as the only cross-committee senator. But Vrin backed the answer with specific cost data, historical context, bill provisions, and stakeholder mapping that RAG did not surface.',
    metrics: [
      { label: 'Specific data points cited', rag: 4, vrin: 14 },
      { label: 'Cost figures provided', rag: 1, vrin: 4 },
      { label: 'Stakeholders mapped', rag: 1, vrin: 5 },
      { label: 'Bill provisions detailed', rag: 2, vrin: 5 },
    ],
    missed: [
      { detail: 'Insulin cost trajectory: commercially insured patients went from $47/month (2018) to $112/month (2025). Uninsured patients average $387/month', impact: 'These numbers are what make the case to a client. Without the cost trajectory, your brief says "prices are high" — with it, you show the acceleration that makes legislation inevitable.' },
      { detail: 'Insulin is over 100 years old (Banting and Best), R&D costs were recouped decades ago, and newest analogs have been on market 15-20 years', impact: 'This undercuts the industry\'s main argument (R&D costs justify prices). A lobbyist armed with this historical context can preempt PhRMA\'s talking points.' },
      { detail: 'The bill requires a GAO report evaluating effects on prices, access, R&D investment, insurance premiums, and PBM practices — a built-in review mechanism', impact: 'This sunset/review provision is a key selling point for persuadable Republicans. If your client is lobbying swing votes, this is the "safety valve" argument.' },
    ],
    expertGap: 'Both systems got the right answer (Whitfield is the only cross-committee senator). The difference is depth of evidence. RAG gives you a summary you could have written from memory. Vrin gives you the cost data, historical context, and bill mechanics that make a client brief actionable.',
    followUpQueries: [
      'What is the average out-of-pocket cost trajectory for insulin over the past 7 years, for both insured and uninsured patients?',
      'How old is insulin as a drug, and have the original R&D costs been recouped?',
      'Does S.1847 include a GAO review mechanism, and what does it evaluate?',
      'Which expert witnesses testified in Finance vs HELP, and what were their key arguments?',
    ],
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
    followUpQueries: [
      'How many constituent contacts did Nakamura receive on drug pricing, and in what forms?',
      'What are the specific provisions of S.1847 — copayment cap start date, PBM disclosure requirements, manufacturer rebate floor?',
      'Is there a House companion bill to S.1847?',
      'What was the CBO breakdown by program — Medicare Part D savings, Medicaid savings, revenue impact?',
    ],
  },
  'insulin-cap-landscape': {
    headline: 'Both systems found the bill status and CBO score. Vrin went deeper: the actual HELP vote count (16-6), named senator positions (Morrison opposes, Nakamura uncommitted), specific enforcement penalties, CBO budget line breakdown, and provisions RAG didn\'t surface like the anti-cost-shifting prohibition and sunset clause.',
    metrics: [
      { label: 'Bill provisions detailed', rag: 5, vrin: 12 },
      { label: 'Named positions identified', rag: 2, vrin: 5 },
      { label: 'CBO line items cited', rag: 1, vrin: 5 },
      { label: 'Enforcement mechanisms found', rag: 1, vrin: 4 },
    ],
    missed: [
      { detail: 'CBO breakdown: $9.8B Medicare Part D savings, $3.1B Medicaid savings, $620M admin costs, $1.3B tax revenue increase — with an expected revised score of $10-12B after R&D credit and phase-in adjustments', impact: 'RAG knew a CBO score existed. Vrin found the line-item breakdown and the expected revision. Your client needs the breakdown to argue for or against specific provisions, and the revision to know where the score is heading.' },
      { detail: 'Named senator positions: Morrison opposes, Nakamura uncommitted (swing), Callahan co-sponsored — the Finance Committee negotiation hinges on these votes', impact: 'Generic "bipartisan support" is not actionable. Named vote positions are. Your client\'s lobbying strategy should be different for each of these three senators.' },
      { detail: 'Anti-cost-shifting provision prohibits insurers from raising non-insulin premiums to offset the cap, plus a HHS monitoring program to detect cost-shifting', impact: 'This preempts the insurance industry\'s main objection. If your client is an insurer, this provision directly constrains their pricing. If your client supports the bill, this is a talking point that neutralizes opposition.' },
    ],
    expertGap: 'Both systems produced reasonable landscape summaries. The difference is between a briefing a junior analyst could draft from public sources and one that a senior director with committee access would produce — specific vote counts, named positions, enforcement details, and budget line items that change how your client acts.',
    followUpQueries: [
      'What was the exact HELP Committee vote count on S.1847, and how many Republicans voted yes?',
      'Which specific senators oppose, support, or are uncommitted on S.1847 in Finance?',
      'What are the CBO savings by program — Medicare Part D, Medicaid, and tax revenue separately?',
      'What enforcement penalties does the bill include for PBMs and manufacturers specifically?',
      'Does the bill have anti-cost-shifting provisions to prevent insurers from raising other premiums?',
    ],
  },
  'whitfield-legislative-strategy': {
    headline: 'Both systems identified the two-committee pathway. Vrin uncovered the full strategy: a three-year phase-in and five-year sunset as deliberate compromise tools, anti-cost-shifting guardrails, PBM transparency mandates, and enforcement mechanisms — the complete architecture of how Whitfield designed the bill to survive opposition.',
    metrics: [
      { label: 'Bill provisions detailed', rag: 4, vrin: 14 },
      { label: 'Strategic mechanisms found', rag: 2, vrin: 7 },
      { label: 'Enforcement details cited', rag: 0, vrin: 4 },
      { label: 'Related legislation connected', rag: 0, vrin: 2 },
    ],
    missed: [
      { detail: 'Three-year phase-in + five-year sunset clause are not just implementation details — they are deliberate negotiation tools. The sunset lets Whitfield tell skeptics "this is time-limited and testable, not permanent price-setting"', impact: 'If your client is lobbying swing votes, the sunset clause is the single most useful talking point. It reframes the bill from "permanent government price control" to "a trial we can evaluate and extend."' },
      { detail: 'Anti-cost-shifting provision: insurers are prohibited from raising non-insulin premiums to offset the cap, with HHS monitoring to enforce compliance', impact: 'This preempts the insurance industry\'s main argument against the bill. If your client is an insurer, this directly constrains pricing. If your client supports the bill, this neutralizes the "hidden cost" objection.' },
      { detail: 'Whitfield is running a two-bill strategy: S.1847 (price cap) paired with S.892 (PBM Transparency Act) — she frames drug pricing and PBM reform as "two faces of the same coin"', impact: 'Tracking S.1847 alone misses half the strategy. S.892 could pass independently even if the cap stalls, and together they address both demand and supply-side pricing.' },
    ],
    expertGap: 'RAG found the committee pathway. Vrin found the legislative architecture — the specific provisions Whitfield designed to neutralize opposition, the enforcement teeth that make the bill credible, and the multi-bill strategy that gives her fallback positions. That is the difference between a committee tracker and a legislative strategist.',
    followUpQueries: [
      'Does S.1847 include a sunset clause, and what is its purpose strategically?',
      'Are there anti-cost-shifting provisions in the bill, and how are they enforced?',
      'Is Whitfield pursuing related legislation beyond S.1847, and how do the bills work together?',
      'What are the specific enforcement penalties for PBM and manufacturer noncompliance?',
    ],
  },
  'pharma-lobbying-effectiveness': {
    headline: 'RAG concluded lobbying "didn\'t work" because the bill advanced. Vrin gave the nuanced answer: mixed success. PhRMA has kept Finance Committee outcome "trending unfavorable" but hasn\'t stopped the bill. Vrin found the committee math, PhRMA\'s white paper, and the specific dynamics RAG missed.',
    metrics: [
      { label: 'Committee dynamics analyzed', rag: 1, vrin: 5 },
      { label: 'Named members positioned', rag: 2, vrin: 5 },
      { label: 'PhRMA tactics identified', rag: 0, vrin: 4 },
      { label: 'Vote math details', rag: 0, vrin: 3 },
    ],
    missed: [
      { detail: 'Finance Committee math: 28 members (15D, 13R), 15 votes needed to report. PhRMA can succeed if it peels off even one Democrat — that is the precise tactical pressure point', impact: 'RAG said lobbying "didn\'t work." Vrin shows exactly how narrow the margin is and why PhRMA\'s strategy is focused on Finance specifically. One defection changes the outcome.' },
      { detail: 'PhRMA published a white paper "Innovation at Risk: The Hidden Costs of Price Controls" and pushed an alternative model claiming CBO underestimated R&D impact by $4.8 billion', impact: 'This is the industry\'s counter-narrative. If your client is preparing testimony or talking points, they need to address this specific argument — not generic "industry opposes" framing.' },
      { detail: 'RAG\'s conclusion was binary: lobbying failed because the bill moved. Vrin\'s conclusion was nuanced: lobbying has kept the Finance outcome uncertain and "trending unfavorable" while not being able to collapse support entirely', impact: 'The difference between "lobbying failed" and "lobbying partially succeeded" changes every strategic recommendation. Your client\'s next move depends on which assessment is right.' },
    ],
    expertGap: 'RAG gave a pass/fail assessment. Vrin gave a strategic assessment — specific committee math, named PhRMA tactics, and a nuanced effectiveness evaluation. That is the difference between a news summary and a lobbying firm\'s quarterly report.',
    followUpQueries: [
      'What is the Finance Committee member breakdown by party, and how many votes are needed to report?',
      'Has PhRMA published any specific counter-arguments or white papers against S.1847?',
      'Which specific Finance Committee members has PhRMA lobbied, and what were the outcomes?',
      'What is the current Finance Committee outlook — is it trending favorable or unfavorable for the bill?',
    ],
  },
  'bipartisan-compromise-path': {
    headline: 'RAG found the cap structure and named the sponsors but couldn\'t identify any Republican drivers or the compromise mechanics. Vrin mapped Delgado\'s three-pillar framework (affordability + PBM transparency + innovation protection), the specific R&D tax credit definition, small manufacturer exemption, and the phased uninsured discount.',
    metrics: [
      { label: 'Compromise pillars identified', rag: 1, vrin: 3 },
      { label: 'Named members with positions', rag: 2, vrin: 5 },
      { label: 'Specific provisions mapped', rag: 2, vrin: 8 },
      { label: 'Innovation safeguards found', rag: 0, vrin: 3 },
    ],
    missed: [
      { detail: 'Delgado\'s compromise defines "qualifying insulin R&D expenditures" as Phase I-III clinical trial costs for novel formulations, delivery systems, and biosimilars — an R&D tax credit that does not sunset even if the price cap does', impact: 'This is the provision designed to bring Republicans on board. It lets them say "we protected innovation" while voting for a price cap. Without knowing this exists, your lobbying strategy misses the bridge that makes the coalition work.' },
      { detail: 'Small manufacturer exemption: companies with annual U.S. insulin revenue below $50 million are exempt from the price cap provisions', impact: 'This carve-out is a targeted concession to the "don\'t hurt small innovators" argument. If your client is a small manufacturer, they are exempt. If your client is a large manufacturer, this narrows their coalition against the bill.' },
      { detail: 'RAG could not name a single Republican driving the compromise. Vrin identified specific members, their committee positions, and their stances — the actual coalition map, not just "bipartisan sponsorship"', impact: 'Knowing WHO the Republican supporters are is the difference between a press statement and a whip count. Your client needs names to allocate lobbying resources.' },
    ],
    expertGap: 'RAG described a bipartisan bill. Vrin described a bipartisan deal — the specific provisions each side traded to get to 16-6 in HELP, and the innovation protections that make the price cap politically survivable. That is the difference between reading a press release and understanding the negotiation.',
    followUpQueries: [
      'What specific R&D tax credit is included in the compromise, and what qualifies as eligible R&D?',
      'Are small insulin manufacturers exempt from the price cap, and what is the revenue threshold?',
      'Which Republican members voted for the bill in the HELP markup?',
      'How is the uninsured discount program phased in — what are the year-by-year caps?',
    ],
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

      {/* Follow-up queries an expert would need */}
      {insight.followUpQueries && insight.followUpQueries.length > 0 && (
        <div className="px-6 py-5 space-y-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-red-400/60" />
            <p className="text-xs text-white/30 uppercase tracking-wider font-medium">
              Follow-up queries an expert would need to match Vrin&apos;s response
            </p>
          </div>
          <div className="space-y-2">
            {insight.followUpQueries.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="flex gap-2.5 items-start"
              >
                <span className="text-[10px] text-red-400/40 font-mono mt-0.5 flex-shrink-0">Q{i + 1}</span>
                <p className="text-xs text-white/50 leading-relaxed italic">&ldquo;{q}&rdquo;</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-3 flex items-start gap-2.5 p-3 rounded-lg bg-[#8DAA9D]/5 border border-[#8DAA9D]/10"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#8DAA9D]/60 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-white/50 leading-relaxed">
              <span className="text-[#8DAA9D] font-medium">Cost comparison: </span>
              Standard RAG would need {insight.followUpQueries.length + 1} queries ({insight.followUpQueries.length} expert follow-ups) at ~$0.031 each = <span className="text-red-400/70 font-medium">${((insight.followUpQueries.length + 1) * 0.031).toFixed(3)}</span>.
              {" "}Vrin answered in 1 query at <span className="text-[#8DAA9D] font-medium">$0.046</span>.
              {" "}And that assumes an expert who already knows what to ask.
            </div>
          </motion.div>
        </div>
      )}

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
