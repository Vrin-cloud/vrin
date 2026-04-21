"use client"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { SectionHeader } from "@/components/dashboard/v2/primitives/section-header"
import { KpiCard } from "@/components/dashboard/v2/primitives/kpi-card"
import { UsageSparkline } from "@/components/dashboard/v2/overview/usage-sparkline"
import { EmptyState } from "@/components/dashboard/v2/primitives/empty-state"
import { BarChart3 } from "lucide-react"
import { useUsageStats } from "@/hooks/use-usage-stats"

export default function UsagePage() {
  const { data } = useUsageStats()
  return (
    <PageShell
      eyebrow="Metering"
      title="Usage"
      description="Queries, tokens, and latency across your API keys."
    >
      <div className="space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard label="Queries · 7d" value={data.queriesThisWeek ?? "—"} />
          <KpiCard label="Tokens · 7d" value={data.tokensThisWeek ?? "—"} />
          <KpiCard label="Avg latency" value={data.averageQueryMs ? `${data.averageQueryMs}ms` : "—"} />
        </section>

        <section className="p-5 rounded-xl border border-border/60 bg-surface-2/40">
          <SectionHeader title="Queries · 14 days" />
          <UsageSparkline series={data.series} placeholder={data.isPlaceholder} />
        </section>

        <EmptyState
          icon={BarChart3}
          title="Per-query history coming soon"
          description="We're adding a backend endpoint to surface individual queries, their sources, and latency. This page will light up when it ships."
        />
      </div>
    </PageShell>
  )
}
