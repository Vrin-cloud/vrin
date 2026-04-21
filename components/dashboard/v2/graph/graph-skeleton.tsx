"use client"

export function GraphSkeleton() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-border/60 bg-surface-2/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="w-10 h-10 rounded-full border-2 border-vrin-sage/30 border-t-vrin-sage animate-spin" />
          <p className="text-xs">Laying out graph…</p>
        </div>
      </div>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(141,170,157,0.15) 0px, transparent 40%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.1) 0px, transparent 35%)",
        }}
      />
    </div>
  )
}
