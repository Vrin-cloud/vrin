'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const ease = [0.16, 1, 0.3, 1] as const

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual')
  const proPrice = billingPeriod === 'annual' ? 16 : 19

  const freeFeatures = [
    '10 file uploads / month',
    '100 MB storage',
    '100 queries / month',
    'GPT-5.2 · Claude 4 Haiku · Gemini 3 Flash · Grok 3',
    'Web search integration',
    'Source citations on every answer',
  ]

  const proFeatures = [
    '100 file uploads / month',
    '5 GB storage',
    '1,000 queries / month',
    'All frontier models (GPT-5.2 Turbo, o3, o4-mini, Claude 4 Sonnet & Opus, Gemini 3 Pro & Ultra)',
    'Brainstorm mode · creative reasoning',
    'Expert mode · deep analysis',
    'Thinking panel visibility',
    'Unlimited conversations',
  ]

  return (
    <div className="flex flex-col bg-vrin-paper min-h-screen">
      <Header />

      <section className="relative pt-36 md:pt-44 pb-20 md:pb-28 overflow-hidden vignette-paper">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          {/* Editorial meta row */}
          <div className="flex items-center gap-3 mb-10 max-w-5xl mx-auto">
            <span className="eyebrow text-vrin-blue">Pricing</span>
            <span className="hairline flex-1" />
            <span className="hidden md:inline text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
              individuals · teams come later
            </span>
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.035em] text-vrin-charcoal text-center max-w-5xl mx-auto"
          >
            Start for free.{' '}
            <span className="serif-italic text-vrin-blue">Upgrade</span> when
            you feel the gap.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto text-lg text-vrin-charcoal/65 leading-relaxed text-center"
          >
            Vrin is free to try with a full reasoning engine included. Pro unlocks the
            frontier models, deeper modes, and the context capacity serious work asks
            for.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="mt-12 flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-1 rounded-full border border-vrin-charcoal/15 bg-vrin-cream/60 p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'bg-vrin-charcoal text-vrin-cream'
                    : 'text-vrin-charcoal/65 hover:text-vrin-charcoal'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingPeriod === 'annual'
                    ? 'bg-vrin-charcoal text-vrin-cream'
                    : 'text-vrin-charcoal/65 hover:text-vrin-charcoal'
                }`}
              >
                Annual
                <span
                  className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full ${
                    billingPeriod === 'annual'
                      ? 'bg-vrin-sage/25 text-vrin-sage'
                      : 'bg-vrin-sage/15 text-vrin-sage'
                  }`}
                >
                  −17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="relative bg-vrin-paper pb-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="relative rounded-3xl p-8 md:p-10 flex flex-col bg-vrin-cream/70 border border-vrin-charcoal/10 hover:border-vrin-charcoal/25 transition-all duration-500"
            >
              <div className="mb-6">
                <h2 className="font-display text-3xl leading-none text-vrin-charcoal">
                  Free
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-vrin-charcoal/55">
                  Try Vrin with the full reasoning engine.
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="font-display text-5xl leading-none text-vrin-charcoal">
                  $0
                </span>
                <span className="text-xs font-mono tracking-wider text-vrin-charcoal/40">
                  / month
                </span>
              </div>

              <ul className="space-y-3 mb-10">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-vrin-blue" />
                    <span className="text-vrin-charcoal/75">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/waitlist"
                className="mt-auto group inline-flex items-center justify-between gap-2 rounded-full px-6 py-3.5 text-sm font-medium bg-vrin-charcoal text-vrin-cream hover:bg-vrin-blue transition-all duration-300"
              >
                Join the waitlist
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="relative rounded-3xl p-8 md:p-10 flex flex-col bg-vrin-charcoal text-vrin-cream border border-vrin-charcoal"
            >
              <div className="absolute top-5 right-5 text-[10px] font-mono tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-vrin-sage/20 text-vrin-sage border border-vrin-sage/30">
                Most chosen
              </div>

              <div className="mb-6">
                <h2 className="font-display text-3xl leading-none text-vrin-cream">
                  Pro
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-vrin-cream/60">
                  Frontier models, deeper modes, serious context capacity.
                </p>
              </div>

              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-display text-5xl leading-none text-vrin-cream">
                  ${proPrice}
                </span>
                <span className="text-xs font-mono tracking-wider text-vrin-cream/50">
                  / month
                </span>
              </div>
              <p className="mb-8 text-xs font-mono text-vrin-cream/40">
                {billingPeriod === 'annual' ? 'billed annually' : 'billed monthly'}
              </p>

              <ul className="space-y-3 mb-10">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-vrin-sage" />
                    <span className="text-vrin-cream/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/waitlist"
                className="mt-auto group inline-flex items-center justify-between gap-2 rounded-full px-6 py-3.5 text-sm font-medium bg-vrin-sage text-vrin-ink hover:bg-vrin-cream transition-all duration-300"
              >
                Join the waitlist
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>

              <p className="mt-6 text-xs font-mono text-vrin-cream/40">
                Already subscribed?{' '}
                <Link href="/account/billing" className="text-vrin-sage hover:text-vrin-cream underline">
                  Billing help
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Trust row */}
          <div className="mt-20 max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
            <span>· SOC 2 in progress</span>
            <span>· 256-bit encryption</span>
            <span>· GDPR ready</span>
            <span>· Data never leaves your VPC (enterprise)</span>
          </div>

          {/* Enterprise CTA */}
          <div className="mt-16 max-w-4xl mx-auto rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60 p-8 md:p-10 flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow text-vrin-blue mb-2">Team or enterprise?</p>
              <p className="font-display text-2xl md:text-3xl leading-[1.15] text-vrin-charcoal">
                Dedicated infra, BYOC, SSO, data residency.{' '}
                <span className="serif-italic text-vrin-blue">Talk to us.</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 rounded-full border border-vrin-charcoal/15 px-5 py-3 text-sm font-medium text-vrin-charcoal hover:border-vrin-charcoal/40 hover:bg-vrin-sand/40 transition-all duration-300"
              >
                View team plans
              </Link>
              <a
                href="https://cal.com/vedant-vrin/book-a-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-vrin-charcoal text-vrin-cream px-5 py-3 text-sm font-medium hover:bg-vrin-blue transition-all duration-300"
              >
                Book a demo
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </div>
          </div>

          {/* Questions footer */}
          <div className="mt-16 text-center text-sm text-vrin-charcoal/55">
            Questions about the plans?{' '}
            <a
              href="https://cal.com/vedant-vrin/book-a-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vrin-blue underline hover:text-vrin-charcoal"
            >
              Schedule a call
            </a>{' '}
            or email{' '}
            <a href="mailto:support@vrin.cloud" className="text-vrin-blue underline hover:text-vrin-charcoal">
              support@vrin.cloud
            </a>
            .
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
