'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    items: [
      { label: 'Waitlist', href: '/waitlist' },
      { label: 'Playground', href: '/playground' },
      { label: 'For agents', href: '/for-agents' },
      { label: 'Pricing', href: '/#pricing' },
    ],
  },
  {
    title: 'Industries',
    items: [
      { label: 'Customer support', href: '/industries/customer-support' },
      { label: 'Sales', href: '/industries/sales' },
      { label: 'Legal', href: '#' },
      { label: 'Financial services', href: '#' },
    ],
  },
  {
    title: 'Research',
    items: [
      { label: 'Benchmarks', href: '/blog/benchmark-results-multihop-musique' },
      { label: 'Manifesto', href: '/manifesto' },
      { label: 'Research', href: '/research' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Docs', href: '/docs' },
      { label: 'Contact', href: 'https://cal.com/vedant-vrin/book-a-demo' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
];

export function FooterV2() {
  return (
    <footer className="relative bg-vrin-paper px-2 md:px-3 pb-2 md:pb-3">
      <div className="relative bg-vrin-ink pt-24 pb-10 overflow-hidden rounded-[2rem] md:rounded-[3rem]">
      <div className="absolute inset-0 grid-faint-dark opacity-40 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />
      {/* Bottom-left radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 10% 100%, rgba(141, 170, 157, 0.12), transparent 55%)',
        }}
      />

      <div className="container relative z-10">
        {/* Top giant wordmark */}
        <div className="flex items-end justify-between mb-16 gap-8 flex-wrap">
          <div className="flex items-center gap-4">
            <Image src="/dark-icon.svg" alt="Vrin" width={56} height={56} />
            <div>
              <p className="font-display text-4xl text-vrin-cream leading-none">Vrin</p>
              <p className="mt-1 text-[11px] font-mono tracking-[0.18em] uppercase text-vrin-cream/40">
                Reasoning layer for AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-vrin-cream/50">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vrin-sage animate-pulse" />
              All systems operational
            </span>
            <span className="hidden md:inline text-vrin-cream/30">/</span>
            <span className="hidden md:inline">vrin.cloud</span>
          </div>
        </div>

        <div className="hairline opacity-50" />

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 py-14">
          {/* Left statement */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-xl leading-[1.25] text-vrin-cream/80 max-w-[15rem]">
              Context that&apos;s{' '}
              <span className="serif-italic text-vrin-sage">thought through</span>, not
              looked up.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-vrin-sage/80 mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1 text-sm text-vrin-cream/70 hover:text-vrin-cream transition-colors"
                    >
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline opacity-50" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-10">
          <div className="flex items-center gap-6 text-xs font-mono text-vrin-cream/40">
            <span>© 2026 Vrin, Inc.</span>
            <Link href="#" className="hover:text-vrin-cream/70">Privacy</Link>
            <Link href="#" className="hover:text-vrin-cream/70">Terms</Link>
            <Link href="#" className="hover:text-vrin-cream/70">Security</Link>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://twitter.com/vaborvrin" target="_blank" rel="noopener noreferrer" className="text-xs text-vrin-cream/40 hover:text-vrin-cream/80 transition-colors">
              Twitter / X
            </a>
            <span className="text-vrin-cream/20">·</span>
            <a href="https://linkedin.com/company/vrin" target="_blank" rel="noopener noreferrer" className="text-xs text-vrin-cream/40 hover:text-vrin-cream/80 transition-colors">
              LinkedIn
            </a>
            <span className="text-vrin-cream/20">·</span>
            <a href="https://github.com/vrin" target="_blank" rel="noopener noreferrer" className="text-xs text-vrin-cream/40 hover:text-vrin-cream/80 transition-colors">
              GitHub
            </a>
          </div>
        </div>

      </div>
      </div>
    </footer>
  );
}
