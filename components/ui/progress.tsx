import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

const EnterpriseProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    status?: 'idle' | 'pending' | 'deploying' | 'completed' | 'failed'
    showPercentage?: boolean
    animated?: boolean
  }
>(({ className, value, status, showPercentage = true, animated = true, ...props }, ref) => {
  const getProgressColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      case 'deploying':
        return 'bg-blue-500'
      case 'pending':
        return 'bg-yellow-500'
      default:
        return 'bg-primary'
    }
  }

  return (
    <div className="space-y-2">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            getProgressColor(),
            animated && status === 'deploying' && "animate-pulse"
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
        {animated && status === 'deploying' && (
          <div className="absolute inset-0 deployment-progress opacity-30" />
        )}
      </ProgressPrimitive.Root>
      {showPercentage && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{status === 'completed' ? 'Completed' : status === 'failed' ? 'Failed' : 'Progress'}</span>
          <span>{Math.round(value || 0)}%</span>
        </div>
      )}
    </div>
  )
})
EnterpriseProgress.displayName = "EnterpriseProgress"

export { Progress, EnterpriseProgress }