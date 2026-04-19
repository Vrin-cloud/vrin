'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Editorial watermark that rises from below as the viewer scrolls
 * toward the footer. Uses the Instrument Serif display type and a
 * warm paper-to-charcoal gradient so the wordmark feels engraved
 * into the paper background. The footer's dark section scrolls over
 * the top and hides it again when scrolling back up.
 */
export function VrinGlowV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0.2, 0.5], [200, 0]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative h-[280px] md:h-[360px] bg-vrin-paper"
      style={{ overflow: 'clip' }}
    >
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center">
        <motion.h2
          style={{ y, opacity }}
          className="font-display relative text-[8rem] md:text-[14rem] lg:text-[20rem] leading-[0.85] tracking-[-0.05em] select-none"
        >
          <span
            style={{
              backgroundImage:
                'linear-gradient(0deg, rgba(249, 247, 242, 1) 0%, rgba(249, 247, 242, 0.92) 18%, rgba(32, 30, 30, 0.5) 55%, rgba(32, 30, 30, 0.88) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            vrin
          </span>
        </motion.h2>
      </div>
    </section>
  );
}
