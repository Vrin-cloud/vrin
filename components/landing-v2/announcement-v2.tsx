'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const BANNER_HEIGHT = 40;

export function AnnouncementV2() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--announcement-bar-height',
      `${BANNER_HEIGHT}px`
    );
    return () => {
      document.documentElement.style.setProperty(
        '--announcement-bar-height',
        '0px'
      );
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] bg-vrin-ink border-b border-vrin-cream/5">
        <div className="container">
          <div className="flex items-center justify-center gap-3 py-2.5 px-4 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-vrin-sage animate-pulse" />
              <span className="font-mono tracking-[0.18em] uppercase text-vrin-sage/90 text-[10px]">
                New
              </span>
            </span>

            <span className="text-vrin-cream/75 font-normal">
              <span className="hidden sm:inline">See how Vrin resolves complex support tickets faster.&nbsp;</span>
              <span className="sm:hidden">Support demo&nbsp;·&nbsp;</span>
            </span>

            <Link
              href="/industries/customer-support#demo"
              className="group inline-flex items-center gap-1 font-medium text-vrin-cream hover:text-vrin-sage transition-colors"
            >
              Watch the demo
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>
      </div>
      <div style={{ height: BANNER_HEIGHT }} aria-hidden="true" />
    </>
  );
}
