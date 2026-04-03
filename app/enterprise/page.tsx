"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Shield,
  Cloud,
  Lock,
  Users,
  ArrowRight,
  Check,
  Loader2,
  Calendar,
} from "lucide-react"

const features = [
  {
    icon: Lock,
    title: "Data Sovereignty",
    desc: "Your data never leaves your cloud. Deploy VRIN in your own AWS, Azure, or GCP account.",
  },
  {
    icon: Shield,
    title: "SSO / SAML",
    desc: "Integrate with your existing identity provider. Active Directory, Okta, and more.",
  },
  {
    icon: Cloud,
    title: "Hybrid Cloud Deployment",
    desc: "VPC-isolated, air-gapped, or hybrid explicit routing based on data sensitivity.",
  },
  {
    icon: Users,
    title: "Dedicated Support & SLAs",
    desc: "24/7 engineering support, 99.9% uptime SLA, and a dedicated account team.",
  },
]

const companySizes = ["1-50", "51-200", "201-1000", "1000+"]

export default function EnterprisePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    companySize: "",
    useCase: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/enterprise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage(data.message || "We'll be in touch!")
      } else {
        setStatus("error")
        setMessage(data.error || "Something went wrong.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="px-6 py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <Image src="/dark-icon.svg" alt="Vrin" width={28} height={28} />
            <span className="font-semibold text-white/80">Vrin</span>
            <span className="text-white/30 mx-1">/</span>
            <span className="text-white/50">Enterprise</span>
          </Link>
        </div>
      </header>

      {/* Main content — two columns */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column — Value prop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8DAA9D]/10 border border-[#8DAA9D]/20 text-[#8DAA9D] text-xs font-medium mb-6">
              Enterprise
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Knowledge Reasoning
              <br />
              <span className="text-[#8DAA9D]">in Your Cloud</span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed mb-10">
              Deploy VRIN in your own infrastructure with complete data sovereignty.
              Your documents, your knowledge graph, your cloud &mdash; we never see your data.
            </p>

            {/* Feature list */}
            <div className="space-y-5 mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#8DAA9D]/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-[#8DAA9D]" />
                  </div>
                  <div>
                    <p className="font-medium text-white/80">{f.title}</p>
                    <p className="text-sm text-white/40 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Or schedule directly */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-sm text-white/40 mb-3">Prefer to talk first?</p>
              <a
                href="https://cal.com/vedant-vrin/book-a-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#8DAA9D] hover:text-[#a3bfb2] text-sm font-medium transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule a call with the Founder
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Right column — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-[#8DAA9D]/20 flex items-center justify-center mx-auto mb-5">
                    <Check className="w-7 h-7 text-[#8DAA9D]" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">{message}</h2>
                  <p className="text-white/50 text-sm mb-6">
                    In the meantime, you can schedule a call to get started faster.
                  </p>
                  <a
                    href="https://cal.com/vedant-vrin/book-a-demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#8DAA9D] text-[#0a0a0a] font-semibold rounded-xl hover:bg-[#7d9d8f] transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule a Call
                  </a>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-1">Request a Demo</h2>
                  <p className="text-sm text-white/40 mb-6">
                    We typically respond within 1 business day.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        required
                        className="px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#8DAA9D]/50 focus:ring-1 focus:ring-[#8DAA9D]/30 transition-all text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        required
                        className="px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#8DAA9D]/50 focus:ring-1 focus:ring-[#8DAA9D]/30 transition-all text-sm"
                      />
                    </div>

                    <input
                      type="email"
                      placeholder="Work email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#8DAA9D]/50 focus:ring-1 focus:ring-[#8DAA9D]/30 transition-all text-sm"
                    />

                    <input
                      type="text"
                      placeholder="Company"
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#8DAA9D]/50 focus:ring-1 focus:ring-[#8DAA9D]/30 transition-all text-sm"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Role / Title"
                        value={form.role}
                        onChange={(e) => updateField("role", e.target.value)}
                        className="px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#8DAA9D]/50 focus:ring-1 focus:ring-[#8DAA9D]/30 transition-all text-sm"
                      />
                      <select
                        value={form.companySize}
                        onChange={(e) => updateField("companySize", e.target.value)}
                        className="px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DAA9D]/50 focus:ring-1 focus:ring-[#8DAA9D]/30 transition-all text-sm appearance-none"
                      >
                        <option value="" className="bg-[#1a1a1a] text-white/50">Company size</option>
                        {companySizes.map((s) => (
                          <option key={s} value={s} className="bg-[#1a1a1a]">{s} employees</option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      placeholder="What's your primary use case? (optional)"
                      value={form.useCase}
                      onChange={(e) => updateField("useCase", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#8DAA9D]/50 focus:ring-1 focus:ring-[#8DAA9D]/30 transition-all text-sm resize-none"
                    />

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3.5 bg-[#8DAA9D] hover:bg-[#7d9d8f] text-[#0a0a0a] font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Request a Demo
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-red-400 text-sm text-center">{message}</p>
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
