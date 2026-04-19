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
  const delay = 0.08 * i;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease }}
      className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,2.4fr)_auto] items-center gap-5 py-3.5"
    >
      {/* Label */}
      <p
        className={`text-right text-sm md:text-base tracking-tight truncate ${
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
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.1, delay: delay + 0.2, ease }}
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
  const [activeIdx, setActiveIdx] = useState(0);
  const [cardRef, cardInView] = useInView({ threshold: 0.2 });

  // Auto-rotate only while card is in view; resets on manual tab click
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
        {/* Header block */}
        <div className="max-w-4xl mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="eyebrow text-vrin-blue">Benchmarks</span>
            <span className="hairline flex-1" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
            Reasoned context
            <br />
            <span className="serif-italic text-vrin-blue">outperforms</span> retrieved chunks.
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed">
            Public, reproducible evaluations against the strongest systems on the
            leaderboard. Same documents, same questions — every Vrin answer traceable
            back to source.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5">
          {leaderboards.map((b, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={b.id}
                onClick={() => setActiveIdx(i)}
                className={`group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'bg-vrin-charcoal text-vrin-cream'
                    : 'border border-vrin-charcoal/15 text-vrin-charcoal/65 hover:border-vrin-charcoal/35 hover:text-vrin-charcoal'
                }`}
              >
                <span className="relative z-10">{b.title}</span>
                {/* Progress fill on active tab */}
                {isActive && cardInView && (
                  <motion.span
                    key={`progress-${activeIdx}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: ROTATION_MS / 1000, ease: 'linear' }}
                    style={{ transformOrigin: 'left' }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-vrin-sage/70"
                  />
                )}
              </button>
            );
          })}
          <span className="ml-auto hidden md:block text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/40">
            auto-rotates · tap to pin
          </span>
        </div>

        {/* Single leaderboard card */}
        <div
          ref={cardRef}
          className="relative rounded-3xl border border-vrin-charcoal/10 bg-vrin-paper/80 p-8 md:p-12 overflow-hidden"
        >
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
              <div className="flex items-end justify-between mb-10 pb-6 border-b border-vrin-charcoal/10 flex-wrap gap-3">
                <div>
                  <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45 mb-2">
                    Leaderboard
                  </p>
                  <h3 className="font-display text-4xl md:text-5xl leading-none text-vrin-charcoal">
                    {board.title}
                  </h3>
                  <p className="mt-2 font-mono text-sm text-vrin-charcoal/55">
                    {board.metric}
                  </p>
                </div>
                {board.note && (
                  <div className="hidden md:flex flex-col items-end text-[11px] font-mono tracking-[0.12em] uppercase text-vrin-charcoal/40">
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Legend + reproducibility */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-vrin-charcoal/10">
          <div className="flex items-center gap-3 text-[11px] font-mono text-vrin-charcoal/50">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-vrin-blue" />
              <span className="uppercase tracking-[0.12em]">Vrin</span>
            </span>
            <span className="flex items-center gap-2 ml-4">
              <span className="w-2.5 h-2.5 rounded-full bg-vrin-blue/30" />
              <span className="uppercase tracking-[0.12em]">
                Other systems on the leaderboard
              </span>
            </span>
          </div>

          <Link
            href="/blog/benchmark-results-multihop-musique"
            className="text-[11px] font-mono tracking-[0.12em] uppercase text-vrin-charcoal/50 hover:text-vrin-charcoal transition-colors"
          >
            Reproducibility notes &amp; run configs →
          </Link>
        </div>
      </div>
    </section>
  );
}
