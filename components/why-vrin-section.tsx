'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const paragraph =
  "Today's AI agents can synthesize, analyze, and reason brilliantly. But only over the context they're given. " +
  "The bottleneck was never the model. It's what you feed it. " +
  "Most enterprise decisions require connecting insights across departments, timelines, and document types. " +
  "3+ hop reasoning that transformer architecture can't do natively and vector search doesn't even attempt. " +
  "Vrin adds the missing layer: context reasoning at the retrieval layer." +
  "Not retrieval. Not recall. " +
  "A structured reasoning chain that understands the crux of what you're asking, " +
  "pulls insights from domains you never mentioned, " +
  "and gives the AI agent exactly what it needs to get the answer right.";

function ScrollRevealWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: any;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block mr-[0.25em] text-white tracking-tight"
    >
      {word}
    </motion.span>
  );
}

export function WhyVrinSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const words = paragraph.split(' ');
  const buttonOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Dark background */}
      <div className="absolute inset-0 rounded-[3rem] md:rounded-[4rem] bg-black" />

      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Sphere image — fixed in sticky frame, bottom-left */}
          <img
            src="/background-images/vision-background.png"
            alt=""
            loading="eager"
            className="absolute bottom-0 left-0 w-[55%] md:w-[40%] h-auto pointer-events-none rounded-bl-[3rem] md:rounded-bl-[4rem]"
          />

          <div className="relative max-w-xl ml-auto mr-[8%] md:mr-[12%] px-6 flex flex-col items-center">
            <span className="mb-10 text-xs font-medium tracking-widest uppercase text-[#8DAA9D]">
              Why Vrin
            </span>

            <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed md:leading-relaxed lg:leading-relaxed tracking-tight text-center">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = Math.min((i + 1) / words.length, 1);
                return (
                  <ScrollRevealWord
                    key={i}
                    word={word}
                    progress={scrollYProgress}
                    range={[start * 0.6, end * 0.6]}
                  />
                );
              })}
            </p>

            <motion.div
              style={{ opacity: buttonOpacity }}
              className="mt-10"
            >
              <Link
                href="/vision"
                className="inline-flex items-center gap-2 text-[#8DAA9D] hover:text-white text-sm font-medium transition-colors duration-300"
              >
                Our Vision
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
