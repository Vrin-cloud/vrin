"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Download,
  ExternalLink,
  BookOpen,
  FlaskConical,
  Brain,
  GitBranch,
  Network,
  Clock,
  Shield,
  Search,
  Layers,
  Target,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const benchmarkResults = {
  multihop: [
    { system: "Vrin (HybridRAG)", accuracy: "95.1%", ci: "[90.5, 99.7]", highlight: true },
    { system: "GPT 5.2 (w/ oracle evidence)", accuracy: "78.9%", ci: "[74.3, 83.5]", highlight: false },
    { system: "Multi-Meta RAG + GPT-4", accuracy: "63.0%", ci: "\u2014", highlight: false },
    { system: "IRCoT + GPT-4", accuracy: "58.2%", ci: "\u2014", highlight: false },
    { system: "Standard RAG + GPT-4", accuracy: "47.3%", ci: "\u2014", highlight: false },
  ],
  musique: [
    { system: "Vrin", em: "0.478", f1: "0.563", highlight: true },
    { system: "HippoRAG 2 (SOTA)", em: "0.372", f1: "0.486", highlight: false },
    { system: "Standard RAG", em: "\u2014", f1: "0.457", highlight: false },
  ],
}

const pipelineStages = [
  {
    icon: Target,
    stage: "Query Complexity Routing",
    description: "Structural classification in <1ms determines retrieval depth \u2014 simple factual lookups skip the full pipeline, complex queries get iterative multi-hop reasoning.",
  },
  {
    icon: Network,
    stage: "Graph-Aware Query Planning",
    description: "Before decomposing a query, Vrin consults the knowledge graph\u2019s structural metadata \u2014 what entities exist, which communities they belong to, what relationships connect them.",
  },
  {
    icon: Search,
    stage: "Multi-Strategy Graph Traversal",
    description: "Multi-hop beam search with hub-weighted Personalized PageRank, synonym edge resolution, and three parallel traversal strategies merged via reciprocal rank fusion.",
  },
  {
    icon: BarChart3,
    stage: "5-Dimensional Confidence Scoring",
    description: "Entity coverage, type alignment, temporal alignment, fact density, and topical relevance \u2014 producing three outcomes: proceed, supplement with exploratory retrieval, or bail out.",
  },
  {
    icon: Brain,
    stage: "Iterative Reasoning Engine",
    description: "Complex queries are decomposed into dependency-ordered sub-questions with targeted retrieval per gap \u2014 each iteration snapshots state and reverts if quality degrades.",
  },
  {
    icon: Layers,
    stage: "Structured Context Preparation",
    description: "Facts organized by entity and topic, cross-document connections stated as established insights, iterative reasoning chain injected \u2014 the LLM synthesizes from organized understanding.",
  },
]

const cognitiveSubprocesses = [
  { label: "Perceive", description: "Identify entities and relationships", color: "text-[#083C5E]" },
  { label: "Structure", description: "Formalize the query as a constrained search", color: "text-[#083C5E]" },
  { label: "Store", description: "Know where relevant information lives", color: "text-[#083C5E]" },
  { label: "Organize", description: "Connect related facts across documents", color: "text-[#083C5E]" },
  { label: "Retrieve", description: "Pull the specific facts needed", color: "text-[#083C5E]" },
]

export default function ResearchPage() {
  return (
    <div className="flex flex-col">
      <AnimatedBackground />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
              Research
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#201E1E] dark:text-white leading-tight mb-8">
              The gap between retrieval<br />and reasoning
            </h1>
            <p className="text-lg text-[#201E1E]/60 dark:text-white/60 font-light max-w-2xl mx-auto mb-10">
              Current RAG systems delegate reasoning to the LLM, failing on multi-hop, temporal,
              and numerical queries. Vrin engineers five cognitive subprocesses that the industry skipped.
              The results are measurable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://vrin.cloud/vrin-whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="px-8 py-6 text-base font-medium bg-[#083C5E] hover:bg-[#083C5E]/90 text-white rounded-full"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Read the Whitepaper
                </Button>
              </a>
              <a
                href="https://github.com/Vrin-cloud/vrin-benchmarks"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-medium border-2 border-[#201E1E]/20 dark:border-white/20 text-[#201E1E] dark:text-white bg-transparent hover:bg-[#201E1E]/5 dark:hover:bg-white/5 rounded-full"
                >
                  <GitBranch className="mr-2 h-5 w-5" />
                  Benchmark Code
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Whitepaper Overview */}
      <section className="py-24 bg-[#F8F8F8] dark:bg-[#1A1818]">
        <div className="container max-w-3xl mx-auto px-6">
          <Section>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#083C5E]/10 dark:bg-[#8DAA9D]/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D]" />
              </div>
              <div>
                <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-2 block">
                  Whitepaper &middot; April 2026
                </span>
                <h2 className="text-2xl md:text-3xl font-light text-[#201E1E] dark:text-white">
                  Vrin: From Retrieval to Reasoning. A Hybrid Knowledge Graph Architecture for Enterprise AI
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-lg text-[#201E1E]/70 dark:text-white/70 font-light leading-relaxed">
              <p>
                A human analyst answering a complex question doesn&apos;t just search for similar text.
                They identify entities and relationships, formalize the question as a constrained search,
                know where relevant information lives, connect related facts across documents, and then
                pull the specific facts needed. Five cognitive subprocesses, yet current RAG addresses
                only the last one.
              </p>
              <p>
                This paper presents Vrin, a hybrid knowledge graph architecture that engineers each of
                these five subprocesses explicitly. Rather than treating retrieval as a single undifferentiated
                step, Vrin implements a multi-stage reasoning pipeline: entity-centric fact extraction with
                coreference resolution and temporal versioning, a knowledge graph with community detection
                and cross-fact deduplication, graph-aware query planning, confidence-scored multi-hop
                traversal with Personalized PageRank, iterative reasoning with per-step quality evaluation,
                and structured context preparation that organizes evidence by concept rather than by source.
              </p>
              <p>
                The architecture draws from established constructs in cognitive science: the brain&apos;s
                Complementary Learning Systems theory (dual-store hippocampus-neocortex architecture),
                semantic network theory (spreading activation along relational pathways), and metacognitive
                monitoring (confidence-based retrieval halting). Vrin independently converged on the same
                dual-store architecture that HippoRAG applied to RAG at NeurIPS, a convergence
                suggesting these engineering problems have a natural solution space.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="https://vrin.cloud/vrin-whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#083C5E] dark:text-[#8DAA9D] hover:underline text-sm font-medium"
              >
                Read the full whitepaper
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </Section>
        </div>
      </section>

      {/* The Five Cognitive Subprocesses */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-4xl mx-auto px-6">
          <Section>
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
                Core Thesis
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-4">
                Five subprocesses. RAG addresses one.
              </h2>
              <p className="text-lg text-[#201E1E]/60 dark:text-white/60 font-light max-w-2xl mx-auto">
                The industry spent three years optimizing retrieval: better embeddings, smarter chunking,
                bigger context windows. The other four subprocesses were left to the LLM.
              </p>
            </div>

            <div className="grid gap-4">
              {cognitiveSubprocesses.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`flex items-center gap-5 p-5 rounded-xl border transition-colors ${
                    i === 4
                      ? "border-[#8DAA9D]/40 bg-[#8DAA9D]/5 dark:bg-[#8DAA9D]/10"
                      : "border-[#201E1E]/10 dark:border-white/10"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm ${
                    i === 4
                      ? "bg-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D]"
                      : "bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 text-[#083C5E] dark:text-[#8DAA9D]"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-[#201E1E] dark:text-white">{item.label}</span>
                    <span className="text-[#201E1E]/50 dark:text-white/50 mx-2">/</span>
                    <span className="text-[#201E1E]/60 dark:text-white/60 font-light">{item.description}</span>
                  </div>
                  {i < 4 && (
                    <span className="text-xs font-medium tracking-wider uppercase text-[#083C5E]/40 dark:text-[#8DAA9D]/40 flex-shrink-0">
                      Vrin
                    </span>
                  )}
                  {i === 4 && (
                    <span className="text-xs font-medium tracking-wider uppercase text-[#8DAA9D] flex-shrink-0">
                      Vrin + RAG
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-[#201E1E]/50 dark:text-white/50 font-light mt-6 text-center">
              Standard RAG addresses only subprocess 5 (Retrieve) through semantic similarity. Vrin engineers all five.
            </p>
          </Section>
        </div>
      </section>

      {/* Benchmark Results */}
      <section className="py-24 bg-black rounded-[3rem] md:rounded-[4rem]">
        <div className="container max-w-5xl mx-auto px-6">
          <Section>
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
                Experimental Evaluation
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                Benchmark results
              </h2>
              <p className="text-lg text-white/60 font-light max-w-2xl mx-auto">
                Evaluated on two complementary academic benchmarks following BetterBench guidelines:
                fixed-seed sampling, confidence intervals, and open-source evaluation code.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* MultiHop-RAG */}
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-medium text-white mb-1">MultiHop-RAG</h3>
                  <p className="text-sm text-white/50 font-light">
                    609 news articles, 384 stratified samples. Cross-document reasoning over 2&ndash;4 articles.
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {benchmarkResults.multihop.map((row, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                          row.highlight ? "bg-[#8DAA9D]/15" : ""
                        }`}
                      >
                        <span className={`text-sm ${row.highlight ? "text-white font-medium" : "text-white/60 font-light"}`}>
                          {row.system}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-mono ${row.highlight ? "text-[#8DAA9D] font-semibold" : "text-white/70"}`}>
                            {row.accuracy}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 font-light">
                      GPT 5.2 receives exact evidence documents (oracle context). Vrin retrieves from the full corpus.
                      The gap is entirely attributable to structured reasoning.
                    </p>
                  </div>
                </div>
              </div>

              {/* MuSiQue */}
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-medium text-white mb-1">MuSiQue</h3>
                  <p className="text-sm text-white/50 font-light">
                    4,848 Wikipedia paragraphs, 300 questions. Compositional multi-hop QA designed to resist shortcuts.
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-xs text-white/40 font-medium tracking-wider uppercase px-3 pb-2">
                      <span>System</span>
                      <div className="flex gap-8">
                        <span>Exact Match</span>
                        <span>Token F1</span>
                      </div>
                    </div>
                    {benchmarkResults.musique.map((row, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
                          row.highlight ? "bg-[#8DAA9D]/15" : ""
                        }`}
                      >
                        <span className={`text-sm ${row.highlight ? "text-white font-medium" : "text-white/60 font-light"}`}>
                          {row.system}
                        </span>
                        <div className="flex gap-8">
                          <span className={`text-sm font-mono w-14 text-right ${row.highlight ? "text-[#8DAA9D] font-semibold" : "text-white/70"}`}>
                            {row.em}
                          </span>
                          <span className={`text-sm font-mono w-14 text-right ${row.highlight ? "text-[#8DAA9D] font-semibold" : "text-white/70"}`}>
                            {row.f1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 font-light">
                      +28% Exact Match and +16% Token F1 over HippoRAG 2, the current published
                      state of the art on compositional multi-hop QA.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Finding */}
            <div className="mt-12 p-8 rounded-2xl border border-[#8DAA9D]/20 bg-[#8DAA9D]/5">
              <h3 className="text-base font-medium text-white mb-3">Where structure matters most</h3>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                The performance gap between Vrin and GPT 5.2 on MultiHop-RAG is largest on <span className="text-white font-medium">temporal queries (+48.9pp)</span> and <span className="text-white font-medium">comparison queries (+15.5pp)</span>,
                precisely the query types that require understanding the <em>structure</em> of the question
                rather than finding semantically similar text. On inference queries (single-hop lookups),
                both systems perform equally well (99.2% vs 98.4%), confirming that the gap is
                architectural, not model-dependent.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* Architecture: Pipeline Stages */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-4xl mx-auto px-6">
          <Section>
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
                Architecture
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-4">
                Reasoning before inference
              </h2>
              <p className="text-lg text-[#201E1E]/60 dark:text-white/60 font-light max-w-2xl mx-auto">
                Before the LLM sees a single token, Vrin has already understood the query, consulted
                the knowledge graph, traversed multi-hop relationships, evaluated confidence, and
                organized evidence by concept.
              </p>
            </div>

            <div className="space-y-5">
              {pipelineStages.map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-5 p-6 rounded-2xl border border-[#201E1E]/10 dark:border-white/10 hover:border-[#8DAA9D]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#083C5E]/10 dark:bg-[#8DAA9D]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <stage.icon className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-[#201E1E] dark:text-white mb-1.5">
                      {stage.stage}
                    </h4>
                    <p className="text-sm text-[#201E1E]/60 dark:text-white/60 font-light leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* Neuroscience Foundation */}
      <section className="py-24 bg-[#F8F8F8] dark:bg-[#1A1818]">
        <div className="container max-w-3xl mx-auto px-6">
          <Section>
            <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
              Cognitive Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-8">
              Informed by neuroscience, validated by benchmarks
            </h2>
            <div className="space-y-6 text-lg text-[#201E1E]/70 dark:text-white/70 font-light leading-relaxed">
              <p>
                Vrin&apos;s architecture maps to established constructs in cognitive science.
                The dual-store knowledge graph (Neptune for structured facts, OpenSearch for
                unstructured passages) mirrors the brain&apos;s <strong className="font-medium text-[#201E1E] dark:text-white">Complementary Learning Systems</strong>:
                the hippocampus for fast episodic indexing, the neocortex for slow, structured knowledge consolidation.
              </p>
              <p>
                The multi-hop graph traversal implements <strong className="font-medium text-[#201E1E] dark:text-white">spreading activation</strong> from
                semantic network theory: entities activate related entities along typed relationship edges,
                not through embedding similarity. Hub-weighted PageRank reflects how the brain organizes
                knowledge through hub-like multi-synaptic structures rather than point-to-point connections.
              </p>
              <p>
                The confidence scoring system draws from <strong className="font-medium text-[#201E1E] dark:text-white">metacognitive monitoring</strong>.
                The anterior cingulate cortex detects retrieval uncertainty and can halt processing when
                evidence is insufficient. Vrin&apos;s adaptive bail-out, which detects zero entity coverage
                and terminates in under 500ms, is a direct analog.
              </p>
              <p>
                The nightly consolidation pipeline (community detection, cross-fact deduplication,
                usage-based stability scoring) mirrors <strong className="font-medium text-[#201E1E] dark:text-white">sleep-dependent memory consolidation</strong>,
                where the brain restructures and strengthens frequently-accessed knowledge pathways.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* Vision: The 95% Unexplored */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-3xl mx-auto px-6">
          <Section>
            <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
              Looking Forward
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-8">
              The 95% unexplored
            </h2>
            <div className="space-y-6 text-lg text-[#201E1E]/70 dark:text-white/70 font-light leading-relaxed">
              <p>
                We believe the industry has explored less than 5% of the available innovation space in
                knowledge-augmented AI. The dominant focus has been on improving the <em>retrieval</em> subprocess:
                better embeddings, smarter reranking, larger context windows. The other four cognitive
                subprocesses (perception, structuring, storage, and organization), each with
                validated science behind them, remain largely unapplied.
              </p>
              <p>
                Active areas of research include <strong className="font-medium text-[#201E1E] dark:text-white">adaptive retrieval</strong> that
                makes finer-grained decisions about which pipeline stages to invoke, <strong className="font-medium text-[#201E1E] dark:text-white">automatic
                domain specialization</strong> that detects query patterns and learns domain expertise
                from usage, and <strong className="font-medium text-[#201E1E] dark:text-white">knowledge graph pattern detection</strong> that
                identifies frequently-accessed subgraphs and creates memory packs for fine-tuning
                domain-specialized models.
              </p>
              <p>
                The fundamental thesis is that AI systems will eventually be specialized like human
                employees, not through fine-tuning a single model, but through engineering the
                cognitive infrastructure surrounding it.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* Further Reading */}
      <section className="py-24 bg-[#F8F8F8] dark:bg-[#1A1818]">
        <div className="container max-w-4xl mx-auto px-6">
          <Section>
            <div className="text-center mb-12">
              <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
                Further Reading
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white">
                Deep dives
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Link
                href="/blog/benchmark-results-multihop-musique"
                className="group p-6 rounded-2xl border border-[#201E1E]/10 dark:border-white/10 hover:border-[#8DAA9D]/30 transition-colors"
              >
                <FlaskConical className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D] mb-3" />
                <h4 className="text-base font-medium text-[#201E1E] dark:text-white mb-2 group-hover:text-[#083C5E] dark:group-hover:text-[#8DAA9D] transition-colors">
                  Benchmark Results: Full Methodology
                </h4>
                <p className="text-sm text-[#201E1E]/60 dark:text-white/60 font-light">
                  Complete evaluation on MultiHop-RAG and MuSiQue with per-type breakdowns,
                  methodology details, and analysis.
                </p>
              </Link>

              <Link
                href="/blog/the-reasoning-gap"
                className="group p-6 rounded-2xl border border-[#201E1E]/10 dark:border-white/10 hover:border-[#8DAA9D]/30 transition-colors"
              >
                <Brain className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D] mb-3" />
                <h4 className="text-base font-medium text-[#201E1E] dark:text-white mb-2 group-hover:text-[#083C5E] dark:group-hover:text-[#8DAA9D] transition-colors">
                  The Reasoning Gap: Why RAG Fails
                </h4>
                <p className="text-sm text-[#201E1E]/60 dark:text-white/60 font-light">
                  Technical deep-dive into why semantic similarity search cannot solve
                  multi-document reasoning and what architecture replaces it.
                </p>
              </Link>

              <Link
                href="/blog/karpathy-knowledge-base-stress-test"
                className="group p-6 rounded-2xl border border-[#201E1E]/10 dark:border-white/10 hover:border-[#8DAA9D]/30 transition-colors"
              >
                <Search className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D] mb-3" />
                <h4 className="text-base font-medium text-[#201E1E] dark:text-white mb-2 group-hover:text-[#083C5E] dark:group-hover:text-[#8DAA9D] transition-colors">
                  Filesystem vs. Graph: A Stress Test
                </h4>
                <p className="text-sm text-[#201E1E]/60 dark:text-white/60 font-light">
                  Head-to-head comparison of local filesystem agent, standard RAG, and Vrin
                  on a 30-document strategic reasoning task.
                </p>
              </Link>

              <Link
                href="/blog/why-vector-search-fails"
                className="group p-6 rounded-2xl border border-[#201E1E]/10 dark:border-white/10 hover:border-[#8DAA9D]/30 transition-colors"
              >
                <Network className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D] mb-3" />
                <h4 className="text-base font-medium text-[#201E1E] dark:text-white mb-2 group-hover:text-[#083C5E] dark:group-hover:text-[#8DAA9D] transition-colors">
                  Why Vector Search Fails for Multi-Document Questions
                </h4>
                <p className="text-sm text-[#201E1E]/60 dark:text-white/60 font-light">
                  The five failure modes of embedding-based retrieval and why knowledge graphs
                  address each one architecturally.
                </p>
              </Link>
            </div>
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-3xl mx-auto px-6 text-center">
          <Section>
            <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-4">
              The context is reasoned over before the model sees it
            </h2>
            <p className="text-lg text-[#201E1E]/60 dark:text-white/60 font-light mb-10 max-w-xl mx-auto">
              Read the whitepaper, explore the benchmark code, or see it in action.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://vrin.cloud/vrin-whitepaper.pdf" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base font-medium bg-[#083C5E] hover:bg-[#083C5E]/90 text-white rounded-full"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Read the Whitepaper
                </Button>
              </a>
              <Link href="/playground">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-medium border-2 border-[#201E1E]/20 dark:border-white/20 text-white dark:text-[#201E1E] bg-[#201E1E] dark:bg-white hover:bg-[#201E1E]/90 dark:hover:bg-white/90 rounded-full"
                >
                  Try the Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Section>
        </div>
      </section>

      <Footer />
    </div>
  )
}
