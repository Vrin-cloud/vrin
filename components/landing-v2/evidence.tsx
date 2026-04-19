'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1] as const;

type Row = {
  label: string;
  vrin: number;
  baseline: number;
  baselineName: string;
  unit?: string;
};

const rows: Row[] = [
  { label: 'MultiHop-RAG · accuracy', vrin: 95.1, baseline: 78.9, baselineName: 'GPT-5.2 · same docs' },
  { label: 'MuSiQue · multi-hop EM', vrin: 47.8, baseline: 37.2, baselineName: 'HippoRAG 2 (SOTA)' },
  { label: 'MuSiQue · multi-hop F1', vrin: 56.3, baseline: 43.9, baselineName: 'HippoRAG 2 (SOTA)' },
];

function Bar({ row, i, inView }: { row: Row; i: number; inView: boolean }) {
  const max = Math.max(row.vrin, row.baseline, 100);
  const vrinPct = (row.vrin / max) * 100;
  const baseDelay = 0.15 * i;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: baseDelay, ease }}
      className="py-6 border-b border-vrin-charcoal/10 last:border-b-0"
    >
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-6 mb-3">
        <div>
          <p className="text-xs font-mono tracking-[0.12em] uppercase text-vrin-charcoal/45">
            {row.label}
          </p>
        </div>
        <div className="flex items-baseline gap-6">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl md:text-4xl leading-none text-vrin-charcoal">
              {row.vrin}
            </span>
            <span className="text-xs font-mono text-vrin-charcoal/50">Vrin</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-lg md:text-xl text-vrin-charcoal/35">
              {row.baseline}
            </span>
            <span className="text-[11px] font-mono text-vrin-charcoal/35">
              {row.baselineName}
            </span>
          </div>
        </div>
      </div>

      {/* Bars */}
      <div className="relative h-6 rounded-full bg-vrin-sand/50 overflow-hidden">
        {/* Baseline */}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${(row.baseline / max) * 100}%` } : {}}
          transition={{ duration: 1.1, delay: baseDelay + 0.25, ease }}
          className="absolute inset-y-0 left-0 bg-vrin-charcoal/15"
        />
        {/* Vrin */}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${vrinPct}%` } : {}}
          transition={{ duration: 1.3, delay: baseDelay + 0.4, ease }}
          className="absolute inset-y-0 left-0 bg-vrin-blue"
        />
        {/* Glow head */}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${vrinPct}%` } : {}}
          transition={{ duration: 1.3, delay: baseDelay + 0.4, ease }}
          className="absolute inset-y-0 left-0 flex justify-end"
        >
          <span className="w-px h-full bg-vrin-sage" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Evidence() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative bg-vrin-cream py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — narrative */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <span className="eyebrow text-vrin-blue">Benchmarks</span>
              <span className="hairline flex-1" />
            </div>

            <h2 className="font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
              Reasoned context
              <br />
              <span className="serif-italic text-vrin-blue">outperforms</span>
              <br />
              retrieved chunks.
            </h2>

            <p className="mt-6 text-base md:text-lg text-vrin-charcoal/65 leading-relaxed max-w-sm">
              Public, reproducible benchmarks against the strongest LLMs and retrieval
              methods available. Same documents, same questions, higher accuracy — and
              every answer traceable to source.
            </p>

            <p className="mt-8 text-xs font-mono tracking-[0.12em] uppercase text-vrin-charcoal/40">
              Reproducibility notes &amp; run configs →{' '}
              <Link href="/blog/benchmark-results-multihop-musique" className="underline hover:text-vrin-charcoal">
                blog
              </Link>
            </p>
          </div>

          {/* Right — chart */}
          <div ref={ref} className="lg:col-span-7">
            <div className="rounded-3xl border border-vrin-charcoal/10 bg-vrin-paper/80 p-8 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 grid-faint opacity-40 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/40">
                    fig. bench · 2026 Q1
                  </span>
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-vrin-charcoal/70">
                      <span className="w-2.5 h-2.5 rounded-full bg-vrin-blue" /> Vrin
                    </span>
                    <span className="flex items-center gap-1.5 text-vrin-charcoal/40">
                      <span className="w-2.5 h-2.5 rounded-full bg-vrin-charcoal/15" /> baseline
                    </span>
                  </div>
                </div>

                <div>
                  {rows.map((r, i) => (
                    <Bar key={r.label} row={r} i={i} inView={inView} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
