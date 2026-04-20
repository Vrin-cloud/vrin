'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1] as const;

type Step = {
  idx: string;
  kicker: string;
  title: string;
  italic: string;
  copy: string;
  diagram: React.ReactNode;
};

function ConnectDiagram() {
  return (
    <Image
      src="/Vrin KG.png"
      alt="Vrin knowledge graph: every enterprise source connected into one reasoning core"
      width={1600}
      height={900}
      sizes="(min-width: 1024px) 60vw, 100vw"
      className="w-full h-auto"
      priority
    />
  );
}

function StructureDiagram() {
  return (
    <video
      src="https://viwzlcmoipoagqzf.public.blob.vercel-storage.com/vrin-sales-page-autoplay-KP3OuZ9vN3Emt5mehiZ5NFfCMhd3zv.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label="Vrin turning documents into a living knowledge graph"
      className="w-full h-auto rounded-3xl"
    />
  );
}

function ReasonDiagram() {
  // Reasoning path through 3 hops
  return (
    <svg viewBox="0 0 400 280" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8DAA9D" />
        </marker>
      </defs>

      {/* Question */}
      <rect x="20" y="30" width="120" height="32" rx="16" fill="none" stroke="#201E1E" strokeOpacity="0.2" strokeDasharray="3 4" />
      <text x="80" y="50" textAnchor="middle" fontSize="11" fill="#201E1E" fillOpacity="0.75" fontFamily="var(--font-instrument-serif), serif" fontStyle="italic">
        your question
      </text>

      {/* Hops */}
      {[
        { x: 80, y: 120, label: 'fact 1' },
        { x: 200, y: 160, label: 'fact 2' },
        { x: 320, y: 120, label: 'fact 3' },
      ].map((h, i) => (
        <g key={i}>
          <circle cx={h.x} cy={h.y} r="22" fill="#F9F7F2" stroke="#083C5E" strokeOpacity="0.5" />
          <text x={h.x} y={h.y - 2} textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono), monospace" fill="#083C5E" letterSpacing="0.1em">
            {String(i + 1).padStart(2, '0')}
          </text>
          <text x={h.x} y={h.y + 10} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill="#201E1E" fillOpacity="0.55">
            {h.label}
          </text>
        </g>
      ))}

      {/* connecting curves */}
      <path d="M 80 62 Q 80 90, 80 98" stroke="#8DAA9D" strokeWidth="1.2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 102 120 Q 150 140, 178 160" stroke="#8DAA9D" strokeWidth="1.2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 222 160 Q 270 140, 298 120" stroke="#8DAA9D" strokeWidth="1.2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 320 98 Q 320 80, 320 70" stroke="#8DAA9D" strokeWidth="1.2" fill="none" markerEnd="url(#arrow)" />

      {/* Answer */}
      <rect x="260" y="30" width="120" height="32" rx="16" fill="#201E1E" />
      <text x="320" y="50" textAnchor="middle" fontSize="11" fill="#F9F7F2" fontFamily="var(--font-instrument-serif), serif" fontStyle="italic">
        cited answer
      </text>

      {/* bottom source trace */}
      <text x="200" y="230" textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono), monospace" fill="#201E1E" fillOpacity="0.4" letterSpacing="0.12em">
        → 3 HOPS · 4 SOURCES · 1.8s
      </text>
    </svg>
  );
}

const steps: Step[] = [
  {
    idx: '01',
    kicker: 'Connect',
    title: 'Every source, one surface.',
    italic: 'without the migration tax.',
    copy: 'Point Vrin at where your knowledge already lives: Drive, Notion, Slack, SharePoint, PDFs, databases. Your team keeps working. Vrin keeps reading.',
    diagram: <ConnectDiagram />,
  },
  {
    idx: '02',
    kicker: 'Structure',
    title: 'Documents become a living graph.',
    italic: 'not a bucket of chunks.',
    copy: 'Vrin extracts entities, relationships, and timestamped facts, each one cited back to its source. Your knowledge graph grows with every ingest and self-heals across conflicting versions.',
    diagram: <StructureDiagram />,
  },
  {
    idx: '03',
    kicker: 'Reason',
    title: 'Your agent asks. Vrin walks the graph.',
    italic: 'three hops. one answer.',
    copy: 'At query time, Vrin reasons across the graph, gathers the exact facts the question demands, and hands your agent a curated context pack: cited, time-aware, ready to generate.',
    diagram: <ReasonDiagram />,
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const reverse = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease }}
      className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
        reverse ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      {/* Text column */}
      <div className="lg:col-span-5">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-mono text-sm tracking-widest text-vrin-charcoal/40">
            {step.idx}
          </span>
          <span className="eyebrow text-vrin-blue">{step.kicker}</span>
        </div>

        <h3 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.025em] text-vrin-charcoal">
          {step.title}
          <br />
          <span className="serif-italic text-vrin-charcoal/55">{step.italic}</span>
        </h3>

        <p className="mt-6 max-w-md text-base md:text-lg text-vrin-charcoal/65 leading-relaxed">
          {step.copy}
        </p>
      </div>

      {/* Diagram column: media renders raw on the paper background */}
      <div className="lg:col-span-7">
        <div className="relative w-full">
          <span className="absolute -top-6 left-0 text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/35">
            fig. {step.idx}
          </span>
          {step.diagram}
        </div>
      </div>
    </motion.div>
  );
}

export function HowItThinks() {
  return (
    <section id="how-it-works" className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-4xl mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="eyebrow text-vrin-blue">How Vrin thinks</span>
            <span className="hairline flex-1" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.03em] text-vrin-charcoal">
            Three moves between a question
            <br />
            and a <span className="serif-italic text-vrin-blue">trustworthy</span> answer.
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-28 md:space-y-36">
          {steps.map((s, i) => (
            <StepCard key={s.idx} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
