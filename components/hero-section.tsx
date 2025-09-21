'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Rocket,
  Calendar
} from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { useState } from 'react';
import { ContactForm } from '@/components/contact-form';

export function HeroSection() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [contactFormSubject, setContactFormSubject] = useState("");

  const openContactForm = (subject: string) => {
    setContactFormSubject(subject);
    setIsContactFormOpen(true);
  };

  const competitiveAdvantages = [
    {
      icon: Zap,
      title: "450x Faster Retrieval",
      description: "vs. traditional RAG systems",
      color: "text-orange-600"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "User isolation and data privacy",
      color: "text-green-600"
    },
    {
      icon: Brain,
      title: "Hybrid RAG Architecture",
      description: "Best of both worlds",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "+5.4pts Multi-hop QA",
      description: "Superior reasoning capabilities",
      color: "text-blue-600"
    }
  ];

  const comparisonMetrics = [
    { metric: "Fact Retrieval Speed", vrin: "< 1.8s", competitor: "5-30s", unit: "" },
    { metric: "Storage Efficiency", vrin: "40-60%", competitor: "0%", unit: "reduction" },
    { metric: "Expert Validation", vrin: "8.5/10", competitor: "6.2/10", unit: "score" },
    { metric: "Multi-hop Reasoning", vrin: "+5.4pts", competitor: "Baseline", unit: "" }
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
                className="text-slate-300 dark:text-slate-600"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Badge variant="outline" className="relative px-4 py-2 text-sm font-medium overflow-hidden">
                <span className="relative z-10">Now Available</span>
                <BorderBeam duration={8} size={20} />
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight"
            >
              <span className="gradient-text block mb-2">HybridRAG Memory</span>
              <span className="text-gray-900 dark:text-gray-100">Operating System</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Enterprise context orchestration layer for AI agents. HybridRAG architecture delivers 
              <span className="font-medium text-gray-900 dark:text-gray-100"> Evidence-backed answers</span> with 
              <span className="font-medium text-gray-900 dark:text-gray-100"> user-defined specialization</span> and 
              <span className="text-blue-600 dark:text-blue-400"> fast fact retrieval</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium"
                onClick={() => window.location.href = '/auth'}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg font-medium border border-gray-300 dark:border-gray-600"
                onClick={() => openContactForm("Schedule a Demo")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>99.9% uptime SLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span>Production ready</span>
              </div>
            </motion.div> */}
          </div>

          {/* Competitive Advantages Grid
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {competitiveAdvantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`p-3 rounded-lg bg-gray-50 w-fit mb-4`}>
                    <Icon className={`h-6 w-6 ${advantage.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {advantage.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div> */}

          {/* Performance Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl p-8 mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Performance That Speaks for Itself
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Independent benchmarks show Vrin consistently outperforms competitors in every critical metric
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comparisonMetrics.map((metric, index) => (
                <motion.div
                  key={metric.metric}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                      {metric.metric}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {metric.vrin}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {metric.unit}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        vs {metric.competitor}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* <div className="text-center mt-8">
              <Button variant="outline" className="text-sm">
                View Full Benchmark Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div> */}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by Developers at</p>
            <div className="flex items-center justify-center space-x-8">
              {/* UC Davis Logo */}
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img 
                  src="/UC Davis logo.png"
                  alt="UC Davis"
                  className="h-12 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Contact Form Modal */}
      <ContactForm 
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        defaultSubject={contactFormSubject}
      />
    </section>
  );
} 