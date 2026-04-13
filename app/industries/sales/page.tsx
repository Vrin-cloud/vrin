"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import {
  TrendingUp,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// FAQ items
const faqs = [
  {
    question: "How is this different from Guru or Highspot?",
    answer:
      "They organize and surface documents. Vrin reasons across them to give you the actual answer. Ask Guru a complex question and you get a list of links. Ask Vrin and you get a synthesized response with citations to the exact passages. It\u2019s the difference between a search engine and a knowledgeable colleague.",
  },
  {
    question: "What should we load first?",
    answer:
      "Whatever your reps ask about most. Usually that\u2019s battle cards, pricing docs, your top case studies, and the objection handling playbook. Most teams are live in 15 minutes. Everything else can sync over time\u2014Vrin auto-indexes new content as it appears.",
  },
  {
    question: "How does it stay current?",
    answer:
      "Vrin auto-syncs from connected sources. Update a battle card in Notion, publish a new case study in Drive, share a competitive insight in Slack\u2014Vrin picks it up automatically. No manual uploads, no stale answers.",
  },
  {
    question: "Will my reps actually use it?",
    answer:
      "It\u2019s faster than pinging a colleague and more reliable than searching Slack. Reps type a question and get the answer in seconds. No training, no new workflow, no behavior change. It works the way they already think.",
  },
  {
    question: "Where does our data live?",
    answer:
      "In your cloud. Vrin supports enterprise deployment where all documents, embeddings, and knowledge graphs stay in your own AWS account. We never store your content on our infrastructure. SOC 2 Type II compliant.",
  },
  {
    question: "Can we try it on our own content first?",
    answer:
      "Yes. We run a guided pilot with your actual sales content so your team can test it on real questions. You see the quality of answers on your own data before any commitment.",
  },
]

export default function SalesPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const isVideoInView = useInView(videoRef, { amount: 0.4 })

  const startVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (!hasStarted) {
      video.currentTime = 0
      setHasStarted(true)
    }
    video.play().catch(() => {})
  }, [hasStarted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isVideoInView) {
      startVideo()
    } else {
      video.pause()
    }
  }, [isVideoInView, startVideo])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current
      if (!video) return
      if (document.hidden) {
        video.pause()
      } else if (isVideoInView) {
        video.play().catch(() => {})
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [isVideoInView])

  // Scroll-linked hero card animation
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const cardRotateX = useTransform(heroScroll, [0, 0.5], [12, 0])
  const cardTranslateY = useTransform(heroScroll, [0, 0.5], [60, 0])
  const cardScale = useTransform(heroScroll, [0, 0.5], [0.95, 1])

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <Header />

      {/* ================================================================ */}
      {/* Hero — centered text + tilting product card                      */}
      {/* ================================================================ */}
      <section
        ref={heroRef}
        className="pt-32 pb-0 bg-[#FFFFFF] dark:bg-[#201E1E] overflow-hidden"
      >
        <div className="container max-w-6xl">
          {/* Centered copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 border-[#083C5E]/20 dark:border-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D]"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              For Sales Teams
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 text-[#201E1E] dark:text-[#FFFFFF]">
              Your sales team doesn&apos;t need another place to search.{" "}
              <span className="text-[#083C5E] dark:text-[#8DAA9D]">
                They need something that thinks and reasons.
              </span>
            </h1>
            <p className="text-base md:text-lg text-[#201E1E]/60 dark:text-[#FFFFFF]/60 font-normal mb-8 max-w-3xl mx-auto">
              Vrin reasons across your entire knowledge base and delivers
              sourced answers in seconds&mdash;on every call, for every deal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="https://cal.com/vedant-vrin/book-a-demo"
                target="_blank"
              >
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-[#083C5E] hover:bg-[#083C5E]/90 dark:bg-[#8DAA9D] dark:hover:bg-[#8DAA9D]/90 dark:text-[#201E1E]"
                >
                  Book a 15-min Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Product mockup card — tilts back, rises on scroll */}
          <div className="max-w-3xl mx-auto" style={{ perspective: "1200px", clipPath: "inset(-50px -100vw 0 -100vw)", maxHeight: "580px" }}>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                rotateX: cardRotateX,
                translateY: cardTranslateY,
                scale: cardScale,
                transformOrigin: "bottom center",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
              }}
            >
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sales-hero-section.svg"
                  alt="Vrin answering a complex sales question — reasoning across battle cards, compliance docs, case studies, and Slack threads to deliver a sourced migration plan in seconds"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Pillar 1: Knowledge Reasoning — video + copy                     */}
      {/* ================================================================ */}
      <section className="py-20 md:py-28 bg-black dark:bg-[#FFFFFF] rounded-[3rem] md:rounded-[4rem]">
        <div className="container max-w-[90rem] px-8 md:px-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left — autoplay video */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative lg:col-span-7"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl w-full">
                <video
                  ref={videoRef}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-auto"
                >
                  <source
                    src="/videos/vrin-sales-page-autoplay.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </motion.div>

            {/* Right — copy */}
            <div className="space-y-8 lg:col-span-5 lg:pl-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-medium tracking-widest uppercase text-[#8DAA9D] dark:text-[#083C5E] mb-6">
                  Knowledge Reasoning
                </p>
                <h2 className="text-3xl md:text-4xl font-light leading-tight mb-6 text-[#FFFFFF] dark:text-[#201E1E]">
                  Every rep answers like your best closer. On every call,
                  from day one.
                </h2>
                <p className="text-[#FFFFFF]/60 dark:text-[#201E1E]/60 leading-relaxed mb-8">
                  Your battle cards, case studies, pricing docs, and competitive
                  intel already have the answer. Vrin connects them into a
                  knowledge graph and reasons across all of it. Any rep
                  can pull the perfect response in seconds, not hours.
                </p>
              </motion.div>

              {[
                {
                  text: "No more \u201Clet me get back to you.\u201D Reps get sourced, multi-document answers live on the call.",
                },
                {
                  text: "New hires sell like veterans. Day-one access to every insight your best closer built over years.",
                },
                {
                  text: "Every answer cites its source. Reps verify the claim in 2 seconds before saying it to a prospect.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-[#8DAA9D] dark:text-[#083C5E] mt-0.5 flex-shrink-0" />
                  <p className="text-[#FFFFFF]/80 dark:text-[#201E1E]/80 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Section B: How Vrin is different — text + strokes image          */}
      {/* ================================================================ */}
      <section className="py-20 md:py-28 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — differentiators */}
            <div className="space-y-10 order-2 lg:order-1 lg:pr-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-medium tracking-widest uppercase text-[#083C5E] dark:text-[#8DAA9D] mb-6">
                  How Vrin Is Different
                </p>
              </motion.div>
              {[
                {
                  headline: "It doesn\u2019t search. It reasons.",
                  body: "Other tools return a list of documents and hope you find the answer. Vrin reads across your battle cards, case studies, compliance docs, and Slack threads\u2014then synthesizes a single, sourced answer.",
                },
                {
                  headline: "Every answer is traceable.",
                  body: "No hallucinations, no guessing. Every claim links back to the exact passage in the exact document. Your reps can trust it. Your prospects can verify it.",
                },
                {
                  headline: "It knows what you know today.",
                  body: "Auto-syncs from your tools. Update a battle card at 9 AM, and the answer changes by 9:01. No manual uploads, no stale knowledge.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <h3 className="text-xl md:text-2xl font-light text-[#201E1E] dark:text-[#FFFFFF] mb-3 leading-snug">
                    {item.headline}
                  </h3>
                  <p className="text-[#201E1E]/60 dark:text-[#FFFFFF]/60 leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right — aesthetic image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-1 lg:order-2"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/5] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/background-images/strokes.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Section C: What changes — universe blur image + outcomes         */}
      {/* ================================================================ */}
      <section className="py-20 md:py-28 bg-black dark:bg-[#FFFFFF] rounded-[3rem] md:rounded-[4rem]">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — aesthetic image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/5] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/background-images/universe blur.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Right — outcomes */}
            <div className="space-y-10 lg:pl-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-medium tracking-widest uppercase text-[#8DAA9D] dark:text-[#083C5E] mb-6">
                  What Changes
                </p>
              </motion.div>
              {[
                {
                  headline: "Deals move at the speed of the conversation.",
                  body: "When a prospect asks a hard question, the answer arrives before the call ends. No follow-up emails. No waiting on Solutions Engineering. The deal keeps moving.",
                },
                {
                  headline: "New reps sell like veterans.",
                  body: "Day-one access to every playbook, every case study, every tribal answer your best rep has built over years. Ramp in days, not months.",
                },
                {
                  headline: "Your knowledge compounds.",
                  body: "Every new battle card, every closed deal insight, every Slack thread\u2014it all gets indexed and reasoned across. Your team gets smarter with every win.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <h3 className="text-xl md:text-2xl font-light text-[#FFFFFF] dark:text-[#201E1E] mb-3 leading-snug">
                    {item.headline}
                  </h3>
                  <p className="text-[#FFFFFF]/60 dark:text-[#201E1E]/60 leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FAQ — accordion                                                  */}
      {/* ================================================================ */}
      <section className="py-20 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#201E1E] dark:text-[#FFFFFF]">
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
                <Card className="border-[#201E1E]/10 dark:border-[#FFFFFF]/10 bg-[#FFFFFF] dark:bg-[#201E1E]">
                  <CardContent className="p-0">
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      className="w-full p-6 text-left flex items-center justify-between gap-4"
                    >
                      <h3 className="font-medium text-[#201E1E] dark:text-[#FFFFFF]">
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
                        <p className="text-[#201E1E]/60 dark:text-[#FFFFFF]/60">
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

      {/* ================================================================ */}
      {/* Final CTA                                                        */}
      {/* ================================================================ */}
      <section className="py-20 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-[#201E1E] dark:text-white">
              Stop asking around. Start closing.
            </h2>
            <p className="text-lg text-[#201E1E]/60 dark:text-white/80 mb-8 max-w-2xl mx-auto">
              Your team&apos;s knowledge, reasoned across and ready to use,
              on every call, in every deal, for every rep.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="https://cal.com/vedant-vrin/book-a-demo"
                target="_blank"
              >
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-[#083C5E] text-white hover:bg-[#083C5E]/90"
                >
                  Book a 15-min Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#201E1E]/50 dark:text-white/70 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Auto-syncs from your tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>15-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Source citations on every answer</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
