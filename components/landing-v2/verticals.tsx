'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { ArrowUpRight, Scale, LineChart, Stethoscope, Headphones, Landmark } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const verticals = [
  {
    icon: Scale,
    kicker: 'Legal AI',
    title: 'Every clause, every precedent — traced.',
    blurb:
      'Your agents cite the exact clause, version, and jurisdiction. Audit-grade by construction, not by hope.',
  },
  {
    icon: LineChart,
    kicker: 'Financial AI',
    title: 'Numbers you can defend.',
    blurb:
      'Reasoning across filings, earnings, and market data with temporal versioning. Know what was true on any given day.',
  },
  {
    icon: Stethoscope,
    kicker: 'Healthcare AI',
    title: 'Evidence-bound clinical context.',
    blurb:
      'Connect clinical notes, literature, and guidelines with fact-level provenance. Every recommendation traces to evidence.',
  },
  {
    icon: Headphones,
    kicker: 'Customer Support',
    title: 'Resolution on the first response.',
    blurb:
      'Your agent walks the graph of tickets, docs, and changelogs — arrives at the right policy before anyone has to escalate.',
  },
  {
    icon: Landmark,
    kicker: 'Enterprise Intelligence',
    title: 'Ask across every department.',
    blurb:
      'Cross-team questions that used to require a human analyst. Now answered with the full org context, in seconds.',
  },
];

export function Verticals() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="relative bg-vrin-ink py-28 md:py-36 overflow-hidden rounded-[3rem] md:rounded-[4rem]">
      <div className="absolute inset-0 grid-faint-dark opacity-60 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(141, 170, 157, 0.1), transparent 60%)',
        }}
      />

      <div ref={ref} className="container relative z-10">
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="eyebrow text-vrin-sage">For agent builders</span>
            <span className="hairline flex-1 opacity-40" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.03em] text-vrin-cream">
            The <span className="serif-italic text-vrin-sage">reasoning</span> layer
            <br />
            inside every vertical agent.
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-vrin-cream/60 leading-relaxed">
            One integration. Your customers get data sovereignty. You get a reasoning
            layer that keeps improving with every query.
          </p>
        </div>

        {/* Grid — large first card, 2x2 rest */}
        <div className="grid md:grid-cols-6 gap-4">
          {/* Feature card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="md:col-span-6 lg:col-span-3 md:row-span-2 group relative rounded-3xl border border-vrin-cream/10 bg-vrin-charcoal/40 p-10 overflow-hidden hover:border-vrin-sage/40 transition-all duration-500"
          >
            <div className="absolute inset-0 grain pointer-events-none" />
            {/* Background ornament */}
            <svg className="absolute -right-20 -bottom-20 w-96 h-96 opacity-20" viewBox="0 0 200 200">
              {Array.from({ length: 6 }).map((_, i) => (
                <circle
                  key={i}
                  cx="100"
                  cy="100"
                  r={20 + i * 14}
                  fill="none"
                  stroke="#8DAA9D"
                  strokeOpacity={0.1 + i * 0.04}
                  strokeDasharray={`${2 + i} ${8 - i}`}
                />
              ))}
            </svg>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-vrin-sage/15 border border-vrin-sage/20 flex items-center justify-center">
                  {(() => {
                    const Icon = verticals[0].icon;
                    return <Icon className="w-5 h-5 text-vrin-sage" />;
                  })()}
                </div>
                <span className="eyebrow text-vrin-sage">{verticals[0].kicker}</span>
              </div>

              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.025em] text-vrin-cream mb-6">
                {verticals[0].title}
              </h3>

              <p className="text-base text-vrin-cream/65 leading-relaxed max-w-md">
                {verticals[0].blurb}
              </p>

              <div className="mt-auto pt-10 flex items-center gap-2 text-sm text-vrin-sage font-medium">
                <span className="serif-italic">audit-grade by construction</span>
              </div>
            </div>
          </motion.div>

          {/* Small cards */}
          {verticals.slice(1).map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.kicker}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease }}
                className="md:col-span-3 lg:col-span-3 group relative rounded-3xl border border-vrin-cream/10 bg-vrin-charcoal/25 p-8 overflow-hidden hover:border-vrin-sage/30 hover:bg-vrin-charcoal/45 transition-all duration-500"
              >
                <div className="absolute inset-0 grain pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-vrin-sage/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-vrin-sage" />
                    </div>
                    <span className="eyebrow text-vrin-sage/80">{v.kicker}</span>
                  </div>

                  <h3 className="font-display text-2xl leading-[1.1] tracking-[-0.02em] text-vrin-cream mb-3">
                    {v.title}
                  </h3>

                  <p className="text-sm text-vrin-cream/55 leading-relaxed">
                    {v.blurb}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="mt-14 flex flex-wrap items-center justify-between gap-6 p-6 md:p-8 rounded-3xl border border-vrin-cream/10 bg-vrin-cream/[0.02]"
        >
          <div className="max-w-xl">
            <p className="font-display text-xl md:text-2xl text-vrin-cream leading-tight">
              Building a vertical agent?
              <span className="serif-italic text-vrin-sage"> Let&apos;s plug in Vrin.</span>
            </p>
            <p className="mt-1 text-sm text-vrin-cream/55">
              OEM licensing · BYOC deployment · revenue-share available.
            </p>
          </div>
          <Link
            href="/for-agents"
            className="group inline-flex items-center gap-2 rounded-full bg-vrin-sage px-6 py-3 text-sm font-medium text-vrin-ink hover:bg-vrin-cream transition-all duration-300"
          >
            Partner programme
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
