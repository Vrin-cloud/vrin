"use client"

import * as React from "react"
import type { VRINService } from "@/lib/services/vrin-service"
import type { AuthCredential } from "@/config/api"

export interface DashboardUser {
  user_id: string
  email: string
  name?: string
  created_at: string
}

export interface AuthContextValue {
  user: DashboardUser

  /**
   * Current best credential for dashboard calls. Prefers a Stytch session JWT
   * (short-lived, auto-rotating) when the user is signed in via Stytch;
   * falls back to the stored API key for legacy sessions and during the
   * transition window. Consumers generally do NOT read this directly —
   * prefer `authedFetch`/`authedJson` or the pre-wired `vrinService`.
   */
  credential: AuthCredential | null

  /**
   * The raw, long-lived VRIN API key — now optional. Exposed for the API-keys
   * page and any UI that needs to surface the SDK key to the user. May be
   * null for users who only ever authenticated via Stytch on a fresh browser.
   */
  apiKey: string | null

  /**
   * Stytch session JWT when present, else null. Short-lived (~5 min); read
   * lazily by the helpers below so every call picks up the freshest value.
   */
  sessionJwt: string | null

  /**
   * Authenticated fetch helper. Takes an absolute URL (or path relative to
   * the caller's chosen base URL) plus a standard RequestInit; attaches the
   * current best credential automatically. Mirrors `fetch` so hooks that
   * previously did `fetch(url, { headers: { Authorization: ... } })` can swap
   * with a one-line change.
   */
  authedFetch: (url: string, init?: RequestInit) => Promise<Response>

  /**
   * JSON convenience wrapper. Throws on non-2xx.
   */
  authedJson: <T = unknown>(url: string, init?: RequestInit) => Promise<T>

  /**
   * Pre-wired VRINService bound to the current credential. Kept for
   * backward compat with hooks that still want the typed service surface.
   */
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
