"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { PRIMARY_NAV, SECONDARY_NAV } from "./nav-config"
import { ThemeToggle } from "./theme-toggle"
import { UserMenu } from "./user-menu"

interface TopbarProps {
  onOpenPalette: () => void
  onOpenMobileNav: () => void
}

export function DashboardTopbar({ onOpenPalette }: TopbarProps) {
  const pathname = usePathname()
  const title = pageTitleFromPath(pathname)
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  const shortcut = isMac ? "⌘" : "Ctrl"

  return (
    <header className="h-14 flex items-center justify-between gap-3 px-4 border-b border-border/60 bg-background/60 backdrop-blur">
      <div className="min-w-0 flex items-center gap-2">
        <h1 className="text-sm font-medium text-foreground truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenPalette}
          className={cn(
            "hidden md:inline-flex items-center gap-2 px-3 h-9 rounded-md border border-border/80 bg-surface-2/60 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors min-w-[240px]"
          )}
          aria-label="Open command palette"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search or jump to…</span>
          <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground/80">
            <span>{shortcut}</span>
            <span>K</span>
          </kbd>
        </button>

        <button
          onClick={onOpenPalette}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-3"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}

function pageTitleFromPath(pathname: string): string {
  const all = [...PRIMARY_NAV, ...SECONDARY_NAV]
  // Deeper matches first (e.g. /dashboard/knowledge/wiki before /dashboard/knowledge).
  const candidates = all
    .flatMap((item) => [item, ...(item.children || [])])
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)
  return candidates[0]?.label ?? "Dashboard"
}
