"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface KpiCardProps {
  label: string
  value: React.ReactNode
  hint?: string
  icon?: LucideIcon
  href?: string
  loading?: boolean
  className?: string
}

export function KpiCard({ label, value, hint, icon: Icon, href, loading, className }: KpiCardProps) {
  const body = (
    <div
      className={cn(
        "group relative flex flex-col justify-between h-full p-5 rounded-xl border border-border/60 bg-surface-2/70 hover:border-border hover:bg-surface-2 transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <p className="eyebrow text-[10px]">{label}</p>
        {Icon && <Icon className="w-4 h-4" />}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        {loading ? (
          <div className="h-8 w-20 bg-surface-3 rounded animate-pulse" />
        ) : (
          <span className="font-display text-3xl md:text-4xl leading-none tracking-heading mono-num">{value}</span>
        )}
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
      {href && (
        <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  )

  return href ? <Link href={href}>{body}</Link> : body
}
