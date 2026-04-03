"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import {
  Bot,
  Scale,
  BarChart3,
  Stethoscope,
  Headphones,
  ArrowRight,
  Calendar,
  CheckCircle,
  Code2,
  Puzzle,
  Globe,
  Shield,
  GitBranch,
  TrendingUp,
  Zap,
  Network,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { useState } from "react"

// Problems with current AI agents
const problems = [
  {
    icon: Network,
    title: "Agents hallucinate without structured knowledge",
    description: "Vector search returns similar-looking text chunks. Your agents need actual facts with relationships: who, what, when, and how they connect."
  },
  {
    icon: GitBranch,
    title: "No provenance means no trust",
    description: "When your enterprise customer asks 'where did the AI get that answer?', you need to point to specific facts from specific documents. Not 'it was in the embeddings.'"
  },
  {
    icon: Shield,
    title: "Data sovereignty is non-negotiable",
    description: "Your enterprise customers require their data stays in their cloud. You need a reasoning layer that supports isolated deployments per customer."
  },
  {
    icon: TrendingUp,
    title: "Building in-house takes 6-12 months",
    description: "Custom knowledge graph pipelines, fact extraction, multi-hop traversal, temporal versioning. Your team should ship product features, not infrastructure."
  }
]

// Use cases
const useCases = [
  {
    icon: Scale,
    industry: "Legal AI",
    title: "Trace answers to specific clauses and precedents",
    description: "Legal agents need to cite exactly where an answer came from: which contract clause, which regulation, which precedent. Vrin's fact-level provenance gives your agents the audit trail regulated industries demand.",
    result: "Every legal conclusion traceable to source documents"
  },
  {
    icon: BarChart3,
    industry: "Financial AI",
    title: "Reason across filings, reports, and market data",
    description: "Financial agents need to connect data across quarterly reports, analyst notes, and regulatory filings, with temporal awareness. Vrin's bi-temporal knowledge graph tracks what was true in Q2 vs Q3, not just what's latest.",
    result: "Cross-document financial reasoning with temporal versioning"
  },
  {
    icon: Stethoscope,
    industry: "Healthcare AI",
    title: "Connect clinical notes, research, and guidelines",
    description: "Healthcare agents deal with patient data, clinical research, and treatment guidelines that evolve. Vrin ensures every recommendation traces to specific evidence, with automatic conflict resolution when guidelines change.",
    result: "Evidence-based recommendations with full provenance"
  },
  {
    icon: Headphones,
    industry: "Customer Support AI",
    title: "Answer complex tickets across all knowledge sources",
    description: "Support agents need to reason across tickets, docs, Slack threads, and product notes simultaneously. Vrin's multi-hop reasoning connects the dots that keyword search misses, with cited sources for every answer.",
    result: "Cross-system reasoning with source-backed answers"
  }
]

// How it works steps
const howItWorks = [
  {
    step: "01",
    title: "Connect your customer's knowledge",
    description: "Vrin connects to your customer's data sources (documents, APIs, databases) and extracts structured facts into a temporal knowledge graph. Each customer gets an isolated knowledge graph in their own cloud."
  },
  {
    step: "02",
    title: "Your agents reason, not just retrieve",
    description: "When your agent asks Vrin a question, it doesn't just return similar text. It decomposes the question, traverses entity relationships across documents, and assembles precisely the context your LLM needs."
  },
  {
    step: "03",
    title: "Every answer is traceable",
    description: "Vrin returns not just the answer context, but the specific facts it used, the documents they came from, and confidence scores. Your agents can cite sources, building trust with enterprise customers."
  }
]

// Integration code examples
const codeExamples = {
  sdk: `from vrin import VRINClient

client = VRINClient(api_key="vrin_your_api_key")

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
  -H "Authorization: Bearer vrin_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Which suppliers had delivery delays in Q4?",
    "query_depth": "research",
    "stream": true
  }'`
}

// FAQs
const faqs = [
  {
    q: "How is this different from just using a vector database?",
    a: "Vector databases find text chunks that look similar. Vrin builds a structured knowledge graph (entities, relationships, timestamps, confidence scores) and reasons across them. For simple questions, vector search works fine. For questions that span multiple documents, require temporal awareness, or need audit trails, you need a knowledge graph."
  },
  {
    q: "Can each of my customers have their own isolated instance?",
    a: "Yes. Vrin's enterprise routing (vrin_ent_* API keys) deploys each customer's knowledge graph in their own AWS account. Their data never touches our infrastructure or any other customer's environment. This is built-in, not an add-on."
  },
  {
    q: "What LLMs does Vrin work with?",
    a: "All of them. Vrin is the reasoning layer, not the model. It works with GPT, Claude, Gemini, open-source models, or any LLM your customers prefer. You bring the model, Vrin provides the structured context."
  },
  {
    q: "How long does integration take?",
    a: "The SDK integration is a few lines of Python. Most teams have a working prototype within a day. Production deployment (including knowledge ingestion, testing, and customer data isolation) typically takes 1-2 weeks."
  },
  {
    q: "What benchmarks can I show my customers?",
    a: "Vrin scores 95.1% accuracy on MultiHop-RAG (vs. 78.9% for GPT-5.2 with the same documents) and is 28% more accurate than HippoRAG 2 (academic state-of-the-art) on MuSiQue multi-hop reasoning. These are published, reproducible results."
  },
  {
    q: "Does Vrin handle document updates and contradictions?",
    a: "Yes. Vrin's temporal knowledge graph versions every fact with timestamps. When a new document contradicts an older fact, Vrin automatically detects the contradiction and preserves both versions with their temporal context. Your agents always know what's current."
  }
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-[#201E1E]/10 dark:border-[#FFFFFF]/10 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-medium text-[#201E1E] dark:text-[#FFFFFF] pr-4">{q}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#201E1E]/40 dark:text-[#FFFFFF]/40 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#201E1E]/40 dark:text-[#FFFFFF]/40 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <p className="pb-5 text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  )
}

export default function ForAgentsPage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [problemsRef, problemsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [useCasesRef, useCasesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [howRef, howInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [codeRef, codeInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [activeTab, setActiveTab] = useState<'sdk' | 'mcp' | 'api'>('sdk')

  return (
    <div className="flex flex-col">
      <AnimatedBackground />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-vrin-cream dark:bg-vrin-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#083C5E]/5 dark:to-[#8DAA9D]/5" />

        <div className="container relative z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 border-[#083C5E]/20 dark:border-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D]">
              <Bot className="w-3 h-3 mr-2" />
              For AI Agent Builders
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight text-vrin-charcoal dark:text-vrin-cream mb-6">
              Give your AI agents a reasoning engine they can trust
            </h1>

            <p className="text-base md:text-lg text-vrin-charcoal/60 dark:text-vrin-cream/60 font-normal max-w-2xl mx-auto mb-10">
              Your agents are only as good as the knowledge behind them. Vrin structures enterprise
              documents into a temporal knowledge graph and reasons across it, so your agents
              deliver traceable answers, not hallucinations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-vrin-charcoal hover:bg-vrin-blue text-vrin-cream dark:bg-vrin-cream dark:text-vrin-charcoal dark:hover:bg-vrin-sage px-8 py-6 text-base font-medium rounded-full transition-all duration-300"
                onClick={() => window.location.href = '/waitlist'}
              >
                Join Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-medium border-2 border-vrin-charcoal/20 dark:border-vrin-cream/20 text-vrin-charcoal dark:text-vrin-cream hover:bg-vrin-sage/10 dark:hover:bg-vrin-blue/10 rounded-full transition-all duration-300"
                onClick={() => window.open("https://cal.com/vedant-vrin/book-a-demo", "_blank")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Talk to Our Team
              </Button>
            </div>

            {/* Benchmark proof chips */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#083C5E]/5 dark:bg-[#8DAA9D]/10 rounded-full">
                <CheckCircle className="w-4 h-4 text-[#083C5E] dark:text-[#8DAA9D]" />
                <span className="text-xs font-medium text-[#083C5E] dark:text-[#8DAA9D]">95.1% on MultiHop-RAG</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#083C5E]/5 dark:bg-[#8DAA9D]/10 rounded-full">
                <CheckCircle className="w-4 h-4 text-[#083C5E] dark:text-[#8DAA9D]" />
                <span className="text-xs font-medium text-[#083C5E] dark:text-[#8DAA9D]">28% better than academic SOTA</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#083C5E]/5 dark:bg-[#8DAA9D]/10 rounded-full">
                <CheckCircle className="w-4 h-4 text-[#083C5E] dark:text-[#8DAA9D]" />
                <span className="text-xs font-medium text-[#083C5E] dark:text-[#8DAA9D]">Your data stays in your cloud</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-24 bg-[#201E1E]">
        <div className="container">
          <motion.div
            ref={problemsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={problemsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D] mb-4 block">
              The Problem
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#FFFFFF] mb-6">
              Why your AI agents fall short
            </h2>
            <p className="text-base text-[#FFFFFF]/60 font-normal max-w-2xl mx-auto">
              You built a great agent. But when enterprise customers ask hard questions that span
              multiple documents, need temporal context, or require audit trails, your agent guesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {problems.map((problem, index) => {
              const Icon = problem.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={problemsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 bg-[#201E1E]/30 rounded-2xl border border-[#FFFFFF]/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#8DAA9D]/20 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#8DAA9D]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#FFFFFF] mb-3">{problem.title}</h3>
                  <p className="text-sm text-[#FFFFFF]/60 leading-relaxed">{problem.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container">
          <motion.div
            ref={howRef}
            initial={{ opacity: 0, y: 20 }}
            animate={howInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-[#083C5E] dark:text-[#8DAA9D] mb-4 block">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#201E1E] dark:text-[#FFFFFF] mb-6">
              Connect. Reason. Trace.
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={howInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#083C5E] dark:bg-[#8DAA9D] flex items-center justify-center">
                  <span className="text-sm font-bold text-white dark:text-[#201E1E]">{step.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#201E1E] dark:text-[#FFFFFF] mb-2">{step.title}</h3>
                  <p className="text-base text-[#201E1E]/60 dark:text-[#FFFFFF]/60 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-[#FAFAFA] dark:bg-[#1a1a1a]">
        <div className="container">
          <motion.div
            ref={useCasesRef}
            initial={{ opacity: 0, y: 20 }}
            animate={useCasesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-[#083C5E] dark:text-[#8DAA9D] mb-4 block">
              Use Cases
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#201E1E] dark:text-[#FFFFFF] mb-6">
              One reasoning engine, every vertical
            </h2>
            <p className="text-base text-[#201E1E]/60 dark:text-[#FFFFFF]/60 font-normal max-w-2xl mx-auto">
              Whether you&apos;re building for legal, finance, healthcare, or support, your agents need
              the same thing: structured knowledge reasoning with traceable answers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={useCasesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 bg-white dark:bg-[#201E1E] rounded-2xl border border-[#201E1E]/10 dark:border-[#FFFFFF]/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#083C5E]/10 dark:bg-[#8DAA9D]/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-widest text-[#083C5E] dark:text-[#8DAA9D]">
                      {useCase.industry}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-[#201E1E] dark:text-[#FFFFFF] mb-3">{useCase.title}</h3>
                  <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60 leading-relaxed mb-4">{useCase.description}</p>
                  <div className="flex items-center gap-2 text-sm text-[#083C5E] dark:text-[#8DAA9D]">
                    <CheckCircle className="w-4 h-4" />
                    <span>{useCase.result}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integration Code Examples */}
      <section className="py-24 bg-[#201E1E]">
        <div className="container">
          <motion.div
            ref={codeRef}
            initial={{ opacity: 0, y: 20 }}
            animate={codeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D] mb-4 block">
              Integration
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#FFFFFF] mb-6">
              A few lines to add reasoning
            </h2>
            <p className="text-base text-[#FFFFFF]/60 font-normal max-w-2xl mx-auto">
              Drop-in integration via Python SDK, MCP server, or REST API. Your agents get structured
              knowledge reasoning without changing your architecture.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {(['sdk', 'mcp', 'api'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-[#8DAA9D] text-[#201E1E]'
                      : 'bg-[#FFFFFF]/10 text-[#FFFFFF]/60 hover:text-[#FFFFFF]'
                  }`}
                >
                  {tab === 'sdk' ? 'Python SDK' : tab === 'mcp' ? 'MCP Server' : 'REST API'}
                </button>
              ))}
            </div>

            {/* Code block */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 overflow-x-auto border border-[#FFFFFF]/10">
              <pre className="text-sm text-[#FFFFFF]/80 font-mono leading-relaxed">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* B2B2B Pitch */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-[#083C5E] dark:text-[#8DAA9D] mb-4 block">
              Scale
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#201E1E] dark:text-[#FFFFFF] mb-6">
              One integration. Hundreds of enterprise deployments.
            </h2>
            <p className="text-base text-[#201E1E]/60 dark:text-[#FFFFFF]/60 font-normal max-w-2xl mx-auto mb-12">
              You build the agent. Vrin handles the knowledge reasoning. Each of your enterprise customers
              gets their own isolated knowledge graph in their own cloud, with data sovereignty built in,
              not bolted on.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-[#FAFAFA] dark:bg-[#2A2828] rounded-2xl">
                <Zap className="w-8 h-8 text-[#083C5E] dark:text-[#8DAA9D] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#201E1E] dark:text-[#FFFFFF] mb-2">Ship faster</h3>
                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60">
                  Skip 6-12 months of infrastructure building. Add knowledge reasoning to your agent in days.
                </p>
              </div>
              <div className="p-6 bg-[#FAFAFA] dark:bg-[#2A2828] rounded-2xl">
                <Shield className="w-8 h-8 text-[#083C5E] dark:text-[#8DAA9D] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#201E1E] dark:text-[#FFFFFF] mb-2">Data isolation</h3>
                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60">
                  Each customer&apos;s knowledge graph runs in their own cloud. Enterprise-grade data sovereignty per deployment.
                </p>
              </div>
              <div className="p-6 bg-[#FAFAFA] dark:bg-[#2A2828] rounded-2xl">
                <TrendingUp className="w-8 h-8 text-[#083C5E] dark:text-[#8DAA9D] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#201E1E] dark:text-[#FFFFFF] mb-2">Improves over time</h3>
                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60">
                  Vrin&apos;s knowledge graph consolidates and strengthens with every query. Your agents get smarter the more they&apos;re used.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <section className="py-24 bg-[#FAFAFA] dark:bg-[#1a1a1a]">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-[#083C5E] dark:text-[#8DAA9D] mb-4 block">
              Benchmarks
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#201E1E] dark:text-[#FFFFFF] mb-6">
              Independently verified accuracy
            </h2>
            <p className="text-base text-[#201E1E]/60 dark:text-[#FFFFFF]/60 font-normal max-w-2xl mx-auto mb-12">
              Published results on standard academic benchmarks. Not marketing claims. Reproducible measurements.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="p-8 bg-white dark:bg-[#201E1E] rounded-2xl border border-[#201E1E]/10 dark:border-[#FFFFFF]/10">
                <div className="text-4xl font-light text-[#083C5E] dark:text-[#8DAA9D] mb-2">95.1%</div>
                <div className="text-base font-medium text-[#201E1E] dark:text-[#FFFFFF] mb-2">MultiHop-RAG</div>
                <div className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60">
                  vs. 78.9% for GPT-5.2 with the same documents. 16.2pp improvement on cross-document reasoning.
                </div>
              </div>
              <div className="p-8 bg-white dark:bg-[#201E1E] rounded-2xl border border-[#201E1E]/10 dark:border-[#FFFFFF]/10">
                <div className="text-4xl font-light text-[#083C5E] dark:text-[#8DAA9D] mb-2">+28%</div>
                <div className="text-base font-medium text-[#201E1E] dark:text-[#FFFFFF] mb-2">MuSiQue</div>
                <div className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60">
                  28% more accurate than HippoRAG 2 (academic state-of-the-art) on multi-hop reasoning tasks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-[#FFFFFF]">
                Common questions
              </h2>
            </div>
            <div>
              {faqs.map((faq, index) => (
                <FAQItem key={index} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#201E1E]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#FFFFFF] mb-6">
              Give your agents the reasoning they deserve
            </h2>
            <p className="text-base text-[#FFFFFF]/60 mb-10 max-w-xl mx-auto">
              Start with the free tier. Integrate in minutes. Scale to hundreds of enterprise deployments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#FFFFFF] text-[#201E1E] hover:bg-[#8DAA9D] px-8 py-6 text-base font-medium rounded-full transition-all duration-300"
                onClick={() => window.location.href = '/waitlist'}
              >
                Join Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-medium border-2 border-[#FFFFFF]/20 text-[#FFFFFF] hover:bg-[#FFFFFF]/10 rounded-full transition-all duration-300"
                onClick={() => window.open("https://cal.com/vedant-vrin/book-a-demo", "_blank")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Talk to Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
