"use client"

import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background - VRIN Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8DAA9D]/10 via-transparent to-[#083C5E]/10 dark:from-[#083C5E]/20 dark:via-transparent dark:to-[#8DAA9D]/10" />

      {/* Animated Gradient Orbs - VRIN Sage & Blue */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#8DAA9D]/10 to-[#083C5E]/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#083C5E]/10 to-[#8DAA9D]/10 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-gradient-to-r from-[#8DAA9D]/10 to-[#083C5E]/10 rounded-full blur-3xl animate-float-reverse" />

      {/* Floating Particles - VRIN Colors */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <div className="w-1 h-1 bg-gradient-to-r from-[#8DAA9D] to-[#083C5E] rounded-full opacity-30 dark:opacity-20" />
          </div>
        ))}
      </div>

      {/* Grid Pattern - VRIN Charcoal */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(to right, #201E1E 1px, transparent 1px),
            linear-gradient(to bottom, #201E1E 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Animated Lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--brand-primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--brand-secondary))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-secondary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--brand-secondary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--brand-accent))" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path
          d="M0,50 Q400,100 800,50 T1600,50"
          stroke="url(#lineGradient1)"
          strokeWidth="1"
          fill="none"
          className="animate-draw-line"
        />
        <path
          d="M0,150 Q600,200 1200,150 T2400,150"
          stroke="url(#lineGradient2)"
          strokeWidth="1"
          fill="none"
          className="animate-draw-line-reverse"
        />
      </svg>
      
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(2deg); }
          50% { transform: translate(-10px, -30px) rotate(-1deg); }
          75% { transform: translate(-20px, 10px) rotate(1deg); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(-30px, -10px) rotate(-2deg) scale(1.1); }
          66% { transform: translate(20px, -25px) rotate(2deg) scale(0.9); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, 20px) rotate(3deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px) scale(1.2); opacity: 0.6; }
          50% { transform: translateY(-40px) translateX(-5px) scale(0.8); opacity: 0.4; }
          75% { transform: translateY(-20px) translateX(-10px) scale(1.1); opacity: 0.7; }
        }
        
        @keyframes draw-line {
          0% { stroke-dasharray: 0 1000; }
          100% { stroke-dasharray: 1000 0; }
        }
        
        @keyframes draw-line-reverse {
          0% { stroke-dasharray: 1000 0; }
          100% { stroke-dasharray: 0 1000; }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 18s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        
        .animate-draw-line {
          animation: draw-line 15s ease-in-out infinite alternate;
        }
        
        .animate-draw-line-reverse {
          animation: draw-line-reverse 12s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
} 