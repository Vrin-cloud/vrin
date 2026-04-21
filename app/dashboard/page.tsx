"use client"

import * as React from "react"
import { Network, GitBranch, Layers, Key } from "lucide-react"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { KpiCard } from "@/components/dashboard/v2/primitives/kpi-card"
import { SectionHeader } from "@/components/dashboard/v2/primitives/section-header"
import { QuickActions } from "@/components/dashboard/v2/overview/quick-actions"
import { ActivityFeed } from "@/components/dashboard/v2/overview/activity-feed"
import { UsageSparkline } from "@/components/dashboard/v2/overview/usage-sparkline"
import { useDashboardAuth } from "@/components/dashboard/v2/shell/auth-context"
import { useAccountKnowledgeGraph } from "@/hooks/use-knowledge-graph"
import { useApiKeys } from "@/hooks/use-api-keys"
import { useUsageStats } from "@/hooks/use-usage-stats"
import { computeCommunities } from "@/lib/utils/graph-communities"

export default function DashboardOverviewPage() {
  const { user } = useDashboardAuth()
  const { data: graphResponse, isLoading: graphLoading } = useAccountKnowledgeGraph({ limit: 2000 })
  const { apiKeys, isLoading: keysLoading } = useApiKeys()
  const usage = useUsageStats()

  const nodes = graphResponse?.data?.nodes || []
  const edges = graphResponse?.data?.edges || []

  const clusterCount = React.useMemo(() => {
    if (!nodes.length) return 0
    return computeCommunities(nodes, edges).count
  }, [nodes, edges])

  const greetingName = user.name || user.email.split("@")[0]

  return (
    <PageShell
      eyebrow="Overview"
      title={`Welcome back, ${greetingName}`}
      description="Your retrieval-time reasoning layer, at a glance."
    >
      <div className="space-y-8">
        <section>
          <SectionHeader title="Quick actions" />
          <QuickActions />
        </section>

        <section>
          <SectionHeader title="Your knowledge" description="Entities and relationships in your account." />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <KpiCard
              label="Entities"
              value={formatNumber(nodes.length)}
              hint="Distinct nodes in the graph"
              icon={Network}
              href="/dashboard/knowledge/wiki"
              loading={graphLoading}
            />
            <KpiCard
              label="Relationships"
              value={formatNumber(edges.length)}
              hint="Fact triples connecting entities"
              icon={GitBranch}
              href="/dashboard/knowledge"
              loading={graphLoading}
            />
            <KpiCard
              label="Clusters"
              value={formatNumber(clusterCount)}
              hint="Communities detected in your graph"
              icon={Layers}
              href="/dashboard/knowledge"
              loading={graphLoading}
            />
            <KpiCard
              label="API keys"
              value={formatNumber(apiKeys?.length || 0)}
              hint="Active keys for SDK & MCP"
              icon={Key}
              href="/dashboard/api-keys"
              loading={keysLoading}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-3 p-5 rounded-xl border border-border/60 bg-surface-2/40">
            <SectionHeader title="Usage" description="Queries over the last 14 days." className="mb-1" />
            <UsageSparkline series={usage.data.series} placeholder={usage.data.isPlaceholder} />
          </div>
          <div className="flex flex-col gap-3">
            <SectionHeader title="Recent activity" description="Live updates from the knowledge graph." className="mb-1" />
            <ActivityFeed />
          </div>
        </section>
      </div>
    </PageShell>
  )
}

function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—"
  if (n < 1000) return n.toString()
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`
  return `${(n / 1_000_000).toFixed(1)}M`
}
