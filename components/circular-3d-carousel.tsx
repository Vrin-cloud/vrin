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
    ],
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
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
    ],
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
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
    ],
    color: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20"
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
    ],
    color: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
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
    ],
    color: "from-rose-500 to-red-500",
    bgGradient: "from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20"
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
    ],
    color: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20"
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
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="workflow-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-300 dark:text-slate-600"
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
          className="text-center mb-12 max-w-4xl mx-auto"
        >
          <span className="inline-block px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-4">
            How VRIN Works
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-gray-100 mb-4">
            From Raw Data to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
              Expert Insights
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            VRIN&apos;s HybridRAG architecture transforms fragmented information into persistent, intelligent memory.
          </p>
        </motion.div>

        {/* Step Navigation Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {workflowSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`
                  group relative px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300
                  ${activeStep === index
                    ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-105`
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${activeStep === index ? 'text-white/70' : 'text-gray-400'}`}>
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
              className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-800/30 dark:to-slate-800/50 border border-gray-200 dark:border-gray-700 shadow-xl"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <div className="max-w-3xl mx-auto">
                {/* Icon and Title */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center shadow-lg mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="mb-2">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                      STEP {currentStep.step}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700 }}>
                    {currentStep.name}
                  </h3>

                  <p className={`text-sm font-semibold bg-gradient-to-r ${currentStep.color} bg-clip-text text-transparent`} style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600 }}>
                    {currentStep.title}
                  </p>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-center" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400 }}>
                  {currentStep.description}
                </p>

                {/* Highlights Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {currentStep.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400 }}>
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Step Progress Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                  {workflowSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`
                        h-2 rounded-full transition-all duration-300
                        ${activeStep === index ? 'w-8 bg-gradient-to-r ' + currentStep.color : 'w-2 bg-gray-300 dark:bg-gray-600'}
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
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              All of this happens automatically—you just integrate the API
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
