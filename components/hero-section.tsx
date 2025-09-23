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
                <span className="relative z-10">Now Available – AI Memory & Context OS for Every Team</span>
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
              The first AI memory platform that solves what vector-only RAG can&apos;t:
              <span className="font-medium text-gray-900 dark:text-gray-100"> persistent context</span>,
              <span className="font-medium text-gray-900 dark:text-gray-100"> multi-hop reasoning</span>, and
              <span className="text-blue-600 dark:text-blue-400"> true domain expertise</span>. Transform any team&apos;s AI from generic responses to professional-grade insights.
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