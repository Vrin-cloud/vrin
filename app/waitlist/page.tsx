'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

const bullets = [
  {
    title: 'Retrieval is not reasoning',
    desc: 'Search returns fragments. Vrin reasons across your documents to reach conclusions no single document contains.',
  },
  {
    title: 'One query, not five follow-ups',
    desc: 'Complex, strategic questions answered in one shot. The kind that takes a senior expert hours of cross-referencing.',
  },
  {
    title: 'Audit-ready answers',
    desc: 'Names, dates, section references, and evidence chains. Every claim traced back to source.',
  },
]

export default function WaitlistPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  )
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          company: company.trim(),
        }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || "You're on the list.")
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-full border border-vrin-charcoal/15 bg-vrin-cream/70 text-sm text-vrin-charcoal placeholder:text-vrin-charcoal/35 focus:outline-none focus:border-vrin-blue focus:bg-vrin-cream transition-all'

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-vrin-paper">
      {/* Left — editorial brand panel */}
      <div className="relative hidden lg:flex lg:w-1/2 vignette-paper items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="relative z-10 max-w-md px-8"
        >
          <Link href="/" className="flex items-center gap-3 mb-10">
            <Image src="/icon.svg" alt="Vrin" width={48} height={48} />
            <span className="font-display text-3xl text-vrin-charcoal leading-none">
              Vrin
            </span>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="eyebrow text-vrin-blue">Private beta</span>
            <span className="hairline flex-1" />
          </div>

          <h1 className="font-display text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.02] tracking-[-0.03em] text-vrin-charcoal">
            Context that&apos;s{' '}
            <span className="serif-italic text-vrin-blue">thought through</span>,
            not looked up.
          </h1>

          <p className="mt-6 text-base text-vrin-charcoal/65 leading-relaxed">
            Vrin is the retrieval-time reasoning layer for AI agents. Early access
            is rolling out to teams building agents that need to reason across real
            enterprise context.
          </p>

          <div className="mt-10 space-y-5">
            {bullets.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease }}
                className="flex gap-3"
              >
                <span className="mt-0.5 w-5 h-5 rounded-full bg-vrin-sage/25 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-vrin-blue" />
                </span>
                <div>
                  <p className="font-display text-lg leading-tight text-vrin-charcoal">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-vrin-charcoal/55 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-12 text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/40">
            vrin.cloud / waitlist
          </p>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/icon.svg" alt="Vrin" width={40} height={40} />
              <span className="font-display text-2xl text-vrin-charcoal leading-none">
                Vrin
              </span>
            </Link>
          </div>

          {status === 'success' ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-vrin-sage/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-7 h-7 text-vrin-blue" />
              </div>
              <h1 className="font-display text-4xl leading-[1.1] tracking-[-0.02em] text-vrin-charcoal mb-3">
                You&apos;re on <span className="serif-italic text-vrin-blue">the list.</span>
              </h1>
              <p className="text-base text-vrin-charcoal/65 mb-8">{message}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm font-mono tracking-[0.1em] uppercase text-vrin-charcoal/55 hover:text-vrin-charcoal"
              >
                Back to home
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-blue">
                  <span className="w-1.5 h-1.5 rounded-full bg-vrin-sage animate-pulse" />
                  Private beta
                </span>
                <span className="hairline flex-1 max-w-32" />
              </div>

              <h1 className="font-display text-[clamp(2.25rem,4vw,3rem)] leading-[1.05] tracking-[-0.025em] text-vrin-charcoal">
                Join the <span className="serif-italic text-vrin-blue">waitlist.</span>
              </h1>

              <p className="mt-4 text-base text-vrin-charcoal/65 leading-relaxed">
                We&apos;re onboarding teams gradually. Leave your details and
                we&apos;ll reach out when it&apos;s your turn.
              </p>

              {status === 'error' && (
                <div className="mt-6 p-4 rounded-2xl border border-red-200 bg-red-50">
                  <p className="text-sm text-red-700">{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45 mb-2"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45 mb-2"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45 mb-2"
                  >
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45 mb-2"
                  >
                    Company{' '}
                    <span className="text-vrin-charcoal/30 normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="group mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-vrin-charcoal px-6 py-3.5 text-sm font-medium text-vrin-cream hover:bg-vrin-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Request early access
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[11px] font-mono tracking-[0.12em] uppercase text-vrin-charcoal/40">
                We never share your email · You hear from us within a week
              </p>

              <p className="mt-6 text-center text-sm text-vrin-charcoal/55">
                Already have an account?{' '}
                <Link
                  href="/auth"
                  className="text-vrin-blue hover:text-vrin-charcoal underline underline-offset-2"
                >
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
