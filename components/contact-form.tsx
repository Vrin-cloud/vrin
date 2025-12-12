"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Mail, User, Building, MessageSquare, Send, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
  defaultSubject?: string
}

export function ContactForm({ isOpen, onClose, defaultSubject = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: defaultSubject,
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY", // Replace with your actual key
          from_name: formData.name,
          email: formData.email,
          subject: `Vrin Contact Form: ${formData.subject}`,
          message: `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Subject: ${formData.subject}

Message:
${formData.message}
          `,
          to: "vedantspatel33@gmail.com"
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          onClose()
          setIsSubmitted(false)
          setFormData({ name: "", email: "", company: "", subject: "", message: "" })
        }, 2000)
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#201E1E]/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 bg-[#FFFDFD] dark:bg-[#201E1E] border border-[#201E1E]/10 dark:border-[#FFFDFD]/10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#083C5E] dark:bg-[#8DAA9D] flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#FFFDFD] dark:text-[#201E1E]" />
              </div>
              <div>
                <h2 className="text-xl font-light text-[#201E1E] dark:text-[#FFFDFD]">Get in Touch</h2>
                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light">We&apos;d love to hear from you</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-[#8DAA9D]/10 dark:hover:bg-[#8DAA9D]/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="p-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-[#083C5E] dark:text-[#8DAA9D] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#201E1E] dark:text-[#FFFDFD] mb-2">Message Sent!</h3>
                <p className="text-[#201E1E]/60 dark:text-[#FFFDFD]/60 text-sm font-light">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-3.5 w-3.5" />
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                      className="border-border focus:border-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium">
                      <Building className="h-3.5 w-3.5" />
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company"
                      className="border-border focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-3.5 w-3.5" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="border-border focus:border-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What can we help you with?"
                    required
                    className="border-border focus:border-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your needs..."
                    rows={4}
                    required
                    className="border-border focus:border-slate-400 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 bg-transparent border-[#201E1E]/30 dark:border-[#FFFDFD]/30 hover:bg-[#8DAA9D]/10 dark:hover:bg-[#8DAA9D]/20 rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#201E1E] hover:bg-[#083C5E] text-[#FFFDFD] dark:bg-[#FFFDFD] dark:text-[#201E1E] dark:hover:bg-[#8DAA9D] rounded-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FFFDFD] dark:border-[#201E1E] mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 