"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, AlertTriangle, DollarSign, Clock, Users, Server, Shield } from "lucide-react"

interface CostBreakdownProps {
  openContactForm: (subject: string) => void
}

export function DIYRAGCostComparison({ openContactForm }: CostBreakdownProps) {
  const diyComponents = [
    {
      category: "Vector Database",
      cost: "$160-$500+/mo",
      icon: <Server className="h-5 w-5" />,
      details: "Pinecone, Weaviate, or similar - multiple pods needed"
    },
    {
      category: "Search Infrastructure", 
      cost: "$1,000+/mo",
      icon: <Server className="h-5 w-5" />,
      details: "OpenSearch/Elastic managed service with storage"
    },
    {
      category: "Graph Database",
      cost: "$338+/mo",
      icon: <Server className="h-5 w-5" />,
      details: "Neptune instance + HA clusters (2-3 instances)"
    },
    {
      category: "Engineering Team",
      cost: "$27,000-$40,000/mo",
      icon: <Users className="h-5 w-5" />,
      details: "2 FTE (ML Engineer + Data Engineer) fully loaded"
    },
    {
      category: "Security & Compliance",
      cost: "$20,000-$60,000",
      icon: <Shield className="h-5 w-5" />,
      details: "SOC 2 certification, security tools, audit prep"
    },
    {
      category: "SSO/Identity",
      cost: "$14-$17/user/mo",
      icon: <Shield className="h-5 w-5" />,
      details: "Okta or similar workforce SSO/MFA"
    }
  ]

  const diyProblems = [
    "6-12 months to reach &apos;good enough&apos; quality",
    "Limited multi-hop reasoning capabilities", 
    "No built-in conflict resolution",
    "Manual fact validation and deduplication",
    "Complex maintenance and scaling",
    "No explainable AI audit trail"
  ]

  const vrinAdvantages = [
    "Production-ready in days, not quarters",
    "Advanced multi-hop reasoning out-of-the-box",
    "Smart deduplication (40-60% storage savings)",
    "User-defined AI specialization",
    "Complete audit trail and explainability",
    "Enterprise security and compliance included"
  ]

  return (
    <section id="cost-comparison" className="py-20 bg-gradient-to-br from-red-50/30 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-red-200 text-red-700 dark:border-red-800 dark:text-red-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Reality Check
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            DIY RAG: <span className="text-red-600">Cheap Infra, Expensive Headcount</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Most teams underestimate the true cost of building production-ready RAG. 
            Vector-only solutions miss critical capabilities like multi-hop reasoning, temporal awareness, 
            and explainable AI—requiring months of engineering effort to reach basic functionality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* DIY Costs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-red-200 dark:border-red-800">
              <CardHeader className="bg-red-50/50 dark:bg-red-950/20">
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <DollarSign className="h-5 w-5" />
                  DIY RAG Pipeline Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  {diyComponents.map((component, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        {component.icon}
                        <div>
                          <div className="font-medium">{component.category}</div>
                          <div className="text-sm text-muted-foreground">{component.details}</div>
                        </div>
                      </div>
                      <div className="font-bold text-red-600">{component.cost}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Monthly Total (All-In):</span>
                    <span className="text-2xl text-red-600">$30,000-$47,000</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    + 6-12 months development time
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    What You Still Don&apos;t Get:
                  </h4>
                  {diyProblems.map((problem, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{problem}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* VRIN Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-green-200 dark:border-green-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-blue-50/20 dark:from-green-950/10 dark:to-blue-950/10" />
              <CardHeader className="bg-green-50/50 dark:bg-green-950/20 relative">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  VRIN: Complete Solution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative">
                <div className="mb-6">
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-600 mb-2">70% Cost Reduction</div>
                    <div className="text-lg font-semibold">Launch in Days, Not Quarters</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Platform fee + usage vs. full engineering team
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                    <Badge className="h-4 w-4 rounded-full bg-green-500" />
                    What&apos;s Included Out-of-the-Box:
                  </h4>
                  {vrinAdvantages.map((advantage, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{advantage}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">🎯 Exclusive Capabilities:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>User-Defined AI Specialization</strong> - Custom expert prompts</li>
                    <li>• <strong>Multi-Hop Reasoning</strong> - Cross-document synthesis</li>
                    <li>• <strong>Temporal Knowledge Graph</strong> - Bi-temporal fact storage</li>
                    <li>• <strong>Smart Deduplication</strong> - 40-60% storage optimization</li>
                  </ul>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button 
                    onClick={() => openContactForm("Cost Analysis & ROI Discussion")}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    Get ROI Analysis & Demo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => openContactForm("Technical Architecture Review")}
                    className="w-full border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/20"
                  >
                    Compare Your Current Stack
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ROI Calculation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">ROI Reality Check</h3>
                <p className="text-muted-foreground">Typical enterprise savings with VRIN</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-red-600">$400K+</div>
                  <div className="text-sm text-muted-foreground">Annual DIY engineering cost</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">$120K</div>
                  <div className="text-sm text-muted-foreground">Annual VRIN cost (Business tier)</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">$280K</div>
                  <div className="text-sm text-muted-foreground">Net annual savings</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Plus:</strong> Faster time-to-market, higher quality results, and expert-level analysis capabilities
                </p>
                <Button 
                  onClick={() => openContactForm("Enterprise ROI Calculation")}
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/20"
                >
                  Calculate Your Savings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}