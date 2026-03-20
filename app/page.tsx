"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { AnimatedBackground } from "@/components/animated-background"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { HeroSection } from "@/components/hero-section"
import { PricingSection } from "@/components/pricing-section"
import { StickyNavChallengeSection } from "@/components/sticky-nav-challenge-section"
import { CoreFeatures } from "@/components/core-features"
import { AnnouncementBar } from "@/components/announcement-bar"
import { HowVrinWorks } from "@/components/how-vrin-works"

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
      <AnnouncementBar
        badge="New"
        message="See how Vrin resolves complex support tickets faster"
        linkText="Watch the Demo"
        linkHref="/industries/customer-support#demo"
      />
      <Header />
      
            {/* Enhanced Hero Section */}
      <HeroSection />

      {/* AI Memory Gap Problem Statement */}
      <StickyNavChallengeSection />

      {/* How Vrin Works — 3-step workflow with SVG diagram */}
      <HowVrinWorks />

      {/* Core Features Section */}
      <CoreFeatures />

      {/* System Architecture */}
      <section className="py-24 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#8DAA9D]/10 dark:bg-[#8DAA9D]/20 border-[#8DAA9D]/30 text-[#083C5E] dark:text-[#8DAA9D]">
              System Architecture
            </Badge>
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-[#201E1E] dark:text-[#FFFFFF]">
              How Vrin Learns & Reasons
            </h2>
            <p className="text-base text-[#201E1E]/60 dark:text-[#FFFFFF]/60 font-normal max-w-3xl mx-auto">
              Two pipelines, one unified knowledge engine. Documents are structured into an enterprise knowledge graph,
              then queries are reasoned over — not just searched.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Image
              src="/Vrin-architecture.png"
              alt="Vrin system architecture — knowledge ingestion pipeline and query reasoning pipeline with hybrid structured knowledge stores"
              width={2400}
              height={1600}
              className="w-full h-auto rounded-2xl"
              priority
            />
          </div>

        </div>
      </section>


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
