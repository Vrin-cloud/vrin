'use client';

import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  ArrowRight,
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
      title: "Your Data Is Scattered Everywhere",
      problem: "Slack, Notion, Drive, Salesforce, Zendesk, Jira... Your team's knowledge is scattered across dozens of disconnected tools.",
      solution: "One Connected Knowledge Base",
      solutionHeadline: "All Your Apps. One AI That Understands Them.",
      solutionIcon: Network,
      visualType: "image"
    },
    {
      id: 'siloed-ai',
      title: "Search Isn't Reasoning",
      problem: "Most AI tools retrieve text snippets based on keyword matching. They find documents—but can't connect the dots. Complex questions that require tracing relationships across your data get fragments, not answers.",
      solution: "Multi-Hop Reasoning",
      solutionHeadline: "AI That Connects the Dots Across Everything",
      solutionIcon: Network,
      visualType: "image"
    },
    {
      id: 'diy-trap',
      title: "Building This In-House? Don't.",
      problem: "Custom RAG pipelines take 6-12 months, require ML expertise, and you'll still spend months building integrations. Your engineers should be shipping products, not infrastructure.",
      solution: "Ready Today, Not Next Year",
      solutionHeadline: "Skip the Science Project. Start Asking Questions.",
      solutionIcon: Zap,
      visualType: "code"
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
                <div className="space-y-4 p-6">
                  {challenges.map((challenge, index) => {
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

                        <div className="relative z-10 pl-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-sm font-medium uppercase tracking-widest ${
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
                              ? 'text-xl text-[#201E1E] dark:text-[#FFFDFD] mb-3'
                              : 'text-lg text-[#201E1E]/70 dark:text-[#FFFDFD]/70'
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
                                className="text-sm text-[#201E1E]/50 dark:text-[#FFFDFD]/50 line-clamp-2 mt-1"
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
                                <p className="text-base leading-relaxed text-[#201E1E]/70 dark:text-[#FFFDFD]/70">
                                  {challenge.problem}
                                </p>

                                <div className="mt-4 pt-4 border-t border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
                                  <div className="flex items-center gap-2 text-sm font-medium text-[#083C5E] dark:text-[#8DAA9D]">
                                    <ArrowRight className="w-4 h-4" />
                                    <span>See VRIN Solution</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                      {/* Solution Section - Minimal */}
                      <div className="w-full">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl md:text-4xl font-extralight text-[#201E1E] dark:text-[#FFFDFD] mb-2">
                            {challenge.solution}
                          </h2>
                          <h3 className="text-lg md:text-xl font-medium text-[#083C5E] dark:text-[#8DAA9D]">
                            {challenge.solutionHeadline}
                          </h3>
                        </div>

                        <div className="max-w-4xl mx-auto">
                          {/* Visual Element Only */}
                          {index === 0 ? (
                            /* Knowledge Graph Image for Problem 1 */
                            <div className="rounded-2xl overflow-hidden">
                              <img
                                src="/Vrin KG.png"
                                alt="VRIN Knowledge Graph - All your apps connected into one unified AI"
                                className="w-full h-auto rounded-2xl"
                              />
                            </div>
                          ) : challenge.visualType === 'code' ? (
                            /* Code Snippet for Problem 3 */
                            <div className="rounded-2xl overflow-hidden">
                              <div className="bg-[#1e1e1e] p-1 rounded-2xl">
                                <div className="flex items-center gap-2 px-4 py-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                  <span className="ml-2 text-xs text-gray-400">vrin_quickstart.py</span>
                                </div>
                                <pre className="p-4 text-sm overflow-x-auto">
                                  <code className="text-gray-300">
{`from vrin import VRINClient

# Initialize with your API key
client = VRINClient(api_key="vrin_...")

# Insert knowledge from your documents
client.insert(
    content="Q4 roadmap includes...",
    title="Product Roadmap 2025"
)

# Query with multi-hop reasoning
response = client.query("What's our Q4 roadmap?")
print(response["summary"])   # AI-generated answer
print(response["sources"])   # Source documents`}
                                  </code>
                                </pre>
                              </div>
                            </div>
                          ) : index === 1 ? (
                            /* Multi-Hop Workflow Video for Problem 2 */
                            <div className="rounded-2xl overflow-hidden">
                              <video
                                src="/videos/Vrin Multi-Hop Workflow.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto rounded-2xl"
                              />
                            </div>
                          ) : (
                            /* Fallback placeholder */
                            <div className="rounded-2xl border-2 border-dashed border-[#201E1E]/20 dark:border-[#FFFDFD]/20 p-12 text-center">
                              <p className="text-sm text-[#201E1E]/50 dark:text-[#FFFDFD]/50">
                                Visual placeholder
                              </p>
                            </div>
                          )}
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