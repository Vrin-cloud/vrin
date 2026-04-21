"use client"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { MCPSection } from "@/components/dashboard/sections/mcp-section"
import { useDashboardAuth } from "@/components/dashboard/v2/shell/auth-context"

export default function McpPage() {
  const { apiKey } = useDashboardAuth()
  return (
    <PageShell
      eyebrow="Model Context Protocol"
      title="MCP server"
      description="Wire Claude, Cursor, and other MCP clients into your VRIN knowledge base."
    >
      <MCPSection apiKey={apiKey} />
    </PageShell>
  )
}
