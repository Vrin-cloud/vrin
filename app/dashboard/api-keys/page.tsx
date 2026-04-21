"use client"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { ModernApiKeysSection } from "@/components/dashboard/sections/modern-api-keys"

export default function ApiKeysPage() {
  return (
    <PageShell
      eyebrow="Credentials"
      title="API keys"
      description="Generate and manage keys for the SDK, REST API, and MCP server."
    >
      <ModernApiKeysSection />
    </PageShell>
  )
}
