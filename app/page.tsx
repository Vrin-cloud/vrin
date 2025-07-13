"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Shield, BarChart3, Clock, Database, Check } from "lucide-react"
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
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <MemoryNodes />
        
        {/* Floating Lottie Animation - Background */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-0 opacity-20 hidden xl:block">
          <div 
            dangerouslySetInnerHTML={{
              __html: `<dotlottie-wc src="https://lottie.host/8444d856-22df-42b4-a579-53816910606e/oxjTCqCzLp.lottie" style="width: 300px; height: 300px;" speed="0.8" autoplay loop></dotlottie-wc>`
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* <Badge variant="outline" className="relative mb-6 px-3 py-1 animate-fade-in overflow-hidden"> */}
            <Badge variant="outline" className="relative mb-6 px-3 py-1 animate-fade-in overflow-hidden">
              Introducing Vrin
              <BorderBeam duration={8} size={20} />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight">
              <span className="gradient-text block mb-2">Smart Memory</span>
              <span className="text-foreground">for Your AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-slide-up stagger-1 font-medium max-w-3xl mx-auto">
              The first hybrid RAG memory orchestration platform that maximizes performance
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 animate-slide-up stagger-2 max-w-2xl mx-auto">
              Give your AI applications persistent memory, semantic understanding, and intelligent context retrieval. 
              Our adaptive hybrid approach automatically optimizes for your specific query patterns to deliver superior results.
            </p>
            
            {/* Value Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 animate-slide-up stagger-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full">
                <div className="w-2 h-2 bg-red-600 dark:bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">90% storage reduction</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full">
                <div className="w-2 h-2 bg-green-600 dark:bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">450x faster retrieval</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full">
                <div className="w-2 h-2 bg-purple-600 dark:bg-purple-600 rounded-full animate-pulse"></div>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">+5.4pts multi-hop QA</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">Hybrid RAG architecture</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-4">
              <Button 
                size="lg" 
                className="gradient-bg text-white hover:opacity-90 w-full sm:w-auto"
                onClick={() => openContactForm("Schedule a Demo")}
              >
                Schedule a Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-transparent"
                onClick={() => openContactForm("Get Started Free")}
              >
                Get Started Free
              </Button>
            </div>

            {/* Lottie Animation - Mobile/Tablet */}
            <div className="mt-12 flex justify-center xl:hidden animate-fade-in">
              <div 
                dangerouslySetInnerHTML={{
                  __html: `<dotlottie-wc src="https://lottie.host/8444d856-22df-42b4-a579-53816910606e/oxjTCqCzLp.lottie" style="width: 280px; height: 280px;" speed="1" autoplay loop></dotlottie-wc>`
                }}
              />
            </div>
            
            {/* Concrete Examples */}
            <div className="mt-16 animate-slide-up stagger-5">
              <p className="text-sm text-muted-foreground mb-6">Your AI will understand and remember:</p>
              <div className="grid md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-4 border border-border/50">
                  <div className="text-sm gradient-text mb-2">Healthcare</div>
                  <div className="text-sm font-medium">"What medications has this patient tried for their chronic condition?"</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-4 border border-border/50">
                  <div className="text-sm gradient-text mb-2">Finance</div>
                  <div className="text-sm font-medium">"Show me this client's investment preferences from our previous meetings"</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-4 border border-border/50">
                  <div className="text-sm gradient-text mb-2">Legal</div>
                  <div className="text-sm font-medium">"What precedents have we discussed for similar contract disputes?"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold mb-6">The Problem</h2>
              <p className="text-lg text-muted-foreground mb-6">
                LLMs across all industries suffer from memory limitations, causing:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <span className="text-red-600 dark:text-red-400">✕</span>
                  </div>
                  <div>
                    <p className="font-medium">Context Amnesia</p>
                    <p className="text-muted-foreground">LLMs forget critical conversation history between sessions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <span className="text-red-600 dark:text-red-400">✕</span>
                  </div>
                  <div>
                    <p className="font-medium">Token Waste</p>
                    <p className="text-muted-foreground">15-20 minutes spent re-feeding context in each session</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <span className="text-red-600 dark:text-red-400">✕</span>
                  </div>
                  <div>
                    <p className="font-medium">Knowledge Gaps</p>
                    <p className="text-muted-foreground">
                      Missing critical domain-specific context and relationship data
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="animate-slide-in-right">
              <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Vrin provides a comprehensive memory orchestration platform:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Persistent Memory</p>
                    <p className="text-muted-foreground">Store and retrieve context across sessions for any domain</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Intelligent Retrieval</p>
                    <p className="text-muted-foreground">Reduce information gathering from 15 minutes to 2 seconds</p>
                  </div>
          </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Enterprise Security</p>
                    <p className="text-muted-foreground">Industry-grade security with complete audit logging</p>
                  </div>
          </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Showcase Section */}
      <section id="industries" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Proven Across Industries</h2>
            <p className="text-lg text-muted-foreground">
              Vrin's memory orchestration platform delivers value across diverse sectors, with specialized demos and case studies.
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
              Each industry has unique requirements. Our platform adapts to your domain's specific needs.
            </p>
            <Link href="/industries">
              <Button variant="outline" size="lg" className="bg-transparent">
                Explore Industry Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* See It In Action - Demo Video Section */}
      <section id="demo" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
            <p className="text-lg text-muted-foreground">
              Watch how Vrin transforms AI interactions with persistent memory in the <span className="gradient-text">Health Care</span> Industry.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border shadow-lg">
            <div className="aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
              {/* Video placeholder - you can replace this with your MP4 video */}
              <div>
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  // poster="/video-thumbnail.jpg" // optional thumbnail
                >
                  <source src="videos/Vrin HealthCare Demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional vs Vrin Comparison */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Traditional LLMs vs AI-Native Memory</h2>
            <p className="text-lg text-muted-foreground">
              See how Vrin transforms the fundamental approach to LLM memory and context management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Traditional Approach */}
            <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10">
              <CardContent className="pt-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Traditional LLMs</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                      <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
                    </div>
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Context Amnesia</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Forget everything between sessions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                      <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
                    </div>
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Manual Context Loading</p>
                      <p className="text-sm text-red-600 dark:text-red-400">15-20 minutes re-feeding context each time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                      <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
                    </div>
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Token Limits</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Constrained by context window size</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                      <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
                    </div>
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">No Relationship Understanding</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Cannot connect related information across time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vrin Approach */}
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10">
              <CardContent className="pt-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                    <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">Vrin AI-Native Memory</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Persistent Memory</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Remembers everything across all sessions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Instant Context Retrieval</p>
                      <p className="text-sm text-green-600 dark:text-green-400">2-second intelligent context loading</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Unlimited Scale</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Store millions of interactions and facts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Semantic Knowledge Graph</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Understands and connects related concepts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full border border-green-200 dark:border-green-800">
              <span className="text-green-700 dark:text-green-300 font-medium">
                🚀 15-20 minutes → 2 seconds
              </span>
              <span className="text-green-600 dark:text-green-400">
                That's a 450x improvement!
              </span>
            </div>
          </div>
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
              <h3 className="text-2xl font-bold mb-6">Vrin's Facts-First Architecture</h3>
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
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-border/50">
            <h3 className="text-xl font-bold mb-6 text-center">Vrin's Revolutionary Workflow</h3>
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
          </div>

          {/* Cost Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
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
          </div>
        </div>
      </section>

      {/* Hybrid RAG Architecture - Technical Differentiation */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              Technical Differentiation
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Hybrid RAG Architecture: Best of Both Worlds</h2>
            <p className="text-lg text-muted-foreground">
              While others stick to single approaches, Vrin intelligently combines vector search and graph traversal 
              to optimize performance for both single-hop and multi-hop queries. Our flexible architecture maximizes 
              results for every customer use case.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">Industry Performance Comparison</h3>
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-border/50">
                  <h4 className="text-lg font-semibold mb-4">Single-Hop Queries</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Traditional RAG</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-blue-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
                          <div className="w-16 h-full bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">68.18 F1</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Graph RAG</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden">
                          <div className="w-16 h-full bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">65.44 F1</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Vrin Hybrid</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-green-600">68.18+ F1</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-border/50">
                  <h4 className="text-lg font-semibold mb-4">Multi-Hop Queries</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Traditional RAG</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-blue-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
                          <div className="w-16 h-full bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">65.77 Acc</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Graph RAG</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">71.17 Acc</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Vrin Hybrid</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-green-600">71.17+ Acc</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Intelligent Query Routing</h3>
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Smart Detection</h4>
                      <p className="text-sm text-muted-foreground">AI classifies query complexity in real-time</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our system automatically detects whether a query requires simple fact retrieval or complex relationship reasoning,
                    routing it to the optimal retrieval method.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Dual Retrieval</h4>
                      <p className="text-sm text-muted-foreground">Vector search + Graph traversal combined</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For complex queries, we combine both approaches, letting the LLM leverage the strengths of each system
                    for maximum accuracy and context richness.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Continuous Learning</h4>
                      <p className="text-sm text-muted-foreground">Performance optimization over time</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our hybrid system learns from usage patterns to improve routing decisions and achieve even better 
                    performance for your specific domain and use cases.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-hop Query Focus */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-border/50">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Optimized for Multi-Hop Reasoning</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Healthcare, legal, and financial domains predominantly involve multi-hop queries requiring complex 
                relationship reasoning. Our hybrid approach delivers the performance advantages your industry needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                <div className="text-3xl font-bold gradient-text mb-2">+5.4pts</div>
                <div className="text-sm font-medium mb-1">Multi-hop QA Improvement</div>
                <div className="text-xs text-muted-foreground">Over traditional RAG systems</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg">
                <div className="text-3xl font-bold gradient-text mb-2">85%</div>
                <div className="text-sm font-medium mb-1">Industry Query Type</div>
                <div className="text-xs text-muted-foreground">Multi-hop reasoning required</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-lg">
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <div className="text-sm font-medium mb-1">Performance Loss</div>
                <div className="text-xs text-muted-foreground">On single-hop queries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Features for Vrin */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Vrin</h2>
            <p className="text-lg text-muted-foreground">
              Our platform provides everything you need to give your LLMs a reliable, secure memory system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Episodic Memory</h3>
                <p className="text-muted-foreground">
                  Store conversational episodes with vector embeddings optimized for domain-specific terminology and semantic
                  search.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Semantic Knowledge Graph</h3>
                <p className="text-muted-foreground">
                  Extract and store domain facts, relationships, and entities for complex industry-specific queries.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Intelligent Query Routing</h3>
                <p className="text-muted-foreground">
                  AI-powered system automatically detects query complexity and routes to optimal retrieval method—vector search for detail, graph traversal for multi-hop reasoning.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Enterprise-ready with end-to-end encryption, audit logging, and complete data isolation.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Intelligent Analytics</h3>
                <p className="text-muted-foreground">
                  Track memory usage, optimize retrieval, and gain insights into your AI's learning patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Automated Memory Management</h3>
                <p className="text-muted-foreground">
                  Smart consolidation and forgetting policies based on domain importance and usage patterns.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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

          {/* Integration Code Example */}
          <div className="max-w-4xl mx-auto">
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
          </div>
        </div>
      </section>

      {/* Technical Moat & Innovations */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Technical Moat</h2>
            <p className="text-lg text-muted-foreground">
              Patent-pending innovations that create defensible competitive advantages in LLM memory orchestration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Patent-Pending Innovations */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
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
            </Card>

            {/* Competitive Advantages */}
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
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
          </div>

          {/* Technical Architecture */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">System Architecture</h3>
            <p className="text-muted-foreground">Patent-pending architecture combines multiple memory systems for optimal recall</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <TechDiagram />
          </div>
          
          {/* Performance Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
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
      </section>

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

      {/* Final CTA Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Give Your AI a Memory?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join leading organizations across industries using Vrin to build more intelligent, context-aware AI applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gradient-bg text-white hover:opacity-90 w-full sm:w-auto"
                onClick={() => openContactForm("Get Started Free")}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-transparent"
                onClick={() => openContactForm("Schedule a Demo")}
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      
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
