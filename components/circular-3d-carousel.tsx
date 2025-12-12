'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Database, GitBranch, Brain, Zap, Network, Sparkles, ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const workflowSteps = [
  {
    step: "01",
    icon: Database,
    name: "Connect & Ingest",
    title: "Universal Data Integration",
    description: "VRIN ingests from any source—APIs, databases, documents, conversations, Slack threads, customer tickets. No complex ETL pipelines. No data movement. Just simple REST API calls that work with your existing infrastructure.",
    highlights: [
      "REST API & SDK integration",
      "Real-time streaming & batch processing",
      "Support for structured and unstructured data",
      "Zero data migration required"
    ]
  },
  {
    step: "02",
    icon: GitBranch,
    name: "Extract Facts",
    title: "LLM-Powered Knowledge Extraction",
    description: "Advanced LLMs analyze your data to extract structured facts, entities, relationships, and provenance. Unlike traditional RAG that just creates embeddings, VRIN builds typed facts with citations—creating a foundation for true reasoning.",
    highlights: [
      "Entity & relationship extraction",
      "Provenance and citation tracking",
      "Temporal awareness and versioning",
      "Automatic conflict detection"
    ]
  },
  {
    step: "03",
    icon: Network,
    name: "Hybrid Storage",
    title: "Best of Both Worlds",
    description: "Facts populate knowledge graphs (Neptune/CosmosDB) for multi-hop reasoning. Vectors enable fast similarity search. Our intelligent query router automatically picks the optimal retrieval path based on query complexity.",
    highlights: [
      "Knowledge graphs for reasoning",
      "Vector stores for similarity search",
      "Automatic conflict resolution",
      "Temporal consistency guarantees"
    ]
  },
  {
    step: "04",
    icon: Brain,
    name: "Reason & Route",
    title: "Multi-Hop Intelligence",
    description: "Our constraint-solver engine traverses knowledge graphs to connect insights across time, documents, and data sources. Simple queries use vector search for speed. Complex 'why' questions trigger graph traversal for causal reasoning.",
    highlights: [
      "Multi-hop reasoning across documents",
      "Query complexity analysis",
      "Intelligent hybrid routing",
      "Cause-and-effect inference"
    ]
  },
  {
    step: "05",
    icon: Sparkles,
    name: "Specialize",
    title: "Domain Experts You Define",
    description: "Create AI specialists for sales, engineering, finance, support—each with custom reasoning patterns, prompt templates, and knowledge focus areas. Your AI adapts to your team's unique expertise and workflows.",
    highlights: [
      "Custom prompt templates per domain",
      "Domain-specific reasoning patterns",
      "Expert knowledge filtering",
      "Team-specific context awareness"
    ]
  },
  {
    step: "06",
    icon: Zap,
    name: "Retrieve & Answer",
    title: "Expert Insights with Citations",
    description: "Get context-aware responses with full citations and transparent reasoning chains. Your AI doesn't just answer—it shows its work. Persistent memory means every conversation builds on the last, creating compound intelligence over time.",
    highlights: [
      "Cited, verifiable answers",
      "Transparent reasoning chains",
      "Persistent conversation memory",
      "Compound intelligence over time"
    ]
  }
];

export default function Circular3DCarousel() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % workflowSteps.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + workflowSteps.length) % workflowSteps.length);
  };

  const currentStep = workflowSteps[activeStep];
  const Icon = currentStep.icon;

  return (
    <section className="py-24 bg-[#FFFDFD] dark:bg-[#201E1E] relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="workflow-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-[#201E1E] dark:text-[#FFFDFD]"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#workflow-grid)" />
        </svg>
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
            How VRIN Works
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-[#201E1E] dark:text-[#FFFDFD] mb-6">
            From Raw Data to Expert Insights
          </h2>

          <p className="text-lg text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light leading-relaxed">
            VRIN&apos;s HybridRAG architecture transforms fragmented information into persistent, intelligent memory.
          </p>
        </motion.div>

        {/* Step Navigation Tabs */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {workflowSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`
                  group relative px-5 py-3 rounded-full font-medium text-sm transition-all duration-300
                  ${activeStep === index
                    ? 'bg-[#083C5E] dark:bg-[#8DAA9D] text-[#FFFDFD] dark:text-[#201E1E] shadow-lg'
                    : 'bg-[#FFFDFD] dark:bg-[#201E1E]/50 text-[#201E1E]/70 dark:text-[#FFFDFD]/70 hover:bg-[#8DAA9D]/10 dark:hover:bg-[#8DAA9D]/20 border border-[#201E1E]/10 dark:border-[#FFFDFD]/10'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${activeStep === index ? 'text-[#FFFDFD]/60 dark:text-[#201E1E]/60' : 'text-[#8DAA9D]'}`}>
                    {step.step}
                  </span>
                  <span>{step.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Content */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative p-10 md:p-14 rounded-3xl bg-[#FFFDFD] dark:bg-[#201E1E]/50 border border-[#201E1E]/10 dark:border-[#FFFDFD]/10 shadow-sm"
            >
              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#8DAA9D]/20 dark:bg-[#8DAA9D]/30 flex items-center justify-center hover:bg-[#8DAA9D]/30 dark:hover:bg-[#8DAA9D]/40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#8DAA9D]/20 dark:bg-[#8DAA9D]/30 flex items-center justify-center hover:bg-[#8DAA9D]/30 dark:hover:bg-[#8DAA9D]/40 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
              </button>

              <div className="max-w-3xl mx-auto">
                {/* Icon and Title */}
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#083C5E] dark:bg-[#8DAA9D] flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-[#FFFDFD] dark:text-[#201E1E]" />
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D]">
                      Step {currentStep.step}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-light text-[#201E1E] dark:text-[#FFFDFD] mb-2">
                    {currentStep.name}
                  </h3>

                  <p className="text-sm font-medium text-[#083C5E] dark:text-[#8DAA9D]">
                    {currentStep.title}
                  </p>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-[#201E1E]/70 dark:text-[#FFFDFD]/70 font-light leading-relaxed mb-10 text-center">
                  {currentStep.description}
                </p>

                {/* Highlights Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {currentStep.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-[#083C5E]/5 dark:bg-[#083C5E]/20 rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#201E1E]/70 dark:text-[#FFFDFD]/70 font-light">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Step Progress Indicator */}
                <div className="flex justify-center gap-2 mt-10">
                  {workflowSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`
                        h-1.5 rounded-full transition-all duration-300
                        ${activeStep === index ? 'w-8 bg-[#083C5E] dark:bg-[#8DAA9D]' : 'w-1.5 bg-[#201E1E]/20 dark:bg-[#FFFDFD]/20'}
                      `}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8DAA9D]/10 dark:bg-[#083C5E]/30 border border-[#8DAA9D]/20 dark:border-[#8DAA9D]/30">
            <Sparkles className="w-4 h-4 text-[#083C5E] dark:text-[#8DAA9D]" />
            <span className="text-sm font-light text-[#201E1E]/70 dark:text-[#FFFDFD]/70">
              All of this happens automatically—you just integrate the API
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
