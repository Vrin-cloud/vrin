"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, ChevronDown, Headphones, Building2, Scale, Heart, FileText, BarChart3, BookOpen, Play } from "lucide-react"

// Menu configuration
const menuItems = {
  industries: {
    label: "Industries",
    hasDropdown: true,
    sections: [
      {
        title: "BY INDUSTRY",
        items: [
          { label: "Customer Support", href: "/industries/customer-support", icon: Headphones, description: "AI memory for support teams" },
          { label: "Financial Services", href: "#", icon: Building2, description: "Coming soon" },
          { label: "Legal", href: "#", icon: Scale, description: "Coming soon" },
          { label: "Healthcare", href: "#", icon: Heart, description: "Coming soon" },
        ]
      }
    ],
    featured: {
      title: "FEATURED",
      label: "Customer Support Demo",
      description: "See how VRIN transforms customer support with persistent AI memory",
      href: "/industries/customer-support",
      hasVideo: true
    }
  },
  resources: {
    label: "Resources",
    hasDropdown: true,
    sections: [
      {
        title: "LEARN",
        items: [
          { label: "Blog", href: "/blog", icon: FileText, description: "Engineering & research insights" },
          { label: "Documentation", href: "/docs", icon: BookOpen, description: "API reference and guides" },
          { label: "Benchmarks", href: "/blog/benchmark-results-ragbench-multihop", icon: BarChart3, description: "Performance comparisons" },
        ]
      }
    ],
    featured: {
      title: "LATEST POST",
      label: "97.5% Accuracy on FinQA",
      description: "22% better than Oracle baselines on financial reasoning",
      href: "/blog/benchmark-results-ragbench-multihop",
      hasVideo: false
    }
  },
  enterprise: {
    label: "Enterprise",
    hasDropdown: false,
    href: "/enterprise"
  },
  pricing: {
    label: "Pricing",
    hasDropdown: false,
    href: "/#pricing"
  }
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const dropdownPanelRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is inside nav
      const isInsideNav = navRef.current?.contains(target)
      // Check if click is inside dropdown panel
      const isInsideDropdown = dropdownPanelRef.current?.contains(target)

      // Close if click is outside both nav and dropdown
      if (!isInsideNav && !isInsideDropdown) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    const item = menuItems[key as keyof typeof menuItems]
    if (item.hasDropdown) {
      setActiveDropdown(key)
    }
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const navLinkClass = (isScrolled: boolean) => `
    text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center gap-1
    ${isScrolled
      ? "text-[#FFFDFD]/80 hover:text-[#FFFDFD]"
      : "text-vrin-charcoal/70 hover:text-vrin-charcoal dark:text-vrin-cream/70 dark:hover:text-vrin-cream"
    }
  `

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-4"
      }`}
      style={{ top: 'var(--announcement-bar-height, 0px)' }}
    >
      {/* Main header container */}
      <div
        className={`mx-auto transition-all duration-500 ${
          isScrolled ? "max-w-4xl px-2" : "container"
        }`}
      >
        <div
          className={`transition-all duration-500 ${
            isScrolled
              ? "bg-[#64748B]/50 backdrop-blur-md rounded-full px-6 shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? "h-14" : "h-20"
          }`}>
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 transition-all duration-300">
                <Image
                  src="/icon.svg"
                  alt="Vrin"
                  width={isScrolled ? 32 : 40}
                  height={isScrolled ? 32 : 40}
                  className="flex-shrink-0 transition-all duration-300 dark:hidden"
                />
                <Image
                  src="/dark-icon.svg"
                  alt="Vrin"
                  width={isScrolled ? 32 : 40}
                  height={isScrolled ? 32 : 40}
                  className="flex-shrink-0 transition-all duration-300 hidden dark:block"
                />
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

            {/* Center: Navigation */}
            <nav className="hidden lg:flex items-center gap-8" ref={navRef}>
              {Object.entries(menuItems).map(([key, item]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.hasDropdown ? (
                    <button
                      className={navLinkClass(isScrolled)}
                      onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link href={'href' in item ? item.href : '#'} className={navLinkClass(isScrolled)}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-4">
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
                className={`lg:hidden transition-colors duration-300 ${
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

      {/* Mega Menu Dropdown */}
      {activeDropdown && (
        <div
          ref={dropdownPanelRef}
          className={`absolute left-0 right-0 ${isScrolled ? 'top-[55px]' : 'top-full'}`}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={isScrolled ? "max-w-4xl mx-auto px-2" : "container"}>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#201E1E]/10 dark:border-[#FFFDFD]/10 overflow-hidden">
              {activeDropdown === 'industries' && (
                <div className="grid grid-cols-3 gap-0">
                  {/* Left: Menu Items */}
                  <div className="col-span-2 p-8">
                    {menuItems.industries.sections.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xs font-semibold text-[#201E1E]/50 dark:text-[#FFFDFD]/50 tracking-wider mb-4">
                          {section.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {section.items.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#083C5E]/5 dark:hover:bg-[#8DAA9D]/10 transition-colors group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-[#083C5E]/10 dark:bg-[#8DAA9D]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#083C5E]/20 dark:group-hover:bg-[#8DAA9D]/30 transition-colors">
                                <item.icon className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                              </div>
                              <div>
                                <p className="font-medium text-[#201E1E] dark:text-[#FFFDFD] group-hover:text-[#083C5E] dark:group-hover:text-[#8DAA9D] transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Featured */}
                  <div className="bg-[#8DAA9D]/10 dark:bg-[#8DAA9D]/5 p-8 flex flex-col">
                    <h3 className="text-xs font-semibold text-[#201E1E]/50 dark:text-[#FFFDFD]/50 tracking-wider mb-4">
                      {menuItems.industries.featured.title}
                    </h3>
                    <div className="flex-1 flex flex-col">
                      <div className="aspect-video bg-[#201E1E]/10 dark:bg-[#FFFDFD]/10 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                        <div className="w-12 h-12 rounded-full bg-[#083C5E] dark:bg-[#8DAA9D] flex items-center justify-center">
                          <Play className="w-5 h-5 text-white ml-1" />
                        </div>
                      </div>
                      <h4 className="font-medium text-[#201E1E] dark:text-[#FFFDFD] mb-1">
                        {menuItems.industries.featured.label}
                      </h4>
                      <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 mb-4 flex-1">
                        {menuItems.industries.featured.description}
                      </p>
                      <Link
                        href={menuItems.industries.featured.href}
                        className="text-sm font-medium text-[#083C5E] dark:text-[#8DAA9D] hover:underline"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Watch demo →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeDropdown === 'resources' && (
                <div className="grid grid-cols-3 gap-0">
                  {/* Left: Menu Items */}
                  <div className="col-span-2 p-8">
                    {menuItems.resources.sections.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xs font-semibold text-[#201E1E]/50 dark:text-[#FFFDFD]/50 tracking-wider mb-4">
                          {section.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {section.items.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#083C5E]/5 dark:hover:bg-[#8DAA9D]/10 transition-colors group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-[#083C5E]/10 dark:bg-[#8DAA9D]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#083C5E]/20 dark:group-hover:bg-[#8DAA9D]/30 transition-colors">
                                <item.icon className="w-5 h-5 text-[#083C5E] dark:text-[#8DAA9D]" />
                              </div>
                              <div>
                                <p className="font-medium text-[#201E1E] dark:text-[#FFFDFD] group-hover:text-[#083C5E] dark:group-hover:text-[#8DAA9D] transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Featured */}
                  <div className="bg-[#083C5E]/5 dark:bg-[#083C5E]/10 p-8 flex flex-col">
                    <h3 className="text-xs font-semibold text-[#201E1E]/50 dark:text-[#FFFDFD]/50 tracking-wider mb-4">
                      {menuItems.resources.featured.title}
                    </h3>
                    <div className="flex-1 flex flex-col">
                      <div className="aspect-video bg-gradient-to-br from-[#083C5E] to-[#8DAA9D] rounded-xl mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">97.5%</span>
                      </div>
                      <h4 className="font-medium text-[#201E1E] dark:text-[#FFFDFD] mb-1">
                        {menuItems.resources.featured.label}
                      </h4>
                      <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 mb-4 flex-1">
                        {menuItems.resources.featured.description}
                      </p>
                      <Link
                        href={menuItems.resources.featured.href}
                        className="text-sm font-medium text-[#083C5E] dark:text-[#8DAA9D] hover:underline"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden mx-4 mt-2 rounded-2xl backdrop-blur-xl ${
          isScrolled
            ? "bg-[#201E1E]/90"
            : "bg-vrin-cream/95 dark:bg-vrin-charcoal/95"
        }`}>
          <div className="px-6 py-6 flex flex-col gap-1">
            {/* Industries Section */}
            <div className="py-2">
              <p className={`text-xs font-semibold tracking-wider mb-2 ${
                isScrolled ? "text-[#FFFDFD]/50" : "text-vrin-charcoal/50 dark:text-vrin-cream/50"
              }`}>
                INDUSTRIES
              </p>
              {menuItems.industries.sections[0].items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block text-base font-normal py-2 transition-colors ${
                    isScrolled
                      ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                      : "text-vrin-charcoal/70 hover:text-vrin-blue dark:text-vrin-cream/70 dark:hover:text-vrin-sage"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Resources Section */}
            <div className="py-2 border-t border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
              <p className={`text-xs font-semibold tracking-wider mb-2 mt-2 ${
                isScrolled ? "text-[#FFFDFD]/50" : "text-vrin-charcoal/50 dark:text-vrin-cream/50"
              }`}>
                RESOURCES
              </p>
              {menuItems.resources.sections[0].items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block text-base font-normal py-2 transition-colors ${
                    isScrolled
                      ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                      : "text-vrin-charcoal/70 hover:text-vrin-blue dark:text-vrin-cream/70 dark:hover:text-vrin-sage"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Direct Links */}
            <div className="py-2 border-t border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
              <Link
                href="/enterprise"
                className={`block text-base font-normal py-2 transition-colors ${
                  isScrolled
                    ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                    : "text-vrin-charcoal/70 hover:text-vrin-blue dark:text-vrin-cream/70 dark:hover:text-vrin-sage"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Enterprise
              </Link>
              <Link
                href="/#pricing"
                className={`block text-base font-normal py-2 transition-colors ${
                  isScrolled
                    ? "text-[#FFFDFD]/70 hover:text-[#8DAA9D]"
                    : "text-vrin-charcoal/70 hover:text-vrin-blue dark:text-vrin-cream/70 dark:hover:text-vrin-sage"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </div>

            {/* CTA */}
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
