'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowUpRight, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

const faqs = [
  {
    question: 'How is this different from Guru or Highspot?',
    answer:
      'They organize and surface documents. Vrin reasons across them to give you the actual answer. Ask Guru a complex question and you get a list of links. Ask Vrin and you get a synthesized response with citations to the exact passages. It’s the difference between a search engine and a knowledgeable colleague.',
  },
  {
    question: 'What should we load first?',
    answer:
      'Whatever your reps ask about most. Usually that’s battle cards, pricing docs, your top case studies, and the objection handling playbook. Most teams are live in 15 minutes. Everything else can sync over time. Vrin auto-indexes new content as it appears.',
  },
  {
    question: 'How does it stay current?',
    answer:
      'Vrin auto-syncs from connected sources. Update a battle card in Notion, publish a new case study in Drive, share a competitive insight in Slack. Vrin picks it up automatically. No manual uploads, no stale answers.',
  },
  {
    question: 'Will my reps actually use it?',
    answer:
      'It’s faster than pinging a colleague and more reliable than searching Slack. Reps type a question and get the answer in seconds. No training, no new workflow, no behavior change. It works the way they already think.',
  },
  {
    question: 'Where does our data live?',
    answer:
      'In your cloud. Vrin supports enterprise deployment where all documents, embeddings, and knowledge graphs stay in your own AWS account. We never store your content on our infrastructure. SOC 2 Type II in progress.',
  },
  {
    question: 'Can we try it on our own content first?',
    answer:
      'Yes. We run a guided pilot with your actual sales content so your team can test it on real questions. You see the quality of answers on your own data before any commitment.',
  },
]

const reasoningBullets = [
  {
    text: 'No more “let me get back to you.” Reps get sourced, multi-document answers live on the call.',
  },
  {
    text: 'New hires sell like veterans. Day-one access to every insight your best closer built over years.',
  },
  {
    text: 'Every answer cites its source. Reps verify the claim in two seconds before saying it to a prospect.',
  },
]

const differentiators = [
  {
    headline: 'It doesn’t search. It reasons.',
    body: 'Other tools return a list of documents and hope you find the answer. Vrin reads across your battle cards, case studies, compliance docs, and Slack threads, then synthesizes a single sourced answer.',
  },
  {
    headline: 'Every answer is traceable.',
    body: 'No hallucinations, no guessing. Every claim links back to the exact passage in the exact document. Your reps can trust it. Your prospects can verify it.',
  },
  {
    headline: 'It knows what you know today.',
    body: 'Auto-syncs from your tools. Update a battle card at 9 AM, and the answer changes by 9:01. No manual uploads, no stale knowledge.',
  },
]

const outcomes = [
  {
    headline: 'Deals move at the speed of the conversation.',
    body: 'When a prospect asks a hard question, the answer arrives before the call ends. No follow-up emails. No waiting on Solutions Engineering. The deal keeps moving.',
  },
  {
    headline: 'New reps sell like veterans.',
    body: 'Day-one access to every playbook, every case study, every tribal answer your best rep has built over years. Ramp in days, not months.',
  },
  {
    headline: 'Your knowledge compounds.',
    body: 'Every new battle card, every closed deal insight, every Slack thread gets indexed and reasoned across. Your team gets smarter with every win.',
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

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const cardRotateX = useTransform(heroScroll, [0, 0.5], [10, 0])
  const cardTranslateY = useTransform(heroScroll, [0, 0.5], [40, 0])
  const cardScale = useTransform(heroScroll, [0, 0.5], [0.96, 1])

  return (
    <div className="flex flex-col bg-vrin-paper">
      <Header />

      {/* Hero — centered text + tilting mockup that hides behind the next section */}
      <section
        ref={heroRef}
        className="relative pt-36 md:pt-44 pb-0 overflow-hidden vignette-paper"
      >
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="w-10 h-px bg-vrin-charcoal/20" />
              <span className="eyebrow text-vrin-blue">For sales teams</span>
              <span className="w-10 h-px bg-vrin-charcoal/20" />
            </div>

            <h1 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.035em] text-vrin-charcoal">
              Your reps don&apos;t need another place to search.{' '}
              <span className="serif-italic text-vrin-blue">
                They need something that thinks.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-vrin-charcoal/65 leading-relaxed">
              Vrin reasons across your entire knowledge base and delivers sourced
              answers in seconds, on every call, for every deal.
            </p>

            <div className="mt-10 flex justify-center">
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
          </motion.div>

          {/* Product mockup — centered, tilts back, partially hides behind next section */}
          <div
            className="mt-14 max-w-3xl mx-auto"
            style={{
              perspective: '1200px',
              clipPath: 'inset(-50px -100vw 0 -100vw)',
              maxHeight: '580px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease }}
              style={{
                rotateX: cardRotateX,
                translateY: cardTranslateY,
                scale: cardScale,
                transformOrigin: 'bottom center',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
              }}
              className="rounded-3xl overflow-hidden border border-vrin-charcoal/10"
            >
              <Image
                src="/sales-hero-section.svg"
                alt="Vrin reasoning across battle cards, case studies, compliance docs, and Slack threads to deliver a sourced migration plan in seconds"
                width={1200}
                height={720}
                className="w-full h-auto"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillar 1 — Knowledge Reasoning (dark) */}
      <section className="relative bg-vrin-ink py-28 md:py-36 overflow-hidden rounded-[3rem] md:rounded-[4rem]">
        <div className="absolute inset-0 grid-faint-dark opacity-50 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="relative lg:col-span-7"
            >
              <div className="rounded-3xl overflow-hidden border border-vrin-cream/10">
                <video
                  ref={videoRef}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-auto"
                >
                  <source
                    src="https://viwzlcmoipoagqzf.public.blob.vercel-storage.com/vrin-sales-page-autoplay-KP3OuZ9vN3Emt5mehiZ5NFfCMhd3zv.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </motion.div>

            <div className="space-y-8 lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <span className="eyebrow text-vrin-sage">Knowledge reasoning</span>
                  <span className="hairline flex-1 opacity-40" />
                </div>
                <h2 className="font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.05] tracking-[-0.025em] text-vrin-cream mb-6">
                  Every rep answers like your best closer.{' '}
                  <span className="serif-italic text-vrin-sage">
                    Day one.
                  </span>
                </h2>
                <p className="text-vrin-cream/60 leading-relaxed mb-8">
                  Your battle cards, case studies, pricing docs, and competitive
                  intel already have the answer. Vrin connects them into a
                  knowledge graph and reasons across all of it. Any rep can pull
                  the perfect response in seconds, not hours.
                </p>
              </motion.div>

              {reasoningBullets.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-vrin-sage mt-0.5 flex-shrink-0" />
                  <p className="text-vrin-cream/80 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-12 order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="eyebrow text-vrin-blue">How Vrin is different</span>
                <span className="hairline flex-1" />
              </div>
              {differentiators.map((item, i) => (
                <motion.div
                  key={item.headline}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease }}
                >
                  <h3 className="font-display text-2xl md:text-3xl leading-[1.15] tracking-[-0.02em] text-vrin-charcoal mb-3">
                    {item.headline}
                  </h3>
                  <p className="text-vrin-charcoal/65 leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="relative order-1 lg:order-2"
            >
              <div className="rounded-3xl overflow-hidden aspect-[4/5] w-full border border-vrin-charcoal/10">
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

      {/* Outcomes (dark) */}
      <section className="relative bg-vrin-ink py-28 md:py-36 overflow-hidden rounded-[3rem] md:rounded-[4rem]">
        <div className="absolute inset-0 grid-faint-dark opacity-50 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden aspect-[4/5] w-full border border-vrin-cream/10">
                <img
                  src="/background-images/universe blur.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <div className="space-y-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="eyebrow text-vrin-sage">What changes</span>
                <span className="hairline flex-1 opacity-40" />
              </div>
              {outcomes.map((item, i) => (
                <motion.div
                  key={item.headline}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease }}
                >
                  <h3 className="font-display text-2xl md:text-3xl leading-[1.15] tracking-[-0.02em] text-vrin-cream mb-3">
                    {item.headline}
                  </h3>
                  <p className="text-vrin-cream/60 leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
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
            <span className="eyebrow text-vrin-charcoal/50">Close the deal</span>
            <span className="w-10 h-px bg-vrin-charcoal/20" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] text-vrin-charcoal">
            Stop asking around.
            <br />
            <span className="serif-italic text-vrin-blue">Start closing.</span>
          </h2>

          <p className="mt-8 max-w-xl mx-auto text-lg text-vrin-charcoal/65 leading-relaxed">
            Your team&apos;s knowledge, reasoned across and ready to use on every
            call, in every deal, for every rep.
          </p>

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

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
            <span>· Auto-syncs from your tools</span>
            <span>· 15-minute setup</span>
            <span>· Source citations on every answer</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
