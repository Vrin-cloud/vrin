'use client';

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
  // Hub-and-spoke: sources flowing into Vrin core
  const sources = ['Notion', 'Slack', 'Drive', 'SharePoint', 'Jira', 'PDFs'];
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full">
      {/* center node */}
      <defs>
        <radialGradient id="core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8DAA9D" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8DAA9D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="140" r="60" fill="url(#core)" />
      <circle cx="200" cy="140" r="28" fill="#201E1E" />
      <text
        x="200"
        y="145"
        textAnchor="middle"
        fill="#F9F7F2"
        fontSize="10"
        fontFamily="var(--font-geist-mono), monospace"
        letterSpacing="0.1em"
      >
        VRIN
      </text>

      {sources.map((s, i) => {
        const angle = (i / sources.length) * Math.PI * 2 - Math.PI / 2;
        const r = 110;
        const x = 200 + Math.cos(angle) * r;
        const y = 140 + Math.sin(angle) * r;
        return (
          <g key={s}>
            <line
              x1={200}
              y1={140}
              x2={x}
              y2={y}
              stroke="#201E1E"
              strokeOpacity="0.18"
              strokeDasharray="3 4"
            />
            <circle cx={x} cy={y} r="4" fill="#083C5E" />
            <text
              x={x}
              y={y + (y > 140 ? 16 : -8)}
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-geist-mono), monospace"
              fill="#201E1E"
              fillOpacity="0.55"
              letterSpacing="0.06em"
            >
              {s}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StructureDiagram() {
  // Entity graph schematic
  const nodes = [
    { id: 'A', x: 80, y: 80, label: 'Acme Corp' },
    { id: 'B', x: 220, y: 60, label: 'Q4 2025' },
    { id: 'C', x: 320, y: 140, label: '$50M' },
    { id: 'D', x: 200, y: 180, label: 'revenue' },
    { id: 'E', x: 80, y: 200, label: 'Jane Doe' },
    { id: 'F', x: 340, y: 40, label: 'filed' },
  ];
  const edges = [
    ['A', 'B'], ['B', 'D'], ['D', 'C'],
    ['A', 'E'], ['E', 'F'], ['B', 'F'],
  ];
  const map = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg viewBox="0 0 400 280" className="w-full h-full">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={map[a].x}
          y1={map[a].y}
          x2={map[b].x}
          y2={map[b].y}
          stroke="#083C5E"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      ))}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="5" fill="#083C5E" />
          <circle cx={n.x} cy={n.y} r="12" fill="#083C5E" fillOpacity="0.08" />
          <text
            x={n.x + 10}
            y={n.y + 4}
            fontSize="10"
            fontFamily="var(--font-geist-mono), monospace"
            fill="#201E1E"
            fillOpacity="0.7"
            letterSpacing="0.02em"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ReasonDiagram() {
  // Reasoning path through 3 hops
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full">
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
    copy: 'Point Vrin at where your knowledge already lives — Drive, Notion, Slack, SharePoint, PDFs, databases. Your team keeps working. Vrin keeps reading.',
    diagram: <ConnectDiagram />,
  },
  {
    idx: '02',
    kicker: 'Structure',
    title: 'Documents become a living graph.',
    italic: 'not a bucket of chunks.',
    copy: 'Vrin extracts entities, relationships, and timestamped facts — each one cited back to its source. Your knowledge graph grows with every ingest and self-heals across conflicting versions.',
    diagram: <StructureDiagram />,
  },
  {
    idx: '03',
    kicker: 'Reason',
    title: 'Your agent asks. Vrin walks the graph.',
    italic: 'three hops. one answer.',
    copy: 'At query time, Vrin reasons across the graph, gathers the exact facts the question demands, and hands your agent a curated context pack — cited, time-aware, ready to generate.',
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

      {/* Diagram column */}
      <div className="lg:col-span-7">
        <div className="relative aspect-[4/3] rounded-2xl border border-vrin-charcoal/10 bg-vrin-cream/60 backdrop-blur-sm p-6 overflow-hidden">
          <div className="absolute inset-0 grid-faint opacity-50" />
          <div className="absolute inset-0 grain" />
          <div className="absolute top-4 left-4 text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/35">
            fig. {step.idx}
          </div>
          <div className="absolute top-4 right-4 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-vrin-charcoal/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-vrin-charcoal/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-vrin-charcoal/20" />
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {step.diagram}
          </div>
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
