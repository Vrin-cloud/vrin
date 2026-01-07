"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

interface AnnouncementBarProps {
  message: string
  linkText: string
  linkHref: string
  badge?: string
}

const BANNER_HEIGHT = 48 // Height in pixels

export function AnnouncementBar({
  message,
  linkText,
  linkHref,
  badge
}: AnnouncementBarProps) {
  // Set CSS variable for header offset when banner mounts
  useEffect(() => {
    document.documentElement.style.setProperty('--announcement-bar-height', `${BANNER_HEIGHT}px`)
    return () => {
      document.documentElement.style.setProperty('--announcement-bar-height', '0px')
    }
  }, [])

  return (
    <>
      {/* Fixed banner at top */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#4A7C9B] via-[#5A8CAB] to-[#4A7C9B] dark:from-[#3A6C8B] dark:via-[#4A7C9B] dark:to-[#3A6C8B] text-white">
        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer overflow-hidden" />

        <div className="container relative">
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 px-4 text-sm">
            {badge && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-medium tracking-wide uppercase">
                <Sparkles className="w-3 h-3" />
                {badge}
              </span>
            )}

            <span className="text-white/90 font-light text-xs sm:text-sm">
              {message}
            </span>

            <Link
              href={linkHref}
              className="inline-flex items-center gap-1 sm:gap-1.5 font-medium text-white hover:text-[#8DAA9D] transition-colors group whitespace-nowrap"
            >
              <span className="hidden sm:inline">{linkText}</span>
              <span className="sm:hidden">Watch</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer to push non-fixed content below the banner */}
      <div style={{ height: BANNER_HEIGHT }} aria-hidden="true" />
    </>
  )
}
