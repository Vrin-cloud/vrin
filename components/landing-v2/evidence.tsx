'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1] as const;

type Row = {
  name: string;
  value: number;
  isVrin?: boolean;
};

// MuSiQue · Exact Match leaderboard (ordered by score desc)
const rows: Row[] = [
  { name: 'Vrin', value: 47.8, isVrin: true },
  { name: 'StepChain GraphRAG', value: 43.9 },
  { name: 'HopRAG', value: 42.2 },
  { name: 'SiReRAG', value: 40.5 },
  { name: 'HippoRAG 2', value: 37.2 },
];

// Scale: leader fills ~75% of the track, keeps proportional gaps
const MAX_TRACK = 65;

function LeaderboardRow({ row, i, inView }: { row: Row; i: number; inView: boolean }) {
  const width = (row.value / MAX_TRACK) * 100;
  const delay = 0.12 * i;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className="grid grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)_auto] items-center gap-5 py-3.5"
    >
      {/* Label */}
      <p
        className={`text-right text-sm md:text-base tracking-tight ${
          row.isVrin
            ? 'text-vrin-charcoal font-medium'
            : 'text-vrin-charcoal/60 font-normal'
        }`}
      >
        {row.name}
      </p>

      {/* Bar track */}
      <div className="relative h-7 rounded-full bg-vrin-sand/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${width}%` } : {}}
          transition={{ duration: 1.2, delay: delay + 0.25, ease }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            row.isVrin ? 'bg-vrin-blue' : 'bg-vrin-blue/30'
          }`}
        />
      </div>

      {/* Value */}
      <p
        className={`font-mono text-sm md:text-base min-w-[4ch] text-right tabular-nums ${
          row.isVrin ? 'text-vrin-charcoal font-medium' : 'text-vrin-charcoal/55'
        }`}
      >
        {row.value.toFixed(1)}%
      </p>
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
              Public, reproducible evaluations against the strongest systems on the
              leaderboard. Same documents, same questions — and every Vrin answer
              traceable back to source.
            </p>

            {/* Secondary stat — MultiHop-RAG */}
            <div className="mt-10 pt-8 border-t border-vrin-charcoal/10 max-w-sm">
              <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45 mb-2">
                Also on MultiHop-RAG
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl md:text-5xl leading-none text-vrin-charcoal">
                  95.1%
                </span>
                <span className="text-sm text-vrin-charcoal/55">
                  accuracy · tops the leaderboard
                </span>
              </div>
            </div>

            <p className="mt-10 text-xs font-mono tracking-[0.12em] uppercase text-vrin-charcoal/40">
              Reproducibility notes &amp; run configs →{' '}
              <Link
                href="/blog/benchmark-results-multihop-musique"
                className="underline hover:text-vrin-charcoal"
              >
                blog
              </Link>
            </p>
          </div>

          {/* Right — leaderboard */}
          <div ref={ref} className="lg:col-span-7">
            <div className="rounded-3xl border border-vrin-charcoal/10 bg-vrin-paper/80 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 grid-faint opacity-40 pointer-events-none" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-end justify-between mb-10 pb-6 border-b border-vrin-charcoal/10">
                  <div>
                    <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45 mb-2">
                      Leaderboard
                    </p>
                    <h3 className="font-display text-4xl md:text-5xl leading-none text-vrin-charcoal">
                      MuSiQue
                    </h3>
                    <p className="mt-2 font-mono text-sm text-vrin-charcoal/55">
                      metric: Exact Match (EM)
                    </p>
                  </div>
                  <div className="hidden md:flex flex-col items-end text-[11px] font-mono tracking-[0.12em] uppercase text-vrin-charcoal/40">
                    <span>fig. bench · 2026 Q1</span>
                    <span className="mt-1">n = 299 questions</span>
                  </div>
                </div>

                {/* Rows */}
                <div>
                  {rows.map((r, i) => (
                    <LeaderboardRow key={r.name} row={r} i={i} inView={inView} />
                  ))}
                </div>

                {/* Footnote */}
                <div className="mt-8 pt-6 border-t border-vrin-charcoal/10 flex items-center gap-3 text-[11px] font-mono text-vrin-charcoal/40">
                  <span className="w-2.5 h-2.5 rounded-full bg-vrin-blue" />
                  <span className="uppercase tracking-[0.12em]">Vrin</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-vrin-blue/30 ml-4" />
                  <span className="uppercase tracking-[0.12em]">Other systems on the leaderboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
