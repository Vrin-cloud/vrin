"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"

const steps = [
  {
    title: "Bring your scattered knowledge into one place.",
    description:
      "Your team's knowledge lives across dozens of tools — Notion, Slack, Google Drive, Confluence, SharePoint, and more. Vrin connects to your existing sources and ingests everything without requiring anyone to change how they work.",
  },
  {
    title: "Turn documents into a living knowledge graph.",
    description:
      "Vrin doesn't just index your files — it reads them. Every document is broken into entities, relationships, and timestamped facts, then woven into a graph that captures how your knowledge actually connects. Not keywords. Structure.",
  },
  {
    title: "Ask complex questions. Get cited answers.",
    description:
      "Ask anything — from simple lookups to questions that span multiple documents, teams, and time periods. Vrin reasons across your knowledge graph, connecting facts no single search result could surface. Every answer traces back to source documents.",
  },
]

/* ─── Step text (left-aligned text, container centered on its half) ─── */

function StepText({
  step,
  index,
}: {
  step: (typeof steps)[0]
  index: number
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      /* ── TEXT SIZE: max-w-md controls block width, text sizes below ── */
      className="max-w-md"
    >
      <h3 className="text-4xl md:text-[2.75rem] font-normal text-[#201E1E] dark:text-[#FFFFFF] leading-tight mb-5">
        {step.title}
      </h3>
      <p className="text-lg md:text-xl text-[#201E1E] dark:text-[#FFFFFF]/80 leading-relaxed font-light">
        {step.description}
      </p>
    </motion.div>
  )
}

/* ─── Carousel slide data ─── */

const carouselSlides = [
  {
    title: "Vrin Chat",
    description: "Ask questions, get cited answers from your knowledge base.",
  },
  {
    title: "Vrin MCP",
    description: "Bring Vrin's reasoning into any LLM chat environment you already use.",
  },
  {
    title: "Developer API",
    description: "Integrate Vrin into your product in minutes with our SDK.",
  },
]

/* ── SLIDE HEIGHT: change this value to resize all slides uniformly ── */
const SLIDE_HEIGHT = "h-[280px]"

function ChatSlide() {
  return (
    <div className={`w-full ${SLIDE_HEIGHT} rounded-xl overflow-hidden flex items-center justify-center bg-white dark:bg-[#2A2828]`}>
      <Image
        src="/vrin-chat-page.png"
        alt="Vrin Chat — ask anything about your knowledge"
        width={800}
        height={400}
        className="w-full h-full object-contain p-2"
      />
    </div>
  )
}

function MCPSlide() {
  return (
    <div className={`w-full ${SLIDE_HEIGHT} rounded-xl overflow-hidden flex items-center justify-center bg-[#2A2828]`}>
      <Image
        src="/vrin-mcp-toggle.png"
        alt="Vrin MCP integration in Claude"
        width={800}
        height={500}
        className="w-full h-full object-contain p-2"
      />
    </div>
  )
}

function APISlide() {
  return (
    <div className={`w-full ${SLIDE_HEIGHT} bg-[#1E293B] rounded-xl p-4 overflow-hidden flex flex-col`}>
      <div className="flex items-center gap-1.5 mb-3 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308]/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
        <span className="ml-2 text-[10px] text-slate-500">vrin-query.py</span>
      </div>
      <pre className="text-[13px] leading-relaxed font-mono flex-1 overflow-hidden">
        <code>
          <span className="text-[#C084FC]">from</span>
          <span className="text-slate-300"> vrin </span>
          <span className="text-[#C084FC]">import</span>
          <span className="text-[#67E8F9]"> VRINClient</span>
          {"\n\n"}
          <span className="text-slate-300">client = </span>
          <span className="text-[#67E8F9]">VRINClient</span>
          <span className="text-slate-300">(</span>
          <span className="text-[#FCA5A5]">api_key</span>
          <span className="text-slate-300">=</span>
          <span className="text-[#86EFAC]">&quot;vrin_...&quot;</span>
          <span className="text-slate-300">)</span>
          {"\n\n"}
          <span className="text-slate-300">result = client.</span>
          <span className="text-[#67E8F9]">query</span>
          <span className="text-slate-300">(</span>
          {"\n"}
          <span className="text-slate-300">{"    "}</span>
          <span className="text-[#86EFAC]">
            &quot;Compare Acme and Widget Corp&quot;
          </span>
          {"\n"}
          <span className="text-slate-300">)</span>
          {"\n\n"}
          <span className="text-[#C084FC]">print</span>
          <span className="text-slate-300">(result[</span>
          <span className="text-[#86EFAC]">&quot;summary&quot;</span>
          <span className="text-slate-300">])</span>
        </code>
      </pre>
    </div>
  )
}

/* ─── Auto-rotating carousel (bottom-left card) ─── */
/*
 * CARD CONTROLS:
 *   - max-w-[580px]  → card width
 *   - SLIDE_HEIGHT   → inner slide height (defined above as constant)
 *   - p-6 md:p-8     → card padding
 *   - rounded-3xl    → card border radius
 */

const ROTATION_INTERVAL = 4000

function UsageModeCarousel() {
  const [active, setActive] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % carouselSlides.length)
  }, [])

  useEffect(() => {
    if (!inView) return
    const id = setInterval(advance, ROTATION_INTERVAL)
    return () => clearInterval(id)
  }, [inView, advance])

  const slideContent = [
    <ChatSlide key="chat" />,
    <MCPSlide key="mcp" />,
    <APISlide key="api" />,
  ]

  const current = carouselSlides[active]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-[580px] relative p-6 md:p-8 rounded-3xl bg-white dark:bg-[#201E1E]/50 border border-[#201E1E]/10 dark:border-[#FFFFFF]/10 shadow-lg"
    >
      {/* Slide content — fixed height so card never resizes */}
      <div className={SLIDE_HEIGHT}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className={`${SLIDE_HEIGHT} flex items-center justify-center`}
          >
            {slideContent[active]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Title + description below the slide */}
      <div className="text-center mt-5">
        <h4 className="text-base font-medium text-[#201E1E] dark:text-[#FFFFFF]">
          {current.title}
        </h4>
        <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60 font-light mt-1">
          {current.description}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-4">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i
                ? "w-8 bg-[#083C5E] dark:bg-[#8DAA9D]"
                : "w-1.5 bg-[#201E1E]/20 dark:bg-[#FFFFFF]/20"
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main section ─── */

export function HowVrinWorks() {
  const [sectionRef] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  })

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E] overflow-hidden"
    >
      {/* Section header */}
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 border-[#083C5E]/20 dark:border-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D]"
          >
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-[#201E1E] dark:text-[#FFFFFF]">
            How Vrin Works
          </h2>
          <p className="text-base text-[#201E1E]/60 dark:text-[#FFFFFF]/60 font-normal max-w-3xl mx-auto">
            Three steps to answers your team can trust.
          </p>
        </div>
      </div>

      {/* ─── Desktop: full-bleed SVG with overlaid content ─── */}
      <div className="hidden md:block">
        <div
          className="relative w-[100vw] ml-[1vw]"
          style={{ aspectRatio: "10500 / 10500" }}
        >
          {/* SVG diagram — left edge bleeds off-screen */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vrin-workflow-diagram.svg"
            alt="Vrin workflow — connect sources, build knowledge graph, reason over data"
            className="absolute inset-0 w-full h-full dark:opacity-90"
          />

          {/*
           * OVERLAY GRID — 3 rows over the SVG
           * Each row is a 50/50 split. Text container is centered
           * within its half via justify-center, text is left-aligned inside.
           */}
          <div className="absolute inset-0 grid grid-rows-3">
            {/* Row 1: text centered on the RIGHT half */}
            <div className="flex items-center">
              <div className="w-1/2" />
              <div className="flex items-center justify-center px-[8%]">
                <StepText step={steps[0]} index={0} />
              </div>
            </div>

            {/* Row 2: text on LEFT, pushed down to align with graph card center */}
            <div className="flex items-end pb-[10%]">
              <div className="flex items-center justify-center px-[5%]">
                <StepText step={steps[1]} index={1} />
              </div>
              <div className="w-1/2" />
            </div>

            {/* Row 3: card centered on LEFT half, text centered on RIGHT half */}
            <div className="flex items-end pb-[5%]">
              <div className="w-1/2 flex items-center justify-start pl-[2%]">
                <UsageModeCarousel />
              </div>
              <div className="flex items-center justify-center px-[8%] pb-[5%]">
                <StepText step={steps[2]} index={2} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile: stacked ─── */}
      <div className="md:hidden container space-y-16">
        <StepText step={steps[0]} index={0} />
        <StepText step={steps[1]} index={1} />
        <div className="space-y-6">
          <StepText step={steps[2]} index={2} />
          <UsageModeCarousel />
        </div>
      </div>
    </section>
  )
}
