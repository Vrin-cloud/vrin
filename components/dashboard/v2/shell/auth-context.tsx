"use client"

import * as React from "react"
import type { VRINService } from "@/lib/services/vrin-service"

export interface DashboardUser {
  user_id: string
  email: string
  name?: string
  created_at: string
}

export interface AuthContextValue {
  user: DashboardUser
  apiKey: string
  vrinService: VRINService
  logout: () => Promise<void>
}

export const AuthContext = React.createContext<AuthContextValue | null>(null)

export function useDashboardAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error("useDashboardAuth must be used inside <AuthProvider> (dashboard layout)")
  }
  return ctx
}
