"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PageShellProps {
  title: string
  description?: string
  eyebrow?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  /** Remove default content padding (for full-bleed pages like graph / chat). */
  bleed?: boolean
}

export function PageShell({ title, description, eyebrow, actions, children, className, bleed = false }: PageShellProps) {
  return (
    <div className={cn("flex flex-col min-h-full", className)}>
      <div className="px-6 pt-6 pb-4 border-b border-border/60">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow text-muted-foreground mb-1">{eyebrow}</p>}
            <h1 className="font-display text-2xl md:text-3xl leading-tight tracking-heading">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </div>
      <div className={cn("flex-1 min-h-0", bleed ? "" : "p-6")}>{children}</div>
    </div>
  )
}
