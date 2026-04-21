"use client"

/**
 * Usage statistics for the dashboard overview + /usage page.
 *
 * STUB: the backend does not yet expose a consolidated usage endpoint.
 * We synthesize a plausible 14-day sparkline and "—" placeholders for
 * headline counters. When the endpoint lands, swap this to a TanStack
 * Query hook hitting apiCall(API_CONFIG.ENDPOINTS.USAGE_STATS, ...).
 */

import * as React from "react"

export interface UsagePoint {
  date: string // ISO yyyy-mm-dd
  queries: number
  tokens: number
}

export interface UsageStats {
  queriesThisWeek: number | null
  tokensThisWeek: number | null
  averageQueryMs: number | null
  series: UsagePoint[]
  isPlaceholder: true
}

export function useUsageStats(): { data: UsageStats; isLoading: boolean } {
  const data = React.useMemo<UsageStats>(() => {
    const today = new Date()
    const series: UsagePoint[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      series.push({
        date: d.toISOString().slice(0, 10),
        queries: 0,
        tokens: 0,
      })
    }
    return {
      queriesThisWeek: null,
      tokensThisWeek: null,
      averageQueryMs: null,
      series,
      isPlaceholder: true,
    }
  }, [])

  return { data, isLoading: false }
}
