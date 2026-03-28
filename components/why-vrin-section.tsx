'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Layers, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const blocks = [
  {
    icon: Brain,
    title: "AI agents are powerful reasoners. But only over the context they're given.",
    description: "Today's LLMs can synthesize, analyze, and reason brilliantly. The bottleneck isn't the model. It's what you feed it."
  },
  {
    icon: Layers,
    title: "Most enterprise questions need 3+ hops. Transformers can't do that natively.",
    description: "Strategic decisions require connecting insights across departments, timelines, and document types. Transformer architecture degrades beyond 2-3 hops. Vector search doesn't even try."
  },
  {
    icon: Target,
    title: "VRIN reasons about what context is needed before inference begins.",
    description: "Pre-inference context reasoning. Not retrieval. Not recall. A structured reasoning chain that gives the AI agent exactly what it needs to get the answer right."
  }
];

export function WhyVrinSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]" ref={ref}>
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#8DAA9D]/10 dark:bg-[#8DAA9D]/20 border-[#8DAA9D]/30 text-[#083C5E] dark:text-[#8DAA9D]"
          >
            Why VRIN
          </Badge>
          <h2 className="text-3xl md:text-4xl font-light text-[#201E1E] dark:text-[#FFFFFF]">
            The missing layer in your AI stack
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {blocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#8DAA9D]/10 dark:bg-[#8DAA9D]/20 flex items-center justify-center mx-auto mb-6">
                <block.icon className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D]" />
              </div>
              <h3 className="text-base font-medium text-[#201E1E] dark:text-[#FFFFFF] mb-3 leading-snug">
                {block.title}
              </h3>
              <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60 font-normal leading-relaxed">
                {block.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
