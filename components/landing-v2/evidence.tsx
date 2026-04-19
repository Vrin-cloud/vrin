'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1] as const;
const ROTATION_MS = 5000;

type Row = {
  name: string;
  value: number;
  isVrin?: boolean;
};

type Leaderboard = {
  id: string;
  title: string;
  metric: string;
  note?: string;
  rows: Row[];
  /** Max value that maps to 100% of the bar track. */
  maxTrack: number;
};

const multihop: Leaderboard = {
  id: 'multihop',
  title: 'MultiHop-RAG',
  metric: 'metric: Semantic Accuracy (SA)',
  note: 'fig. bench · 2026 Q1',
  rows: [
    { name: 'Vrin (HybridRAG)', value: 95.1, isVrin: true },
    { name: 'ChatGPT 5.2 (Thinking) [Oracle Context]', value: 78.9 },
    { name: 'Multi-Meta RAG (GPT-4)', value: 63.0 },
    { name: 'Multi-Meta RAG (Google PaLM)', value: 61.0 },
    { name: 'GPT-4 Baseline', value: 56.0 },
  ],
  maxTrack: 100,
};

const musique: Leaderboard = {
  id: 'musique',
  title: 'MuSiQue',
  metric: 'metric: Exact Match (EM)',
  note: 'n = 299 questions',
  rows: [
    { name: 'Vrin', value: 47.8, isVrin: true },
    { name: 'StepChain GraphRAG', value: 43.9 },
    { name: 'HopRAG', value: 42.2 },
    { name: 'SiReRAG', value: 40.5 },
    { name: 'HippoRAG 2', value: 37.2 },
  ],
  maxTrack: 65,
};

const leaderboards: Leaderboard[] = [multihop, musique];

function LeaderboardRow({
  row,
  i,
  maxTrack,
}: {
  row: Row;
  i: number;
  maxTrack: number;
}) {
  const width = Math.min(100, (row.value / maxTrack) * 100);
  const delay = 0.07 * i;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease }}
      className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_auto] items-center gap-4 py-3"
    >
      {/* Label */}
      <p
        className={`text-right text-xs md:text-sm tracking-tight truncate ${
          row.isVrin
            ? 'text-vrin-charcoal font-medium'
            : 'text-vrin-charcoal/60 font-normal'
        }`}
      >
        {row.name}
      </p>

      {/* Bar track */}
      <div className="relative h-6 rounded-full bg-vrin-sand/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.1, delay: delay + 0.18, ease }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            row.isVrin ? 'bg-vrin-blue' : 'bg-vrin-blue/30'
          }`}
        />
      </div>

      {/* Value */}
      <p
        className={`font-mono text-xs md:text-sm min-w-[4ch] text-right tabular-nums ${
          row.isVrin ? 'text-vrin-charcoal font-medium' : 'text-vrin-charcoal/55'
        }`}
      >
        {row.value.toFixed(1)}%
      </p>
    </motion.div>
  );
}

export function Evidence() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [cardRef, cardInView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (!cardInView) return;
    const t = setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % leaderboards.length);
    }, ROTATION_MS);
    return () => clearTimeout(t);
  }, [activeIdx, cardInView]);

  const board = leaderboards[activeIdx];

  return (
    <section className="relative bg-vrin-cream py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
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

          {/* Right — leaderboard card */}
          <div ref={cardRef} className="lg:col-span-7">
            <div className="relative rounded-3xl border border-vrin-charcoal/10 bg-vrin-paper/80 p-8 md:p-10 overflow-hidden">
              <div className="absolute inset-0 grid-faint opacity-40 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={board.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease }}
                  className="relative z-10"
                >
                  {/* Header */}
                  <div className="flex items-end justify-between mb-8 pb-5 border-b border-vrin-charcoal/10 flex-wrap gap-3">
                    <div>
                      <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45 mb-2">
                        Leaderboard
                      </p>
                      <h3 className="font-display text-3xl md:text-4xl leading-none text-vrin-charcoal">
                        {board.title}
                      </h3>
                      <p className="mt-2 font-mono text-xs md:text-sm text-vrin-charcoal/55">
                        {board.metric}
                      </p>
                    </div>
                    {board.note && (
                      <div className="hidden md:flex flex-col items-end text-[10px] font-mono tracking-[0.12em] uppercase text-vrin-charcoal/40">
                        <span>{board.note}</span>
                      </div>
                    )}
                  </div>

                  {/* Rows */}
                  <div>
                    {board.rows.map((r, i) => (
                      <LeaderboardRow
                        key={`${board.id}-${r.name}`}
                        row={r}
                        i={i}
                        maxTrack={board.maxTrack}
                      />
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-5 border-t border-vrin-charcoal/10 flex items-center gap-4 text-[10px] font-mono text-vrin-charcoal/50">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-vrin-blue" />
                      <span className="uppercase tracking-[0.12em]">Vrin</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-vrin-blue/30" />
                      <span className="uppercase tracking-[0.12em]">
                        Leaderboard competitors
                      </span>
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Page dots */}
              <div className="relative z-10 mt-8 flex justify-center gap-2">
                {leaderboards.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Show ${b.title} leaderboard`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIdx
                        ? 'w-8 bg-vrin-blue'
                        : 'w-1.5 bg-vrin-charcoal/20 hover:bg-vrin-charcoal/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
