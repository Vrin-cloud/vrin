import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthProvider } from "@/components/dashboard/v2/shell/auth-provider"
import { DashboardShell } from "@/components/dashboard/v2/shell/dashboard-shell"

export const metadata: Metadata = {
  title: "Dashboard — VRIN",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <DashboardShell>{children}</DashboardShell>
      </Suspense>
    </AuthProvider>
  )
}
