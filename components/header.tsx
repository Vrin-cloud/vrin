"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)

      // Detect if scrolled past hero section (typically around 600-800px)
      // Hero sections are usually viewport height, so using window.innerHeight is more reliable
      const heroHeight = window.innerHeight * 0.8 // 80% of viewport height
      setIsScrolledPastHero(scrollPosition > heroHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left: Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-1/2 transition-all duration-300">
              {/* Icon - always visible, constant size */}
              <Image
                src="/icon.svg"
                alt="Vrin"
                width={40}
                height={40}
                className="flex-shrink-0"
              />

              {/* Company name from og-image - hidden when scrolled past hero */}
              <div
                className={`transition-all duration-300 ${
                  isScrolledPastHero
                    ? 'opacity-0 w-0 overflow-hidden'
                    : 'opacity-100 w-auto'
                }`}
              >
                <Image
                  src="/og-image.png"
                  alt="VRiN"
                  width={85}
                  height={24}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            <a
              href="#product-demo"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('product-demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Demo
            </a>
            <a
              href="#benchmark"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('[data-benchmark-section]')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Benchmarks
            </a>
            <a
              href="#industries"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Industries
            </a>
            <Link href="/enterprise" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Enterprise
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-4">
              {/* <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
              </Link> */}
            <Link href="/auth">
              <Button size="sm" className="gradient-bg text-white hover:opacity-90">
                Get Started
              </Button>
            </Link>
            <ModeToggle />
          </div>

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container py-4 flex flex-col gap-4">
            <a
              href="#product-demo"
              className="text-sm font-medium py-2 text-foreground cursor-pointer"
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
              className="text-sm font-medium py-2 text-foreground cursor-pointer"
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
              className="text-sm font-medium py-2 text-foreground cursor-pointer"
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
              className="text-sm font-medium py-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Enterprise
            </Link>
            <div className="flex items-center gap-4 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Log in
                </Button>
              </Link>
              <Link href="/auth" className="flex-1">
                <Button size="sm" className="w-full gradient-bg text-white hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="flex justify-end pt-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
