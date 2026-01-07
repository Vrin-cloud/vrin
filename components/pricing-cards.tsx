"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import Link from "next/link"

export function PricingCards() {
  const [annual, setAnnual] = useState(false)

  const toggleBilling = () => {
    setAnnual(!annual)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-12">
        <span className={`text-sm ${!annual ? "font-medium" : "text-muted-foreground"}`}>Monthly</span>
        <Switch checked={annual} onCheckedChange={toggleBilling} />
        <div className="flex items-center gap-2">
          <span className={`text-sm ${annual ? "font-medium" : "text-muted-foreground"}`}>Annual</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Save 20%
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">${annual ? "399" : "499"}</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Perfect for small healthcare practices</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Up to 10,000 memory episodes</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Basic episodic memory</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Standard API access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Email support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">HIPAA compliance</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Get Started
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-2 border-primary/20 bg-background/50 backdrop-blur-sm relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle>Professional</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">${annual ? "799" : "999"}</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">For growing healthcare organizations</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Up to 100,000 memory episodes</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Advanced episodic memory</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Semantic knowledge graph</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Priority API access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">24/7 email & chat support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Advanced analytics dashboard</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button className="w-full gradient-bg text-white hover:opacity-90">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">Custom</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">For large healthcare networks</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited memory episodes</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Full memory orchestration suite</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Custom integration support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">SLA with 99.99% uptime</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">On-premise deployment option</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="https://calendly.com/vedant-vrin/15-minute-meeting" target="_blank" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Contact Sales
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground mt-8 text-center max-w-xl">
        All plans include HIPAA compliance, data encryption, and basic support. Need a custom plan?{" "}
        <Link href="https://calendly.com/vedant-vrin/15-minute-meeting" target="_blank" className="text-primary hover:underline">
          Contact our sales team
        </Link>
        .
      </p>
    </div>
  )
}
