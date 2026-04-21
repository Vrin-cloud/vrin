"use client"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { AISpecializationSection } from "@/components/dashboard/sections/ai-specialization"
import { useDashboardAuth } from "@/components/dashboard/v2/shell/auth-context"

export default function SpecializationPage() {
  const { apiKey } = useDashboardAuth()
  return (
    <PageShell
      eyebrow="Reasoning"
      title="AI specialization"
      description="Define custom experts — reasoning focus, analysis depth, and domain prompts."
    >
      <AISpecializationSection apiKey={apiKey ?? ""} />
    </PageShell>
  )
}
