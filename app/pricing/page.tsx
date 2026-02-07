'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowLeft } from 'lucide-react'
import vrinIcon from '@/public/vrin-icon.svg'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual')

  const proPrice = billingPeriod === 'annual' ? 16 : 19
  const savings = billingPeriod === 'annual' ? 'Save $60/year' : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src={vrinIcon} alt="VRIN" width={32} height={32} />
            <span className="text-xl font-semibold text-gray-900">VRIN</span>
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose your plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock the full power of AI-driven reasoning over your knowledge base
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              billingPeriod === 'annual'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annual
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500 text-white">
              -17%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/ month</span>
              </div>
              <p className="text-gray-600">
                Get started with AI-powered knowledge search
              </p>
            </div>

            <Link
              href="/auth"
              className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 text-center font-semibold rounded-xl transition-all mb-8"
            >
              Get Started
            </Link>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">10 file uploads per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">100 MB storage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">100 queries per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Access to GPT-5.2, Claude 4 Haiku, Gemini 3 Flash, Grok 3</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Web search integration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Source citations</span>
              </li>
            </ul>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#1a1a1a] rounded-2xl p-8 shadow-xl relative"
          >
            {/* Popular Badge */}
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-sm font-medium rounded-full border border-teal-500/30">
                Popular
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">${proPrice}</span>
                <span className="text-gray-400">/ month</span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="text-sm text-gray-500 mb-2">when billed annually</p>
              )}
              <p className="text-gray-400">
                Unlock advanced reasoning and premium models
              </p>
            </div>

            <button
              onClick={() => {
                // TODO: Integrate with Stripe checkout
                window.location.href = '/auth?plan=pro'
              }}
              className="block w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-gray-900 text-center font-semibold rounded-xl transition-all mb-8"
            >
              Get Pro
            </button>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">100 file uploads per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">5 GB storage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">1,000 queries per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  All AI models including GPT-5.2 Turbo, o3, o4-mini, Claude 4 Sonnet & Opus, Gemini 3 Pro & Ultra
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Brainstorm mode for creative reasoning</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Expert mode with deep analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Thinking panel visibility</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Unlimited conversations</span>
              </li>
            </ul>

            <p className="mt-8 text-sm text-gray-500">
              Existing subscriber?{' '}
              <a href="/account/billing" className="text-teal-400 hover:underline">
                See billing help
              </a>
            </p>
          </motion.div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Questions about our plans?{' '}
            <a
              href="https://calendly.com/vedant-vrin/15-minute-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline"
            >
              Schedule a call
            </a>
            {' '}or email us at{' '}
            <a href="mailto:support@vrin.co" className="text-teal-600 hover:underline">
              support@vrin.co
            </a>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Image src={vrinIcon} alt="VRIN" width={20} height={20} className="opacity-50" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src={vrinIcon} alt="VRIN" width={20} height={20} className="opacity-50" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src={vrinIcon} alt="VRIN" width={20} height={20} className="opacity-50" />
            <span>GDPR Ready</span>
          </div>
        </div>
      </main>
    </div>
  )
}
