'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LoadingAnimationProps {
  isStreaming?: boolean
}

export function LoadingAnimation({ isStreaming = false }: LoadingAnimationProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    // Reset timer when component mounts
    setElapsedSeconds(0)

    // Start timer
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const isLongWait = elapsedSeconds >= 30
  const displayText = isLongWait
    ? 'Thinking longer for a better answer'
    : 'Thinking'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-center py-8"
    >
      <div className="flex items-center gap-3 text-gray-600">
        {/* Thinking text with subtle blink */}
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-base font-medium"
        >
          {displayText}
        </motion.span>

        {/* Animated dots */}
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="text-gray-600"
            >
              •
            </motion.span>
          ))}
        </span>

        {/* Seconds counter */}
        <span className="text-sm text-gray-500 font-mono ml-2">
          {elapsedSeconds}s
        </span>
      </div>
    </motion.div>
  )
}
