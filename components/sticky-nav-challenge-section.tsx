'use client';

import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  RotateCcw,
  Target,
  DollarSign,
  AlertCircle,
  TrendingDown,
  CheckCircle,
  ArrowRight,
  Database,
  Network,
  Zap
} from 'lucide-react';

export function StickyNavChallengeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();
  const [activeSection, setActiveSection] = useState(0);

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Intersection Observer for tracking active sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeIndex = -1;

        entries.forEach((entry) => {
          const index = sectionRefs.findIndex(ref => ref.current === entry.target);
          if (index !== -1 && entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeIndex = index;
          }
        });

        if (activeIndex !== -1) {
          setActiveSection(activeIndex);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
        rootMargin: '-20% 0px -50% 0px'
      }
    );

    sectionRefs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const challenges = [
    {
      id: 'context-amnesia',
      icon: RotateCcw,
      title: "AI Without Memory Can't Scale",
      problem: "Knowledge workers waste 20-30% of their time re-explaining context that AI should already know",
      impact: "Fragmented information across 20+ disconnected tools means your AI starts every conversation from scratch. Teams spend hours searching instead of solving.",
      solution: "Facts-First Memory Architecture",
      solutionDetail: "VRIN's knowledge graph extracts and stores facts, not embeddings. Your AI builds a persistent understanding that compounds over time—remembering relationships, user preferences, and domain expertise across all interactions. Unlike vector search that forgets everything, VRIN creates institutional memory that gets smarter with every conversation.",
      solutionIcon: Database,
      color: "from-red-500 to-orange-500"
    },
    {
      id: 'surface-analysis',
      icon: Target,
      title: "Vector Search Misses What Matters",
      problem: "Traditional RAG retrieves similar text but can't connect insights across documents or reason through complex questions",
      impact: "Your team gets keyword matches when they need expert-level analysis. Without multi-hop reasoning, AI can't answer 'why' or trace cause-and-effect across your data.",
      solution: "HybridRAG with Multi-Hop Reasoning",
      solutionDetail: "VRIN combines the speed of vector search with the intelligence of graph traversal. Our constraint-solver engine automatically reasons across multiple documents, time periods, and data sources to answer complex questions that require connecting the dots. Define AI specialists for your domains—sales, engineering, finance—and get expert insights, not surface matches.",
      solutionIcon: Network,
      color: "from-orange-500 to-yellow-500"
    },
    {
      id: 'diy-trap',
      icon: DollarSign,
      title: "Building RAG In-House Is A Trap",
      problem: "Custom RAG systems take 6-12 months to build, require specialized ML talent, and still underperform production-ready platforms",
      impact: "While your engineers wrestle with vector databases, embedding models, and prompt engineering, competitors ship AI features. You're building infrastructure when you should be building products.",
      solution: "Enterprise-Ready in Days, Not Months",
      solutionDetail: "VRIN deploys in your cloud (AWS, Azure, GCP) or ours—your choice with BYOC/BYOK. Simple REST APIs integrate with your existing stack in hours. No data migration, no vendor lock-in, no infrastructure headaches. We handle the complexity of hybrid retrieval, temporal consistency, and conflict resolution so you can focus on building features your users love.",
      solutionIcon: Zap,
      color: "from-yellow-500 to-red-500"
    }
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section ref={ref} className="py-24 bg-[#FFFDFD] dark:bg-[#201E1E]">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-[1400px]">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D]">
              The Challenge
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-6 leading-tight text-[#201E1E] dark:text-[#FFFDFD]"
          >
            Your AI Forgets Everything
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light leading-relaxed"
          >
            Vector search was a breakthrough—until teams realized it&apos;s just
            <span className="font-medium text-[#201E1E] dark:text-[#FFFDFD]"> expensive keyword matching</span>.
            While you&apos;re building custom RAG systems for months, your AI still can&apos;t connect the dots.
          </motion.p>
        </motion.div>

        {/* Sticky Navigation Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative max-w-7xl mx-auto"
        >
          <div className="lg:flex lg:gap-12">
            {/* Fixed Problems Navigation Sidebar */}
            <div className="lg:w-[400px] lg:flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <div className="space-y-2 p-6">
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#201E1E] dark:bg-[#FFFDFD] flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-[#FFFDFD] dark:text-[#201E1E]" />
                    </div>
                    <h3 className="text-xl font-light text-[#201E1E] dark:text-[#FFFDFD] mb-1">
                      The Problems
                    </h3>
                    <p className="text-xs text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                      Why traditional AI fails teams
                    </p>
                  </div>

                  {challenges.map((challenge, index) => {
                    const Icon = challenge.icon;
                    const isActive = activeSection === index;

                    return (
                      <motion.div
                        key={challenge.id}
                        className="w-full text-left rounded-2xl transition-all duration-300 group relative overflow-hidden p-4"
                        initial={false}
                        animate={{
                          height: isActive ? 'auto' : 'auto',
                          transition: { duration: 0.3 }
                        }}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            className="absolute left-0 top-0 w-1 h-full bg-[#083C5E] dark:bg-[#8DAA9D] rounded-r-full"
                          />
                        )}

                        <div className="relative z-10">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                              isActive
                                ? 'bg-[#083C5E] dark:bg-[#8DAA9D]'
                                : 'bg-[#201E1E]/10 dark:bg-[#FFFDFD]/10'
                            }`}>
                              <Icon className={`w-5 h-5 ${isActive ? 'text-[#FFFDFD] dark:text-[#201E1E]' : 'text-[#201E1E]/60 dark:text-[#FFFDFD]/60'}`} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium uppercase tracking-widest ${
                                  isActive ? 'text-[#083C5E] dark:text-[#8DAA9D]' : 'text-[#201E1E]/50 dark:text-[#FFFDFD]/50'
                                }`}>
                                  Problem #{index + 1}
                                </span>
                                {isActive && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-1.5 h-1.5 rounded-full bg-[#083C5E] dark:bg-[#8DAA9D]"
                                  />
                                )}
                              </div>

                              <h4 className={`font-medium transition-colors ${
                                isActive
                                  ? 'text-base text-[#201E1E] dark:text-[#FFFDFD] mb-3'
                                  : 'text-sm text-[#201E1E]/70 dark:text-[#FFFDFD]/70'
                              }`}>
                                {challenge.title}
                              </h4>

                              <AnimatePresence mode="wait">
                                {!isActive && (
                                  <motion.p
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xs text-[#201E1E]/50 dark:text-[#FFFDFD]/50 line-clamp-1 mt-1"
                                  >
                                    {challenge.problem}
                                  </motion.p>
                                )}

                                {isActive && (
                                  <motion.div
                                    key="expanded"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <p className="text-sm leading-relaxed text-[#201E1E]/70 dark:text-[#FFFDFD]/70 mb-2">
                                      {challenge.problem}
                                    </p>

                                    <p className="text-xs leading-relaxed text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                                      {challenge.impact}
                                    </p>

                                    <div className="mt-3 pt-3 border-t border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
                                      <div className="flex items-center gap-2 text-xs font-medium text-[#083C5E] dark:text-[#8DAA9D]">
                                        <ArrowRight className="w-3 h-3" />
                                        <span>See VRIN Solution</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Scrolling Solutions Content Area */}
            <div className="lg:flex-1 mt-8 lg:mt-0">
              <div className="space-y-24">
                {challenges.map((challenge, index) => {
                  const SolutionIcon = challenge.solutionIcon;

                  return (
                    <motion.div
                      key={challenge.id}
                      ref={sectionRefs[index]}
                      variants={itemVariants}
                      className="min-h-[85vh] flex items-center py-12"
                    >
                      {/* Solution Section Only */}
                      <div className="w-full">
                        <div className="text-center mb-10">
                          <span className="text-xs font-medium text-[#8DAA9D] uppercase tracking-widest">
                            VRIN Solution #{index + 1}
                          </span>
                          <h2 className="text-2xl md:text-4xl font-extralight text-[#201E1E] dark:text-[#FFFDFD] mt-3 mb-6">
                            {challenge.solution}
                          </h2>
                        </div>

                        <div className="max-w-4xl mx-auto">
                          {/* Large Solution Card */}
                          <div className="p-8 md:p-12 bg-[#083C5E]/5 dark:bg-[#083C5E]/20 rounded-3xl border border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
                            <div className="text-center mb-10">
                              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#083C5E] dark:bg-[#8DAA9D] flex items-center justify-center mb-6">
                                <SolutionIcon className="w-8 h-8 text-[#FFFDFD] dark:text-[#201E1E]" />
                              </div>

                              <h3 className="text-xl md:text-2xl font-light text-[#201E1E] dark:text-[#FFFDFD] mb-4">
                                How {challenge.solution} Works
                              </h3>
                            </div>

                            <div className="text-center space-y-8">
                              <p className="text-base md:text-lg text-[#201E1E]/70 dark:text-[#FFFDFD]/70 font-light leading-relaxed">
                                {challenge.solutionDetail}
                              </p>

                              {/* Solution Benefits */}
                              <div className="grid md:grid-cols-2 gap-6 mt-12">
                                <div className="p-6 rounded-2xl bg-[#FFFDFD] dark:bg-[#201E1E] border border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
                                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#8DAA9D]/20 dark:bg-[#8DAA9D]/30 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D]" />
                                  </div>
                                  <h4 className="font-medium text-[#201E1E] dark:text-[#FFFDFD] mb-2">
                                    {index === 0 ? "Never Forgets" : index === 1 ? "Connects Insights" : "Instant Deployment"}
                                  </h4>
                                  <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light">
                                    {index === 0 ? "Persistent knowledge across all conversations" :
                                     index === 1 ? "Advanced multi-hop reasoning capabilities" :
                                     "Production-ready in minutes, not months"}
                                  </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-[#FFFDFD] dark:bg-[#201E1E] border border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
                                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#8DAA9D]/20 dark:bg-[#8DAA9D]/30 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D]" />
                                  </div>
                                  <h4 className="font-medium text-[#201E1E] dark:text-[#FFFDFD] mb-2">
                                    {index === 0 ? "Dramatic Cost Savings" : index === 1 ? "Professional Insights" : "70% Cost Reduction"}
                                  </h4>
                                  <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light">
                                    {index === 0 ? "Memory-efficient storage with space reduction" :
                                     index === 1 ? "Expert-level analysis from connected data" :
                                     "Compared to traditional DIY approaches"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}