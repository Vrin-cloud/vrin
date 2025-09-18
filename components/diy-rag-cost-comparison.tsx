"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, AlertTriangle, DollarSign, Clock, Users, Server, Shield, TrendingUp, Calculator, Building2 } from "lucide-react"

interface CostBreakdownProps {
  openContactForm: (subject: string) => void
}

export function DIYRAGCostComparison({ openContactForm }: CostBreakdownProps) {
  const diyComponents = [
    {
      category: "Vector Database",
      cost: "$500+",
      monthlyLabel: "/mo",
      icon: <Server className="h-4 w-4 text-slate-500" />,
      details: "Pinecone, Weaviate clusters"
    },
    {
      category: "Search Infrastructure",
      cost: "$1,000+",
      monthlyLabel: "/mo",
      icon: <Server className="h-4 w-4 text-slate-500" />,
      details: "OpenSearch managed service"
    },
    {
      category: "Graph Database",
      cost: "$338+",
      monthlyLabel: "/mo",
      icon: <Server className="h-4 w-4 text-slate-500" />,
      details: "Neptune HA instances"
    },
    {
      category: "Engineering Team",
      cost: "$40,000",
      monthlyLabel: "/mo",
      icon: <Users className="h-4 w-4 text-slate-500" />,
      details: "2 FTE Engineers"
    },
    {
      category: "Security & Compliance",
      cost: "$60,000",
      monthlyLabel: "",
      icon: <Shield className="h-4 w-4 text-slate-500" />,
      details: "SOC 2, audit prep"
    }
  ]

  const comparisonPoints = [
    { diy: "6-12 months development", vrin: "Production-ready in days", category: "Time to Market" },
    { diy: "Basic vector search only", vrin: "Advanced multi-hop reasoning", category: "Capabilities" },
    { diy: "Manual deduplication", vrin: "Intelligent storage optimization", category: "Efficiency" },
    { diy: "Limited customization", vrin: "User-defined specialization", category: "Flexibility" },
    { diy: "Basic retrieval", vrin: "Complete audit trail", category: "Compliance" }
  ]

  return (
    <section id="cost-comparison" className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1">
            Cost Analysis
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The True Cost of Building RAG
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Infrastructure costs are just the tip of the iceberg. The real expense lies in engineering time,
            maintenance, and the opportunity cost of delayed deployment.
          </p>
        </div>

        {/* Modern Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Build vs Buy Analysis</h3>
                <Badge variant="secondary">TCO Comparison</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
                {/* DIY Column */}
                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-5 w-5 text-slate-600" />
                      <h4 className="text-lg font-semibold">DIY Infrastructure</h4>
                    </div>
                    <div className="space-y-3">
                      {diyComponents.map((component, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <div className="flex items-center gap-2">
                            {component.icon}
                            <div>
                              <div className="text-sm font-medium">{component.category}</div>
                              <div className="text-xs text-muted-foreground">{component.details}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {component.cost}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              {component.monthlyLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Monthly Total</span>
                        <span className="text-2xl font-bold">$47,000+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Time to Production</span>
                        <span className="text-sm font-medium">6-12 months</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VRIN Column */}
                <div className="p-8 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-950">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <h4 className="text-lg font-semibold">VRIN Platform</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Platform License</span>
                          <span className="font-semibold">Custom Pricing</span>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>All infrastructure included</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>Managed updates & scaling</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>Enterprise security built-in</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>24/7 support included</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">70% Cost Reduction</div>
                          <div className="text-sm text-muted-foreground">vs DIY total cost of ownership</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Time to Production</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">ROI Timeline</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">3-6 months</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-3">Capability Comparison</h3>
            <p className="text-muted-foreground">What you get vs what you build</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisonPoints.map((point, index) => (
              <Card key={index} className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    {point.category}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">DIY</div>
                        <div className="text-sm text-muted-foreground">{point.diy}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">VRIN</div>
                        <div className="text-sm text-muted-foreground">{point.vrin}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Card className="border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-3">ROI Calculator</Badge>
                <h3 className="text-2xl font-semibold mb-3">Enterprise Cost Comparison</h3>
                <p className="text-muted-foreground">Annual total cost of ownership breakdown</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-2">DIY Infrastructure</div>
                  <div className="text-3xl font-bold mb-1">$564K</div>
                  <div className="text-xs text-muted-foreground">Annual TCO</div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-2">VRIN Platform</div>
                  <div className="text-3xl font-bold text-gradient mb-1">$169K</div>
                  <div className="text-xs text-muted-foreground">Annual Cost</div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-6 text-center border border-green-200 dark:border-green-700">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Your Savings</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">$395K</div>
                  <div className="text-xs text-muted-foreground">Per Year (70% reduction)</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => openContactForm("Enterprise Cost Analysis")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Custom ROI Analysis
                </Button>
                <Button
                  onClick={() => openContactForm("Platform Demo Request")}
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}