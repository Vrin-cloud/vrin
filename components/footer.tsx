"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="px-2 md:px-3 pb-2 md:pb-3">
      <div className="bg-black rounded-[2rem] md:rounded-[3rem] mx-auto px-8 md:px-16 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex justify-start leading-none mb-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/dark-icon.svg" alt="Vrin" width={48} height={48} />
              </Link>
            </div>
            <p className="text-sm text-white font-light leading-relaxed">
              Knowledge Reasoning Infrastructure<br />for AI Agents.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D] mb-6">Product</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/auth"
                  className="text-white hover:text-[#8DAA9D] transition-colors duration-200"
                >
                  Try VRIN
                </Link>
              </li>
              <li>
                <a
                  href="#industries"
                  className="text-white hover:text-[#8DAA9D] transition-colors duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Industries
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="text-white hover:text-[#8DAA9D] transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D] mb-6">Platform</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/auth" className="text-white hover:text-[#8DAA9D] transition-colors duration-200">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-white hover:text-[#8DAA9D] transition-colors duration-200">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-[#8DAA9D] mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="https://calendly.com/vedant-vrin/15-minute-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#8DAA9D] transition-colors duration-200 cursor-pointer"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#FFFFFF]/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-[#FFFFFF]/50">
            <span>© 2026 Vrin. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#FFFFFF]/50">
            <span>Status:</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#8DAA9D] rounded-full"></div>
              <span className="text-[#8DAA9D]">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
