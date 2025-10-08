'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Database, Network, Brain, Zap, Shield, GitBranch } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: "Facts-First Memory",
    description: "Knowledge graphs that store facts with provenance, not just embeddings. Build institutional memory that compounds over time."
  },
  {
    icon: Network,
    title: "Multi-Hop Reasoning",
    description: "Constraint-solver engine that traces relationships across documents and time to answer complex 'why' questions."
  },
  {
    icon: Brain,
    title: "AI Specialization",
    description: "Define domain experts for sales, engineering, finance with custom reasoning patterns and knowledge focus areas."
  },
  {
    icon: Zap,
    title: "HybridRAG Routing",
    description: "Intelligent query analysis routes to optimal path: vector search for similarity, graph traversal for reasoning."
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
    <section className="py-16 bg-slate-900 dark:bg-black relative overflow-hidden">
      {/* Corner dots and connecting lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner dots */}
        <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-blue-400/50"></div>
        <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-blue-400/50"></div>
        <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-blue-400/50"></div>
        <div className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-blue-400/50"></div>

        {/* Connecting lines */}
        <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute top-8 bottom-8 left-8 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute top-8 bottom-8 right-8 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>

        {/* Animated light beams */}
        <div className="absolute top-8 left-8 right-8 h-px overflow-hidden">
          <div className="h-full w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-beam-horizontal"></div>
        </div>
        <div className="absolute bottom-8 left-8 right-8 h-px overflow-hidden">
          <div className="h-full w-32 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-beam-horizontal-reverse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="absolute top-8 bottom-8 left-8 w-px overflow-hidden">
          <div className="w-full h-32 bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-beam-vertical"></div>
        </div>
        <div className="absolute top-8 bottom-8 right-8 w-px overflow-hidden">
          <div className="w-full h-32 bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-beam-vertical-reverse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600 }}>
              Core Features
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700 }}>
            What&apos;s inside VRIN?
          </h2>

          <p className="text-base md:text-lg text-gray-400 leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400 }}>
            Teams choose VRIN because it transforms AI from forgetful assistants into expert systems with persistent memory and deep reasoning.
          </p>
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
                className="group p-6 bg-slate-800/50 dark:bg-slate-900/50 rounded-2xl border border-slate-700 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700 }}>
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400 }}>
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
