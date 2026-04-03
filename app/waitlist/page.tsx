"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import vrinIcon from "@/app/icon.svg"

export default function WaitlistPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), company: company.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage(data.message || "You're on the list!")
      } else {
        setStatus("error")
        setMessage(data.error || "Something went wrong.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md"
        >
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={vrinIcon}
              alt="Vrin"
              width={56}
              height={56}
              unoptimized
            />
            <Image
              src="/vrin-text-logo.png"
              alt="Vrin"
              width={160}
              height={53}
              priority
            />
          </div>
          <p className="text-gray-600 text-lg mb-10">
            Knowledge Reasoning Infrastructure for AI Agents
          </p>

          {/* Feature bullets */}
          <div className="space-y-5">
            {[
              { title: "Retrieval is not reasoning", desc: "Search returns fragments. Vrin reasons across your documents to reach conclusions no single document contains." },
              { title: "One query, not five follow-ups", desc: "Complex, strategic questions answered in one shot \u2014 the kind that takes a senior expert hours of cross-referencing." },
              { title: "Audit-ready answers", desc: "Names, dates, section references, and evidence chains. Every claim traced back to source." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#8DAA9D]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#8DAA9D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Waitlist Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src={vrinIcon}
                alt="Vrin"
                width={48}
                height={48}
                unoptimized
              />
              <Image
                src="/vrin-text-logo.png"
                alt="Vrin"
                width={120}
                height={40}
                priority
              />
            </div>
            <p className="text-gray-600">
              Knowledge Reasoning for AI Agents
            </p>
          </div>

          {status === "success" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                You&apos;re on the list
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <>
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8DAA9D]/10 border border-[#8DAA9D]/20 text-[#8DAA9D] text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8DAA9D] animate-pulse" />
                  Private Beta
                </span>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Join the Waitlist
                </h1>
                <p className="text-gray-600 mt-2">
                  We&apos;re onboarding teams gradually. Leave your email and we&apos;ll reach out when it&apos;s your turn.
                </p>
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{message}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8DAA9D]/50 focus:border-[#8DAA9D] transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8DAA9D]/50 focus:border-[#8DAA9D] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8DAA9D]/50 focus:border-[#8DAA9D] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8DAA9D]/50 focus:border-[#8DAA9D] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || !email.trim()}
                  className="w-full py-3 bg-[#8DAA9D] hover:bg-[#7d9d8f] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Request Early Access
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                We&apos;ll never share your email. You&apos;ll hear from us within a week.
              </p>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <Link href="/auth" className="text-[#8DAA9D] hover:text-[#7d9d8f] font-medium underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
