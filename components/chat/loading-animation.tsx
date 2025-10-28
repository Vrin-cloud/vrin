'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Brain, Sparkles, CheckCircle2 } from 'lucide-react'

interface LoadingAnimationProps {
  isStreaming?: boolean
}

export function LoadingAnimation({ isStreaming = false }: LoadingAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0)

  const stages = [
    {
      icon: Search,
      title: 'Retrieving context',
      subtitle: 'Searching knowledge graph and vector database',
      color: 'blue',
      duration: 3000
    },
    {
      icon: Brain,
      title: 'Analyzing with AI',
      subtitle: 'Processing retrieved facts with GPT-5-mini',
      color: 'purple',
      duration: 5000
    },
    {
      icon: Sparkles,
      title: 'Generating response',
      subtitle: 'Synthesizing comprehensive answer',
      color: 'indigo',
      duration: 4000
    }
  ]

  useEffect(() => {
    if (isStreaming) {
      // Once streaming starts, show final stage
      setCurrentStage(2)
      return
    }

    // Cycle through stages
    const timer = setTimeout(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, stages[currentStage].duration)

    return () => clearTimeout(timer)
  }, [currentStage, isStreaming])

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      indigo: {
        bg: 'bg-indigo-500',
        text: 'text-indigo-600',
        border: 'border-indigo-200'
      }
    }
    return colorMap[color]?.[variant] || colorMap.blue[variant]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-center"
    >
      <div className="w-full max-w-3xl">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {stages.map((stage, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-500
                        ${idx <= currentStage
                          ? `${getColorClasses(stage.color, 'bg')} text-white shadow-lg`
                          : 'bg-gray-200 text-gray-400'
                        }
                      `}
                      animate={idx === currentStage ? {
                        scale: [1, 1.1, 1],
                        transition: { duration: 1, repeat: Infinity }
                      } : {}}
                    >
                      {idx < currentStage ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <stage.icon className="w-5 h-5" />
                      )}
                    </motion.div>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative overflow-hidden">
                      <motion.div
                        className={`absolute inset-0 ${getColorClasses(stage.color, 'bg')}`}
                        initial={{ width: '0%' }}
                        animate={{ width: idx < currentStage ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Current stage info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {React.createElement(stages[currentStage].icon, {
                    className: `w-6 h-6 ${getColorClasses(stages[currentStage].color, 'text')}`
                  })}
                </motion.div>
                <h3 className={`text-lg font-semibold ${getColorClasses(stages[currentStage].color, 'text')}`}>
                  {stages[currentStage].title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {stages[currentStage].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Animated dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${getColorClasses(stages[currentStage].color, 'bg')}`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Optional streaming indicator */}
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <span className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Streaming response...
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
