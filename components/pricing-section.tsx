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
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Choose Your <span className="text-blue-600">Intelligence Level</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
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
              <Card className={`h-full relative overflow-hidden ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105' 
                  : 'border-gray-200 dark:border-gray-800'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    {plan.badge}
                  </div>
                )}
                
                <CardHeader className={`${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      plan.name === 'Builder' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      plan.name === 'Team' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      plan.name === 'Business' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {plan.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      {!plan.popular && (
                        <Badge variant="outline" className="text-xs">
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      What&apos;s Included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleAction(plan.action, plan.name)}
                    className={`w-full ${
                      plan.name === 'Builder'
                        ? 'bg-green-600 hover:bg-green-700'
                        : plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
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
          className="mt-16 max-w-4xl mx-auto"
        >
          <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">All Plans Include</h3>
                <p className="text-muted-foreground">Revolutionary capabilities that set VRIN apart</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    Core Intelligence
                  </h4>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• User-defined AI specialization</li>
                    <li>• Multi-hop reasoning across documents</li>
                    <li>• Smart deduplication (40-60% savings)</li>
                    <li>• Temporal knowledge graphs</li>
                    <li>• Lightning-fast fact retrieval (&lt;3s)</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4 text-purple-500" />
                    Enterprise Features
                  </h4>
                  <ul className="text-sm space-y-2 ml-6">
                    <li>• Complete audit trails</li>
                    <li>• Explainable AI responses</li>
                    <li>• High-confidence fact extraction</li>
                    <li>• Cross-document synthesis</li>
                    <li>• Production-grade security</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about pricing or need a custom solution?
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => openContactForm("Pricing Questions")}
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/20"
                  >
                    Ask About Pricing
                  </Button>
                  <Button 
                    onClick={() => openContactForm("Custom Enterprise Solution")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Custom Solution
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ROI Note */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground">
            <strong>ROI Guarantee:</strong> VRIN typically pays for itself within the first quarter through 
            reduced engineering costs, faster time-to-market, and superior analysis quality.
          </p>
        </div>
      </div>
    </section>
  )
}