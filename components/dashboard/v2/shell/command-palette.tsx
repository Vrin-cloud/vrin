"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "next-themes"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { PRIMARY_NAV, SECONDARY_NAV } from "./nav-config"
import { useDashboardAuth } from "./auth-context"

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  recentConversations?: Array<{ id: string; title: string }>
}

export function DashboardCommandPalette({ open, onOpenChange, recentConversations = [] }: Props) {
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { logout } = useDashboardAuth()

  const run = (fn: () => void) => {
    onOpenChange(false)
    // Defer to next tick so the dialog close animation doesn't swallow focus.
    setTimeout(fn, 0)
  }

  const navItems = React.useMemo(() => {
    const flat: Array<{ id: string; label: string; href: string; icon: React.ComponentType<{ className?: string }>; keywords?: string[] }> = []
    for (const item of [...PRIMARY_NAV, ...SECONDARY_NAV]) {
      flat.push({ id: item.id, label: item.label, href: item.href, icon: item.icon, keywords: item.keywords })
      for (const child of item.children || []) {
        flat.push({ id: child.id, label: `${item.label} / ${child.label}`, href: child.href, icon: child.icon, keywords: child.keywords })
      }
    }
    return flat
  }, [])

  const currentTheme = theme === "system" ? resolvedTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search or jump to…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.id}
                value={`${item.label} ${(item.keywords || []).join(" ")}`}
                onSelect={() => run(() => router.push(item.href))}
              >
                <Icon className="text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        {recentConversations.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent conversations">
              {recentConversations.slice(0, 6).map((c) => (
                <CommandItem
                  key={c.id}
                  value={`conversation ${c.title}`}
                  onSelect={() => run(() => router.push(`/chat?session=${c.id}`))}
                >
                  <span className="truncate">{c.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          <CommandItem value="new chat conversation" onSelect={() => run(() => router.push("/chat"))}>
            <Plus className="text-muted-foreground" />
            <span>New chat</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem
            value={`toggle theme ${isDark ? "light" : "dark"}`}
            onSelect={() => run(() => setTheme(isDark ? "light" : "dark"))}
          >
            {isDark ? <Sun className="text-muted-foreground" /> : <Moon className="text-muted-foreground" />}
            <span>{isDark ? "Switch to light" : "Switch to dark"}</span>
          </CommandItem>
          <CommandItem value="sign out logout" onSelect={() => run(logout)}>
            <LogOut className="text-muted-foreground" />
            <span>Sign out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
