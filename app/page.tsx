"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Shield, BarChart3, Clock, Database, Check, Target } from "lucide-react"
import { MemoryNodes } from "@/components/memory-nodes"
import { TrustedBy } from "@/components/trusted-by"
import { Header } from "@/components/header"
import { TechDiagram } from "@/components/tech-diagram"
import { Testimonials } from "@/components/testimonials"
import { UseCases } from "@/components/use-cases"
import { AnimatedBackground } from "@/components/animated-background"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { BorderBeam } from "@/components/magicui/border-beam"
import { HeroSection } from "@/components/hero-section"
import { TechnicalDifferentiation } from "@/components/technical-differentiation"
import { EnterpriseSocialProof } from "@/components/enterprise-social-proof"
import { VrinVsZepComparison } from "@/components/vrin-vs-zep-comparison"
import ProfessionalIntegrationSection from "@/components/professional-integration-section"
import Circular3DCarousel from "@/components/circular-3d-carousel"
import ModernSystemArchitecture from "@/components/modern-system-architecture"
import { DIYRAGCostComparison } from "@/components/diy-rag-cost-comparison"
import { PricingSection } from "@/components/pricing-section"

export default function Home() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactFormSubject, setContactFormSubject] = useState("")

  const openContactForm = (subject: string) => {
    setContactFormSubject(subject)
    setIsContactFormOpen(true)
  }
  return (
    <div className="flex flex-col">
      <AnimatedBackground />
      <Header />
      
            {/* Enhanced Hero Section */}
      <HeroSection />

      {/* Product Demo Video Section - Priority Placement */}
      <section id="product-demo" className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              Product Demonstration
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See VRIN in Action
            </h2>
            <p className="text-xl text-muted-foreground">
              Watch how VRIN transforms AI applications with persistent memory, user-defined specialization, and <span className="gradient-text font-semibold">expert-level reasoning</span>.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-800 dark:to-blue-950/30 p-2">
              <div className="aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden">
                <video 
                  controls 
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  <source src="/videos/Vrin Product Demo Compressed.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="flex flex-col items-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">User-Defined Experts</h3>
                <p className="text-sm text-muted-foreground">Transform any LLM into a domain specialist</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Persistent Memory</h3>
                <p className="text-sm text-muted-foreground">40-60% storage optimization without information loss</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">&lt;1.8s Fact Retrieval</h3>
                <p className="text-sm text-muted-foreground">Multi-hop reasoning for expert insights</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                <Link href="/auth">Try VRIN Now</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => openContactForm("Schedule a Live Demo")}
                className="px-8"
              >
                Schedule Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DIY RAG Cost Comparison */}
      <DIYRAGCostComparison openContactForm={openContactForm} />

      {/* Modern Problem & Solution Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              The Challenge & Our Innovation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Why Enterprise AI Falls Short
            </h2>
            <p className="text-xl text-muted-foreground">
              Traditional AI systems lose context and struggle with domain expertise. 
              VRIN&apos;s revolutionary architecture solves this with persistent memory and user-defined specialization.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Problem Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6">
                  Traditional AI Limitations
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">!</div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">No Domain Expertise</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generic responses lack specialized knowledge required for professional analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">!</div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Context Amnesia</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI forgets critical information between sessions, requiring manual context rebuilding</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">!</div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Inefficient Processing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hours wasted re-feeding context and waiting for superficial analysis</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Solution Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6">
                  VRIN&apos;s HybridRAG Solution
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">User-Defined AI Experts</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Transform any LLM into a domain specialist with custom prompts and reasoning focus</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Persistent Memory</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Facts-first architecture stores knowledge efficiently with 40-60% space reduction</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">&lt;1.8s Fact Retrieval Time</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Multi-hop reasoning delivers professional-grade insights in seconds, not hours</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Key Innovation Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-blue-600 text-white rounded-lg shadow-md">
              <Zap className="w-6 h-6" />
              <span className="font-medium text-lg">
                HybridRAG: User-defined specialization + Multi-hop reasoning + Persistent memory
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Circular Carousel Product Section */}
      <Circular3DCarousel />

      {/* Industry Showcase Section */}
      <section id="industries" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Proven Across Industries</h2>
            <p className="text-lg text-muted-foreground">
              Vrin&apos;s memory orchestration platform delivers value across diverse sectors, with specialized demos and case studies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Healthcare */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.75 12A7.25 7.25 0 0112 4.75 7.25 7.25 0 0119.25 12 7.25 7.25 0 0112 19.25 7.25 7.25 0 014.75 12zM12 8.75v6.5M8.75 12h6.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Healthcare</h3>
                <p className="text-muted-foreground mb-4">
                  Transform patient care with persistent memory for clinical conversations, treatment history, and care coordination.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">Live Demo Available</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Finance */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Finance</h3>
                <p className="text-muted-foreground mb-4">
                  Enhance financial AI with persistent memory for client relationships, transaction history, and regulatory compliance.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Legal */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Legal</h3>
                <p className="text-muted-foreground mb-4">
                  Revolutionize legal AI with memory for case histories, precedent tracking, and client communication context.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Each industry has unique requirements. Our platform adapts to your domain&apos;s specific needs.
            </p>
            <Link href="/industries">
              <Button variant="outline" size="lg" className="bg-transparent">
                Explore Industry Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Healthcare Industry Demo Section */}
      <section id="healthcare-demo" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Healthcare Industry Demo</h2>
            <p className="text-lg text-muted-foreground">
              Watch how VRIN transforms AI interactions with persistent memory in the <span className="gradient-text">Healthcare</span> Industry.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border shadow-lg">
            <div className="aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <div className="w-full h-full">
                <video 
                  controls 
                  className="w-full h-full object-contain rounded-lg"
                  preload="metadata"
                >
                  <source src="/videos/Vrin HealthCare Demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              See how VRIN enhances patient care with persistent clinical memory and specialized AI reasoning
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                asChild 
                className="bg-green-600 hover:bg-green-700"
              >
                <Link href="/auth">Try Healthcare Demo</Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => openContactForm("Healthcare Partnership")}
              >
                Healthcare Partnership
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Architecture Comparison */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              Next-Generation Architecture
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Beyond Traditional RAG Systems
            </h2>
            <p className="text-xl text-muted-foreground">
              VRIN&apos;s hybrid architecture combines the best of vector search and graph traversal, 
              enhanced with user-defined specialization for unmatched domain expertise.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Traditional RAG */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Card className="p-8 h-full border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Database className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Traditional RAG</h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Vector-only retrieval</li>
                  <li>• No domain specialization</li>
                  <li>• Limited context understanding</li>
                  <li>• 68.18 F1 performance</li>
                </ul>
              </Card>
            </motion.div>

            {/* Graph RAG */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <Card className="p-8 h-full border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-4">Graph RAG</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Graph-only traversal</li>
                  <li>• Better for multi-hop queries</li>
                  <li>• Still lacks specialization</li>
                  <li>• 71.17 Acc on complex tasks</li>
                </ul>
              </Card>
            </motion.div>

            {/* VRIN Hybrid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Card className="p-8 h-full border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600 text-white">Best</Badge>
                </div>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-medium text-blue-800 dark:text-blue-200 mb-4">VRIN Hybrid</h3>
                <ul className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Intelligent query routing</li>
                  <li>• User-defined AI experts</li>
                  <li>• Multi-hop reasoning</li>
                  <li>• 71.17+ Acc with specialization</li>
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Key Differentiators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl p-8 md:p-12"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">What Makes VRIN Revolutionary</h3>
              <p className="text-lg text-muted-foreground">
                Three breakthrough innovations that transform AI from generic to expert-level performance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2">Smart Query Routing</h4>
                <p className="text-sm text-muted-foreground">
                  AI automatically detects query complexity and routes to optimal retrieval method
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2">Domain Specialization</h4>
                <p className="text-sm text-muted-foreground">
                  Transform any LLM into a domain expert with custom prompts and reasoning focus
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2">Facts-First Storage</h4>
                <p className="text-sm text-muted-foreground">
                  Memory-efficient architecture stores only essential facts with 40-60% space reduction
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Performance Benchmark Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" data-benchmark-section>
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              Industry Benchmarks
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Proven Performance Leadership
            </h2>
            <p className="text-xl text-muted-foreground">
              Independent benchmark results demonstrate VRIN&apos;s superior performance across
              industry-standard tests for knowledge graph reasoning and information retrieval.
            </p>
          </div>

          {/* Modern Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Table Header */}
              <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Benchmark Performance Comparison</h3>
                <p className="text-sm text-muted-foreground mt-2">Evaluated on industry-standard datasets with reproducible methodologies</p>
              </div>

              {/* Knowledge Graph Reasoning Benchmark */}
              <div className="px-8 py-8 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">ComplexWebQuestions</h4>
                  <Badge variant="secondary" className="ml-auto">Knowledge Graph Reasoning</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                        <th className="pb-4 pr-8 font-medium text-sm text-slate-600 dark:text-slate-400">System</th>
                        <th className="pb-4 pr-8 font-medium text-sm text-slate-600 dark:text-slate-400">Accuracy</th>
                        <th className="pb-4 pr-8 font-medium text-sm text-slate-600 dark:text-slate-400">Performance</th>
                        <th className="pb-4 font-medium text-sm text-slate-600 dark:text-slate-400">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <span className="font-semibold text-slate-900 dark:text-white">VRIN HybridRAG</span>
                          </div>
                        </td>
                        <td className="py-4 pr-8">
                          <span className="text-2xl font-bold gradient-text">88%</span>
                        </td>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all" style={{ width: '88%' }}></div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">88/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">Best in Class</Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-slate-700 dark:text-slate-300">GraphRAG (Microsoft)</span>
                          </div>
                        </td>
                        <td className="py-4 pr-8">
                          <span className="text-lg text-slate-600 dark:text-slate-400">45%</span>
                        </td>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                              </div>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">45/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Graph-only approach</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-slate-700 dark:text-slate-300">Traditional RAG</span>
                          </div>
                        </td>
                        <td className="py-4 pr-8">
                          <span className="text-lg text-slate-600 dark:text-slate-400">35%</span>
                        </td>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '35%' }}></div>
                              </div>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">35/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Vector-only retrieval</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-slate-700 dark:text-slate-300">Base LLM (GPT-4)</span>
                          </div>
                        </td>
                        <td className="py-4 pr-8">
                          <span className="text-lg text-slate-600 dark:text-slate-400">30%</span>
                        </td>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                              </div>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">30/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">No retrieval system</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MS MARCO Passage Ranking Benchmark */}
              <div className="px-8 py-8">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">MS MARCO Passage Ranking</h4>
                  <Badge variant="secondary" className="ml-auto">Information Retrieval</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                        <th className="pb-4 pr-8 font-medium text-sm text-slate-600 dark:text-slate-400">System</th>
                        <th className="pb-4 pr-8 font-medium text-sm text-slate-600 dark:text-slate-400">MRR@10</th>
                        <th className="pb-4 pr-8 font-medium text-sm text-slate-600 dark:text-slate-400">Performance</th>
                        <th className="pb-4 font-medium text-sm text-slate-600 dark:text-slate-400">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <span className="font-semibold text-slate-900 dark:text-white">VRIN HybridRAG</span>
                          </div>
                        </td>
                        <td className="py-4 pr-8">
                          <span className="text-2xl font-bold gradient-text">100%</span>
                        </td>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">100/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">Perfect Score</Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-slate-700 dark:text-slate-300">ColBERT v2</span>
                          </div>
                        </td>
                        <td className="py-4 pr-8">
                          <span className="text-lg text-slate-600 dark:text-slate-400">40%</span>
                        </td>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                              </div>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">40/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Dense retriever</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-slate-700 dark:text-slate-300">DPR (Facebook)</span>
                          </div>
                        </td>
                        <td className="py-4 pr-8">
                          <span className="text-lg text-slate-600 dark:text-slate-400">35%</span>
                        </td>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '35%' }}></div>
                              </div>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">35/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Dense passage retrieval</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-slate-700 dark:text-slate-300">BM25 Baseline</span>
                          </div>
                        </td>
                        <td className="py-4 pr-8">
                          <span className="text-lg text-slate-600 dark:text-slate-400">19%</span>
                        </td>
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '19%' }}></div>
                              </div>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">19/100</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Traditional search</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Footer */}
              <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    * Results from standardized benchmarks with reproducible methodologies
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Independently verifiable</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Memory Optimization Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              Revolutionary Architecture
            </Badge>
            <h2 className="text-3xl font-bold mb-4">The Future of LLM Memory: Facts-First Architecture</h2>
            <p className="text-lg text-muted-foreground">
              While others store entire episodes, we extract and store only the intelligence that matters. This breakthrough creates unprecedented cost savings and performance gains.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">Traditional Approach: Brute Force Storage</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Store Full Episodes</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Complete patient conversations, legal documents, financial records</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Massive Storage Costs</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Exponential scaling of storage and retrieval costs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Slow Context Parsing</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Minutes wasted searching through irrelevant information</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Vrin&apos;s Facts-First Architecture</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Extract Key Facts & Relationships</p>
                    <p className="text-sm text-green-600 dark:text-green-400">AI automatically identifies and stores only critical information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">90% Storage Reduction</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Memory-efficient vector storage with zero information loss</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Dynamic Knowledge Graphs</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Built on-demand from stored facts for perfect context</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Diagram */}
          {/* <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-border/50">
            <h3 className="text-xl font-bold mb-6 text-center">Vrin&apos;s Revolutionary Workflow</h3>
            <div className="grid md:grid-cols-6 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <p className="text-sm font-medium">Episode Recorded</p>
                <p className="text-xs text-muted-foreground">Doctor-patient conversation</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                </div>
                <p className="text-sm font-medium">API Called</p>
                <p className="text-xs text-muted-foreground">Vrin processes episode</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">3</span>
                </div>
                <p className="text-sm font-medium">Extract Facts</p>
                <p className="text-xs text-muted-foreground">AI identifies key relationships</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-2">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">4</span>
                </div>
                <p className="text-sm font-medium">Vector Storage</p>
                <p className="text-xs text-muted-foreground">Memory-efficient facts storage</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center mb-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">5</span>
                </div>
                <p className="text-sm font-medium">Knowledge Graph</p>
                <p className="text-xs text-muted-foreground">Dynamic context creation</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mb-2">
                  <span className="text-pink-600 dark:text-pink-400 font-bold">6</span>
                </div>
                <p className="text-sm font-medium">LLM Summary</p>
                <p className="text-xs text-muted-foreground">RL-optimized insights</p>
              </div>
            </div>
          </div> */}

          {/* Cost Comparison */}
          {/* <div className="grid md:grid-cols-2 gap-8 mt-16">
            <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">Traditional Storage Costs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">1M patient episodes</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">$50,000/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average retrieval time</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">15 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage scaling</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Exponential</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">Vrin Facts-First Costs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">1M patient episodes</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">$5,000/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average retrieval time</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">2 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage scaling</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Linear</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </section>

      {/* Modern System Architecture Section */}
      <ModernSystemArchitecture />

      {/* Integration Showcase */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
            <p className="text-lg text-muted-foreground">
              Drop Vrin into your existing stack with simple APIs. No complex setup or migration required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* LLM Providers */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">LLM Providers</h3>
                <p className="text-sm text-muted-foreground mb-3">OpenAI, Anthropic, Cohere, Google AI</p>
                <Badge variant="outline" className="text-xs">5-min setup</Badge>
              </CardContent>
            </Card>

            {/* Development Frameworks */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Frameworks</h3>
                <p className="text-sm text-muted-foreground mb-3">LangChain, LlamaIndex, AutoGPT</p>
                <Badge variant="outline" className="text-xs">Plugin ready</Badge>
              </CardContent>
            </Card>

            {/* Cloud Platforms */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Cloud</h3>
                <p className="text-sm text-muted-foreground mb-3">AWS, Azure, GCP, Vercel</p>
                <Badge variant="outline" className="text-xs">Auto-scale</Badge>
              </CardContent>
            </Card>

            {/* Business Systems */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground mb-3">Salesforce, SAP, ServiceNow</p>
                <Badge variant="outline" className="text-xs">SOC2 ready</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Professional Integration Section */}
          <ProfessionalIntegrationSection />


          {/* Integration Code Example */}
          {/* <div className="max-w-4xl mx-auto">
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Get Started in Minutes</h3>
                  <p className="text-muted-foreground">Simple REST API or SDK integration</p>
                </div>
                
                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-6 text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="ml-2 text-slate-400 text-sm">vrin-integration.py</span>
                  </div>
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`import vrin
from openai import OpenAI

# Initialize Vrin Memory Orchestrator
vrin_client = vrin.Client(api_key="your-api-key")

# Doctor records new patient episode
episode_data = {
  "patient_id": "patient_789",
  "conversation": "Patient reports worsening chest pain, family history of heart disease...",
  "timestamp": "2024-01-15T14:30:00Z",
  "provider": "Dr. Smith"
}

# 1. Doctor hits submit -> Vrin API called
response = vrin_client.episodes.create(
  data=episode_data,
  extract_facts=True,
  build_relationships=True
)

# 2. Vrin extracts facts & causal relationships (memory-efficient)
extracted_facts = response.facts
# Example: ["Patient: chest pain worsening", "Family history: heart disease", 
#          "Relationship: genetic_risk_factor"]

# 3. Store only essential facts in vector DB (90% storage reduction)
vrin_client.memory.store_facts(
  patient_id="patient_789",
  facts=extracted_facts,
  compress=True  # Memory-efficient storage
)

# 4. Later: Doctor needs patient info
query = "Show me this patient's cardiac risk factors and recent symptoms"

# 5. Retrieve relevant facts based on search query
relevant_facts = vrin_client.memory.search(
  patient_id="patient_789",
  query=query,
  max_results=20
)

# 6. Create knowledge graph from retrieved facts
knowledge_graph = vrin_client.graph.build(
  facts=relevant_facts,
  include_relationships=True
)

# 7. LLM summarizes with RL optimization & bandit prompt selection
summary = vrin_client.insights.generate(
  knowledge_graph=knowledge_graph,
  query=query,
  format="clinical_summary",
  optimize_prompt=True,  # RL-driven prompt selection
  bandit_optimization=True  # Continuous learning
)

print(summary.content)
# Output: "Patient has elevated cardiac risk: family history of CAD, 
# current chest pain symptoms increasing in frequency..."
`}
                  </pre>
                </div>
                
                <div className="text-center mt-6">
                  <Link href="/docs">
                    <Button variant="outline" className="bg-transparent">
                      View Full Documentation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </section>

      {/* Vrin vs Zep Comparison */}
      {/* <VrinVsZepComparison /> */}

      {/* Technical Differentiation */}
      {/* <TechnicalDifferentiation /> */}

      

      {/* Enterprise Social Proof */}
      {/* <EnterpriseSocialProof /> */}

      {/* Technical Moat & Innovations */}
      {/* <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Technical Moat</h2>
            <p className="text-lg text-muted-foreground">
              Patent-pending innovations that create defensible competitive advantages in LLM memory orchestration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16"> */}
            {/* Patent-Pending Innovations */}
            {/* <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Patent-Pending Innovations</h3>
                    <Badge variant="secondary" className="mt-1">3 Patents Filed</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Hybrid Memory Consolidation Algorithm</h4>
                    <p className="text-sm text-muted-foreground">Novel approach combining vector embeddings, LLM-based fact extraction, and reinforcement learning for optimal memory compression without information loss.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Causal-Graph Embedding Fusion (GraphRAG+)</h4>
                    <p className="text-sm text-muted-foreground">Proprietary method for jointly using graph relationships and vector similarity with temporal decay factors for superior retrieval accuracy.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Self-Optimizing Prompt Bandit System</h4>
                    <p className="text-sm text-muted-foreground">Thompson Sampling for healthcare-specific prompt optimization with multi-objective rewards (accuracy, speed, user satisfaction).</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Temporal-Semantic Forgetting Policy</h4>
                    <p className="text-sm text-muted-foreground">Intelligent memory lifecycle management using clinical importance and usage patterns for regulatory compliance.</p>
                  </div>
                </div>
              </CardContent>
            </Card>  */}

            {/* Competitive Advantages */}
            {/* <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Defensible Advantages</h3>
                    <Badge variant="secondary" className="mt-1">First-Mover</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Network Effects</h4>
                    <p className="text-sm text-muted-foreground">Each customer's usage improves our algorithms for all users (with privacy isolation). More data = better performance = more customers.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Technical Complexity Barrier</h4>
                    <p className="text-sm text-muted-foreground">Competitors need to build: vector DB + graph DB + LLM integration + optimization algorithms + compliance framework. Estimated 18-24 months to replicate.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Domain Expertise</h4>
                    <p className="text-sm text-muted-foreground">Deep understanding of healthcare workflows, regulatory requirements, and medical ontologies creates switching costs.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Integration Lock-in</h4>
                    <p className="text-sm text-muted-foreground">Once integrated into critical AI workflows, switching costs become prohibitive due to data migration and retraining requirements.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* Technical Architecture */}
          {/* <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">System Architecture</h3>
            <p className="text-muted-foreground">Patent-pending architecture combines multiple memory systems for optimal recall</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <TechDiagram />
          </div> */}
          
          {/* Performance Metrics */}
          {/* <div className="grid md:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">98%+</div>
              <div className="text-sm text-muted-foreground">Clinical Relevance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">&lt;500ms</div>
              <div className="text-sm text-muted-foreground">Query Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">10M+</div>
              <div className="text-sm text-muted-foreground">Episodes Stored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Use Cases Section
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Industry Applications</h2>
            <p className="text-lg text-muted-foreground">
              See how different industries leverage Vrin for enhanced AI capabilities.
            </p>
          </div>

          <UseCases />
        </div>
      </section> */}

      {/* Testimonials Section
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Healthcare Innovators</h2>
            <p className="text-lg text-muted-foreground">See what our customers are saying about Vrin.</p>
          </div>

          <Testimonials />
        </div>
      </section> */}

      {/* Pricing Section */}
      <PricingSection openContactForm={openContactForm} />
      
      <Footer />
      
      {/* Contact Form Popup */}
      <ContactForm 
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        defaultSubject={contactFormSubject}
      />
    </div>
  )
}
