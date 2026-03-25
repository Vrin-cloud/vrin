'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Scale, BarChart3, Stethoscope, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const useCases = [
  {
    icon: Scale,
    title: "Legal AI",
    description: "Your agents trace answers to specific clauses and precedents. Every conclusion cites the exact source, critical for compliance and audit."
  },
  {
    icon: BarChart3,
    title: "Financial AI",
    description: "Your agents reason across filings, earnings reports, and market data with full audit trails. Temporal versioning tracks how facts change quarter to quarter."
  },
  {
    icon: Stethoscope,
    title: "Healthcare AI",
    description: "Your agents connect clinical notes, research papers, and treatment guidelines with provenance. Every recommendation traces to specific evidence."
  }
];

export function ForAgentsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-[#201E1E] relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8DAA9D]/[0.03] to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <Badge variant="outline" className="mb-6 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#8DAA9D]/10 border-[#8DAA9D]/20 text-[#8DAA9D]">
            For AI Agent Builders
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#FFFFFF] mb-6">
            The reasoning engine behind your AI agents
          </h2>

          <p className="text-base text-[#FFFFFF]/60 font-normal leading-relaxed max-w-2xl mx-auto">
            Vertical AI companies embed Vrin to give their agents structured knowledge reasoning.
            One integration powers hundreds of enterprise deployments.
          </p>
        </motion.div>

        {/* Use Case Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group p-8 bg-[#201E1E]/30 rounded-2xl border border-[#FFFFFF]/10 hover:border-[#8DAA9D]/30 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#8DAA9D]/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#8DAA9D]" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-[#FFFFFF] mb-3">
                  {useCase.title}
                </h3>
                <p className="text-sm text-[#FFFFFF]/60 leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Key Message + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center p-8 bg-gradient-to-r from-[#083C5E]/10 to-[#8DAA9D]/10 rounded-2xl border border-[#FFFFFF]/5">
            <p className="text-base text-[#FFFFFF]/80 mb-6">
              Your customers get data sovereignty. You get a reasoning layer that improves over time.
            </p>
            <Link href="/for-agents">
              <Button
                size="lg"
                className="bg-[#8DAA9D] text-[#201E1E] hover:bg-[#8DAA9D]/90 px-8 py-6 text-base font-medium rounded-full transition-all duration-300"
              >
                Learn more
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
