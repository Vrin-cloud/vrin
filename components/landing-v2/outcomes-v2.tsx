'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1] as const;

type Outcome = {
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
  detail: string;
};

const outcomes: Outcome[] = [
  {
    prefix: 'Up to ',
    value: 95,
    suffix: '%',
    label: 'First-response resolution',
    detail: 'Your agent lands the right answer on the first try.',
  },
  {
    value: 80,
    suffix: '% fewer',
    label: 'Follow-up questions needed',
    detail: 'Cited, complete context. Less back-and-forth.',
  },
  {
    value: 10,
    suffix: '× faster',
    label: 'Research time cut',
    detail: 'Weeks of reading collapsed into seconds of reasoning.',
  },
  {
    value: 5,
    suffix: '× richer',
    label: 'Context for complex questions',
    detail: 'Multi-hop reasoning where vector search gives up.',
  },
];

function CountUp({
  to,
  duration = 1600,
  start,
  delay = 0,
}: {
  to: number;
  duration?: number;
  start: boolean;
  delay?: number;
}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    const delayTimer = window.setTimeout(() => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        // ease-out-expo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(Math.round(to * eased));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(delayTimer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [start, to, duration, delay]);

  return <>{value}</>;
}

export function OutcomesV2() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.25 });

  return (
    <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-14 max-w-5xl mx-auto">
          <span className="eyebrow text-vrin-blue">Outcomes</span>
          <span className="hairline flex-1" />
          <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
            what teams feel on day one
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

              <div className="flex items-baseline gap-1">
                <span className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-none tracking-[-0.03em] text-vrin-charcoal tabular-nums">
                  {item.prefix}
                  <CountUp
                    to={item.value}
                    start={inView}
                    delay={200 + i * 120}
                  />
                  {item.suffix}
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
