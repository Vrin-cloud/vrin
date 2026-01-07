'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Folder,
  FolderOpen
} from 'lucide-react'

export type ConnectorStatus = 'disconnected' | 'connected' | 'syncing' | 'error'

interface HierarchyItem {
  id: string
  title: string
  type: 'database' | 'page'
  children?: HierarchyItem[]
  total_children?: number
}

interface HierarchyData {
  type: 'tree' | 'flat'
  workspace?: string
  items: HierarchyItem[]
  total_items: number
  summary: {
    databases: number
    pages: number
    total: number
  }
}

interface RecordsData {
  connector_type: string
  total_records: number
  hierarchy: HierarchyData
  has_more: boolean
}

export interface IntegrationCardProps {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: ConnectorStatus
  lastSync?: string
  documentsCount?: number
  errorMessage?: string
  apiKey?: string
  onConnect: () => Promise<void>
  onDisconnect: () => Promise<void>
  onSync: () => Promise<void>
}

export function IntegrationCard({
  id,
  name,
  description,
  icon,
  status,
  lastSync,
  documentsCount,
  errorMessage,
  apiKey,
  onConnect,
  onDisconnect,
  onSync
}: IntegrationCardProps) {
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [recordsData, setRecordsData] = useState<RecordsData | null>(null)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Fetch records when expanded
  useEffect(() => {
    if (expanded && status === 'connected' && !recordsData && apiKey) {
      fetchRecords()
    }
  }, [expanded, status])

  const fetchRecords = async () => {
    if (!apiKey) return

    setLoadingRecords(true)
    try {
      const response = await fetch(`/api/user/connectors/${id}/records`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecordsData(data)
      }
    } catch (error) {
      console.error('Failed to fetch records:', error)
    } finally {
      setLoadingRecords(false)
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    try {
      await onConnect()
    } catch (error) {
      console.error(`Failed to connect ${name}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setLoading(true)
    setShowMenu(false)
    try {
      await onDisconnect()
      setRecordsData(null)
      setExpanded(false)
    } catch (error) {
      console.error(`Failed to disconnect ${name}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      await onSync()
      // Refresh records after sync
      if (expanded) {
        setTimeout(() => fetchRecords(), 5000)
      }
    } catch (error) {
      console.error(`Failed to sync ${name}:`, error)
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <Check className="w-3 h-3 mr-1" /> Connected
          </span>
        )
      case 'syncing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Syncing
          </span>
        )
      case 'error':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <X className="w-3 h-3 mr-1" /> Error
          </span>
        )
      default:
        return null
    }
  }

  // Use actual count from records data if available
  const actualDocCount = recordsData?.total_records ?? documentsCount

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl border-2 border-gray-200 bg-white transition-all duration-200 hover:shadow-md"
    >
      {/* Main Card Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm">
              {icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                {name}
                {getStatusBadge()}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            </div>
          </div>

          {/* Menu for connected state */}
          {status !== 'disconnected' && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={handleSync}
                      disabled={status === 'syncing'}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${status === 'syncing' ? 'animate-spin' : ''}`} />
                      Sync Now
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={loading}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                      Disconnect
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content based on status */}
        {status === 'disconnected' ? (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect {name}
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            {/* Sync info */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {lastSync ? `Last sync: ${formatLastSync(lastSync)}` : 'Never synced'}
              </span>
              {actualDocCount !== undefined && (
                <span className="text-gray-700 font-medium">
                  {actualDocCount.toLocaleString()} pages
                </span>
              )}
            </div>

            {/* Summary from hierarchy if available */}
            {recordsData?.hierarchy?.summary && (
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {recordsData.hierarchy.summary.databases} databases
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {recordsData.hierarchy.summary.pages} pages
                </span>
              </div>
            )}

            {/* Error message */}
            {status === 'error' && errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errorMessage}</p>
                <button
                  onClick={handleConnect}
                  className="mt-2 text-sm font-medium text-red-900 hover:text-red-700"
                >
                  Try reconnecting →
                </button>
              </div>
            )}

            {/* Quick actions */}
            {status === 'connected' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex-1 py-2 px-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  {expanded ? 'Hide Details' : 'View Details'}
                </button>
                <button
                  onClick={handleSync}
                  className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Syncing progress */}
            {status === 'syncing' && (
              <div className="space-y-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <p className="text-xs text-gray-600 text-center">Syncing documents...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expandable Details Panel */}
      <AnimatePresence>
        {expanded && status === 'connected' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-200"
          >
            <div className="p-4 bg-gray-50">
              {loadingRecords ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Loading content structure...</span>
                </div>
              ) : recordsData?.hierarchy ? (
                <div className="space-y-3">
                  {/* Workspace header */}
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Folder className="w-4 h-4" />
                    {recordsData.hierarchy.workspace || 'Workspace'}
                  </div>

                  {/* Hierarchy tree */}
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {recordsData.hierarchy.items.map((item) => (
                      <HierarchyItemRow
                        key={item.id}
                        item={item}
                        expanded={expandedFolders.has(item.id)}
                        onToggle={() => toggleFolder(item.id)}
                      />
                    ))}
                  </div>

                  {/* Show more indicator */}
                  {recordsData.hierarchy.total_items > recordsData.hierarchy.items.length && (
                    <p className="text-xs text-gray-500 pt-2">
                      Showing {recordsData.hierarchy.items.length} of {recordsData.hierarchy.total_items} items
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No content synced yet. Click &quot;Sync Now&quot; to start.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Hierarchy item component
function HierarchyItemRow({
  item,
  expanded,
  onToggle,
  depth = 0
}: {
  item: HierarchyItem
  expanded: boolean
  onToggle: () => void
  depth?: number
}) {
  const hasChildren = item.children && item.children.length > 0
  const isDatabase = item.type === 'database'

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm ${
          depth > 0 ? 'ml-4' : ''
        }`}
        onClick={hasChildren ? onToggle : undefined}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button className="p-0.5 hover:bg-gray-200 rounded">
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Icon */}
        {isDatabase ? (
          expanded ? (
            <FolderOpen className="w-4 h-4 text-gray-600" />
          ) : (
            <Folder className="w-4 h-4 text-gray-500" />
          )
        ) : (
          <FileText className="w-4 h-4 text-gray-400" />
        )}

        {/* Title */}
        <span className={`truncate ${isDatabase ? 'font-medium text-gray-700' : 'text-gray-600'}`}>
          {item.title}
        </span>

        {/* Child count for databases */}
        {isDatabase && item.total_children !== undefined && (
          <span className="text-xs text-gray-400 ml-auto">
            {item.total_children} pages
          </span>
        )}
      </div>

      {/* Children */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {item.children?.slice(0, 10).map((child) => (
              <HierarchyItemRow
                key={child.id}
                item={child}
                expanded={false}
                onToggle={() => {}}
                depth={depth + 1}
              />
            ))}
            {item.children && item.children.length > 10 && (
              <div className="text-xs text-gray-400 ml-8 py-1">
                +{item.children.length - 10} more pages
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
