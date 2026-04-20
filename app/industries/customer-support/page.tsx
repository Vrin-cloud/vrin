'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  Users,
  MessageSquare,
  Zap,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Search,
  FileText,
  Link2,
  AlertCircle,
  UserPlus,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

const problems = [
  {
    icon: Layers,
    title: 'Context is scattered',
    description:
      'Across tickets, docs, Slack, product notes, and the people who “just know.”',
  },
  {
    icon: Users,
    title: 'Answers drift across agents',
    description:
      'Different reps give different answers to the same question.',
  },
  {
    icon: AlertCircle,
    title: 'Escalations stall tickets',
    description:
      'Waiting on someone who has the context slows everything down.',
  },
  {
    icon: UserPlus,
    title: 'New hires ramp slowly',
    description:
      'It takes months before new agents can handle complex cases confidently.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Connect your knowledge sources',
    description:
      "Vrin connects to where support truth actually lives. Tickets, docs, Slack, issue trackers, and internal knowledge, so your team isn't stuck guessing or switching tabs.",
    icon: Link2,
  },
  {
    step: '02',
    title: 'Get an Answer Card inside the ticket',
    description:
      'When a ticket opens, Vrin generates a tight summary, recommended next steps, and key supporting context. No wall of text, just what matters. Every claim is backed by sources.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Deep Search for complex cases',
    description:
      'If a case is unusual, agents ask Vrin directly. It searches across all connected systems and surfaces the most relevant evidence: similar past cases, internal decisions, runbooks, and what changed.',
    icon: Search,
  },
  {
    step: '04',
    title: 'Draft a response in your tone',
    description:
      "With one click, Vrin drafts a reply grounded in your policies and the facts of the case. Reps approve, edit, and send. Faster replies, more consistent answers.",
    icon: MessageSquare,
  },
  {
    step: '05',
    title: 'Trigger workflow agents for follow-ups',
    description:
      'Beyond answers, Vrin can spin up agents for the busywork: drafting Slack questions to the right team, compiling escalation packets, or proposing KB updates from resolutions.',
    icon: Zap,
  },
]

const outcomes = [
  { metric: 'Lower AHT', description: 'Average handle time' },
  { metric: 'Fewer escalations', description: 'Faster handoffs when needed' },
  { metric: 'Higher FCR', description: 'First-contact resolution' },
  { metric: 'Faster onboarding', description: 'New-hire ramp time' },
  { metric: 'Consistent answers', description: 'Less drift across agents' },
  { metric: 'Cleaner KB', description: 'Solutions captured automatically' },
]

const integrations = {
  support: ['Zendesk', 'Intercom', 'Freshdesk', 'HelpScout'],
  knowledge: ['Slack', 'Confluence', 'Notion', 'Google Drive', 'SharePoint'],
  engineering: ['Jira', 'GitHub', 'Linear'],
}

const differentiators = [
  {
    title: 'Cross-tool context',
    description:
      'Not just help-center answers. Pulls from tickets, internal chatter, and engineering context.',
  },
  {
    title: 'Source-backed answers',
    description:
      'Agents can verify quickly and confidently respond. Every claim has a citation.',
  },
  {
    title: 'Consistency at scale',
    description: 'Reduces answer drift across reps, shifts, and regions.',
  },
  {
    title: 'Actionable workflows',
    description:
      "Agents don't just suggest. They help package escalations, message teams, and update KB.",
  },
  {
    title: 'Fits your workflow',
    description:
      'Inside your existing support portal. No “context switching tax.”',
  },
]

const faqs = [
  {
    question: 'Does Vrin replace our agents?',
    answer:
      "No. Vrin equips agents with context, verified sources, and workflow agents so they can resolve faster and stay consistent. It's a copilot, not a replacement.",
  },
  {
    question: 'Does it work with Zendesk / Intercom?',
    answer:
      'Yes. Vrin is designed to embed into the support portal you already use and pull the right context into the ticket. We support Zendesk, Intercom, Freshdesk, and similar platforms.',
  },
  {
    question: 'Where does Vrin pull knowledge from?',
    answer:
      'From the sources you connect: tickets, docs, internal discussions, engineering trackers, Slack, and more, so answers reflect how your company actually operates.',
  },
  {
    question: 'Will it auto-send replies to customers?',
    answer:
      'Default is draft + approve. Your agents always review before sending. If you enable automation later, you choose which workflows can run automatically.',
  },
  {
    question: 'What about complex issues and escalations?',
    answer:
      'Vrin can compile an escalation packet with key context, timeline, and evidence so escalation is faster and cleaner. The receiving team gets everything they need.',
  },
  {
    question: 'How do you prevent made-up answers?',
    answer:
      'Vrin emphasizes source-backed context and verification. Agents can see citations and the evidence behind key claims before sending. No hallucinations, just facts from your systems.',
  },
]

function FAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-vrin-charcoal/10 last:border-0">
      <button
        className="w-full flex items-center justify-between py-6 text-left"
        onClick={onToggle}
      >
        <span className="font-display text-lg md:text-xl text-vrin-charcoal pr-4 leading-tight">
          {q}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-vrin-charcoal/40 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-vrin-charcoal/40 flex-shrink-0" />
        )}
      </button>
      {open && (
        <p className="pb-6 text-base text-vrin-charcoal/65 leading-relaxed max-w-3xl">
          {a}
        </p>
      )}
    </div>
  )
}

export default function CustomerSupportPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause()
      else videoRef.current.play()
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) document.exitFullscreen()
      else videoRef.current.requestFullscreen()
    }
  }

  return (
    <div className="flex flex-col bg-vrin-paper">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-16 md:pb-20 overflow-hidden vignette-paper">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <span className="eyebrow text-vrin-blue">For customer support</span>
            <span className="hairline flex-1" />
            <span className="hidden md:inline text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
              inside your support portal
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] tracking-[-0.035em] text-vrin-charcoal max-w-5xl"
          >
            Resolve complex tickets faster,{' '}
            <span className="serif-italic text-vrin-blue">
              without bouncing between tools.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-8 max-w-3xl text-lg md:text-xl text-vrin-charcoal/65 leading-relaxed"
          >
            Support teams lose time on context: past tickets, Slack threads,
            docs, runbooks, product notes. Vrin brings the right evidence into
            the ticket, drafts customer-ready replies, and triggers workflow
            agents for follow-ups, so resolution stays fast even when cases get
            messy.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="mt-4 text-sm text-vrin-charcoal/50"
          >
            Works with your existing support portal (Zendesk, Intercom, or
            similar) and connects to the tools where knowledge lives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-vrin-charcoal px-7 py-4 text-sm font-medium text-vrin-cream hover:bg-vrin-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              Watch the demo
              <Play className="w-4 h-4" />
            </Link>
            <a
              href="https://cal.com/vedant-vrin/book-a-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-vrin-charcoal/20 px-7 py-4 text-sm font-medium text-vrin-charcoal hover:border-vrin-charcoal/50 hover:bg-vrin-sand/40 transition-all duration-300"
            >
              Book a 15-min call
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Video demo */}
      <section id="demo" className="relative bg-vrin-paper py-12 md:py-20 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="relative max-w-5xl mx-auto"
          >
            <div
              className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-vrin-charcoal/10 bg-vrin-ink"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              <video
                ref={videoRef}
                className="w-full aspect-video"
                src="/videos/Customer Support Demo Compressed.mp4"
                poster="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230D0D0E'/%3E%3C/svg%3E"
                muted={isMuted}
                playsInline
                onEnded={() => setIsPlaying(false)}
              />

              {!isPlaying && (
                <button
                  className="absolute inset-0 flex items-center justify-center bg-vrin-ink/30 cursor-pointer group"
                  onClick={togglePlay}
                  aria-label="Play demo"
                >
                  <span className="w-20 h-20 rounded-full bg-vrin-cream/95 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <Play className="w-7 h-7 text-vrin-charcoal ml-1 fill-vrin-charcoal" />
                  </span>
                </button>
              )}

              <div
                className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-vrin-ink/80 to-transparent transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full bg-vrin-cream/20 hover:bg-vrin-cream/30 flex items-center justify-center transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-vrin-cream" />
                      ) : (
                        <Play className="w-4 h-4 text-vrin-cream" />
                      )}
                    </button>
                    <button
                      onClick={restartVideo}
                      className="w-10 h-10 rounded-full bg-vrin-cream/20 hover:bg-vrin-cream/30 flex items-center justify-center transition-colors"
                      aria-label="Restart"
                    >
                      <RotateCcw className="w-4 h-4 text-vrin-cream" />
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 rounded-full bg-vrin-cream/20 hover:bg-vrin-cream/30 flex items-center justify-center transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-vrin-cream" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-vrin-cream" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded-full bg-vrin-cream/20 hover:bg-vrin-cream/30 flex items-center justify-center transition-colors"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="w-4 h-4 text-vrin-cream" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
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
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-cream">
              Why complex tickets{' '}
              <span className="serif-italic text-vrin-sage">stall.</span>
            </h2>
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
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal">
              Context in the ticket.{' '}
              <span className="serif-italic text-vrin-blue">Reply out.</span>
            </h2>
          </div>

          <div className="max-w-4xl space-y-10 md:space-y-12">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
              >
                <span className="font-mono text-sm tracking-widest text-vrin-charcoal/40">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl leading-[1.15] tracking-[-0.02em] text-vrin-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-vrin-charcoal/65 leading-relaxed max-w-3xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="relative bg-vrin-cream py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-14 max-w-5xl mx-auto">
            <span className="eyebrow text-vrin-blue">Outcomes</span>
            <span className="hairline flex-1" />
            <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
              what teams feel
            </span>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-y-12 md:gap-y-16 gap-x-10">
            {outcomes.map((item, i) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                className="relative"
              >
                <span className="absolute -left-4 md:-left-7 top-1 text-[10px] font-mono tracking-widest text-vrin-charcoal/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-display text-xl md:text-2xl leading-tight text-vrin-charcoal">
                  {item.metric}
                </p>
                <p className="mt-1.5 text-sm text-vrin-charcoal/55 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Why Vrin</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal">
              Built for how support{' '}
              <span className="serif-italic text-vrin-blue">actually works.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl">
            {differentiators.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="p-7 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60"
              >
                <h3 className="font-display text-xl md:text-2xl leading-[1.15] text-vrin-charcoal mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-vrin-charcoal/65 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-4xl mb-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Integrations</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal">
              Works with the tools{' '}
              <span className="serif-italic text-vrin-blue">you already use.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-6xl">
            {(['support', 'knowledge', 'engineering'] as const).map((key) => (
              <div
                key={key}
                className="p-7 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60"
              >
                <p className="eyebrow text-vrin-blue mb-5 capitalize">{key}</p>
                <div className="flex flex-wrap gap-2">
                  {integrations[key].map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 rounded-full border border-vrin-charcoal/15 bg-vrin-paper/60 text-sm text-vrin-charcoal/75"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container max-w-4xl relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Frequently asked</span>
              <span className="hairline flex-1" />
            </div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.0] tracking-[-0.025em] text-vrin-charcoal">
              Common <span className="serif-italic text-vrin-blue">questions.</span>
            </h2>
          </div>
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              q={faq.question}
              a={faq.answer}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="w-10 h-px bg-vrin-charcoal/20" />
            <span className="eyebrow text-vrin-charcoal/50">Inside your portal</span>
            <span className="w-10 h-px bg-vrin-charcoal/20" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] text-vrin-charcoal">
            Resolutions that hold up{' '}
            <span className="serif-italic text-vrin-blue">across every ticket.</span>
          </h2>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cal.com/vedant-vrin/book-a-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-vrin-charcoal px-7 py-4 text-sm font-medium text-vrin-cream hover:bg-vrin-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a 15-min call
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
