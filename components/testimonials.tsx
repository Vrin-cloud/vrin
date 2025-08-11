"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Vrin has transformed how our emergency department handles patient data. We've reduced information gathering time by 90% and improved clinical decision accuracy.",
    author: "Dr. Sarah Johnson",
    title: "Chief Medical Officer, Metro General Hospital",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "Integrating Vrin into our clinical software has given us a competitive edge. Our customers report significant improvements in medication management and patient outcomes.",
    author: "Michael Chen",
    title: "VP of Product, PharmaTech Solutions",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "The memory orchestration platform has eliminated repetitive questioning in our AI-assisted consultations. Patients feel heard and understood from the first interaction.",
    author: "Dr. Emily Rodriguez",
    title: "Director of Innovation, HealthFirst Network",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      next()
    }, 5000)

    return () => clearInterval(interval)
  }, [current, autoplay])

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
        <CardContent className="p-8 md:p-12">
          <Quote className="h-12 w-12 text-primary/10 mb-6" />

          <div className="min-h-[200px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 absolute w-full ${
                  index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                style={{ display: index === current ? "block" : "none" }}
              >
                <blockquote className="text-xl md:text-2xl font-medium mb-8">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-12">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === current ? "bg-primary" : "bg-primary/20"
                  }`}
                  onClick={() => {
                    setCurrent(index)
                    setAutoplay(false)
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                onClick={() => {
                  prev()
                  setAutoplay(false)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                onClick={() => {
                  next()
                  setAutoplay(false)
                }}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
