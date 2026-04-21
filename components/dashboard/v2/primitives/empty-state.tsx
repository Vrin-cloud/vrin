"use client"

import * as React from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; href?: string; onClick?: () => void }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 py-12 px-6 rounded-xl border border-dashed border-border/70 bg-surface-2/30",
        className
      )}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-md bg-surface-3 flex items-center justify-center text-muted-foreground">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="space-y-1 max-w-md">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-foreground text-background hover:opacity-90"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-foreground text-background hover:opacity-90"
          >
            {action.label}
          </button>
        ))}
    </div>
  )
}
