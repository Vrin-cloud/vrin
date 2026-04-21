import {
  LayoutDashboard,
  MessageSquare,
  Network,
  BookOpen,
  Upload,
  Plug,
  Key,
  BarChart3,
  Sparkles,
  Server,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  /** Optional nested children; parent rendered as collapsible group. */
  children?: NavItem[]
  /** Hint for command palette keywords. */
  keywords?: string[]
}

/**
 * Single source of truth for dashboard navigation. The sidebar renders these,
 * and the command palette surfaces them under a "Navigate" group.
 *
 * During the migration `href` uses real routes. Pages that don't exist yet
 * (Phase 4+) will 404 — legacy `?tab=X` deep links are redirected by the
 * shell's redirect shim so bookmarks don't break.
 */
export const PRIMARY_NAV: NavItem[] = [
  { id: "overview", label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { id: "chat", label: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  {
    id: "knowledge",
    label: "Knowledge",
    href: "/dashboard/knowledge",
    icon: Network,
    children: [
      { id: "knowledge-graph", label: "Graph", href: "/dashboard/knowledge", icon: Network },
      { id: "knowledge-wiki", label: "Wiki", href: "/dashboard/knowledge/wiki", icon: BookOpen },
      { id: "knowledge-uploads", label: "Uploads", href: "/dashboard/knowledge/uploads", icon: Upload },
    ],
  },
  { id: "connectors", label: "Connectors", href: "/dashboard/connectors", icon: Plug, keywords: ["notion", "slack", "drive", "integrations"] },
  { id: "api-keys", label: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { id: "specialization", label: "Specialization", href: "/dashboard/specialization", icon: Sparkles },
  { id: "mcp", label: "MCP", href: "/dashboard/mcp", icon: Server, keywords: ["model context protocol"] },
  { id: "usage", label: "Usage", href: "/dashboard/usage", icon: BarChart3 },
]

export const SECONDARY_NAV: NavItem[] = [
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
]

/** Legacy `?tab=X` values from the old single-page dashboard → new routes. */
export const LEGACY_TAB_REDIRECTS: Record<string, string> = {
  home: "/dashboard",
  "data-sources": "/dashboard/connectors",
  graph: "/dashboard/knowledge",
  "ai-specialization": "/dashboard/specialization",
  "api-keys": "/dashboard/api-keys",
  mcp: "/dashboard/mcp",
  "api-docs": "/dashboard",
}
