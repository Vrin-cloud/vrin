"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useSidebarState } from "@/hooks/use-sidebar-state"
import { useDashboardAuth } from "./auth-context"
import { useConversations } from "@/hooks/use-conversations"
import { DashboardSidebar } from "./sidebar"
import { DashboardTopbar } from "./topbar"
import { DashboardCommandPalette } from "./command-palette"
import { LEGACY_TAB_REDIRECTS } from "./nav-config"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, toggleCollapsed] = useSidebarState(false)
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  const { apiKey, sessionJwt } = useDashboardAuth()
  const bearer = sessionJwt || apiKey || ""
  const { conversations, fetchConversations } = useConversations(bearer)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Cmd+K / Ctrl+K opens the palette globally.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Legacy `?tab=X` deep-link redirect: old dashboard had /dashboard?tab=graph etc.
  // Keep those bookmarks working while routes migrate.
  React.useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && pathname === "/dashboard" && LEGACY_TAB_REDIRECTS[tab]) {
      router.replace(LEGACY_TAB_REDIRECTS[tab])
    }
  }, [searchParams, pathname, router])

  // Fetch recent conversations for the sidebar + palette surfacing.
  React.useEffect(() => {
    if (apiKey) fetchConversations()
  }, [apiKey, fetchConversations])

  const recent = React.useMemo(
    () => conversations.slice(0, 8).map((c) => ({ id: c.session_id, title: c.title || "Untitled conversation" })),
    [conversations]
  )

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <DashboardSidebar collapsed={collapsed} onToggle={toggleCollapsed} recentConversations={recent} />

      {/* Mobile nav — same content in a sheet. */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {/* Sidebar always renders its own chrome; force expanded here. */}
          <div className="h-full">
            <DashboardSidebar collapsed={false} onToggle={() => setMobileNavOpen(false)} recentConversations={recent} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 min-h-0">{children}</main>
      </div>

      <DashboardCommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} recentConversations={recent} />
    </div>
  )
}
