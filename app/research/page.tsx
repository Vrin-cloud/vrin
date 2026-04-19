'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  ArrowUpRight,
  Download,
  BookOpen,
  FlaskConical,
  Brain,
  GitBranch,
  Network,
  Search,
  Layers,
  Target,
  BarChart3,
} from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

const multihopRows = [
  { system: 'Vrin', value: 95.1, isVrin: true },
  { system: 'ChatGPT 5.2 (Thinking) [Oracle Context]', value: 78.9 },
  { system: 'Multi-Meta RAG (GPT-4)', value: 63.0 },
  { system: 'Multi-Meta RAG (Google PaLM)', value: 61.0 },
  { system: 'GPT-4 Baseline', value: 56.0 },
]

const musiqueRows = [
  { system: 'Vrin', value: 47.8, isVrin: true },
  { system: 'StepChain GraphRAG', value: 43.9 },
  { system: 'HopRAG', value: 42.2 },
  { system: 'SiReRAG', value: 40.5 },
  { system: 'HippoRAG 2', value: 37.2 },
]

const pipelineStages = [
  {
    icon: Target,
    stage: 'Query complexity routing',
    description:
      'Structural classification in under a millisecond determines retrieval depth. Simple factual lookups skip the full pipeline; complex queries get iterative multi-hop reasoning.',
  },
  {
    icon: Network,
    stage: 'Graph-aware query planning',
    description:
      "Before decomposing a query, Vrin consults the knowledge graph's structural metadata: what entities exist, which communities they belong to, what relationships connect them.",
  },
  {
    icon: Search,
    stage: 'Multi-strategy graph traversal',
    description:
      'Multi-hop beam search with hub-weighted Personalized PageRank, synonym edge resolution, and three parallel traversal strategies merged via reciprocal rank fusion.',
  },
  {
    icon: BarChart3,
    stage: '5-dimensional confidence scoring',
    description:
      'Entity coverage, type alignment, temporal alignment, fact density, and topical relevance producing three outcomes: proceed, supplement with exploratory retrieval, or bail out.',
  },
  {
    icon: Brain,
    stage: 'Iterative reasoning engine',
    description:
      'Complex queries decomposed into dependency-ordered sub-questions with targeted retrieval per gap. Each iteration snapshots state and reverts if quality degrades.',
  },
  {
    icon: Layers,
    stage: 'Structured context preparation',
    description:
      'Facts organized by entity and topic, cross-document connections stated as established insights, iterative reasoning chain injected. The LLM synthesizes from organized understanding.',
  },
]

const cognitiveSubprocesses = [
  { label: 'Perceive', description: 'Identify entities and relationships' },
  { label: 'Structure', description: 'Formalize the query as a constrained search' },
  { label: 'Store', description: 'Know where relevant information lives' },
  { label: 'Organize', description: 'Connect related facts across documents' },
  { label: 'Retrieve', description: 'Pull the specific facts needed' },
]

type Row = { system: string; value: number; isVrin?: boolean }

function LeaderboardCard({
  title,
  metric,
  rows,
  maxTrack,
  note,
}: {
  title: string
  metric: string
  rows: Row[]
  maxTrack: number
  note: string
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  return (
    <div
      ref={ref}
      className="rounded-3xl border border-vrin-cream/15 bg-vrin-charcoal/40 p-8 md:p-10 overflow-hidden"
    >
      <div className="mb-8 pb-5 border-b border-vrin-cream/10">
        <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-cream/45 mb-2">
          Leaderboard
        </p>
        <h3 className="font-display text-3xl md:text-4xl leading-none text-vrin-cream">
          {title}
        </h3>
        <p className="mt-2 font-mono text-xs md:text-sm text-vrin-cream/55">
          {metric}
        </p>
      </div>

      <div>
        {rows.map((r, i) => {
          const width = Math.min(100, (r.value / maxTrack) * 100)
          return (
            <motion.div
              key={r.system}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_auto] items-center gap-4 py-3"
            >
              <p
                className={`text-right text-xs md:text-sm tracking-tight truncate ${
                  r.isVrin
                    ? 'text-vrin-cream font-medium'
                    : 'text-vrin-cream/60'
                }`}
              >
                {r.system}
              </p>
              <div className="relative h-6 rounded-full bg-vrin-cream/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${width}%` } : {}}
                  transition={{ duration: 1.1, delay: i * 0.08 + 0.2, ease }}
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    r.isVrin ? 'bg-vrin-sage' : 'bg-vrin-sage/30'
                  }`}
                />
              </div>
              <p
                className={`font-mono text-xs md:text-sm min-w-[4ch] text-right tabular-nums ${
                  r.isVrin ? 'text-vrin-cream font-medium' : 'text-vrin-cream/55'
                }`}
              >
                {r.value.toFixed(1)}%
              </p>
            </motion.div>
          )
        })}
      </div>

      <p className="mt-6 pt-5 border-t border-vrin-cream/10 text-xs text-vrin-cream/45 leading-relaxed">
        {note}
      </p>
    </div>
  )
}

const furtherReading = [
  {
    icon: FlaskConical,
    title: 'Benchmark results: full methodology',
    href: '/blog/benchmark-results-multihop-musique',
    blurb:
      'Complete evaluation on MultiHop-RAG and MuSiQue with per-type breakdowns, methodology details, and analysis.',
  },
  {
    icon: Brain,
    title: 'The reasoning gap: why RAG fails',
    href: '/blog/the-reasoning-gap',
    blurb:
      'Technical deep-dive into why semantic similarity search cannot solve multi-document reasoning and what architecture replaces it.',
  },
  {
    icon: Search,
    title: 'Filesystem vs. graph: a stress test',
    href: '/blog/karpathy-knowledge-base-stress-test',
    blurb:
      'Head-to-head comparison of local filesystem agent, standard RAG, and Vrin on a 30-document strategic reasoning task.',
  },
  {
    icon: Network,
    title: 'Why vector search fails for multi-document questions',
    href: '/blog/why-vector-search-fails',
    blurb:
      'The five failure modes of embedding-based retrieval and why knowledge graphs address each one architecturally.',
  },
]

export default function ResearchPage() {
  return (
    <div className="flex flex-col bg-vrin-paper">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-24 md:pb-28 overflow-hidden vignette-paper">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <span className="eyebrow text-vrin-blue">Research</span>
            <span className="hairline flex-1" />
            <span className="hidden md:inline text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
              whitepaper · benchmarks · code
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] tracking-[-0.035em] text-vrin-charcoal max-w-5xl"
          >
            The gap between retrieval
            <br />
            and <span className="serif-italic text-vrin-blue">reasoning.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-8 max-w-3xl text-lg md:text-xl text-vrin-charcoal/65 leading-relaxed"
          >
            Current RAG systems delegate reasoning to the LLM, failing on multi-hop,
            temporal, and numerical queries. Vrin engineers five cognitive
            subprocesses the industry skipped. The results are measurable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="https://vrin.cloud/vrin-whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-vrin-charcoal px-7 py-4 text-sm font-medium text-vrin-cream hover:bg-vrin-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              Read the whitepaper
            </a>
            <a
              href="https://github.com/Vrin-cloud/vrin-benchmarks"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-vrin-charcoal/20 px-7 py-4 text-sm font-medium text-vrin-charcoal hover:border-vrin-charcoal/50 hover:bg-vrin-sand/40 transition-all duration-300"
            >
              <GitBranch className="w-4 h-4" />
              Benchmark code
            </a>
          </motion.div>
        </div>
      </section>

      {/* Whitepaper overview */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-vrin-blue" />
              </div>
              <div>
                <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
                  Whitepaper · April 2026
                </p>
                <h2 className="font-display text-2xl md:text-3xl leading-[1.15] tracking-[-0.02em] text-vrin-charcoal">
                  Vrin: From Retrieval to Reasoning. A Hybrid Knowledge Graph
                  Architecture for Enterprise AI
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-base md:text-lg text-vrin-charcoal/70 leading-relaxed">
              <p>
                A human analyst answering a complex question doesn&apos;t just
                search for similar text. They identify entities and relationships,
                formalize the question as a constrained search, know where
                relevant information lives, connect related facts across
                documents, and then pull the specific facts needed. Five
                cognitive subprocesses, yet current RAG addresses only the last
                one.
              </p>
              <p>
                This paper presents Vrin, a hybrid knowledge graph architecture
                that engineers each of these five subprocesses explicitly. Rather
                than treating retrieval as a single undifferentiated step, Vrin
                implements a multi-stage reasoning pipeline: entity-centric fact
                extraction with coreference resolution and temporal versioning, a
                knowledge graph with community detection and cross-fact
                deduplication, graph-aware query planning, confidence-scored
                multi-hop traversal with Personalized PageRank, iterative
                reasoning with per-step quality evaluation, and structured context
                preparation that organizes evidence by concept rather than by
                source.
              </p>
              <p>
                The architecture draws from established constructs in cognitive
                science: the brain&apos;s Complementary Learning Systems theory,
                semantic network theory, and metacognitive monitoring. Vrin
                independently converged on the same dual-store architecture that
                HippoRAG applied to RAG at NeurIPS, a convergence suggesting these
                engineering problems have a natural solution space.
              </p>
            </div>

            <a
              href="https://vrin.cloud/vrin-whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-vrin-blue hover:text-vrin-charcoal transition-colors"
            >
              Read the full whitepaper
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Five subprocesses */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container max-w-4xl relative z-10">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Core thesis</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal mb-4">
              Five subprocesses.{' '}
              <span className="serif-italic text-vrin-blue">RAG addresses one.</span>
            </h2>
            <p className="max-w-2xl text-base md:text-lg text-vrin-charcoal/65 leading-relaxed">
              The industry spent three years optimizing retrieval: better
              embeddings, smarter chunking, bigger context windows. The other four
              subprocesses were left to the LLM.
            </p>
          </div>

          <div className="space-y-3">
            {cognitiveSubprocesses.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08, ease }}
                className={`flex items-center gap-5 p-5 rounded-2xl border transition-colors ${
                  i === 4
                    ? 'border-vrin-sage/50 bg-vrin-sage/10'
                    : 'border-vrin-charcoal/10 bg-vrin-cream/60'
                }`}
              >
                <span className="font-mono text-xs tracking-widest text-vrin-charcoal/40 w-8">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-lg md:text-xl text-vrin-charcoal">
                  {item.label}
                </span>
                <span className="text-vrin-charcoal/25">/</span>
                <span className="flex-1 text-sm text-vrin-charcoal/65">
                  {item.description}
                </span>
                <span
                  className={`text-[10px] font-mono tracking-[0.14em] uppercase whitespace-nowrap ${
                    i === 4 ? 'text-vrin-blue' : 'text-vrin-blue/50'
                  }`}
                >
                  {i === 4 ? 'Vrin + RAG' : 'Vrin'}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-sm text-vrin-charcoal/55 text-center">
            Standard RAG addresses only subprocess 5 (Retrieve) through semantic
            similarity. Vrin engineers all five.
          </p>
        </div>
      </section>

      {/* Benchmarks — dark */}
      <section className="relative bg-vrin-ink py-28 md:py-36 overflow-hidden rounded-[3rem] md:rounded-[4rem]">
        <div className="absolute inset-0 grid-faint-dark opacity-50 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-sage">Experimental evaluation</span>
              <span className="hairline flex-1 opacity-40" />
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-cream">
              Benchmark <span className="serif-italic text-vrin-sage">results.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-vrin-cream/65 leading-relaxed">
              Evaluated on two complementary academic leaderboards following
              BetterBench guidelines: fixed-seed sampling, confidence intervals,
              and open-source evaluation code.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 max-w-6xl">
            <LeaderboardCard
              title="MultiHop-RAG"
              metric="metric: Semantic Accuracy (SA)"
              rows={multihopRows}
              maxTrack={100}
              note="Vrin tops the leaderboard even as ChatGPT 5.2 is given the exact evidence documents (oracle context) while Vrin retrieves from the full corpus. The gap is entirely attributable to structured reasoning."
            />
            <LeaderboardCard
              title="MuSiQue"
              metric="metric: Exact Match (EM)"
              rows={musiqueRows}
              maxTrack={65}
              note="Compositional multi-hop QA designed to resist shortcuts. Vrin leads the public leaderboard, ahead of StepChain GraphRAG, HopRAG, SiReRAG, and HippoRAG 2."
            />
          </div>

          {/* Key Finding */}
          <div className="mt-10 max-w-6xl p-8 md:p-10 rounded-3xl border border-vrin-sage/25 bg-vrin-sage/5">
            <p className="eyebrow text-vrin-sage mb-4">Where structure matters most</p>
            <p className="text-base md:text-lg text-vrin-cream/75 leading-relaxed max-w-4xl">
              The performance gap between Vrin and ChatGPT 5.2 on MultiHop-RAG is
              largest on{' '}
              <span className="font-medium text-vrin-cream">
                temporal queries (+48.9pp)
              </span>{' '}
              and{' '}
              <span className="font-medium text-vrin-cream">
                comparison queries (+15.5pp)
              </span>
              , precisely the query types that require understanding the
              structure of the question rather than finding semantically similar
              text. On inference queries (single-hop lookups), both systems
              perform equally well (99.2% vs 98.4%), confirming that the gap is
              architectural, not model-dependent.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture pipeline */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container max-w-5xl relative z-10">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Architecture</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal mb-6">
              Reasoning <span className="serif-italic text-vrin-blue">before</span>{' '}
              inference.
            </h2>
            <p className="max-w-2xl text-base md:text-lg text-vrin-charcoal/65 leading-relaxed">
              Before the LLM sees a single token, Vrin has already understood the
              query, consulted the knowledge graph, traversed multi-hop
              relationships, evaluated confidence, and organized evidence by
              concept.
            </p>
          </div>

          <div className="space-y-4">
            {pipelineStages.map((stage, i) => {
              const Icon = stage.icon
              return (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease }}
                  className="flex items-start gap-5 p-6 md:p-7 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60 hover:border-vrin-charcoal/25 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-vrin-blue" />
                  </div>
                  <div>
                    <h4 className="font-display text-xl md:text-2xl leading-[1.15] text-vrin-charcoal mb-2">
                      {stage.stage}
                    </h4>
                    <p className="text-sm md:text-base text-vrin-charcoal/65 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Neuroscience */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Cognitive architecture</span>
              <span className="hairline flex-1" />
            </div>

            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal mb-10">
              Informed by neuroscience,{' '}
              <span className="serif-italic text-vrin-blue">
                validated by benchmarks.
              </span>
            </h2>

            <div className="space-y-6 text-base md:text-lg text-vrin-charcoal/70 leading-relaxed">
              <p>
                Vrin&apos;s architecture maps to established constructs in
                cognitive science. The dual-store knowledge graph (Neptune for
                structured facts, OpenSearch for unstructured passages) mirrors
                the brain&apos;s{' '}
                <span className="font-medium text-vrin-charcoal">
                  Complementary Learning Systems
                </span>
                : the hippocampus for fast episodic indexing, the neocortex for
                slow, structured knowledge consolidation.
              </p>
              <p>
                The multi-hop graph traversal implements{' '}
                <span className="font-medium text-vrin-charcoal">
                  spreading activation
                </span>{' '}
                from semantic network theory: entities activate related entities
                along typed relationship edges, not through embedding similarity.
                Hub-weighted PageRank reflects how the brain organizes knowledge
                through hub-like multi-synaptic structures rather than
                point-to-point connections.
              </p>
              <p>
                The confidence scoring system draws from{' '}
                <span className="font-medium text-vrin-charcoal">
                  metacognitive monitoring
                </span>
                . The anterior cingulate cortex detects retrieval uncertainty and
                can halt processing when evidence is insufficient. Vrin&apos;s
                adaptive bail-out, which detects zero entity coverage and
                terminates in under 500ms, is a direct analog.
              </p>
              <p>
                The nightly consolidation pipeline (community detection,
                cross-fact deduplication, usage-based stability scoring) mirrors{' '}
                <span className="font-medium text-vrin-charcoal">
                  sleep-dependent memory consolidation
                </span>
                , where the brain restructures and strengthens frequently
                accessed knowledge pathways.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The 95% unexplored */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Looking forward</span>
              <span className="hairline flex-1" />
            </div>

            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal mb-10">
              The <span className="serif-italic text-vrin-blue">95%</span>{' '}
              unexplored.
            </h2>

            <div className="space-y-6 text-base md:text-lg text-vrin-charcoal/70 leading-relaxed">
              <p>
                We believe the industry has explored less than 5% of the
                available innovation space in knowledge-augmented AI. The dominant
                focus has been on improving the{' '}
                <span className="italic">retrieval</span> subprocess: better
                embeddings, smarter reranking, larger context windows. The other
                four cognitive subprocesses (perception, structuring, storage,
                and organization), each with validated science behind them,
                remain largely unapplied.
              </p>
              <p>
                Active areas of research include{' '}
                <span className="font-medium text-vrin-charcoal">
                  adaptive retrieval
                </span>{' '}
                that makes finer-grained decisions about which pipeline stages
                to invoke,{' '}
                <span className="font-medium text-vrin-charcoal">
                  automatic domain specialization
                </span>{' '}
                that detects query patterns and learns domain expertise from
                usage, and{' '}
                <span className="font-medium text-vrin-charcoal">
                  knowledge graph pattern detection
                </span>{' '}
                that identifies frequently-accessed subgraphs and creates memory
                packs for fine-tuning domain-specialized models.
              </p>
              <p>
                The fundamental thesis is that AI systems will eventually be
                specialized like human employees, not through fine-tuning a
                single model, but through engineering the cognitive
                infrastructure surrounding it.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Further reading */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container max-w-5xl relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Further reading</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal">
              Deep <span className="serif-italic text-vrin-blue">dives.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {furtherReading.map((item, i) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group p-7 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60 hover:border-vrin-charcoal/25 transition-all duration-500"
                >
                  <div className="w-10 h-10 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-vrin-blue" />
                  </div>
                  <h4 className="font-display text-xl leading-[1.15] text-vrin-charcoal group-hover:text-vrin-blue transition-colors mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-vrin-charcoal/65 leading-relaxed">
                    {item.blurb}
                  </p>
                </Link>
              )
            })}
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
            <span className="eyebrow text-vrin-charcoal/50">Reasoning before inference</span>
            <span className="w-10 h-px bg-vrin-charcoal/20" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] text-vrin-charcoal">
            The context is reasoned over
            <br />
            <span className="serif-italic text-vrin-blue">
              before the model sees it.
            </span>
          </h2>

          <p className="mt-8 max-w-xl mx-auto text-lg text-vrin-charcoal/65 leading-relaxed">
            Read the whitepaper, explore the benchmark code, or see it in action.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://vrin.cloud/vrin-whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-vrin-charcoal px-7 py-4 text-sm font-medium text-vrin-cream hover:bg-vrin-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              Read the whitepaper
            </a>
            <Link
              href="/playground"
              className="group inline-flex items-center gap-2 rounded-full border border-vrin-charcoal/20 px-7 py-4 text-sm font-medium text-vrin-charcoal hover:border-vrin-charcoal/50 hover:bg-vrin-sand/40 transition-all duration-300"
            >
              Try the playground
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
