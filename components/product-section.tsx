'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import { ArrowRight, Zap, Brain, Network, Database, Eye } from 'lucide-react';
import FloatingElements from './floating-elements';

// Dynamic import to avoid SSR issues with Three.js
const CircularCarousel3D = dynamic(() => import('./3d-circular-carousel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading 3D Experience...</p>
      </div>
    </div>
  ),
});

const productCards = [
  {
    title: "Adaptive Hybrid Retrieval",
    description: "Entity extraction → graph lookup → vector search → intelligent fusion for comprehensive knowledge discovery.",
    icon: "🔍",
    color: "#3B82F6" // Blue
  },
  {
    title: "Multi-hop Reasoning",
    description: "Expert synthesis across documents with relationship traversal and contextual understanding.",
    icon: "🧠",
    color: "#8B5CF6" // Purple
  },
  {
    title: "User-Defined Specialization",
    description: "Per-tenant experts with custom thresholds, reasoning chains, and domain-specific analysis.",
    icon: "⚙️",
    color: "#06B6D4" // Cyan
  },
  {
    title: "Idempotent Ingestion",
    description: "Smart deduplication with 40-60% storage reduction, confidence scoring, and full provenance tracking.",
    icon: "📊",
    color: "#10B981" // Emerald
  },
  {
    title: "Observability & Ops",
    description: "Real-time latency tracking, quality metrics, cache optimization, and comprehensive system monitoring.",
    icon: "👁️",
    color: "#F59E0B" // Amber
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0
  }
};

export default function ProductSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden relative">
      <FloatingElements />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-4">
              Product Overview
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6"
          >
            What Vrin Is
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            A <span className="font-semibold text-blue-600">HybridRAG context & memory layer</span> that routes across graph/vector, 
            writes typed facts with provenance, and composes domain-specific reasoning via user specializations.
          </motion.p>
        </motion.div>

        {/* 3D Carousel Container */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-3xl" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          
          {/* 3D Carousel */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-200/50 bg-white/50 backdrop-blur-sm shadow-2xl">
            <CircularCarousel3D cards={productCards} />
          </div>
        </motion.div>

        {/* Key Modules Grid (Alternative view for smaller screens) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-24 md:hidden"
        >
          <motion.h3 
            variants={itemVariants}
            className="text-2xl font-bold text-center mb-12 text-gray-900"
          >
            Key Modules
          </motion.h3>
          
          <div className="grid gap-6">
            {productCards.map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${card.color}15 0%, transparent 100%)`
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {card.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            See &ldquo;How it Works&rdquo;
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}