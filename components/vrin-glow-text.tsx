'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function VrinGlowText() {
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
      className="relative h-[250px] md:h-[300px] bg-white"
      style={{ overflow: 'clip' }}
    >
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center">
        <motion.h2
          style={{ y, opacity }}
          className="relative text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold tracking-tight leading-none select-none"
        >
          <span
            style={{
              backgroundImage: 'linear-gradient(0deg, rgba(255, 255, 255, 0.65) 0%, rgba(241, 241, 241, 0.8) 40%, rgba(172, 172, 172, 0.75) 75%, rgba(199, 199, 199, 0.91) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Vrin
          </span>
        </motion.h2>
      </div>
    </section>
  );
}
