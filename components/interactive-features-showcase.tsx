'use client';

import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  Brain,
  Zap,
  Target,
  Database,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Network,
  Clock,
  TrendingUp,
  Users,
  Shield,
  Layers,
  BarChart3,
  Search,
  Cpu,
  Lock,
  Globe
} from 'lucide-react';

export function InteractiveFeaturesShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const coreFeatures = [
    {
      icon: Brain,
      title: "User-Defined AI Experts",
      subtitle: "Custom Domain Specialization",
      description: "Transform any LLM into a domain specialist with custom prompts, reasoning patterns, and knowledge focus areas tailored to your expertise.",
      benefits: ["No more generic responses", "Professional-grade insights", "Domain-specific reasoning"],
      color: "from-slate-600 to-slate-700",
      bgGradient: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
      accentColor: "text-slate-600 dark:text-slate-400"
    },
    {
      icon: Database,
      title: "Persistent Memory Architecture",
      subtitle: "Facts-First Intelligence",
      description: "Revolutionary storage system that extracts and preserves only essential facts and relationships, eliminating information loss while dramatically reducing costs.",
      benefits: ["Never starts from zero", "Massive storage reduction", "Perfect context retention"],
      color: "from-slate-600 to-slate-700",
      bgGradient: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
      accentColor: "text-slate-600 dark:text-slate-400"
    },
    {
      icon: Network,
      title: "Multi-Hop Reasoning Engine",
      subtitle: "Connect the Dots Intelligence",
      description: "Advanced reasoning system that connects insights across documents, conversations, and time periods to deliver sophisticated analysis.",
      benefits: ["Cross-document synthesis", "Temporal relationship mapping", "Complex inference chains"],
      color: "from-slate-600 to-slate-700",
      bgGradient: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
      accentColor: "text-slate-600 dark:text-slate-400"
    },
    {
      icon: Zap,
      title: "Lightning-Fast Retrieval",
      subtitle: "Intelligent Query Routing",
      description: "Hybrid system automatically detects query complexity and routes to optimal retrieval method - vector search for similarity, graph traversal for reasoning.",
      benefits: ["Smart routing decisions", "Sub-second response times", "Optimal retrieval method selection"],
      color: "from-slate-600 to-slate-700",
      bgGradient: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
      accentColor: "text-slate-600 dark:text-slate-400"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      subtitle: "Privacy-First Design",
      description: "Complete user isolation, data sovereignty controls, and enterprise security standards ensure your sensitive information stays protected.",
      benefits: ["Complete user isolation", "SOC2 Type II compliant", "Multi-cloud deployment"],
      color: "from-slate-600 to-slate-700",
      bgGradient: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
      accentColor: "text-slate-600 dark:text-slate-400"
    },
    {
      icon: Globe,
      title: "Seamless Integration",
      subtitle: "Drop-in Compatibility",
      description: "Simple APIs that work with any LLM provider, development framework, or existing tech stack. No complex migrations required.",
      benefits: ["5-minute setup", "Universal LLM support", "Zero migration complexity"],
      color: "from-slate-600 to-slate-700",
      bgGradient: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
      accentColor: "text-slate-600 dark:text-slate-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-green-200/40 to-cyan-200/40 dark:from-green-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container relative z-10">
        {/* Interactive Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16"
        >
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="relative group"
              >
                <motion.div
                  className="relative p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative z-10">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-medium mb-1 text-gray-900 dark:text-gray-100">
                          {feature.title}
                        </h3>
                        <p className={`text-sm font-medium ${feature.accentColor}`}>
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div
                          key={benefit}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}