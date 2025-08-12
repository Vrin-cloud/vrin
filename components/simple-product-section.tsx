'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const productCards = [
  {
    title: "Adaptive Hybrid Retrieval",
    description: "Entity extraction → graph lookup → vector search → intelligent fusion for comprehensive knowledge discovery.",
    icon: "🔍",
    color: "bg-blue-500/10 dark:bg-blue-500/20",
    iconBg: "bg-blue-500/20 dark:bg-blue-500/30"
  },
  {
    title: "Multi-hop Reasoning",
    description: "Expert synthesis across documents with relationship traversal and contextual understanding.",
    icon: "🧠",
    color: "bg-purple-500/10 dark:bg-purple-500/20",
    iconBg: "bg-purple-500/20 dark:bg-purple-500/30"
  },
  {
    title: "User-Defined Specialization",
    description: "Per-tenant experts with custom thresholds, reasoning chains, and domain-specific analysis.",
    icon: "⚙️",
    color: "bg-cyan-500/10 dark:bg-cyan-500/20",
    iconBg: "bg-cyan-500/20 dark:bg-cyan-500/30"
  },
  {
    title: "Idempotent Ingestion",
    description: "Smart deduplication with 40-60% storage reduction, confidence scoring, and full provenance tracking.",
    icon: "📊",
    color: "bg-green-500/10 dark:bg-green-500/20",
    iconBg: "bg-green-500/20 dark:bg-green-500/30"
  },
  {
    title: "Observability & Operations",
    description: "Real-time latency tracking, quality metrics, cache optimization, and comprehensive system monitoring.",
    icon: "👁️",
    color: "bg-amber-500/10 dark:bg-amber-500/20",
    iconBg: "bg-amber-500/20 dark:bg-amber-500/30"
  }
];

export default function SimpleProductSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-4">
            Product Overview
          </span>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            What Vrin Is
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            A <span className="font-semibold text-blue-600 dark:text-blue-400">HybridRAG context & memory layer</span> that routes across graph/vector, 
            writes typed facts with provenance, and composes domain-specific reasoning via user specializations.
          </p>
        </motion.div>

        {/* Key Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {productCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`p-6 h-full border-border/50 hover:shadow-lg transition-all duration-300 ${card.color}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      {card.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full text-lg hover:shadow-lg transition-all duration-300">
            See How it Works
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}