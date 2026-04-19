'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1] as const;

const outcomes = [
  { value: '95.1%', unit: 'accuracy', label: 'MultiHop-RAG benchmark', detail: '+16.2pp over GPT-5.2 baseline' },
  { value: '71.4%', unit: 'vs 11.1%', label: 'FinQA financial reasoning', detail: '640% over vector-only retrieval' },
  { value: '+28%', unit: 'accuracy', label: 'MuSiQue multi-hop', detail: 'Ahead of HippoRAG 2 (academic SOTA)' },
  { value: '10×', unit: 'faster', label: 'Research-time collapse', detail: 'From weeks of reading to minutes' },
];

export function OutcomesV2() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.25 });

  return (
    <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-14 max-w-5xl mx-auto">
          <span className="eyebrow text-vrin-blue">Evidence</span>
          <span className="hairline flex-1" />
          <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
            2026 public benchmarks
          </span>
        </div>

        <div
          ref={ref}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-14 md:gap-y-20 gap-x-16"
        >
          {outcomes.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
              className="relative"
            >
              {/* Number index */}
              <span className="absolute -left-5 md:-left-8 top-2 text-[10px] font-mono tracking-widest text-vrin-charcoal/30">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="flex items-baseline gap-3">
                <span className="font-display text-[clamp(3rem,6vw,5rem)] leading-none tracking-[-0.03em] text-vrin-charcoal">
                  {item.value}
                </span>
                <span className="font-mono text-sm text-vrin-charcoal/50 tracking-wide">
                  {item.unit}
                </span>
              </div>

              <div className="mt-3 max-w-sm">
                <p className="text-base font-medium text-vrin-charcoal tracking-tight">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-vrin-charcoal/55 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
