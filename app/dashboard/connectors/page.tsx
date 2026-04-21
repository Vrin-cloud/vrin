"use client"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { DataSourcesSection } from "@/components/dashboard/sections/data-sources-section"
import { useDashboardAuth } from "@/components/dashboard/v2/shell/auth-context"

export default function ConnectorsPage() {
  const { user, apiKey } = useDashboardAuth()
  return (
    <PageShell
      eyebrow="Integrations"
      title="Connectors"
      description="Sync Notion, Slack, Google Drive, and more into your knowledge graph."
    >
      <DataSourcesSection apiKey={apiKey ?? undefined} userId={user.user_id} userEmail={user.email} />
    </PageShell>
  )
}
