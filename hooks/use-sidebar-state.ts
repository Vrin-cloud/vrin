"use client"

import * as React from "react"
import { STORAGE_KEYS, storage } from "@/lib/storage-keys"

/**
 * Collapsed/expanded state for the dashboard sidebar, persisted to localStorage.
 * Returns a tuple of [collapsed, toggle, setCollapsed].
 */
export function useSidebarState(defaultCollapsed = false): [boolean, () => void, (v: boolean) => void] {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const raw = storage.get(STORAGE_KEYS.VRIN_DASHBOARD_SIDEBAR_COLLAPSED)
    if (raw === "1") setCollapsed(true)
    setHydrated(true)
  }, [])

  const setAndPersist = React.useCallback((v: boolean) => {
    setCollapsed(v)
    if (v) storage.set(STORAGE_KEYS.VRIN_DASHBOARD_SIDEBAR_COLLAPSED, "1")
    else storage.remove(STORAGE_KEYS.VRIN_DASHBOARD_SIDEBAR_COLLAPSED)
  }, [])

  const toggle = React.useCallback(() => setAndPersist(!collapsed), [collapsed, setAndPersist])

  // Avoid a hydration mismatch on first render by returning default until mounted.
  return [hydrated ? collapsed : defaultCollapsed, toggle, setAndPersist]
}
