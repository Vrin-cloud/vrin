"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import {
  Headphones,
  Brain,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Shield,
  Search,
  FileText,
  Link2,
  AlertCircle,
  UserPlus,
  Layers,
  ChevronDown,
  ChevronUp,
  Quote
} from "lucide-react"

// Problem statements
const problems = [
  {
    icon: Layers,
    title: "Context is scattered",
    description: "Across tickets, docs, Slack, product notes, and the people who 'just know.'"
  },
  {
    icon: Users,
    title: "Answers drift across agents",
    description: "Different reps give different answers to the same question."
  },
  {
    icon: AlertCircle,
    title: "Escalations stall tickets",
    description: "Waiting on someone who has the context slows everything down."
  },
  {
    icon: UserPlus,
    title: "New hires ramp slowly",
    description: "It takes months before new agents can handle complex cases confidently."
  }
]

// How it works steps
const howItWorks = [
  {
    step: "01",
    title: "Connect your knowledge sources",
    description: "Vrin connects to where support truth actually lives—tickets, docs, Slack, issue trackers, and internal knowledge—so your team isn't stuck guessing or switching tabs.",
    icon: Link2
  },
  {
    step: "02",
    title: "Get an Answer Card inside the ticket",
    description: "When a ticket opens, Vrin generates a tight summary, recommended next steps, and key supporting context. No wall of text—just what matters. Every claim is backed by sources.",
    icon: FileText
  },
  {
    step: "03",
    title: "Deep Search for complex cases",
    description: "If a case is unusual, agents ask Vrin directly. It searches across all connected systems and surfaces the most relevant evidence: similar past cases, internal decisions, runbooks, and what changed.",
    icon: Search
  },
  {
    step: "04",
    title: "Draft a response in your tone",
    description: "With one click, Vrin drafts a reply grounded in your policies and the facts of the case. Reps approve, edit, and send—faster replies, more consistent answers.",
    icon: MessageSquare
  },
  {
    step: "05",
    title: "Trigger workflow agents for follow-ups",
    description: "Beyond answers, Vrin can spin up agents for the busywork: drafting Slack questions to the right team, compiling escalation packets, or proposing KB updates from resolutions.",
    icon: Zap
  }
]

// Outcomes/metrics
const outcomes = [
  { metric: "Lower AHT", description: "Average Handle Time" },
  { metric: "Fewer Escalations", description: "Faster handoffs when needed" },
  { metric: "Higher FCR", description: "First-Contact Resolution" },
  { metric: "Faster Onboarding", description: "New hire ramp time" },
  { metric: "Consistent Answers", description: "Less drift across agents" },
  { metric: "Cleaner KB", description: "Solutions captured automatically" }
]

// Integrations
const integrations = {
  support: ["Zendesk", "Intercom", "Freshdesk", "HelpScout"],
  knowledge: ["Slack", "Confluence", "Notion", "Google Drive", "SharePoint"],
  engineering: ["Jira", "GitHub", "Linear"]
}

// FAQ items
const faqs = [
  {
    question: "Does Vrin replace our agents?",
    answer: "No—Vrin equips agents with context, verified sources, and workflow agents so they can resolve faster and stay consistent. It's a copilot, not a replacement."
  },
  {
    question: "Does it work with Zendesk / Intercom?",
    answer: "Yes. Vrin is designed to embed into the support portal you already use and pull the right context into the ticket. We support Zendesk, Intercom, Freshdesk, and similar platforms."
  },
  {
    question: "Where does Vrin pull knowledge from?",
    answer: "From the sources you connect—tickets, docs, internal discussions, engineering trackers, Slack, and more—so answers reflect how your company actually operates."
  },
  {
    question: "Will it auto-send replies to customers?",
    answer: "Default is draft + approve. Your agents always review before sending. If you enable automation later, you choose which workflows can run automatically."
  },
  {
    question: "What about complex issues and escalations?",
    answer: "Vrin can compile an escalation packet with key context, timeline, and evidence so escalation is faster and cleaner—the receiving team gets everything they need."
  },
  {
    question: "How do you prevent made-up answers?",
    answer: "Vrin emphasizes source-backed context and verification. Agents can see citations and the evidence behind key claims before sending. No hallucinations—just facts from your systems."
  }
]

// Differentiators
const differentiators = [
  {
    title: "Cross-tool context",
    description: "Not just help-center answers—pulls from tickets, internal chatter, and engineering context."
  },
  {
    title: "Source-backed answers",
    description: "Agents can verify quickly and confidently respond. Every claim has a citation."
  },
  {
    title: "Consistency at scale",
    description: "Reduces answer drift across reps, shifts, and regions."
  },
  {
    title: "Actionable workflows",
    description: "Agents don't just suggest—they help package escalations, message teams, and update KB."
  },
  {
    title: "Fits your workflow",
    description: "Inside your existing support portal—no 'context switching tax.'"
  }
]

export default function CustomerSupportPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
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
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#FFFDFD] dark:bg-[#201E1E]">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-6 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 border-[#083C5E]/20 dark:border-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D]">
              <Headphones className="w-4 h-4 mr-2" />
              Customer Support
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-6 text-[#201E1E] dark:text-[#FFFDFD]">
              Resolve Complex Tickets Faster—{" "}
              <span className="text-[#083C5E] dark:text-[#8DAA9D]">Without Bouncing Between Tools</span>
            </h1>
            <p className="text-lg md:text-xl text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light max-w-3xl mx-auto mb-4">
              Support teams lose time on context: past tickets, Slack threads, docs, runbooks, product notes.
              Vrin brings the right evidence into the ticket, drafts customer-ready replies, and triggers
              workflow agents for follow-ups—so resolution stays fast even when cases get messy.
            </p>
            <p className="text-sm text-[#201E1E]/50 dark:text-[#FFFDFD]/50 mb-8">
              Works with your existing support portal (Zendesk, Intercom, or similar) and connects to the tools where knowledge lives.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="#demo">
                <Button size="lg" className="rounded-full px-8 bg-[#083C5E] hover:bg-[#083C5E]/90 dark:bg-[#8DAA9D] dark:hover:bg-[#8DAA9D]/90 dark:text-[#201E1E]">
                  Watch the Demo
                  <Play className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="https://calendly.com/vedant-vrin/15-minute-meeting" target="_blank">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-[#201E1E]/20 dark:border-[#FFFDFD]/20">
                  Book a 15-min Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Video Demo Section */}
          <motion.div
            id="demo"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-4xl mx-auto scroll-mt-24"
          >
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#201E1E]"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full aspect-video"
                src="/videos/Customer Support Demo Compressed.mp4"
                poster="/videos/customer-support-poster.jpg"
                muted={isMuted}
                playsInline
                onEnded={() => setIsPlaying(false)}
              />

              {/* Play Button Overlay (when paused) */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <Play className="w-8 h-8 text-[#083C5E] ml-1" />
                  </div>
                </div>
              )}

              {/* Video Controls */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={restartVideo}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <RotateCcw className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-[#201E1E]/50 dark:text-[#FFFDFD]/50 mt-4">
              See Vrin bring evidence-backed context into every support ticket
            </p>
            <div className="flex justify-center mt-6">
              <Link href="https://calendly.com/vedant-vrin/15-minute-meeting" target="_blank">
                <Button size="lg" className="rounded-full px-8 bg-[#083C5E] hover:bg-[#083C5E]/90 dark:bg-[#8DAA9D] dark:hover:bg-[#8DAA9D]/90 dark:text-[#201E1E]">
                  Schedule a Workflow Review
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-[#201E1E]/5 dark:bg-[#FFFDFD]/5">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#201E1E] dark:text-[#FFFDFD]">
              Support isn&apos;t slow because your team isn&apos;t trying
            </h2>
            <p className="text-lg text-[#201E1E]/60 dark:text-[#FFFDFD]/60 max-w-3xl mx-auto">
              It&apos;s slow because the answer is fragmented—across tickets, docs, Slack, product notes, and the people who &quot;just know.&quot;
              Agents spend time searching, validating, and re-explaining. Meanwhile first responses slip, escalations pile up, and consistency breaks as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#FFFDFD] dark:bg-[#201E1E] text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                      <problem.icon className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#201E1E] dark:text-[#FFFDFD]">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Vrin Works Section */}
      <section className="py-20 bg-[#FFFDFD] dark:bg-[#201E1E]">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#201E1E] dark:text-[#FFFDFD]">
              Vrin brings the right evidence into the ticket—then helps your team act on it
            </h2>
            <p className="text-lg text-[#201E1E]/60 dark:text-[#FFFDFD]/60 max-w-2xl mx-auto">
              From context to resolution, Vrin works inside your existing workflow.
            </p>
          </motion.div>

          <div className="space-y-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#FFFDFD] dark:bg-[#201E1E] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                      <div className="w-full md:w-24 bg-[#083C5E] dark:bg-[#8DAA9D] flex items-center justify-center py-6 md:py-0">
                        <span className="text-3xl font-light text-white dark:text-[#201E1E]">{step.step}</span>
                      </div>
                      <div className="flex-1 p-8">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#083C5E]/10 dark:bg-[#8DAA9D]/20 flex items-center justify-center flex-shrink-0">
                            <step.icon className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium mb-2 text-[#201E1E] dark:text-[#FFFDFD]">
                              {step.title}
                            </h3>
                            <p className="text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Vrin / Differentiation Section */}
      <section className="py-20 bg-[#201E1E]/5 dark:bg-[#FFFDFD]/5">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#201E1E] dark:text-[#FFFDFD]">
              Not just &quot;AI replies.&quot; Cross-system reasoning + evidence + actions.
            </h2>
            <p className="text-lg text-[#201E1E]/60 dark:text-[#FFFDFD]/60 max-w-2xl mx-auto">
              What makes Vrin different from ticketing-native AI and search tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((diff, index) => (
              <motion.div
                key={diff.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#FFFDFD] dark:bg-[#201E1E]">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D] mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1 text-[#201E1E] dark:text-[#FFFDFD]">
                          {diff.title}
                        </h3>
                        <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                          {diff.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes / Metrics Section */}
      <section className="py-20 bg-[#FFFDFD] dark:bg-[#201E1E]">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#201E1E] dark:text-[#FFFDFD]">
              Impact you&apos;ll see in the metrics you already track
            </h2>
            <p className="text-lg text-[#201E1E]/60 dark:text-[#FFFDFD]/60 max-w-2xl mx-auto">
              The workflow friction is removed at the source: context + verification + follow-through.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {outcomes.map((outcome, index) => (
              <motion.div
                key={outcome.metric}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-6 rounded-xl bg-[#083C5E]/5 dark:bg-[#8DAA9D]/10"
              >
                <TrendingUp className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D] mx-auto mb-3" />
                <h3 className="font-medium text-[#201E1E] dark:text-[#FFFDFD] mb-1">
                  {outcome.metric}
                </h3>
                <p className="text-xs text-[#201E1E]/50 dark:text-[#FFFDFD]/50">
                  {outcome.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-[#201E1E]/5 dark:bg-[#FFFDFD]/5">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#201E1E] dark:text-[#FFFDFD]">
              Connect your support portal and the knowledge sources behind it
            </h2>
            <p className="text-lg text-[#201E1E]/60 dark:text-[#FFFDFD]/60 max-w-2xl mx-auto">
              Vrin fits into your existing support workflow and connects to the tools where your team collaborates and documents decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#FFFDFD] dark:bg-[#201E1E]">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4 text-[#201E1E] dark:text-[#FFFDFD] flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                    Support Platforms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {integrations.support.map((tool) => (
                      <Badge key={tool} variant="secondary" className="bg-[#083C5E]/10 dark:bg-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D] border-0">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#FFFDFD] dark:bg-[#201E1E]">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4 text-[#201E1E] dark:text-[#FFFDFD] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                    Knowledge & Collaboration
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {integrations.knowledge.map((tool) => (
                      <Badge key={tool} variant="secondary" className="bg-[#083C5E]/10 dark:bg-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D] border-0">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#FFFDFD] dark:bg-[#201E1E]">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4 text-[#201E1E] dark:text-[#FFFDFD] flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                    Engineering Context
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {integrations.engineering.map((tool) => (
                      <Badge key={tool} variant="secondary" className="bg-[#083C5E]/10 dark:bg-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D] border-0">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#FFFDFD] dark:bg-[#201E1E]">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#201E1E] dark:text-[#FFFDFD]">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#FFFDFD] dark:bg-[#201E1E]">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4"
                    >
                      <h3 className="font-medium text-[#201E1E] dark:text-[#FFFDFD]">
                        {faq.question}
                      </h3>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D] flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#083C5E] to-[#083C5E]/80 dark:from-[#083C5E]/90 dark:to-[#8DAA9D]/20">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">
              See Vrin inside your support workflow
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Watch the demo, then we&apos;ll map Vrin to one of your queues and show exactly where it cuts time and escalations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="#demo">
                <Button size="lg" className="rounded-full px-8 bg-white text-[#083C5E] hover:bg-white/90">
                  Watch Demo
                  <Play className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="https://calendly.com/vedant-vrin/15-minute-meeting" target="_blank">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white/10">
                  Book a 15-min Workflow Review
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/70 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Works with Zendesk, Intercom & more</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Live in days, not months</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Start with one queue</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
