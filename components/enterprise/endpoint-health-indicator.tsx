'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  Wifi,
  WifiOff,
  Database,
  Zap,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EndpointHealthProps {
  type: 'database' | 'vector-store' | 'llm' | 'api-key'
  endpoint: string
  status?: 'healthy' | 'unhealthy' | 'testing' | 'unknown' | 'error'
  lastChecked?: Date
  error?: string
  onTest?: () => Promise<void>
  className?: string
  showDetails?: boolean
}

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
    label: 'Active'
  },
  unhealthy: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
    label: 'Inactive'
  },
  testing: {
    icon: RefreshCw,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    label: 'Testing'
  },
  error: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
    label: 'Error'
  },
  unknown: {
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-800',
    label: 'Unknown'
  }
}

const typeIcons = {
  'database': Database,
  'vector-store': Zap,
  'llm': Brain,
  'api-key': Wifi
}

export function EndpointHealthIndicator({
  type,
  endpoint,
  status = 'unknown',
  lastChecked,
  error,
  onTest,
  className,
  showDetails = true
}: EndpointHealthProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const config = statusConfig[status]
  const StatusIcon = config.icon
  const TypeIcon = typeIcons[type]

  const handleTest = async () => {
    if (!onTest) return
    
    setIsAnimating(true)
    try {
      await onTest()
    } finally {
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  const formatEndpoint = (url: string) => {
    if (url.length > 40) {
      return url.substring(0, 37) + '...'
    }
    return url
  }

  const formatError = (errorMsg: string) => {
    // Map backend error messages to user-friendly descriptions
    const errorMappings = {
      'API key not found in enterprise database': 'API key validation failed',
      'Infrastructure configuration not found': 'Configuration missing',
      'Database connectivity test timed out': 'Connection timeout',
      'Lambda functions have improper database permissions': 'Permission denied',
      'DNS resolution failed': 'DNS resolution failed'
    }

    return errorMappings[errorMsg as keyof typeof errorMappings] || errorMsg
  }

  if (!showDetails) {
    // Minimal indicator for inline use
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={cn(
              'flex items-center gap-1',
              className
            )}>
              <StatusIcon className={cn('w-3 h-3', config.color)} />
              <Badge variant="secondary" className={cn('text-xs', config.badge)}>
                {config.label}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{status === 'healthy' ? 'Endpoint is accessible' : error || 'Status unknown'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-lg border',
      config.borderColor,
      config.bgColor,
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <TypeIcon className="w-4 h-4 text-gray-600" />
          <StatusIcon className={cn(
            'w-4 h-4',
            config.color,
            isAnimating && status === 'testing' && 'animate-spin'
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn('text-xs', config.badge)}>
              {config.label}
            </Badge>
            <span className="text-sm font-medium text-gray-900 capitalize">
              {type.replace('-', ' ')}
            </span>
          </div>
          
          {endpoint && (
            <p className="text-xs text-gray-600 font-mono mt-1">
              {formatEndpoint(endpoint)}
            </p>
          )}
          
          {error && (
            <p className="text-xs text-red-600 mt-1">
              {formatError(error)}
            </p>
          )}
          
          {lastChecked && (
            <p className="text-xs text-gray-500 mt-1">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {onTest && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTest}
          disabled={status === 'testing'}
          className="ml-2"
        >
          <RefreshCw className={cn(
            'w-3 h-3 mr-1',
            status === 'testing' && 'animate-spin'
          )} />
          Test
        </Button>
      )}
    </div>
  )
}

// Compact version for dashboard cards
export function EndpointStatusBadge({
  status = 'unknown',
  className
}: {
  status?: EndpointHealthProps['status']
  className?: string
}) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Badge variant="secondary" className={cn(
      'text-xs flex items-center gap-1',
      config.badge,
      className
    )}>
      <StatusIcon className="w-3 h-3" />
      {config.label}
    </Badge>
  )
}