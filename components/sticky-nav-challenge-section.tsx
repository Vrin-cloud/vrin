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
      title: "Context Amnesia",
      problem: "Your AI starts from zero every conversation",
      impact: "Teams waste hours re-explaining domain knowledge instead of getting insights.",
      solution: "Persistent Memory",
      solutionDetail: "Facts-first architecture that never forgets and connects insights across all conversations.",
      solutionIcon: Database,
      color: "from-red-500 to-orange-500"
    },
    {
      id: 'surface-analysis',
      icon: Target,
      title: "Surface-Level Analysis",
      problem: "Vector search finds similar text but misses deeper connections",
      impact: "AI delivers keyword matching instead of professional-grade reasoning.",
      solution: "Multi-Hop Reasoning",
      solutionDetail: "Advanced reasoning engine that connects insights across documents and time periods.",
      solutionIcon: Network,
      color: "from-orange-500 to-yellow-500"
    },
    {
      id: 'diy-trap',
      icon: DollarSign,
      title: "The DIY Development Trap",
      problem: "Building custom RAG systems that barely work takes months",
      impact: "Traditional approach: $47,000+/month, 6-12 months to production. Teams burn budget while competitors gain advantage.",
      solution: "Deploy in Minutes",
      solutionDetail: "VRIN delivers 70% cost reduction with days to deployment. Simple APIs, zero migration complexity.",
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
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-slate-900">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-[1400px]">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4" />
              The Challenge
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight"
          >
            <span className="text-gray-900 dark:text-gray-100">Your AI </span>
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-medium">
              Forgets Everything
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed"
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
                <div className="space-y-2 p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-3xl border border-red-200 dark:border-red-800">
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
                        className={`w-full text-left rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                          isActive
                            ? 'bg-white dark:bg-slate-700 shadow-lg border-2 border-red-400 p-5'
                            : 'bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 p-4'
                        }`}
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
                                  ? 'text-base text-gray-900 dark:text-gray-100 mb-3'
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
              <div className="space-y-32">
                {challenges.map((challenge, index) => {
                  const SolutionIcon = challenge.solutionIcon;

                  return (
                    <motion.div
                      key={challenge.id}
                      ref={sectionRefs[index]}
                      variants={itemVariants}
                      className="min-h-[85vh] flex items-center py-16"
                    >
                      {/* Solution Section Only */}
                      <div className="w-full">
                        <div className="text-center mb-12">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            VRIN Solution #{index + 1}
                          </span>
                          <h2 className="text-3xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mt-2 mb-8">
                            {challenge.solution}
                          </h2>
                        </div>

                        <div className="max-w-4xl mx-auto">
                          {/* Large Solution Card */}
                          <div className="p-12 md:p-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-3xl border border-blue-200 dark:border-blue-800 shadow-lg">
                            <div className="text-center mb-12">
                              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-8">
                                <SolutionIcon className="w-12 h-12 text-white" />
                              </div>

                              <h3 className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-gray-100 mb-6">
                                How {challenge.solution} Works
                              </h3>
                            </div>

                            <div className="text-center space-y-8">
                              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                                {challenge.solutionDetail}
                              </p>

                              {/* Solution Benefits */}
                              <div className="grid md:grid-cols-2 gap-6 mt-12">
                                <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
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

                                <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
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

                              <div className="pt-8">
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full text-sm font-medium">
                                  <CheckCircle className="w-5 h-5" />
                                  <span>Available Now in Production</span>
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