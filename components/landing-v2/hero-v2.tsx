'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import Spline from '@splinetool/react-spline';

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroV2() {
  return (
    <section className="relative overflow-hidden vignette-paper">
      {/* Hairline grid overlay */}
      <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
      {/* Grain */}
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10 pt-36 md:pt-44 pb-20 md:pb-28">
        {/* Editorial meta row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/55">
            <span className="w-1.5 h-1.5 rounded-full bg-vrin-sage" />
            Reasoning Layer · v1
          </span>
          <span className="hairline flex-1" />
          <span className="hidden md:inline text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
            vrin.cloud / 2026
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Headline — editorial display type */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.05 }}
              className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight tracking-[-0.01em] text-vrin-charcoal/55 mb-2"
            >
              Give your AI agents
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="font-display text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.95] tracking-[-0.035em] text-vrin-charcoal"
            >
              Context that&apos;s{' '}
              <span className="serif-italic text-vrin-blue">thought&nbsp;through</span>,
              <br />
              not looked&nbsp;up.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.3 }}
              className="mt-8 max-w-xl text-lg md:text-xl text-vrin-charcoal/65 leading-relaxed font-normal"
            >
              Vrin is the retrieval-time reasoning layer for AI agents. It curates
              the exact context an agent needs — reasoned, cited, and source-bound —
              before a single token is generated.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.45 }}
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link
                href="/waitlist"
                className="group inline-flex items-center gap-2 rounded-full bg-vrin-charcoal px-6 py-3.5 text-sm font-medium text-vrin-cream transition-all duration-300 hover:bg-vrin-blue hover:-translate-y-0.5"
              >
                Join the waitlist
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>

              <a
                href="https://cal.com/vedant-vrin/book-a-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-vrin-charcoal/15 px-6 py-3.5 text-sm font-medium text-vrin-charcoal transition-all duration-300 hover:border-vrin-charcoal/40 hover:bg-vrin-sand/50"
              >
                <Calendar className="h-4 w-4" />
                Book a 20-min demo
              </a>
            </motion.div>

            {/* Works-with row — tucked under as provenance, not hero feature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.7 }}
              className="mt-14 flex items-center gap-5"
            >
              <span className="eyebrow text-vrin-charcoal/45 whitespace-nowrap">
                Model-agnostic
              </span>
              <span className="hairline flex-1 max-w-24" />
              <div className="flex items-center gap-6 opacity-55">
                {[
                  { name: 'OpenAI', file: 'openai.svg' },
                  { name: 'Anthropic', file: 'anthropic.svg' },
                  { name: 'Google', file: 'google.svg' },
                  { name: 'xAI', file: 'xai.svg' },
                  { name: 'Mistral', file: 'mistral.svg' },
                ].map((p) => (
                  <img
                    key={p.name}
                    src={`/llm-providers/${p.file}`}
                    alt={p.name}
                    className="h-5 w-auto object-contain grayscale"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right rail — Spline ornament with editorial caption */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.4 }}
            className="hidden lg:flex lg:col-span-5 relative h-[520px] items-center justify-center"
          >
            {/* Orb container */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <Spline scene="https://prod.spline.design/13Kb3u5Y1XKm3Mrz/scene.splinecode" />
              </div>

              {/* Ornamental tick-marked ring */}
              <svg
                className="absolute inset-0 m-auto w-[460px] h-[460px] pointer-events-none animate-slow-spin"
                viewBox="0 0 460 460"
                fill="none"
              >
                <circle
                  cx="230"
                  cy="230"
                  r="225"
                  stroke="#201E1E"
                  strokeOpacity="0.12"
                  strokeDasharray="2 8"
                />
              </svg>

              {/* Caption markers */}
              <div className="absolute top-4 left-2 text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/40">
                ⊹ reasoning
              </div>
              <div className="absolute bottom-6 right-2 text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/40">
                sources · facts · time
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom hairline sweep */}
      <div className="relative z-10 container">
        <div className="hairline" />
      </div>
    </section>
  );
}
