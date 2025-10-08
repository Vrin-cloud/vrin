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
    <section ref={ref} className="py-16 bg-white dark:bg-slate-900">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-[1400px]">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4" />
              The Challenge
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 leading-tight"
          >
            <span className="text-gray-900 dark:text-gray-100">Your AI </span>
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-medium">
              Forgets Everything
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed"
          >
            Vector search was a breakthrough—until teams realized it&apos;s just
            <span className="font-medium text-gray-900 dark:text-gray-100"> expensive keyword matching</span>.
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
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-1">
                      The Problems
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
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
                            className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500 rounded-r-full"
                          />
                        )}

                        <div className="relative z-10">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                              isActive
                                ? `bg-gradient-to-r ${challenge.color}`
                                : 'bg-gray-200 dark:bg-slate-600'
                            }`}>
                              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium uppercase tracking-wide ${
                                  isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-500'
                                }`}>
                                  Problem #{index + 1}
                                </span>
                                {isActive && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                                  />
                                )}
                              </div>

                              <h4 className={`font-medium transition-colors ${
                                isActive
                                  ? 'text-base text-red-600 dark:text-red-400 mb-3'
                                  : 'text-sm text-gray-700 dark:text-gray-300'
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
                                    className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1"
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
                                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
                                      {challenge.problem}
                                    </p>

                                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                                      {challenge.impact}
                                    </p>

                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                      <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
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
                        <div className="text-center mb-8">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            VRIN Solution #{index + 1}
                          </span>
                          <h2 className="text-2xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mt-2 mb-6">
                            {challenge.solution}
                          </h2>
                        </div>

                        <div className="max-w-4xl mx-auto">
                          {/* Large Solution Card */}
                          <div className="p-8 md:p-10">
                            <div className="text-center mb-8">
                              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-6">
                                <SolutionIcon className="w-10 h-10 text-white" />
                              </div>

                              <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">
                                How {challenge.solution} Works
                              </h3>
                            </div>

                            <div className="text-center space-y-6">
                              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                {challenge.solutionDetail}
                              </p>

                              {/* Solution Benefits */}
                              <div className="grid md:grid-cols-2 gap-6 mt-12">
                                <div className="p-6 rounded-2xl">
                                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                  </div>
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {index === 0 ? "Never Forgets" : index === 1 ? "Connects Insights" : "Instant Deployment"}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {index === 0 ? "Persistent knowledge across all conversations" :
                                     index === 1 ? "Advanced multi-hop reasoning capabilities" :
                                     "Production-ready in minutes, not months"}
                                  </p>
                                </div>

                                <div className="p-6 rounded-2xl">
                                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {index === 0 ? "Dramatic Cost Savings" : index === 1 ? "Professional Insights" : "70% Cost Reduction"}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
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