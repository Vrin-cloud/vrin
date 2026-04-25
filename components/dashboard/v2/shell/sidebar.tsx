"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, ChevronDown, MessageSquarePlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PRIMARY_NAV, SECONDARY_NAV, type NavItem } from "./nav-config"
import vrinIcon from "@/app/icon.svg"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  recentConversations?: Array<{ id: string; title: string }>
}

export function DashboardSidebar({ collapsed, onToggle, recentConversations = [] }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "hidden lg:flex shrink-0 flex-col border-r border-border bg-surface-2/40 transition-[width] duration-200 ease-out",
        collapsed ? "w-[72px]" : "w-[248px]"
      )}
      aria-label="Dashboard navigation"
    >
      <div className="h-14 flex items-center justify-between px-3 border-b border-border/60">
        {collapsed ? (
          <button
            onClick={onToggle}
            className="mx-auto flex items-center justify-center w-9 h-9 rounded-md hover:bg-surface-3 transition-colors"
            aria-label="Expand sidebar"
          >
            <Image src={vrinIcon} alt="VRIN" width={22} height={22} unoptimized />
          </button>
        ) : (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 px-2">
              <Image src={vrinIcon} alt="VRIN" width={22} height={22} unoptimized />
              <span className="font-semibold tracking-tight text-sm">VRIN</span>
            </Link>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md hover:bg-surface-3 text-muted-foreground"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <ScrollArea className="flex-1">
        <nav className="px-2 py-3 space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              recentConversations={item.id === "chat" ? recentConversations : undefined}
            />
          ))}
        </nav>

        {!collapsed && SECONDARY_NAV.length > 0 && (
          <>
            <div className="mx-3 my-2 border-t border-border/60" />
            <nav className="px-2 pb-3 space-y-0.5">
              {SECONDARY_NAV.map((item) => (
                <SidebarItem key={item.id} item={item} pathname={pathname} collapsed={collapsed} />
              ))}
            </nav>
          </>
        )}
      </ScrollArea>

      {collapsed && SECONDARY_NAV.length > 0 && (
        <div className="px-2 py-3 border-t border-border/60 space-y-0.5">
          {SECONDARY_NAV.map((item) => (
            <SidebarItem key={item.id} item={item} pathname={pathname} collapsed />
          ))}
        </div>
      )}
    </aside>
  )
}

interface SidebarItemProps {
  item: NavItem
  pathname: string
  collapsed: boolean
  recentConversations?: Array<{ id: string; title: string }>
}

function SidebarItem({ item, pathname, collapsed, recentConversations }: SidebarItemProps) {
  const Icon = item.icon
  const isActive = isRouteActive(item.href, pathname)
  const hasChildren = !!item.children?.length
  const [expanded, setExpanded] = React.useState(() => isActive || item.children?.some((c) => isRouteActive(c.href, pathname)))

  if (collapsed) {
    return (
      <Link
        href={item.href}
        aria-label={item.label}
        className={cn(
          "flex items-center justify-center w-10 h-10 mx-auto rounded-md transition-colors",
          isActive ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface-3"
        )}
      >
        <Icon className="w-4 h-4" />
      </Link>
    )
  }

  return (
    <div>
      <div className="flex items-stretch">
        <Link
          href={item.href}
          className={cn(
            "flex-1 flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
            isActive
              ? "bg-foreground/5 text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-3"
          )}
        >
          <Icon className={cn("w-4 h-4 shrink-0", isActive && "text-foreground")} />
          <span className="truncate">{item.label}</span>
        </Link>
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setExpanded((v) => !v)
            }}
            className="px-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-3"
            aria-label={expanded ? "Collapse section" : "Expand section"}
          >
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded ? "" : "-rotate-90")} />
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="mt-0.5 ml-6 space-y-0.5 border-l border-border/60 pl-2">
          {item.children!.map((child) => {
            const childActive = isRouteActive(child.href, pathname)
            const ChildIcon = child.icon
            return (
              <Link
                key={child.id}
                href={child.href}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                  childActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-3"
                )}
              >
                <ChildIcon className="w-3.5 h-3.5" />
                <span className="truncate">{child.label}</span>
              </Link>
            )
          })}
        </div>
      )}

      {recentConversations && recentConversations.length > 0 && (
        <div className="mt-1 ml-6 space-y-0.5 border-l border-border/60 pl-2">
          <Link
            href="/chat"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface-3"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>New conversation</span>
          </Link>
          {recentConversations.slice(0, 6).map((conv) => (
            <Link
              key={conv.id}
              href={`/chat?session=${conv.id}`}
              className="block px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface-3 truncate"
              title={conv.title}
            >
              {conv.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function isRouteActive(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Compact floating expand button for when the sidebar is hidden on mobile. */
export function SidebarExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-border hover:bg-surface-3"
      aria-label="Open navigation"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  )
}
