"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { useStytchB2BClient, useStytchMemberSession, useStytchMember } from "@stytch/nextjs/b2b"
import { Loader2, Brain } from "lucide-react"

import { AuthService, VRINService } from "@/lib/services/vrin-service"
import { STORAGE_KEYS, storage } from "@/lib/storage-keys"
import { authedFetch as rawAuthedFetch, authedJson as rawAuthedJson, type AuthCredential } from "@/config/api"
import { AuthContext, type DashboardUser } from "./auth-context"

/**
 * Owns the dashboard auth lifecycle in one place.
 *
 * Auth sources, in preference order:
 *   1. Stytch session JWT — the canonical dashboard credential. Short-lived
 *      (~5 min), auto-refreshed by @stytch/nextjs. Read live from
 *      useStytchB2BClient().session.getTokens() on every render so outbound
 *      requests always pick up the freshest token.
 *   2. Stored API key in localStorage — transitional fallback for users
 *      still carrying a legacy key from before the session migration.
 *   3. NextAuth Google session — on first login the backend returns an
 *      api_key which we persist; subsequent visits hit path (1) or (2).
 *
 * The dashboard is rendered as long as EITHER a Stytch session OR an api_key
 * resolves to a known user. Losing localStorage on a fresh browser no longer
 * blocks login — the Stytch cookie is enough.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession()
  const stytchClient = useStytchB2BClient()
  const { session: stytchSession, isInitialized: stytchInitialized } = useStytchMemberSession()
  const { member: stytchMember } = useStytchMember()
  const authService = React.useMemo(() => new AuthService(), [])

  const [user, setUser] = React.useState<DashboardUser | null>(null)
  const [apiKey, setApiKey] = React.useState<string | null>(null)
  const [isChecking, setIsChecking] = React.useState(true)

  // Live session JWT — read lazily on every consumer call so rotation is free.
  const getSessionJwt = React.useCallback((): string | null => {
    try {
      const tokens = stytchClient?.session?.getTokens?.()
      return tokens?.session_jwt || null
    } catch {
      return null
    }
  }, [stytchClient])

  const sessionJwt = stytchInitialized ? getSessionJwt() : null

  // Bootstrap: reconcile Stytch member + localStorage + NextAuth.
  React.useEffect(() => {
    if (!stytchInitialized || sessionStatus === "loading") return

    let storedApiKey = authService.getStoredApiKey()
    let storedUser = authService.getStoredUser() as DashboardUser | null

    // Cross-account mismatch (legacy NextAuth check): if NextAuth email ≠
    // stored email, wipe local state so the next flow issues fresh values.
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

    // Stytch session present → dashboard auth is satisfied even without an
    // api_key in localStorage. Prefer Stytch member info as the canonical
    // source, fall back to localStorage user data for name/created_at.
    if (stytchSession && stytchMember) {
      const derivedUser: DashboardUser = {
        user_id: storedUser?.user_id || stytchMember.member_id,
        email: stytchMember.email_address || storedUser?.email || "",
        name: stytchMember.name || storedUser?.name || (stytchMember.email_address || "").split("@")[0],
        created_at: storedUser?.created_at || new Date().toISOString(),
      }
      setUser(derivedUser)
      setApiKey(storedApiKey) // may be null — that's fine, session carries auth
      setIsChecking(false)
      return
    }

    // No Stytch session. Try legacy localStorage path.
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
      setIsChecking(false)
      return
    }

    // Google OAuth (NextAuth) first-time flow — sync NextAuth-issued key to localStorage.
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
        setIsChecking(false)
        return
      }
    }

    setIsChecking(false)
  }, [session, sessionStatus, authService, stytchInitialized, stytchSession, stytchMember])

  const logout = React.useCallback(async () => {
    authService.logout()
    setUser(null)
    setApiKey(null)
    try {
      await stytchClient?.session?.revoke?.()
    } catch (err) {
      console.warn("Stytch session revoke failed (continuing logout):", err)
    }
    await signOut({ redirect: false })
    window.location.href = "/auth"
  }, [authService, stytchClient])

  // Canonical credential for outbound API calls. Session JWT wins; api_key is fallback.
  const credential = React.useMemo<AuthCredential | null>(() => {
    if (sessionJwt) return { type: "session", value: sessionJwt }
    if (apiKey) return { type: "apikey", value: apiKey }
    return null
  }, [sessionJwt, apiKey])

  // Pre-bound fetch helpers. Read `credential` via closure so hooks calling
  // into them always pick up the freshest token after rotation.
  const authedFetch = React.useCallback(
    (url: string, init: RequestInit = {}) => rawAuthedFetch(url, init, credential),
    [credential]
  )
  const authedJson = React.useCallback(
    <T = unknown,>(url: string, init: RequestInit = {}) => rawAuthedJson<T>(url, init, credential),
    [credential]
  )

  // VRINService bound to the same credential. Constructed anew when the
  // credential changes — cheap, and keeps the private bearer in sync.
  const vrinService = React.useMemo(
    () =>
      new VRINService({
        apiKey: apiKey,
        sessionJwt: sessionJwt,
      }),
    [apiKey, sessionJwt]
  )

  if (isChecking || !stytchInitialized || sessionStatus === "loading") {
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

  // Dashboard requires EITHER a Stytch session OR a stored api_key + user.
  if (!user || !credential) {
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
    <AuthContext.Provider
      value={{
        user,
        credential,
        apiKey,
        sessionJwt,
        authedFetch,
        authedJson,
        vrinService,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
