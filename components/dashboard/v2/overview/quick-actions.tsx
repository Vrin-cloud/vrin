"use client"

import * as React from "react"
import Link from "next/link"
import { MessageSquare, Network, Upload, Plug, Key, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface Action {
  label: string
  description: string
  href: string
  icon: LucideIcon
}

const ACTIONS: Action[] = [
  { label: "Ask VRIN", description: "Start a new conversation grounded in your knowledge.", href: "/chat", icon: MessageSquare },
  { label: "Explore graph", description: "See entities and relationships in 3D or 2D.", href: "/dashboard/knowledge", icon: Network },
  { label: "Upload documents", description: "Ingest PDFs, notes, or text — facts extracted in seconds.", href: "/dashboard/knowledge/uploads", icon: Upload },
  { label: "Connect a source", description: "Sync Notion, Slack, Google Drive, and more.", href: "/dashboard/connectors", icon: Plug },
  { label: "New API key", description: "Generate a key for SDK, MCP, or direct API use.", href: "/dashboard/api-keys", icon: Key },
]

export function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5", className)}>
      {ACTIONS.map((a) => {
        const Icon = a.icon
        return (
          <Link
            key={a.label}
            href={a.href}
            className="group flex flex-col gap-2 p-4 rounded-xl border border-border/60 bg-surface-2/40 hover:bg-surface-2 hover:border-border transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-md bg-foreground/5 flex items-center justify-center text-foreground">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{a.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
