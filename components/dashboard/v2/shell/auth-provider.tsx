"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { Loader2, Brain } from "lucide-react"

import { AuthService, VRINService } from "@/lib/services/vrin-service"
import { STORAGE_KEYS, storage } from "@/lib/storage-keys"
import { AuthContext, type DashboardUser } from "./auth-context"

/**
 * Owns the dashboard auth lifecycle in one place.
 *
 * Why: previously every page re-ran the same localStorage + NextAuth
 * reconciliation. Centralising it means section pages can assume a valid
 * `{user, apiKey, vrinService}` via useDashboardAuth().
 *
 * Preserves the sequence from the legacy app/dashboard/page.tsx:
 *   1. Read localStorage (api key + user).
 *   2. If NextAuth session email differs, wipe stale local state.
 *   3. If local state missing but NextAuth has a Google session, sync it down.
 *   4. Redirect to /auth when neither path yields credentials.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession()
  const authService = React.useMemo(() => new AuthService(), [])

  const [user, setUser] = React.useState<DashboardUser | null>(null)
  const [apiKey, setApiKey] = React.useState<string | null>(null)
  const [vrinService, setVrinService] = React.useState<VRINService | null>(null)
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    let storedApiKey = authService.getStoredApiKey()
    let storedUser = authService.getStoredUser() as DashboardUser | null

    // Cross-account mismatch: clear stale data when NextAuth disagrees with localStorage.
    if (session?.user?.email && storedUser?.email && session.user.email !== storedUser.email) {
      console.warn(
        `Security: session mismatch — localStorage ${storedUser.email} vs NextAuth ${session.user.email}. Clearing.`
      )
      storage.remove(STORAGE_KEYS.VRIN_API_KEY)
      storage.remove(STORAGE_KEYS.VRIN_USER)
      storage.remove(STORAGE_KEYS.VRIN_CHAT_SESSION_ID)
      storedApiKey = null
      storedUser = null
    }

    if (storedApiKey && storedUser) {
      if (!storedUser.user_id || !storedUser.email) {
        console.warn("Incomplete user data in localStorage — redirecting to /auth")
        storage.remove(STORAGE_KEYS.VRIN_USER)
        storage.remove(STORAGE_KEYS.VRIN_API_KEY)
        setIsChecking(false)
        window.location.href = "/auth"
        return
      }
      setApiKey(storedApiKey)
      setUser(storedUser)
      setVrinService(new VRINService(storedApiKey))
      setIsChecking(false)
      return
    }

    if (sessionStatus === "loading") return

    // Google OAuth path: sync NextAuth → localStorage on first dashboard visit.
    if (session?.user) {
      const nextAuthUser = session.user as { email?: string; name?: string; apiKey?: string; userId?: string }
      if (nextAuthUser.apiKey && nextAuthUser.userId) {
        const userData: DashboardUser = {
          user_id: nextAuthUser.userId,
          email: nextAuthUser.email || "",
          name: nextAuthUser.name || nextAuthUser.email?.split("@")[0] || "",
          created_at: new Date().toISOString(),
        }
        storage.set(STORAGE_KEYS.VRIN_API_KEY, nextAuthUser.apiKey)
        storage.setJson(STORAGE_KEYS.VRIN_USER, userData)
        setApiKey(nextAuthUser.apiKey)
        setUser(userData)
        setVrinService(new VRINService(nextAuthUser.apiKey))
      }
    }
    setIsChecking(false)
  }, [session, sessionStatus, authService])

  const logout = React.useCallback(async () => {
    authService.logout()
    setUser(null)
    setApiKey(null)
    setVrinService(null)
    await signOut({ redirect: false })
    window.location.href = "/auth"
  }, [authService])

  if (isChecking || sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-sm">Checking authentication…</p>
        </div>
      </div>
    )
  }

  if (!user || !apiKey || !vrinService) {
    if (typeof window !== "undefined") window.location.href = "/auth"
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-sm">Redirecting to login…</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, apiKey, vrinService, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
