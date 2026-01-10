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
      id: 'data-silos',
      icon: Database,
      title: "Your Data Lives in 30+ Apps",
      problem: "Slack, Notion, Drive, Salesforce, Zendesk, Jira... Your team's knowledge is scattered across dozens of disconnected tools.",
      solution: "One Connected Knowledge Base",
      solutionHeadline: "All Your Apps. One AI That Understands Them.",
      solutionDetail: "VRIN connects to your entire SaaS stack and builds a unified knowledge graph. Ask questions that span Slack conversations, Notion docs, and Salesforce records—get answers that connect all the dots.",
      solutionIcon: Network,
      visualType: "image", // User will create in Figma
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 'siloed-ai',
      icon: Target,
      title: "AI Can't See Across Your Stack",
      problem: "Current AI tools work in silos. They can search Slack OR Notion—never both. Complex questions that span multiple systems get no answer.",
      solution: "Multi-Source Reasoning",
      solutionHeadline: "AI That Reasons Across Everything",
      solutionDetail: "Ask 'What did our team decide about the Q4 roadmap?' and VRIN traces the answer across your Slack discussions, Notion planning docs, and Jira tickets—giving you one comprehensive answer with sources.",
      solutionIcon: Network,
      visualType: "image", // User will create in Figma/DaVinci
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 'diy-trap',
      icon: DollarSign,
      title: "Building This In-House? Don't.",
      problem: "Custom RAG pipelines take 6-12 months, require ML expertise, and you'll still spend months building integrations. Your engineers should be shipping products, not infrastructure.",
      solution: "Ready Today, Not Next Year",
      solutionHeadline: "Skip the Science Project. Start Asking Questions.",
      solutionDetail: "Pre-built connectors for 50+ SaaS apps. Production-grade RAG that actually works. Connect your tools in minutes, deploy in your cloud (AWS, Azure, GCP), and let your team focus on what matters.",
      solutionIcon: Zap,
      visualType: "code", // Code snippet
      color: "from-green-500 to-emerald-500"
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
            Why Traditional AI Fails Your Team
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light leading-relaxed"
          >
            Your company data lives in dozens of disconnected apps.
            <span className="font-medium text-[#201E1E] dark:text-[#FFFDFD]"> No AI can see across all of them</span>—until now.
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
                                    <p className="text-sm leading-relaxed text-[#201E1E]/70 dark:text-[#FFFDFD]/70">
                                      {challenge.problem}
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
                          <h2 className="text-2xl md:text-4xl font-extralight text-[#201E1E] dark:text-[#FFFDFD] mt-3 mb-2">
                            {challenge.solution}
                          </h2>
                          <h3 className="text-lg md:text-xl font-medium text-[#083C5E] dark:text-[#8DAA9D]">
                            {challenge.solutionHeadline}
                          </h3>
                        </div>

                        <div className="max-w-4xl mx-auto">
                          {/* Large Solution Card */}
                          <div className="p-8 md:p-12 bg-[#083C5E]/5 dark:bg-[#083C5E]/20 rounded-3xl border border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
                            {/* Text description - hide for Problem 1 since image speaks for itself */}
                            {index !== 0 && (
                              <div className="text-center mb-8">
                                <p className="text-base md:text-lg text-[#201E1E]/70 dark:text-[#FFFDFD]/70 font-light leading-relaxed">
                                  {challenge.solutionDetail}
                                </p>
                              </div>
                            )}

                            {/* Visual Element */}
                            {index === 0 ? (
                              /* Knowledge Graph Image for Problem 1 */
                              <div className="mb-8 rounded-2xl overflow-hidden">
                                <img
                                  src="/Vrin KG.png"
                                  alt="VRIN Knowledge Graph - All your apps connected into one unified AI"
                                  className="w-full h-auto rounded-2xl"
                                />
                              </div>
                            ) : challenge.visualType === 'code' ? (
                              /* Code Snippet for Problem 3 */
                              <div className="mb-8 rounded-2xl overflow-hidden">
                                <div className="bg-[#1e1e1e] p-1">
                                  <div className="flex items-center gap-2 px-4 py-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                    <span className="ml-2 text-xs text-gray-400">vrin_quickstart.py</span>
                                  </div>
                                  <pre className="p-4 text-sm overflow-x-auto">
                                    <code className="text-gray-300">
{`import vrin

# Connect your apps in minutes
vrin.connect("notion", api_key="...")
vrin.connect("slack", api_key="...")
vrin.connect("salesforce", api_key="...")

# Ask questions across everything
answer = vrin.query("What's our Q4 roadmap?")
print(answer.text)     # The answer
print(answer.sources)  # Where it came from`}
                                    </code>
                                  </pre>
                                </div>
                              </div>
                            ) : (
                              /* Image Placeholder for Problem 2 */
                              <div className="mb-8 rounded-2xl border-2 border-dashed border-[#201E1E]/20 dark:border-[#FFFDFD]/20 bg-[#201E1E]/5 dark:bg-[#FFFDFD]/5 p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 flex items-center justify-center">
                                  <SolutionIcon className="w-8 h-8 text-[#083C5E]/50 dark:text-[#8DAA9D]/50" />
                                </div>
                                <p className="text-sm text-[#201E1E]/50 dark:text-[#FFFDFD]/50">
                                  Visual: Query tracing through multiple data sources
                                </p>
                                <p className="text-xs text-[#201E1E]/30 dark:text-[#FFFDFD]/30 mt-2">
                                  (Image to be added)
                                </p>
                              </div>
                            )}

                            {/* Solution Benefits */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="p-6 rounded-2xl bg-[#FFFDFD] dark:bg-[#201E1E] border border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#8DAA9D]/20 dark:bg-[#8DAA9D]/30 flex items-center justify-center">
                                  <CheckCircle className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D]" />
                                </div>
                                <h4 className="font-medium text-[#201E1E] dark:text-[#FFFDFD] mb-2">
                                  {index === 0 ? "50+ Connectors" : index === 1 ? "Cross-App Answers" : "Deploy Anywhere"}
                                </h4>
                                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light">
                                  {index === 0 ? "Slack, Notion, Salesforce, Zendesk, and more" :
                                   index === 1 ? "One answer that cites multiple sources" :
                                   "AWS, Azure, GCP, or our cloud"}
                                </p>
                              </div>

                              <div className="p-6 rounded-2xl bg-[#FFFDFD] dark:bg-[#201E1E] border border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#8DAA9D]/20 dark:bg-[#8DAA9D]/30 flex items-center justify-center">
                                  <Zap className="w-6 h-6 text-[#083C5E] dark:text-[#8DAA9D]" />
                                </div>
                                <h4 className="font-medium text-[#201E1E] dark:text-[#FFFDFD] mb-2">
                                  {index === 0 ? "Zero Data Migration" : index === 1 ? "Trace Every Fact" : "Simple REST APIs"}
                                </h4>
                                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light">
                                  {index === 0 ? "Connect without moving your data" :
                                   index === 1 ? "Full source attribution for every answer" :
                                   "Integrate in hours, not months"}
                                </p>
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