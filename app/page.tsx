"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ContactForm } from "@/components/contact-form"
import { AnnouncementV2 } from "@/components/landing-v2/announcement-v2"
import { HeroV2 } from "@/components/landing-v2/hero-v2"
import { OutcomesV2 } from "@/components/landing-v2/outcomes-v2"
import { Narrative } from "@/components/landing-v2/narrative"
import { HowItThinks } from "@/components/landing-v2/how-it-thinks"
import { Surfaces } from "@/components/landing-v2/surfaces"
import { Evidence } from "@/components/landing-v2/evidence"
import { Verticals } from "@/components/landing-v2/verticals"
import { PricingV2 } from "@/components/landing-v2/pricing-v2"
import { ClosingCTA } from "@/components/landing-v2/closing-cta"
import { FooterV2 } from "@/components/landing-v2/footer-v2"

export default function Home() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactFormSubject, setContactFormSubject] = useState("")

  const openContactForm = (subject: string) => {
    setContactFormSubject(subject)
    setIsContactFormOpen(true)
  }

  return (
    <div className="flex flex-col bg-vrin-paper">
      <AnnouncementV2 />
      <Header />

      <HeroV2 />
      <OutcomesV2 />
      <Narrative />
      <HowItThinks />
      <Surfaces />
      <Evidence />
      <Verticals />
      <PricingV2 openContactForm={openContactForm} />
      <ClosingCTA />
      <FooterV2 />

      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        defaultSubject={contactFormSubject}
      />
    </div>
  )
}
