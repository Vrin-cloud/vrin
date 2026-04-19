'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  ArrowUpRight,
  Calendar,
  Briefcase,
  TrendingUp,
  Stethoscope,
  Scale,
  Users,
  FlaskConical,
  Cog,
  Truck,
  Cloud,
  Server,
  Lock,
} from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

const tier1 = [
  {
    icon: Briefcase,
    name: 'Strategy Consulting & Corporate Strategy',
    value:
      'Every engagement requires synthesizing market trends, competitor behavior, cost structures, and risk factors across dozens of sources into a single recommendation.',
  },
  {
    icon: TrendingUp,
    name: 'Investment Management & Venture Capital',
    value:
      'Investment decisions depend on connecting incomplete signals: founder quality, market timing, tech feasibility, macro trends, comparable valuations. No single document holds the answer.',
  },
  {
    icon: Stethoscope,
    name: 'Clinical Medicine & Diagnostics',
    value:
      'Diagnosis is chaining symptoms, test results, medical history, drug interactions, and clinical guidelines. Life-or-death multi-hop reasoning, every day.',
  },
  {
    icon: Scale,
    name: 'Complex Litigation & Corporate Law',
    value:
      'Legal arguments require linking statutes, precedents, case facts, and regulatory filings across jurisdictions. One missed connection changes the outcome.',
  },
  {
    icon: Users,
    name: 'Product Management at Tech Companies',
    value:
      'Balancing user behavior data, funnel metrics, feature gaps, engineering constraints, and business goals. Every prioritization decision is a 4+ hop problem.',
  },
]

const tier2 = [
  {
    icon: FlaskConical,
    name: 'Scientific Research & R&D',
    value: 'Hypothesis building across experiments, anomalies, model revisions, and prior literature. Discovery lives in the connections.',
  },
  {
    icon: Cog,
    name: 'Complex Engineering',
    value: 'Aerospace, energy, infrastructure. Interdependent systems where one design choice cascades through materials, thermal effects, safety, and cost.',
  },
  {
    icon: Truck,
    name: 'Supply Chain & Operations Strategy',
    value: 'Supplier delays, inventory levels, distribution networks, demand signals, revenue impact. Multi-hop reasoning under time pressure.',
  },
]

const deploymentModels = [
  {
    icon: Cloud,
    name: 'Cloud',
    description: 'Fully managed on Vrin infrastructure. Start in minutes.',
  },
  {
    icon: Server,
    name: 'Hybrid',
    description: 'Your data stays in your cloud. Vrin compute on ours.',
  },
  {
    icon: Lock,
    name: 'Private VPC',
    description: 'Everything in your account. Nothing leaves your perimeter.',
  },
]

function Chapter({
  index,
  eyebrow,
  title,
  italic,
  children,
}: {
  index: string
  eyebrow: string
  title: string
  italic?: string
  children: React.ReactNode
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="container max-w-4xl relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease }}
        >
          <div className="flex items-baseline gap-5 mb-8">
            <span className="font-mono text-xs tracking-[0.14em] text-vrin-charcoal/40">
              § {index}
            </span>
            <span className="eyebrow text-vrin-blue">{eyebrow}</span>
            <span className="hairline flex-1" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal mb-10">
            {title}
            {italic && (
              <>
                {' '}
                <span className="serif-italic text-vrin-blue">{italic}</span>
              </>
            )}
          </h2>
          <div className="space-y-6 text-base md:text-lg text-vrin-charcoal/70 leading-relaxed">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function DarkChapter({
  index,
  eyebrow,
  title,
  italic,
  children,
}: {
  index: string
  eyebrow: string
  title: string
  italic?: string
  children: React.ReactNode
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <section className="relative bg-vrin-ink py-24 md:py-32 overflow-hidden rounded-[3rem] md:rounded-[4rem]">
      <div className="absolute inset-0 grid-faint-dark opacity-50 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="container max-w-4xl relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease }}
        >
          <div className="flex items-baseline gap-5 mb-8">
            <span className="font-mono text-xs tracking-[0.14em] text-vrin-cream/40">
              § {index}
            </span>
            <span className="eyebrow text-vrin-sage">{eyebrow}</span>
            <span className="hairline flex-1 opacity-40" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-cream mb-10">
            {title}
            {italic && (
              <>
                {' '}
                <span className="serif-italic text-vrin-sage">{italic}</span>
              </>
            )}
          </h2>
          <div className="space-y-6 text-base md:text-lg text-vrin-cream/70 leading-relaxed">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function ManifestoPage() {
  return (
    <div className="flex flex-col bg-vrin-paper">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-24 md:pb-32 overflow-hidden vignette-paper">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-10 max-w-5xl mx-auto">
            <span className="eyebrow text-vrin-blue">Our manifesto</span>
            <span className="hairline flex-1" />
            <span className="hidden md:inline text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
              vrin.cloud / § 000
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] tracking-[-0.035em] text-vrin-charcoal max-w-5xl mx-auto text-center"
          >
            The reasoning layer
            <br />
            AI agents are <span className="serif-italic text-vrin-blue">missing</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-vrin-charcoal/65 leading-relaxed text-center"
          >
            Context reasoning at the retrieval layer. The overlooked layer between
            your data and your AI.
          </motion.p>
        </div>
      </section>

      <Chapter
        index="001"
        eyebrow="The problem"
        title="Retrieval-time reasoning is"
        italic="overlooked."
      >
        <p>
          Everyone is building better models. Better agents. Better memory. Nobody
          is building the layer that reasons about what context the agent actually
          needs before inference begins.
        </p>
        <p>
          Today&apos;s AI agents are brilliant reasoners. Give them the right context
          and they&apos;ll synthesize, analyze, and conclude with remarkable accuracy.
          But gathering that context? That&apos;s where everything breaks down.
        </p>
        <p>
          Enterprise data lives in terabytes, sometimes petabytes, scattered across
          departments, tools, and formats. You can&apos;t feed it all into a context
          window. So the industry invented RAG: store documents as vector
          embeddings, retrieve by semantic similarity. Embed, retrieve, generate.
          Three steps. No reasoning anywhere in between.
        </p>
        <p>
          This works for simple lookups. It fails the moment a question requires
          connecting insights from across different domains, teams, or timelines.
          Most enterprise decisions require exactly that.
        </p>
      </Chapter>

      <Chapter
        index="002"
        eyebrow="The insight"
        title="Vector similarity is not"
        italic="cognition."
      >
        <p>
          Decades of cognitive science research on how humans retrieve and connect
          knowledge was completely ignored when building retrieval systems. The
          brain doesn&apos;t do cosine similarity. It structures, connects,
          inhibits irrelevant paths, consolidates over time, and reasons
          iteratively before arriving at a conclusion.
        </p>
        <p>
          RAG standardized on embed-retrieve-generate in 2023 and the industry
          moved on. The assumption was that better embeddings or bigger context
          windows would eventually solve multi-hop reasoning. They won&apos;t.
          Transformer architecture itself degrades beyond 2-3 reasoning hops.
          This isn&apos;t a training data problem. It&apos;s a fundamental
          architectural limitation that requires an external reasoning layer.
        </p>
      </Chapter>

      <Chapter
        index="003"
        eyebrow="The gap"
        title="The market is solving memory. The problem is"
        italic="reasoning."
      >
        <p>
          Every startup building context infrastructure for AI agents is focused
          on the same thing: long-term memory storage. Store what the agent saw,
          recall it later. But storage is a solved problem. A vector store already
          does this.
        </p>
        <p>
          The hard part was never remembering. It&apos;s connecting what you
          remember into insights that actually help the agent make a decision.
          None of these players attempt multi-hop reasoning, query decomposition,
          or cross-document synthesis. They&apos;re building better filing
          cabinets. The industry needs the analyst who reads the files.
        </p>
      </Chapter>

      <DarkChapter
        index="004"
        eyebrow="What we're building"
        title="Retrieval-time"
        italic="reasoning."
      >
        <p>
          Vrin adds the missing layer between your data and your AI agents.
          Before the model sees a single token, Vrin has already understood the
          crux of the query, traversed a structured knowledge graph, connected
          insights across domains the user never mentioned, and constructed a
          reasoning chain that gives the AI agent exactly what it needs.
        </p>
        <p>
          Not retrieval. Not recall. Reasoning about what context is needed, why
          it&apos;s connected, and how to present it so the AI agent arrives at
          the right conclusion.
        </p>
        <p>
          The result: AI responses that are accurate, cited, traceable to specific
          facts from specific documents, with confidence scores on every claim.
          Already outperforming the best published academic systems on multi-hop
          reasoning benchmarks.
        </p>
      </DarkChapter>

      {/* Who we serve */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-baseline gap-5 mb-10">
              <span className="font-mono text-xs tracking-[0.14em] text-vrin-charcoal/40">
                § 005
              </span>
              <span className="eyebrow text-vrin-blue">Who we serve</span>
              <span className="hairline flex-1" />
            </div>

            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal mb-6">
              Industries where connecting the dots{' '}
              <span className="serif-italic text-vrin-blue">is</span> the job.
            </h2>
            <p className="max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed mb-16">
              Vrin serves teams that face complex, multi-step, cross-domain
              questions every single day to make strategic decisions that move
              the business.
            </p>

            {/* Tier 1 */}
            <div className="mb-16">
              <p className="eyebrow text-vrin-charcoal/45 mb-8">Core industries</p>
              <div className="grid md:grid-cols-2 gap-5">
                {tier1.map((industry, i) => {
                  const Icon = industry.icon
                  return (
                    <motion.div
                      key={industry.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease }}
                      className="p-7 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60 hover:border-vrin-charcoal/25 transition-all duration-500"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <Icon className="w-5 h-5 text-vrin-blue" />
                        </div>
                        <div>
                          <h4 className="font-display text-xl leading-[1.15] text-vrin-charcoal mb-2">
                            {industry.name}
                          </h4>
                          <p className="text-sm text-vrin-charcoal/65 leading-relaxed">
                            {industry.value}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Tier 2 */}
            <div>
              <p className="eyebrow text-vrin-charcoal/45 mb-8">Strong fit</p>
              <div className="grid md:grid-cols-3 gap-5">
                {tier2.map((industry, i) => {
                  const Icon = industry.icon
                  return (
                    <motion.div
                      key={industry.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease }}
                      className="p-7 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60 hover:border-vrin-charcoal/25 transition-all duration-500"
                    >
                      <div className="w-10 h-10 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center mb-5">
                        <Icon className="w-5 h-5 text-vrin-blue" />
                      </div>
                      <h4 className="font-display text-xl leading-[1.15] text-vrin-charcoal mb-2">
                        {industry.name}
                      </h4>
                      <p className="text-sm text-vrin-charcoal/65 leading-relaxed">
                        {industry.value}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment models */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container max-w-5xl relative z-10">
          <div className="flex items-baseline gap-5 mb-10">
            <span className="font-mono text-xs tracking-[0.14em] text-vrin-charcoal/40">
              § 006
            </span>
            <span className="eyebrow text-vrin-blue">How it works</span>
            <span className="hairline flex-1" />
          </div>

          <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal mb-6 max-w-3xl">
            Embeddable <span className="serif-italic text-vrin-blue">by design.</span>
          </h2>
          <p className="max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed mb-16">
            SDK, MCP server, REST API. Vrin drops into any AI agent stack. Three
            deployment models to match your security requirements.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {deploymentModels.map((model, i) => {
              const Icon = model.icon
              return (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease }}
                  className="p-8 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60"
                >
                  <div className="w-11 h-11 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-vrin-blue" />
                  </div>
                  <h4 className="font-display text-2xl leading-[1.15] text-vrin-charcoal mb-2">
                    {model.name}
                  </h4>
                  <p className="text-sm text-vrin-charcoal/65 leading-relaxed">
                    {model.description}
                  </p>
                </motion.div>
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
            <span className="eyebrow text-vrin-charcoal/50">Ready to reason</span>
            <span className="w-10 h-px bg-vrin-charcoal/20" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] text-vrin-charcoal">
            Give your AI agents
            <br />
            the ability to <span className="serif-italic text-vrin-blue">reason.</span>
          </h2>

          <p className="mt-8 max-w-xl mx-auto text-lg text-vrin-charcoal/65 leading-relaxed">
            Start free. See the difference retrieval-time reasoning makes.
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
              Book a 20-min demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
