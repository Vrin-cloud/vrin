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
import { EnterpriseSocialProof } from "@/components/enterprise-social-proof"
import { VrinVsZepComparison } from "@/components/vrin-vs-zep-comparison"
import ProfessionalIntegrationSection from "@/components/professional-integration-section"
import Circular3DCarousel from "@/components/circular-3d-carousel"
import { PricingSection } from "@/components/pricing-section"
import ModernSystemArchitecture from "@/components/modern-system-architecture"
import { StickyNavChallengeSection } from "@/components/sticky-nav-challenge-section"
// import { InteractiveFeaturesShowcase } from "@/components/interactive-features-showcase"

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

      {/* AI Memory Gap Problem Statement */}
      <StickyNavChallengeSection />

      {/* Product Demo Video Section - Priority Placement */}
      <section id="product-demo" className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              Product Demonstration
            </Badge>
            <h2 className="text-4xl md:text-5xl font-light mb-6">
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

      {/* Features Showcase */}
      {/* <InteractiveFeaturesShowcase /> */}



      {/* 3D Circular Carousel Product Section */}
      <Circular3DCarousel />

      {/* Industry Showcase Section */}
      <section id="industries" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-light mb-4">Proven Across Industries</h2>
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
                <h3 className="text-xl font-medium mb-2">Healthcare</h3>
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
                <h3 className="text-xl font-medium mb-2">Finance</h3>
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
                <h3 className="text-xl font-medium mb-2">Legal</h3>
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
            <h2 className="text-3xl font-light mb-4">Healthcare Industry Demo</h2>
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
            <h2 className="text-4xl md:text-5xl font-light mb-6">
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
                <h3 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4">Traditional RAG</h3>
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
                <h3 className="text-xl font-light text-slate-800 dark:text-slate-200 mb-4">Graph RAG</h3>
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
                <h3 className="text-xl font-light text-blue-800 dark:text-blue-200 mb-4">VRIN Hybrid</h3>
                <ul className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Intelligent query routing</li>
                  <li>• User-defined AI experts</li>
                  <li>• Multi-hop reasoning</li>
                  <li>• 71.17+ Acc with specialization</li>
                </ul>
              </Card>
            </motion.div>
          </div>

        </div>
      </section>







      {/* Modern System Architecture Section */}
      <ModernSystemArchitecture />

      {/* Integration Showcase */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-light mb-4">Seamless Integration</h2>
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
                <h3 className="font-medium mb-2">LLM Providers</h3>
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
                <h3 className="font-medium mb-2">Frameworks</h3>
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
                <h3 className="font-medium mb-2">Cloud</h3>
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
                <h3 className="font-medium mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground mb-3">Salesforce, SAP, ServiceNow</p>
                <Badge variant="outline" className="text-xs">SOC2 ready</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Professional Integration Section */}
          {/* <ProfessionalIntegrationSection /> */}


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
