"use client"

import * as React from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

import type { UsagePoint } from "@/hooks/use-usage-stats"

export function UsageSparkline({ series, placeholder }: { series: UsagePoint[]; placeholder?: boolean }) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="vrin-spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--vrin-sage))" stopOpacity={placeholder ? 0.2 : 0.5} />
              <stop offset="100%" stopColor="hsl(var(--vrin-sage))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          {!placeholder && (
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 6,
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              cursor={{ stroke: "hsl(var(--border))" }}
            />
          )}
          <Area
            type="monotone"
            dataKey="queries"
            stroke="hsl(var(--vrin-sage))"
            strokeWidth={1.5}
            fill="url(#vrin-spark)"
          />
        </AreaChart>
      </ResponsiveContainer>
      {placeholder && (
        <p className="text-[11px] text-muted-foreground -mt-6 ml-1">Usage data arriving soon</p>
      )}
    </div>
  )
}
