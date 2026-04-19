'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  Scale,
  BarChart3,
  Stethoscope,
  Headphones,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Shield,
  GitBranch,
  TrendingUp,
  Zap,
  Network,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

const problems = [
  {
    icon: Network,
    title: 'Agents hallucinate without structured knowledge',
    description:
      'Vector search returns similar-looking text chunks. Your agents need actual facts with relationships: who, what, when, and how they connect.',
  },
  {
    icon: GitBranch,
    title: 'No provenance means no trust',
    description:
      "When your enterprise customer asks 'where did the AI get that answer?', you need to point to specific facts from specific documents. Not 'it was in the embeddings.'",
  },
  {
    icon: Shield,
    title: 'Data sovereignty is non-negotiable',
    description:
      'Your enterprise customers require their data stays in their cloud. You need a reasoning layer that supports isolated deployments per customer.',
  },
  {
    icon: TrendingUp,
    title: 'Building in-house takes 6-12 months',
    description:
      'Custom knowledge graph pipelines, fact extraction, multi-hop traversal, temporal versioning. Your team should ship product features, not infrastructure.',
  },
]

const useCases = [
  {
    icon: Scale,
    industry: 'Legal AI',
    title: 'Trace answers to specific clauses and precedents',
    description:
      "Legal agents need to cite exactly where an answer came from: which contract clause, which regulation, which precedent. Vrin's fact-level provenance gives your agents the audit trail regulated industries demand.",
    result: 'Every legal conclusion traceable to source documents',
  },
  {
    icon: BarChart3,
    industry: 'Financial AI',
    title: 'Reason across filings, reports, and market data',
    description:
      "Financial agents need to connect data across quarterly reports, analyst notes, and regulatory filings, with temporal awareness. Vrin's bi-temporal knowledge graph tracks what was true in Q2 vs Q3, not just what's latest.",
    result: 'Cross-document reasoning with temporal versioning',
  },
  {
    icon: Stethoscope,
    industry: 'Healthcare AI',
    title: 'Connect clinical notes, research, and guidelines',
    description:
      'Healthcare agents deal with patient data, clinical research, and treatment guidelines that evolve. Vrin ensures every recommendation traces to specific evidence, with automatic conflict resolution when guidelines change.',
    result: 'Evidence-based recommendations with full provenance',
  },
  {
    icon: Headphones,
    industry: 'Customer Support AI',
    title: 'Answer complex tickets across all knowledge sources',
    description:
      "Support agents need to reason across tickets, docs, Slack threads, and product notes simultaneously. Vrin's multi-hop reasoning connects the dots that keyword search misses, with cited sources for every answer.",
    result: 'Cross-system reasoning with source-backed answers',
  },
]

const howItWorks = [
  {
    step: '01',
    title: "Connect your customer's knowledge",
    description:
      "Vrin connects to your customer's data sources (documents, APIs, databases) and extracts structured facts into a temporal knowledge graph. Each customer gets an isolated knowledge graph in their own cloud.",
  },
  {
    step: '02',
    title: 'Your agents reason, not just retrieve',
    description:
      "When your agent asks Vrin a question, it doesn't just return similar text. It decomposes the question, traverses entity relationships across documents, and assembles precisely the context your LLM needs.",
  },
  {
    step: '03',
    title: 'Every answer is traceable',
    description:
      'Vrin returns not just the answer context, but the specific facts it used, the documents they came from, and confidence scores. Your agents can cite sources, building trust with enterprise customers.',
  },
]

const codeExamples = {
  sdk: `from vrin import VRINClient

client = VRINClient(api_key="vrin_live_your_api_key")

# Your agent asks Vrin for reasoning
result = client.query(
    "What changed in ACME's revenue between Q2 and Q3?",
    query_depth="research"
)

# Traceable answer with sources
print(result["summary"])
for source in result["sources"]:
    print(f"  - {source['document']}: {source['fact']}")`,
  mcp: `// In your MCP-compatible agent (Claude, Cursor, etc.)
// Vrin exposes these tools automatically:

vrin_query      → Ask complex questions, get reasoned answers
vrin_retrieve   → Get structured context for your own generation
vrin_get_facts  → Retrieve specific facts about entities
vrin_search_entities → Find entities in the knowledge graph`,
  api: `curl -X POST https://api.vrin.cloud/query \\
  -H "Authorization: Bearer vrin_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Which suppliers had delivery delays in Q4?",
    "query_depth": "research",
    "stream": true
  }'`,
}

const faqs = [
  {
    q: 'How is this different from just using a vector database?',
    a: 'Vector databases find text chunks that look similar. Vrin builds a structured knowledge graph (entities, relationships, timestamps, confidence scores) and reasons across them. For simple questions, vector search works fine. For questions that span multiple documents, require temporal awareness, or need audit trails, you need a knowledge graph.',
  },
  {
    q: 'Can each of my customers have their own isolated instance?',
    a: "Yes. Vrin's enterprise routing (vrin_ent_* API keys) deploys each customer's knowledge graph in their own AWS account. Their data never touches our infrastructure or any other customer's environment. This is built-in, not an add-on.",
  },
  {
    q: 'What LLMs does Vrin work with?',
    a: 'All of them. Vrin is the reasoning layer, not the model. It works with GPT, Claude, Gemini, open-source models, or any LLM your customers prefer. You bring the model, Vrin provides the structured context.',
  },
  {
    q: 'How long does integration take?',
    a: 'The SDK integration is a few lines of Python. Most teams have a working prototype within a day. Production deployment (including knowledge ingestion, testing, and customer data isolation) typically takes 1-2 weeks.',
  },
  {
    q: 'What benchmarks can I show my customers?',
    a: 'Vrin tops both the MultiHop-RAG and MuSiQue leaderboards. 95.1% Semantic Accuracy on MultiHop-RAG (vs 78.9% for ChatGPT 5.2 with oracle context) and 47.8% Exact Match on MuSiQue (ahead of StepChain GraphRAG 43.9%, HopRAG 42.2%, SiReRAG 40.5%, and HippoRAG 2 37.2%). Published, reproducible results.',
  },
  {
    q: 'Does Vrin handle document updates and contradictions?',
    a: "Yes. Vrin's temporal knowledge graph versions every fact with timestamps. When a new document contradicts an older fact, Vrin automatically detects the contradiction and preserves both versions with their temporal context. Your agents always know what's current.",
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-vrin-charcoal/10 last:border-0">
      <button
        className="w-full flex items-center justify-between py-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-display text-lg md:text-xl text-vrin-charcoal pr-4 leading-tight">
          {q}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-vrin-charcoal/40 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-vrin-charcoal/40 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <p className="pb-6 text-base text-vrin-charcoal/65 leading-relaxed max-w-3xl">{a}</p>
      )}
    </div>
  )
}

export default function ForAgentsPage() {
  const [activeTab, setActiveTab] = useState<'sdk' | 'mcp' | 'api'>('sdk')

  const [useCasesRef, useCasesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [codeRef, codeInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="flex flex-col bg-vrin-paper">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-24 md:pb-28 overflow-hidden vignette-paper">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <span className="eyebrow text-vrin-blue">For agent builders</span>
            <span className="hairline flex-1" />
            <span className="hidden md:inline text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
              OEM · embeddable · sovereign
            </span>
          </div>

          <div className="max-w-5xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] tracking-[-0.035em] text-vrin-charcoal"
            >
              Give your agents a
              <br />
              <span className="serif-italic text-vrin-blue">reasoning engine</span>{' '}
              they can trust.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="mt-8 max-w-2xl text-lg md:text-xl text-vrin-charcoal/65 leading-relaxed"
            >
              Your agents are only as good as the knowledge behind them. Vrin
              structures enterprise documents into a temporal knowledge graph and
              reasons across it, so your agents deliver traceable answers, not
              hallucinations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.35 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/waitlist"
                className="group inline-flex items-center gap-2 rounded-full bg-vrin-charcoal px-7 py-4 text-sm font-medium text-vrin-cream hover:bg-vrin-blue transition-all duration-300 hover:-translate-y-0.5"
              >
                Join the waitlist
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
              <a
                href="https://cal.com/vedant-vrin/book-a-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-vrin-charcoal/20 px-7 py-4 text-sm font-medium text-vrin-charcoal hover:border-vrin-charcoal/50 hover:bg-vrin-sand/40 transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                Talk to our team
              </a>
            </motion.div>

            {/* Proof chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-3"
            >
              {[
                '95.1% on MultiHop-RAG',
                'Tops MuSiQue leaderboard',
                'Data stays in your cloud',
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-vrin-charcoal/15 bg-vrin-cream/60 px-4 py-2 text-xs font-mono tracking-tight text-vrin-charcoal/75"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-vrin-blue" />
                  {chip}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problems — dark */}
      <section className="relative bg-vrin-ink py-28 md:py-36 overflow-hidden rounded-[3rem] md:rounded-[4rem]">
        <div className="absolute inset-0 grid-faint-dark opacity-50 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-sage">The problem</span>
              <span className="hairline flex-1 opacity-40" />
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-cream">
              Why your agents{' '}
              <span className="serif-italic text-vrin-sage">fall short.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-vrin-cream/60 leading-relaxed">
              You built a great agent. But when enterprise customers ask hard
              questions that span multiple documents, need temporal context, or
              require audit trails, your agent guesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-5xl">
            {problems.map((problem, i) => {
              const Icon = problem.icon
              return (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease }}
                  className="p-8 rounded-3xl border border-vrin-cream/10 bg-vrin-charcoal/40"
                >
                  <div className="w-11 h-11 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-vrin-sage" />
                  </div>
                  <h3 className="font-display text-2xl leading-[1.15] text-vrin-cream mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-vrin-cream/60 leading-relaxed">
                    {problem.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">How it works</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
              Connect. Reason.{' '}
              <span className="serif-italic text-vrin-blue">Trace.</span>
            </h2>
          </div>

          <div className="max-w-4xl space-y-10 md:space-y-12">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
                className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
              >
                <span className="font-mono text-sm tracking-widest text-vrin-charcoal/40">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl leading-[1.15] tracking-[-0.02em] text-vrin-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-vrin-charcoal/65 leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10" ref={useCasesRef}>
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Use cases</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
              One reasoning engine,
              <br />
              <span className="serif-italic text-vrin-blue">every</span> vertical.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed">
              Whether you&apos;re building for legal, finance, healthcare, or
              support, your agents need the same thing: structured knowledge
              reasoning with traceable answers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-6xl">
            {useCases.map((useCase, i) => {
              const Icon = useCase.icon
              return (
                <motion.div
                  key={useCase.industry}
                  initial={{ opacity: 0, y: 20 }}
                  animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1, ease }}
                  className="p-8 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60 hover:border-vrin-charcoal/25 transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-vrin-blue" />
                    </div>
                    <span className="eyebrow text-vrin-blue">
                      {useCase.industry}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl leading-[1.15] tracking-[-0.02em] text-vrin-charcoal mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-vrin-charcoal/65 leading-relaxed mb-5">
                    {useCase.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-vrin-blue">
                    <CheckCircle className="w-4 h-4" />
                    <span className="serif-italic">{useCase.result}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integration — dark */}
      <section className="relative bg-vrin-ink py-28 md:py-36 overflow-hidden rounded-[3rem] md:rounded-[4rem]">
        <div className="absolute inset-0 grid-faint-dark opacity-50 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10" ref={codeRef}>
          <div className="max-w-4xl mb-14">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-sage">Integration</span>
              <span className="hairline flex-1 opacity-40" />
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-cream">
              A few lines to add{' '}
              <span className="serif-italic text-vrin-sage">reasoning.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-vrin-cream/60 leading-relaxed">
              Drop-in integration via Python SDK, MCP server, or REST API. Your
              agents get structured knowledge reasoning without changing your
              architecture.
            </p>
          </div>

          <div className="max-w-4xl">
            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {(['sdk', 'mcp', 'api'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-vrin-sage text-vrin-ink'
                      : 'border border-vrin-cream/20 text-vrin-cream/60 hover:text-vrin-cream hover:border-vrin-cream/40'
                  }`}
                >
                  {tab === 'sdk' ? 'Python SDK' : tab === 'mcp' ? 'MCP Server' : 'REST API'}
                </button>
              ))}
            </div>

            {/* Code */}
            <div className="rounded-3xl border border-vrin-cream/10 bg-vrin-charcoal/60 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-vrin-cream/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/50" />
                </div>
                <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-cream/40">
                  vrin · {activeTab}
                </span>
                <span className="text-[11px] font-mono text-vrin-cream/30">v1.2.0</span>
              </div>
              <pre className="p-8 text-[13px] font-mono leading-[1.7] text-vrin-cream/85 overflow-x-auto">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* B2B2B */}
      <section className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Scale</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
              One integration. Hundreds of
              <br />
              <span className="serif-italic text-vrin-blue">enterprise</span>{' '}
              deployments.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed">
              You build the agent. Vrin handles the knowledge reasoning. Each of
              your enterprise customers gets their own isolated knowledge graph in
              their own cloud, with data sovereignty built in, not bolted on.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-6xl">
            {[
              {
                icon: Zap,
                title: 'Ship faster',
                blurb:
                  'Skip 6-12 months of infrastructure building. Add knowledge reasoning to your agent in days.',
              },
              {
                icon: Shield,
                title: 'Data isolation',
                blurb:
                  "Each customer's knowledge graph runs in their own cloud. Enterprise-grade data sovereignty per deployment.",
              },
              {
                icon: TrendingUp,
                title: 'Improves over time',
                blurb:
                  "Vrin's knowledge graph consolidates and strengthens with every query. Your agents get smarter the more they're used.",
              },
            ].map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease }}
                  className="p-8 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60"
                >
                  <div className="w-11 h-11 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-vrin-blue" />
                  </div>
                  <h3 className="font-display text-2xl leading-[1.15] text-vrin-charcoal mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-vrin-charcoal/65 leading-relaxed">
                    {card.blurb}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <section className="relative bg-vrin-cream py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Benchmarks</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
              Independently verified{' '}
              <span className="serif-italic text-vrin-blue">accuracy.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed">
              Published results on standard academic benchmarks. Not marketing
              claims. Reproducible measurements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
            {[
              {
                value: '95.1%',
                label: 'MultiHop-RAG',
                detail:
                  'Tops the leaderboard on Semantic Accuracy. 16.2pp above ChatGPT 5.2 with oracle context.',
              },
              {
                value: '#1',
                label: 'MuSiQue',
                detail:
                  'Leads the leaderboard on Exact Match (47.8%) across StepChain GraphRAG, HopRAG, SiReRAG, HippoRAG 2.',
              },
            ].map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
                className="p-8 md:p-10 rounded-3xl border border-vrin-charcoal/10 bg-vrin-paper/80"
              >
                <div className="font-display text-6xl md:text-7xl leading-none text-vrin-charcoal mb-4">
                  {b.value}
                </div>
                <p className="eyebrow text-vrin-blue mb-3">{b.label}</p>
                <p className="text-sm text-vrin-charcoal/65 leading-relaxed">
                  {b.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mb-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Frequently asked</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
              Common <span className="serif-italic text-vrin-blue">questions.</span>
            </h2>
          </div>
          <div className="max-w-4xl">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="w-10 h-px bg-vrin-charcoal/20" />
            <span className="eyebrow text-vrin-charcoal/50">Plug it in</span>
            <span className="w-10 h-px bg-vrin-charcoal/20" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] text-vrin-charcoal">
            Give your agents the reasoning
            <br />
            they <span className="serif-italic text-vrin-blue">deserve.</span>
          </h2>

          <p className="mt-8 max-w-xl mx-auto text-lg text-vrin-charcoal/65 leading-relaxed">
            Start with the free tier. Integrate in minutes. Scale to hundreds of
            enterprise deployments.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/waitlist"
              className="group inline-flex items-center gap-2 rounded-full bg-vrin-charcoal px-7 py-4 text-sm font-medium text-vrin-cream hover:bg-vrin-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              Join the waitlist
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
            <a
              href="https://cal.com/vedant-vrin/book-a-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-vrin-charcoal/20 px-7 py-4 text-sm font-medium text-vrin-charcoal hover:border-vrin-charcoal/50 hover:bg-vrin-sand/40 transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              Talk to our team
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
