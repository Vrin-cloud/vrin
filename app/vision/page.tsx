"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
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
} from "lucide-react"

const tier1 = [
  {
    icon: Briefcase,
    name: "Strategy Consulting & Corporate Strategy",
    value: "Every engagement requires synthesizing market trends, competitor behavior, cost structures, and risk factors across dozens of sources into a single recommendation.",
  },
  {
    icon: TrendingUp,
    name: "Investment Management & Venture Capital",
    value: "Investment decisions depend on connecting incomplete signals: founder quality, market timing, tech feasibility, macro trends, comparable valuations. No single document holds the answer.",
  },
  {
    icon: Stethoscope,
    name: "Clinical Medicine & Diagnostics",
    value: "Diagnosis is chaining symptoms, test results, medical history, drug interactions, and clinical guidelines. Life-or-death multi-hop reasoning, every day.",
  },
  {
    icon: Scale,
    name: "Complex Litigation & Corporate Law",
    value: "Legal arguments require linking statutes, precedents, case facts, and regulatory filings across jurisdictions. One missed connection changes the outcome.",
  },
  {
    icon: Users,
    name: "Product Management at Tech Companies",
    value: "Balancing user behavior data, funnel metrics, feature gaps, engineering constraints, and business goals. Every prioritization decision is a 4+ hop problem.",
  },
]

const tier2 = [
  {
    icon: FlaskConical,
    name: "Scientific Research & R&D",
    value: "Hypothesis building across experiments, anomalies, model revisions, and prior literature. Discovery lives in the connections.",
  },
  {
    icon: Cog,
    name: "Complex Engineering",
    value: "Aerospace, energy, infrastructure. Interdependent systems where one design choice cascades through materials, thermal effects, safety, and cost.",
  },
  {
    icon: Truck,
    name: "Supply Chain & Operations Strategy",
    value: "Supplier delays, inventory levels, distribution networks, demand signals, revenue impact. Multi-hop reasoning under time pressure.",
  },
]

const deploymentModels = [
  {
    icon: Cloud,
    name: "Cloud",
    description: "Fully managed on Vrin infrastructure. Start in minutes.",
  },
  {
    icon: Server,
    name: "Hybrid",
    description: "Your data stays in your cloud. Vrin compute on ours.",
  },
  {
    icon: Lock,
    name: "Private VPC",
    description: "Everything in your account. Nothing leaves your perimeter.",
  },
]

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

export default function VisionPage() {
  return (
    <div className="flex flex-col">
      <AnimatedBackground />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
              Our Vision
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#201E1E] dark:text-white leading-tight mb-8">
              The reasoning layer<br />AI agents are missing
            </h1>
            <p className="text-lg text-[#201E1E]/60 dark:text-white/60 font-light max-w-2xl mx-auto">
              Context reasoning at the retrieval layer. The overlooked layer between your data and your AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-3xl mx-auto px-6">
          <Section>
            <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
              The Problem
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-8">
              Retrieval-time reasoning is overlooked
            </h2>
            <div className="space-y-6 text-lg text-[#201E1E]/70 dark:text-white/70 font-light leading-relaxed">
              <p>
                Everyone is building better models. Better agents. Better memory. Nobody is building the layer that reasons about what context the agent actually needs before inference begins.
              </p>
              <p>
                Today&apos;s AI agents are brilliant reasoners. Give them the right context and they&apos;ll synthesize, analyze, and conclude with remarkable accuracy. But gathering that context? That&apos;s where everything breaks down.
              </p>
              <p>
                Enterprise data lives in terabytes, sometimes petabytes, scattered across departments, tools, and formats. You can&apos;t feed it all into a context window. So the industry invented RAG: store documents as vector embeddings, retrieve by semantic similarity. Embed, retrieve, generate. Three steps. No reasoning anywhere in between.
              </p>
              <p>
                This works for simple lookups. It fails the moment a question requires connecting insights from across different domains, teams, or timelines. Most enterprise decisions require exactly that.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* The Insight */}
      <section className="py-24 bg-[#F8F8F8] dark:bg-[#1A1818]">
        <div className="container max-w-3xl mx-auto px-6">
          <Section>
            <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
              The Insight
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-8">
              Vector similarity is not cognition
            </h2>
            <div className="space-y-6 text-lg text-[#201E1E]/70 dark:text-white/70 font-light leading-relaxed">
              <p>
                Decades of cognitive science research on how humans retrieve and connect knowledge was completely ignored when building retrieval systems. The brain doesn&apos;t do cosine similarity. It structures, connects, inhibits irrelevant paths, consolidates over time, and reasons iteratively before arriving at a conclusion.
              </p>
              <p>
                RAG standardized on embed-retrieve-generate in 2023 and the industry moved on. The assumption was that better embeddings or bigger context windows would eventually solve multi-hop reasoning. They won&apos;t. Transformer architecture itself degrades beyond 2-3 reasoning hops. This isn&apos;t a training data problem. It&apos;s a fundamental architectural limitation that requires an external reasoning layer.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* The Gap */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-3xl mx-auto px-6">
          <Section>
            <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
              The Gap
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-8">
              The market is solving memory. The problem is reasoning.
            </h2>
            <div className="space-y-6 text-lg text-[#201E1E]/70 dark:text-white/70 font-light leading-relaxed">
              <p>
                Every startup building context infrastructure for AI agents is focused on the same thing: long-term memory storage. Store what the agent saw, recall it later. But storage is a solved problem. A vector store already does this.
              </p>
              <p>
                The hard part was never remembering. It&apos;s connecting what you remember into insights that actually help the agent make a decision. None of these players attempt multi-hop reasoning, query decomposition, or cross-document synthesis. They&apos;re building better filing cabinets. The industry needs the analyst who reads the files.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* What We&apos;re Building */}
      <section className="py-24 bg-[#201E1E]">
        <div className="container max-w-3xl mx-auto px-6">
          <Section>
            <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
              What We&apos;re Building
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-8">
              Retrieval-time reasoning
            </h2>
            <div className="space-y-6 text-lg text-white/70 font-light leading-relaxed">
              <p>
                Vrin adds the missing layer between your data and your AI agents. Before the model sees a single token, Vrin has already understood the crux of the query, traversed a structured knowledge graph, connected insights across domains the user never mentioned, and constructed a reasoning chain that gives the AI agent exactly what it needs.
              </p>
              <p>
                Not retrieval. Not recall. Reasoning about what context is needed, why it&apos;s connected, and how to present it so the AI agent arrives at the right conclusion.
              </p>
              <p>
                The result: AI responses that are accurate, cited, traceable to specific facts from specific documents, with confidence scores on every claim. Already outperforming the best published academic systems on multi-hop reasoning benchmarks.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-5xl mx-auto px-6">
          <Section>
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
                Who We Serve
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-4">
                Industries where connecting the dots is the job
              </h2>
              <p className="text-lg text-[#201E1E]/60 dark:text-white/60 font-light max-w-2xl mx-auto">
                Vrin serves teams that face complex, multi-step, cross-domain questions every single day to make strategic decisions that move the business.
              </p>
            </div>

            {/* Tier 1 */}
            <div className="mb-16">
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#201E1E]/40 dark:text-white/40 mb-8">
                Core Industries
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {tier1.map((industry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-6 rounded-2xl border border-[#201E1E]/10 dark:border-white/10 hover:border-[#8DAA9D]/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#8DAA9D]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <industry.icon className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-[#201E1E] dark:text-white mb-2">
                          {industry.name}
                        </h4>
                        <p className="text-sm text-[#201E1E]/60 dark:text-white/60 font-light leading-relaxed">
                          {industry.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tier 2 */}
            <div>
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#201E1E]/40 dark:text-white/40 mb-8">
                Strong Fit
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {tier2.map((industry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-6 rounded-2xl border border-[#201E1E]/10 dark:border-white/10 hover:border-[#8DAA9D]/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#8DAA9D]/10 flex items-center justify-center mb-4">
                      <industry.icon className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                    </div>
                    <h4 className="text-base font-medium text-[#201E1E] dark:text-white mb-2">
                      {industry.name}
                    </h4>
                    <p className="text-sm text-[#201E1E]/60 dark:text-white/60 font-light leading-relaxed">
                      {industry.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* How: Deployment Models */}
      <section className="py-24 bg-[#F8F8F8] dark:bg-[#1A1818]">
        <div className="container max-w-4xl mx-auto px-6">
          <Section>
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-[#8DAA9D] mb-6 block">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-white mb-4">
                Embeddable by design
              </h2>
              <p className="text-lg text-[#201E1E]/60 dark:text-white/60 font-light max-w-2xl mx-auto">
                SDK, MCP server, REST API. Vrin drops into any AI agent stack. Three deployment models to match your security requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {deploymentModels.map((model, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center p-8 rounded-2xl border border-[#201E1E]/10 dark:border-white/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#8DAA9D]/10 flex items-center justify-center mx-auto mb-5">
                    <model.icon className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D]" />
                  </div>
                  <h4 className="text-lg font-medium text-[#201E1E] dark:text-white mb-2">
                    {model.name}
                  </h4>
                  <p className="text-sm text-[#201E1E]/60 dark:text-white/60 font-light">
                    {model.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#201E1E]">
        <div className="container max-w-3xl mx-auto px-6 text-center">
          <Section>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Give your AI agents the ability to reason
            </h2>
            <p className="text-lg text-white/60 font-light mb-10 max-w-xl mx-auto">
              Start free. See the difference retrieval-time reasoning makes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="px-8 py-6 text-base font-medium bg-[#083C5E] hover:bg-[#083C5E]/90 text-white rounded-full"
                onClick={() => window.open("https://vrin.cloud/waitlist", "_blank")}
              >
                Join Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-medium border-2 border-white/20 text-[#201E1E] bg-white hover:bg-white/90 rounded-full"
                onClick={() => window.open("https://cal.com/vedant-vrin/book-a-demo", "_blank")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Demo
              </Button>
            </div>
          </Section>
        </div>
      </section>

      <Footer />
    </div>
  )
}
