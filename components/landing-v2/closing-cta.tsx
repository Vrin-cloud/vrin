'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { ArrowUpRight, Calendar } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

export function ClosingCTA() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative bg-vrin-paper pt-28 md:pt-40 pb-14 md:pb-20 overflow-hidden"
    >
      <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(8, 60, 94, 0.08), transparent 65%)',
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, ease }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <span className="w-10 h-px bg-vrin-charcoal/20" />
            <span className="eyebrow text-vrin-charcoal/50">Ready when your agent is</span>
            <span className="w-10 h-px bg-vrin-charcoal/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.035em] text-vrin-charcoal"
          >
            Build agents that
            <br />
            <span className="serif-italic text-vrin-blue">reason.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.25, ease }}
            className="mt-8 max-w-xl mx-auto text-lg text-vrin-charcoal/65 leading-relaxed"
          >
            Three lines of code. A reasoning layer that stays with you from first query to
            enterprise-scale deployment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
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
          </motion.div>

          {/* Signature marks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6, ease }}
            className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/40"
          >
            <span>• Model agnostic</span>
            <span>• Data sovereign</span>
            <span>• Cited by construction</span>
            <span>• Built in CA</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
