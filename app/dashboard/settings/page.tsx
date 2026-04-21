"use client"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { SectionHeader } from "@/components/dashboard/v2/primitives/section-header"
import { useDashboardAuth } from "@/components/dashboard/v2/shell/auth-context"
import { useTheme } from "next-themes"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function SettingsPage() {
  const { user, logout } = useDashboardAuth()
  const { theme, setTheme } = useTheme()

  return (
    <PageShell eyebrow="Preferences" title="Settings" description="Profile, appearance, and account controls.">
      <div className="space-y-8 max-w-2xl">
        <section className="p-5 rounded-xl border border-border/60 bg-surface-2/40">
          <SectionHeader title="Profile" />
          <dl className="grid grid-cols-3 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="col-span-2">{user.name || "—"}</dd>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="col-span-2">{user.email}</dd>
            <dt className="text-muted-foreground">User ID</dt>
            <dd className="col-span-2 font-mono text-xs text-muted-foreground truncate">{user.user_id}</dd>
          </dl>
        </section>

        <section className="p-5 rounded-xl border border-border/60 bg-surface-2/40">
          <SectionHeader title="Appearance" description="Light, dark, or follow the system." />
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(v) => v && setTheme(v)}
            variant="outline"
            size="sm"
            className="justify-start"
          >
            <ToggleGroupItem value="light">Light</ToggleGroupItem>
            <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
            <ToggleGroupItem value="system">System</ToggleGroupItem>
          </ToggleGroup>
        </section>

        <section className="p-5 rounded-xl border border-destructive/30 bg-destructive/5">
          <SectionHeader title="Danger zone" description="Irreversible account actions." />
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            Sign out of this device
          </button>
        </section>
      </div>
    </PageShell>
  )
}
