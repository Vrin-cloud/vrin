"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

export function TechDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const paths = svg.querySelectorAll("path")

    // Animate paths
    paths.forEach((path) => {
      const length = path.getTotalLength()

      // Set up the starting position
      path.style.strokeDasharray = length.toString()
      path.style.strokeDashoffset = length.toString()

      // Define the animation
      path.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
        duration: 1500,
        fill: "forwards",
        easing: "ease-out",
      })
    })
  }, [])

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Your Application</h3>
            <p className="text-sm text-muted-foreground">
              Your healthcare application makes API calls to Vrin&apos;s memory services
            </p>
          </div>
        </Card>

        <Card className="p-6 border border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Hybrid RAG Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              AI routes queries to vector search (single-hop) or graph traversal (multi-hop) for optimal performance
            </p>
          </div>
        </Card>

        <Card className="p-6 border border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">LLM Integration</h3>
            <p className="text-sm text-muted-foreground">
              The LLM receives relevant context and responds with full patient awareness
            </p>
          </div>
        </Card>
      </div>

      <svg
        ref={svgRef}
        className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 z-0 hidden md:block"
        viewBox="0 0 1000 50"
        fill="none"
      >
        <path d="M250,25 L400,25" stroke="url(#gradient1)" strokeWidth="3" strokeLinecap="round" />
        <path d="M600,25 L750,25" stroke="url(#gradient1)" strokeWidth="3" strokeLinecap="round" />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(215, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(262, 83%, 58%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
