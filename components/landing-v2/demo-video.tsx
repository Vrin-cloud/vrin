'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

export function DemoVideo() {
  const [headerRef, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      /* autoplay policy could block; surfacing controls handles it */
    });
    setIsPlaying(true);
  };

  return (
    <section className="relative bg-vrin-paper py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="max-w-4xl mb-14"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="eyebrow text-vrin-blue">See it work</span>
            <span className="hairline flex-1" />
          </div>

          <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
            A walkthrough of Vrin
            <br />
            curating <span className="serif-italic text-vrin-blue">live</span> context.
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed">
            Watch Vrin connect to a real knowledge base, extract facts into a living
            graph, and answer a multi-hop question with traced sources.
          </p>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-vrin-charcoal/10 bg-vrin-ink">
            <video
              ref={videoRef}
              src="/videos/demo-explainer.mp4"
              preload="metadata"
              playsInline
              controls={isPlaying}
              onEnded={() => setIsPlaying(false)}
              poster="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230D0D0E'/%3E%3C/svg%3E"
              className="w-full h-auto block bg-vrin-ink"
            />

            {/* Play overlay — visible until the user presses play */}
            {!isPlaying && (
              <button
                onClick={handlePlay}
                aria-label="Play demo video"
                className="absolute inset-0 flex items-center justify-center group cursor-pointer"
              >
                <span className="absolute inset-0 bg-vrin-ink" />
                <span className="relative z-10 flex items-center gap-3 rounded-full bg-vrin-cream/95 text-vrin-charcoal px-7 py-4 text-sm font-medium shadow-xl shadow-vrin-ink/20 transition-transform duration-300 group-hover:scale-105">
                  <Play className="w-4 h-4 fill-vrin-charcoal" />
                  Play the walkthrough
                </span>
                <span className="absolute bottom-6 left-6 text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-cream/80">
                  demo · ~2 min
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
