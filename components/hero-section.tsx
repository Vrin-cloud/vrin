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
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Sophisticated Background - Warm cream with subtle texture */}
      <div className="absolute inset-0 bg-vrin-cream dark:bg-vrin-charcoal" />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-vrin-charcoal dark:text-vrin-cream"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Elegant gradient overlay with sage accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#8DAA9D]/5 dark:to-[#083C5E]/10" />

      <div className="container relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Badge - Sophisticated minimal style with blue accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 border-[#083C5E]/20 dark:border-[#8DAA9D]/20 text-vrin-blue dark:text-vrin-sage">
              Now Available
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
              {/* Main Headline with Rotating Text - Elegant Typography */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.1] tracking-tight">
                  <span className="text-vrin-charcoal dark:text-vrin-cream">AI Deep Reasoning</span>
                  <br />
                  <span className="text-vrin-charcoal dark:text-vrin-cream">for </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentTextIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="font-medium text-vrin-blue dark:text-vrin-sage inline-block"
                    >
                      {rotatingTexts[currentTextIndex]}
                    </motion.span>
                  </AnimatePresence>
                </h1>

                {/* Subheadline - Refined typography */}
                <p className="text-lg md:text-xl text-vrin-charcoal/60 dark:text-vrin-cream/60 font-light mt-6 max-w-xl">
                  HybridRAG retrieval with multi-hop reasoning and per-claim citations
                </p>
              </div>

              {/* CTA Buttons - Custom VRIN styling */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  size="lg"
                  className="bg-vrin-charcoal hover:bg-vrin-blue text-vrin-cream dark:bg-vrin-cream dark:text-vrin-charcoal dark:hover:bg-vrin-sage px-8 py-6 text-base font-medium rounded-full transition-all duration-300 shadow-lg shadow-vrin-charcoal/10 hover:shadow-xl hover:shadow-vrin-blue/20"
                  onClick={() => window.location.href = '/auth'}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-medium border-2 border-vrin-charcoal/20 dark:border-vrin-cream/20 text-vrin-charcoal dark:text-vrin-cream hover:bg-vrin-sage/10 dark:hover:bg-vrin-blue/10 rounded-full transition-all duration-300"
                  onClick={() => window.open("https://calendly.com/vedant-vrin/15-minute-meeting", "_blank")}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Demo
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

          {/* Social Proof - Elegant minimal styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16 pt-12 border-t border-vrin-charcoal/10 dark:border-vrin-cream/10"
          >
            <p className="text-xs text-vrin-charcoal/50 dark:text-vrin-cream/50 uppercase tracking-widest mb-6">Trusted by developers at</p>
            <div className="flex items-center justify-center space-x-8">
              {/* UC Davis Logo */}
              <div className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-500">
                <img
                  src="/UC Davis logo.png"
                  alt="UC Davis"
                  className="h-10 w-auto filter grayscale"
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
