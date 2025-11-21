'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  ArrowRight,
  Sparkles,
  Brain,
  Search,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatWidgetProps {
  organizationName?: string
}

export default function ChatWidget({ organizationName }: ChatWidgetProps) {
  const quickPrompts = [
    { icon: Search, text: 'Search company documents', prompt: 'Search for recent documents' },
    { icon: FileText, text: 'Summarize key insights', prompt: 'Summarize the key insights from recent reports' },
    { icon: Brain, text: 'Find connections', prompt: 'Find connections between concepts in our knowledge base' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 border border-gray-200 rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Knowledge Assistant</h3>
            <p className="text-sm text-gray-500">Ask questions about {organizationName || 'your organization'}</p>
          </div>
        </div>
        <Link href="/enterprise/chat">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
            Open Chat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickPrompts.map((item, idx) => (
          <Link
            key={idx}
            href={`/enterprise/chat?prompt=${encodeURIComponent(item.prompt)}`}
            className="group"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <item.icon className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{item.text}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Powered by VRIN Hybrid RAG</span>
        </div>
        <span>Real-time streaming responses</span>
      </div>
    </motion.div>
  )
}
