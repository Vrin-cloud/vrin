'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const manifesto =
  'The model isn\'t the bottleneck. The context is. ' +
  'Today\'s LLMs can reason, synthesize, analyze brilliantly — but only over what you feed them. ' +
  'Enterprise decisions demand connecting facts across teams, timelines, and formats. ' +
  'Three-plus hops that transformers can\'t reach natively and vector search doesn\'t even attempt. ' +
  'Vrin is the reasoning layer that curates context before the model ever sees it. ' +
  'Structured, cited, time-aware — ready the moment your agent asks.';

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: any;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.2em]">
      {word}
    </motion.span>
  );
}

export function Narrative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const words = manifesto.split(' ');
  const buttonOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);

  return (
    <section ref={containerRef} className="relative bg-vrin-ink">
      <div className="absolute inset-0 grid-faint-dark opacity-50 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative h-[220vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Ornamental line-marker */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <span className="w-8 h-px bg-vrin-sage/40" />
            <span className="eyebrow text-vrin-sage/80">Manifesto</span>
            <span className="w-8 h-px bg-vrin-sage/40" />
          </div>

          {/* Radial glow behind text */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(141, 170, 157, 0.08), transparent 60%)',
            }}
          />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <p className="font-display text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.25] tracking-[-0.01em] text-vrin-cream">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = Math.min((i + 1) / words.length, 1);
                return (
                  <Word
                    key={i}
                    word={word}
                    progress={scrollYProgress}
                    range={[start * 0.7, end * 0.7]}
                  />
                );
              })}
            </p>

            <motion.div style={{ opacity: buttonOpacity }} className="mt-12">
              <Link
                href="/manifesto"
                className="group inline-flex items-center gap-2 text-sm font-medium text-vrin-sage hover:text-vrin-cream transition-colors"
              >
                Read the full manifesto
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          </div>

          {/* Corner metadata */}
          <div className="absolute bottom-8 left-8 text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-cream/30">
            § 001 — on context
          </div>
          <div className="absolute bottom-8 right-8 text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-cream/30">
            scroll to read
          </div>
        </div>
      </div>
    </section>
  );
}
