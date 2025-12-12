"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "py-3" : "py-4"
      }`}
    >
      {/* Floating container that becomes a pill when scrolled */}
      <div
        className={`mx-auto transition-all duration-500 ${
          isScrolled
            ? "max-w-4xl px-2"
            : "container"
        }`}
      >
        <div
          className={`transition-all duration-500 ${
            isScrolled
              ? "bg-[#64748B]/50 backdrop-blur-md rounded-full px-6 shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div className={`grid grid-cols-3 items-center transition-all duration-500 ${
            isScrolled ? "h-14" : "h-20"
          }`}>
            {/* Left: Logo */}
            <div className="flex justify-start">
              <Link href="/" className="flex items-center gap-2 transition-all duration-300">
                {/* Icon - always use icon.svg, dark-icon.svg only for dark mode */}
                <Image
                  src="/icon.svg"
                  alt="Vrin"
                  width={isScrolled ? 32 : 40}
                  height={isScrolled ? 32 : 40}
                  className="flex-shrink-0 transition-all duration-300 dark:hidden"
                />
                {/* Dark mode icon */}
                <Image
                  src="/dark-icon.svg"
                  alt="Vrin"
                  width={isScrolled ? 32 : 40}
                  height={isScrolled ? 32 : 40}
                  className="flex-shrink-0 transition-all duration-300 hidden dark:block"
                />

                {/* Company name - always visible */}
                <Image
                  src="/og-image.png"
                  alt="VRiN"
                  width={isScrolled ? 70 : 85}
                  height={isScrolled ? 20 : 24}
                  className={`object-contain transition-all duration-300 ${
                    isScrolled ? "brightness-0 invert" : "dark:brightness-0 dark:invert"
                  }`}
                />
              </Link>
            </div>

            {/* Center: Navigation - Adapts to scroll state */}
            <nav className="hidden md:flex items-center justify-center gap-8">
              <a
                href="#product-demo"
                className={`text-sm font-normal transition-colors duration-200 cursor-pointer ${
                  isScrolled
                    ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                    : "text-vrin-charcoal/60 hover:text-vrin-blue dark:text-vrin-cream/60 dark:hover:text-vrin-sage"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('product-demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Demo
              </a>
              <a
                href="#benchmark"
                className={`text-sm font-normal transition-colors duration-200 cursor-pointer ${
                  isScrolled
                    ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                    : "text-vrin-charcoal/60 hover:text-vrin-blue dark:text-vrin-cream/60 dark:hover:text-vrin-sage"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('[data-benchmark-section]')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Benchmarks
              </a>
              <a
                href="#industries"
                className={`text-sm font-normal transition-colors duration-200 cursor-pointer ${
                  isScrolled
                    ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                    : "text-vrin-charcoal/60 hover:text-vrin-blue dark:text-vrin-cream/60 dark:hover:text-vrin-sage"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Industries
              </a>
              <Link
                href="/enterprise"
                className={`text-sm font-normal transition-colors duration-200 ${
                  isScrolled
                    ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                    : "text-vrin-charcoal/60 hover:text-vrin-blue dark:text-vrin-cream/60 dark:hover:text-vrin-sage"
                }`}
              >
                Enterprise
              </Link>
            </nav>

            {/* Right: Actions - Adapts to scroll state */}
            <div className="flex items-center justify-end gap-3">
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth">
                  <Button
                    size="sm"
                    className={`rounded-full px-5 font-medium transition-all duration-300 ${
                      isScrolled
                        ? "bg-[#FFFDFD] text-[#201E1E] hover:bg-[#8DAA9D]"
                        : "bg-vrin-charcoal text-vrin-cream hover:bg-vrin-blue dark:bg-vrin-cream dark:text-vrin-charcoal dark:hover:bg-vrin-sage"
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
                <ModeToggle />
              </div>

              <button
                className={`md:hidden transition-colors duration-300 ${
                  isScrolled ? "text-[#FFFDFD]" : "text-vrin-charcoal dark:text-vrin-cream"
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - Adapts to scroll state */}
      {isMobileMenuOpen && (
        <div className={`md:hidden mx-4 mt-2 rounded-2xl backdrop-blur-xl ${
          isScrolled
            ? "bg-[#201E1E]/90"
            : "bg-vrin-cream/95 dark:bg-vrin-charcoal/95"
        }`}>
          <div className="px-6 py-6 flex flex-col gap-1">
            <a
              href="#product-demo"
              className={`text-base font-normal py-3 cursor-pointer transition-colors ${
                isScrolled
                  ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                  : "text-vrin-charcoal/70 hover:text-vrin-blue dark:text-vrin-cream/70 dark:hover:text-vrin-sage"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                document.getElementById('product-demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Demo
            </a>
            <a
              href="#benchmark"
              className={`text-base font-normal py-3 cursor-pointer transition-colors ${
                isScrolled
                  ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                  : "text-vrin-charcoal/70 hover:text-vrin-blue dark:text-vrin-cream/70 dark:hover:text-vrin-sage"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                document.querySelector('[data-benchmark-section]')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Benchmarks
            </a>
            <a
              href="#industries"
              className={`text-base font-normal py-3 cursor-pointer transition-colors ${
                isScrolled
                  ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                  : "text-vrin-charcoal/70 hover:text-vrin-blue dark:text-vrin-cream/70 dark:hover:text-vrin-sage"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Industries
            </a>
            <Link
              href="/enterprise"
              className={`text-base font-normal py-3 transition-colors ${
                isScrolled
                  ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                  : "text-vrin-charcoal/70 hover:text-vrin-blue dark:text-vrin-cream/70 dark:hover:text-vrin-sage"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Enterprise
            </Link>
            <div className={`flex items-center gap-4 pt-6 mt-4 border-t ${
              isScrolled
                ? "border-[#FFFDFD]/10"
                : "border-vrin-charcoal/10 dark:border-vrin-cream/10"
            }`}>
              <Link href="/auth" className="flex-1">
                <Button
                  size="sm"
                  className={`w-full rounded-full font-medium ${
                    isScrolled
                      ? "bg-[#FFFDFD] text-[#201E1E] hover:bg-[#8DAA9D]"
                      : "bg-vrin-charcoal text-vrin-cream dark:bg-vrin-cream dark:text-vrin-charcoal"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
