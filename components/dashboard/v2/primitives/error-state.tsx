"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 py-12 px-6 rounded-xl border border-destructive/30 bg-destructive/5",
        className
      )}
    >
      <div className="w-10 h-10 rounded-md bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="space-y-1 max-w-md">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-surface-3"
        >
          Try again
        </button>
      )}
    </div>
  )
}
