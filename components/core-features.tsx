'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Database, Network, Brain, Zap, Shield, GitBranch } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: Database,
    title: "Facts-First Reasoning",
    description: "Knowledge graphs that store facts with provenance, not just embeddings. Build institutional knowledge that compounds over time."
  },
  {
    icon: Network,
    title: "Multi-Hop Reasoning",
    description: "Reasoning engine that traces relationships across documents and time to answer complex 'why' questions."
  },
  {
    icon: Brain,
    title: "AI Specialization",
    description: "Define domain experts for sales, engineering, finance with custom reasoning patterns and knowledge focus areas."
  },
  {
    icon: Zap,
    title: "Gets Smarter With Every Query",
    description: "Vrin learns which retrieval strategies work best for your knowledge base. The more your team uses it, the more accurate and faster it becomes."
  },
  {
    icon: Shield,
    title: "BYOC/BYOK Security",
    description: "Deploy in your cloud or ours. Complete data sovereignty, zero vendor lock-in, enterprise-grade isolation."
  },
  {
    icon: GitBranch,
    title: "Temporal Consistency",
    description: "Track how facts evolve over time with automatic conflict resolution and versioning for changing information."
  }
];

export function CoreFeatures() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-20 bg-black relative overflow-hidden rounded-[3rem] md:rounded-[4rem]">
      {/* Sophisticated corner accents */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner dots */}
        <div className="absolute top-8 left-8 w-1.5 h-1.5 rounded-full bg-[#8DAA9D]"></div>
        <div className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-[#8DAA9D]"></div>
        <div className="absolute bottom-8 left-8 w-1.5 h-1.5 rounded-full bg-[#8DAA9D]"></div>
        <div className="absolute bottom-8 right-8 w-1.5 h-1.5 rounded-full bg-[#8DAA9D]"></div>

        {/* Connecting lines */}
        <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#8DAA9D]/30 to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#8DAA9D]/30 to-transparent"></div>
        <div className="absolute top-8 bottom-8 left-8 w-px bg-gradient-to-b from-transparent via-[#8DAA9D]/30 to-transparent"></div>
        <div className="absolute top-8 bottom-8 right-8 w-px bg-gradient-to-b from-transparent via-[#8DAA9D]/30 to-transparent"></div>

        {/* Subtle animated light beams */}
        <div className="absolute top-8 left-8 right-8 h-px overflow-hidden">
          <div className="h-full w-32 bg-gradient-to-r from-transparent via-[#8DAA9D] to-transparent animate-beam-horizontal"></div>
        </div>
        <div className="absolute bottom-8 left-8 right-8 h-px overflow-hidden">
          <div className="h-full w-32 bg-gradient-to-r from-transparent via-[#FFFFFF] to-transparent animate-beam-horizontal-reverse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D] mb-4 block">
            Core Features
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#FFFFFF] mb-6">
            What&apos;s inside VRIN?
          </h2>

          <p className="text-base text-[#FFFFFF]/70 font-normal leading-relaxed max-w-2xl mx-auto">
            Teams choose VRIN because it transforms AI from forgetful assistants into expert systems with persistent memory and deep reasoning.
          </p>
        </motion.div>

        {/* Works With — LLM Provider Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 max-w-4xl mx-auto"
        >
          <p className="text-center text-xs font-medium uppercase tracking-widest text-[#FFFFFF]/40 mb-8">
            Works with
          </p>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {[
              { name: "OpenAI", file: "openai.svg" },
              { name: "Anthropic", file: "anthropic.svg" },
              { name: "Google", file: "google.svg" },

              { name: "Mistral", file: "mistral.svg" },
              { name: "xAI", file: "xai.svg" },
            ].map((provider) => (
              <div key={provider.name} className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                <Image
                  src={`/llm-providers/${provider.file}`}
                  alt={provider.name}
                  width={100}
                  height={32}
                  className="h-7 w-auto object-contain brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 bg-[#201E1E]/30 rounded-2xl border border-[#FFFFFF]/10 hover:border-[#8DAA9D]/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#8DAA9D] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#201E1E]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-medium text-[#FFFFFF] mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-[#FFFFFF]/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
