'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Calendar
} from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { ContactForm } from '@/components/contact-form';
import Spline from '@splinetool/react-spline';


export function HeroSection() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [contactFormSubject, setContactFormSubject] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const rotatingTexts = [
    "your Data",
    "your Product",
    "your Team",
    "Sales",
    "Engineering",
    "Finance",
    "Support",
    "Marketing",
    "Operations",
    "Legal",
    "HR",
    "Customer Success",
    "Analytics",
    "Security",
    "Research"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const openContactForm = (subject: string) => {
    setContactFormSubject(subject);
    setIsContactFormOpen(true);
  };

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
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
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="outline" className="relative px-4 py-2 text-sm font-medium overflow-hidden">
              <span className="relative z-10">Now Available</span>
              <BorderBeam duration={8} size={20} />
            </Badge>
          </motion.div>

          {/* Two Column Layout: Text Left, Spline Right */}
          <div className="grid lg:grid-cols-[60%_40%] gap-8 items-center">
            {/* Left Column: Headline, Subheadline, CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main Headline with Rotating Text */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
                  <span className="text-gray-900 dark:text-gray-100">AI Deep Search <br />for</span>
                  <br />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentTextIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="gradient-text inline-block pt-2 pb-2"
                    >
                      {rotatingTexts[currentTextIndex]}
                    </motion.span>
                  </AnimatePresence>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light mt-4">
                  HybridRAG retrieval with multi-hop reasoning and citations
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium"
                  onClick={() => window.location.href = '/auth'}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 py-3 text-base font-medium border border-gray-300 dark:border-gray-600"
                  onClick={() => openContactForm("Schedule a Demo")}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule a Demo
                </Button>
              </div>
            </motion.div>

            {/* Right Column: Spline 3D Element - Hidden on mobile/tablet */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:flex w-full h-[450px] items-center justify-center"
            >
              <Spline scene="https://prod.spline.design/13Kb3u5Y1XKm3Mrz/scene.splinecode" />
            </motion.div>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Trusted by Developers at</p>
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
