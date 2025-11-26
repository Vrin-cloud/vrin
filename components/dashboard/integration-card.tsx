'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Check, X, RefreshCw, ExternalLink, MoreHorizontal } from 'lucide-react'

export type ConnectorStatus = 'disconnected' | 'connected' | 'syncing' | 'error'

export interface IntegrationCardProps {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: ConnectorStatus
  lastSync?: string
  documentsCount?: number
  errorMessage?: string
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
  onConnect,
  onDisconnect,
  onSync
}: IntegrationCardProps) {
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

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
    } catch (error) {
      console.error(`Failed to disconnect ${name}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      await onSync()
    } catch (error) {
      console.error(`Failed to sync ${name}:`, error)
    }
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

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'border-green-200 bg-green-50/50'
      case 'syncing':
        return 'border-blue-200 bg-blue-50/50'
      case 'error':
        return 'border-red-200 bg-red-50/50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <Check className="w-3 h-3 mr-1" /> Connected
          </span>
        )
      case 'syncing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Syncing
          </span>
        )
      case 'error':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <X className="w-3 h-3 mr-1" /> Error
          </span>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-md ${getStatusColor()}`}
    >
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
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            {documentsCount !== undefined && (
              <span className="text-gray-700 font-medium">
                {documentsCount.toLocaleString()} documents
              </span>
            )}
          </div>

          {/* Error message */}
          {status === 'error' && errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{errorMessage}</p>
              <button
                onClick={handleConnect}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Try reconnecting →
              </button>
            </div>
          )}

          {/* Quick actions */}
          {status === 'connected' && (
            <div className="flex gap-2">
              <button
                onClick={handleSync}
                className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Now
              </button>
            </div>
          )}

          {/* Syncing progress */}
          {status === 'syncing' && (
            <div className="space-y-2">
              <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <p className="text-xs text-blue-600 text-center">Syncing documents...</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
