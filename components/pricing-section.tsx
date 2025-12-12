"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Building, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PricingSectionProps {
  openContactForm: (subject: string) => void
}

export function PricingSection({ openContactForm }: PricingSectionProps) {
  const plans = [
    {
      name: "Builder",
      description: "Perfect for developers and small teams getting started",
      badge: "Free",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "100k chunks / 100k edges",
        "5k queries/month",
        "Shared HybridRAG infrastructure",
        "Basic memory & CBOM",
        "API key authentication",
        "CSV/S3 connectors",
        "Community support"
      ],
      cta: "Start Free",
      ctaVariant: "default" as const,
      popular: false,
      action: "signup"
    },
    {
      name: "Team",
      description: "For growing teams that need dedicated infrastructure",
      badge: "Most Popular",
      icon: <Star className="h-6 w-6" />,
      features: [
        "2M chunks / 3M edges",
        "100k queries/month",
        "Dedicated indices",
        "Full CBOM & TTL",
        "Basic RBAC",
        "+ Postgres/Drive connectors",
        "Email support (48h SLA)",
        "Extra storage/queries available"
      ],
      cta: "Contact Sales",
      ctaVariant: "default" as const,
      popular: true,
      action: "contact"
    },
    {
      name: "Business",
      description: "For enterprises requiring security and compliance",
      badge: "Enterprise Ready",
      icon: <Building className="h-6 w-6" />,
      features: [
        "10M chunks / 15M edges",
        "500k queries/month",
        "Dedicated + VPC peering",
        "Full + compliance exports",
        "SSO/SAML + SCIM",
        "+ Slack/Jira/Confluence",
        "Priority support (8-12h SLA)",
        "Compliance exports, private LLM"
      ],
      cta: "Contact Sales",
      ctaVariant: "default" as const,
      popular: false,
      action: "contact"
    },
    {
      name: "Enterprise",
      description: "Custom solution for large-scale deployments",
      badge: "Custom",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Custom (100M+ chunks; 150M+ edges)",
        "Custom queries (SLA&apos;d)",
        "Private/VPC or on-premises",
        "Full + auditor packs",
        "SSO/SAML, SCIM, data residency",
        "All + custom connectors",
        "Dedicated TAM & DSE",
        "On-prem, managed upgrades"
      ],
      cta: "Contact Sales",
      ctaVariant: "default" as const,
      popular: false,
      action: "contact"
    }
  ]

  const handleAction = (action: string, planName: string) => {
    if (action === "signup") {
      // Redirect to auth page for free plan
      window.location.href = "/auth"
    } else {
      // Open contact form for paid plans
      openContactForm(`${planName} Plan Inquiry`)
    }
  }

  return (
    <section id="pricing" className="py-24 bg-[#FFFDFD] dark:bg-[#201E1E]">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <span className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D] mb-4 block">
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-extralight text-[#201E1E] dark:text-[#FFFDFD] mb-6">
            Choose Your Intelligence Level
          </h2>
          <p className="text-lg text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light leading-relaxed">
            From individual developers to enterprise deployments, VRIN scales with your needs.
            All plans include our revolutionary user-defined AI specialization.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Card className={`h-full relative overflow-hidden rounded-2xl ${
                plan.popular
                  ? 'border-2 border-[#083C5E] dark:border-[#8DAA9D] shadow-xl scale-105'
                  : 'border border-[#201E1E]/10 dark:border-[#FFFDFD]/10'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#083C5E] dark:bg-[#8DAA9D] text-[#FFFDFD] dark:text-[#201E1E] text-center py-2 text-xs font-medium uppercase tracking-widest">
                    {plan.badge}
                  </div>
                )}

                <CardHeader className={`${plan.popular ? 'pt-14' : 'pt-8'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-[#8DAA9D]/20 dark:bg-[#083C5E]/30 text-[#083C5E] dark:text-[#8DAA9D]">
                      {plan.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-medium text-[#201E1E] dark:text-[#FFFDFD]">{plan.name}</CardTitle>
                      {!plan.popular && (
                        <span className="text-xs uppercase tracking-widest text-[#8DAA9D]">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4 mb-8">
                    <h4 className="text-xs font-medium text-[#8DAA9D] uppercase tracking-widest">
                      What&apos;s Included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-[#083C5E] dark:text-[#8DAA9D] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#201E1E]/70 dark:text-[#FFFDFD]/70 font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleAction(plan.action, plan.name)}
                    className={`w-full rounded-full ${
                      plan.popular
                        ? 'bg-[#083C5E] hover:bg-[#083C5E]/90 text-[#FFFDFD] dark:bg-[#8DAA9D] dark:text-[#201E1E] dark:hover:bg-[#8DAA9D]/90'
                        : 'bg-[#201E1E]/10 hover:bg-[#201E1E]/20 text-[#201E1E] dark:bg-[#FFFDFD]/10 dark:text-[#FFFDFD] dark:hover:bg-[#FFFDFD]/20'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <Card className="border border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#083C5E]/5 dark:bg-[#083C5E]/20 rounded-2xl">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-[#201E1E] dark:text-[#FFFDFD] mb-2">All Plans Include</h3>
                <p className="text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light">Revolutionary capabilities that set VRIN apart</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2 text-[#083C5E] dark:text-[#8DAA9D]">
                    <Zap className="h-4 w-4" />
                    Core Intelligence
                  </h4>
                  <ul className="text-sm space-y-2 ml-6 text-[#201E1E]/70 dark:text-[#FFFDFD]/70 font-light">
                    <li>User-defined AI specialization</li>
                    <li>Multi-hop reasoning across documents</li>
                    <li>Smart deduplication (40-60% savings)</li>
                    <li>Temporal knowledge graphs</li>
                    <li>Lightning-fast fact retrieval (&lt;1.8s)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2 text-[#083C5E] dark:text-[#8DAA9D]">
                    <Building className="h-4 w-4" />
                    Enterprise Features
                  </h4>
                  <ul className="text-sm space-y-2 ml-6 text-[#201E1E]/70 dark:text-[#FFFDFD]/70 font-light">
                    <li>Complete audit trails</li>
                    <li>Explainable AI responses</li>
                    <li>High-confidence fact extraction</li>
                    <li>Cross-document synthesis</li>
                    <li>Production-grade security</li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light mb-6">
                  Questions about pricing or need a custom solution?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => openContactForm("Pricing Questions")}
                    variant="outline"
                    className="border-[#201E1E]/30 dark:border-[#FFFDFD]/30 hover:bg-[#8DAA9D]/10 dark:hover:bg-[#083C5E]/20 rounded-full px-6"
                  >
                    Ask About Pricing
                  </Button>
                  <Button
                    onClick={() => openContactForm("Custom Enterprise Solution")}
                    className="bg-[#201E1E] hover:bg-[#083C5E] text-[#FFFDFD] dark:bg-[#FFFDFD] dark:text-[#201E1E] dark:hover:bg-[#8DAA9D] rounded-full px-6"
                  >
                    Custom Solution
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ROI Note */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light">
            <span className="font-medium text-[#083C5E] dark:text-[#8DAA9D]">ROI Guarantee:</span> VRIN typically pays for itself within the first quarter through
            reduced engineering costs, faster time-to-market, and superior analysis quality.
          </p>
        </div>
      </div>
    </section>
  )
}