'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Link2,
  RefreshCw,
  Info,
  Zap,
  Clock,
  FileText,
  AlertTriangle
} from 'lucide-react'
import { IntegrationCard, ConnectorStatus } from '../integration-card'
import { NotionIcon, GoogleDriveIcon, SlackIcon } from '../connector-icons'

// Connector definitions for MVP (3 connectors)
const CONNECTORS = [
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync your wiki pages and project notes',
    icon: <NotionIcon className="w-7 h-7" />,
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Import documents, sheets, and files',
    icon: <GoogleDriveIcon className="w-7 h-7" />,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Index team conversations and threads',
    icon: <SlackIcon className="w-7 h-7" />,
  },
]

interface ConnectorState {
  connector_type: string
  status: ConnectorStatus
  connected_at?: string
  last_sync_at?: string
  documents_synced?: number
  error_message?: string
}

interface DataSourcesSectionProps {
  apiKey?: string
}

export function DataSourcesSection({ apiKey }: DataSourcesSectionProps) {
  const [connectorStates, setConnectorStates] = useState<Record<string, ConnectorState>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch connector statuses on mount
  useEffect(() => {
    fetchConnectorStatuses()
  }, [])

  const fetchConnectorStatuses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/connectors', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        // If API doesn't exist yet, just show disconnected state
        if (response.status === 404) {
          setConnectorStates({})
          return
        }
        throw new Error('Failed to fetch connectors')
      }

      const data = await response.json()
      const states: Record<string, ConnectorState> = {}

      for (const connector of data.connectors || []) {
        states[connector.connector_type] = connector
      }

      setConnectorStates(states)
    } catch (err) {
      console.error('Failed to fetch connector statuses:', err)
      // Don't show error, just show disconnected state
      setConnectorStates({})
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (connectorId: string) => {
    // For now, show a placeholder message since Nango isn't set up yet
    // This will be replaced with actual Nango SDK integration

    console.log(`[DataSources] Connecting to ${connectorId}...`)

    // Check if Nango is available
    if (typeof window !== 'undefined' && (window as any).Nango) {
      try {
        const nango = new (window as any).Nango({
          publicKey: process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY
        })

        // Generate unique connection ID
        const connectionId = `user_${Date.now()}_${connectorId}`

        // Open Nango OAuth popup
        await nango.auth(connectorId, connectionId)

        // Register with backend
        await fetch(`/api/user/connectors/${connectorId}/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ connectionId })
        })

        // Refresh statuses
        await fetchConnectorStatuses()
      } catch (err) {
        console.error('Nango connection failed:', err)
        throw err
      }
    } else {
      // Nango not loaded - show placeholder
      alert(`Nango SDK not configured yet. To complete setup:\n\n1. Create a Nango account at nango.dev\n2. Add NEXT_PUBLIC_NANGO_PUBLIC_KEY to .env.local\n3. Install @nangohq/frontend package`)
    }
  }

  const handleDisconnect = async (connectorId: string) => {
    try {
      await fetch(`/api/user/connectors/${connectorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      // Update local state
      setConnectorStates(prev => {
        const updated = { ...prev }
        delete updated[connectorId]
        return updated
      })
    } catch (err) {
      console.error('Disconnect failed:', err)
      throw err
    }
  }

  const handleSync = async (connectorId: string) => {
    try {
      // Update local state to show syncing
      setConnectorStates(prev => ({
        ...prev,
        [connectorId]: {
          ...prev[connectorId],
          status: 'syncing' as ConnectorStatus
        }
      }))

      await fetch(`/api/user/connectors/${connectorId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      // Poll for completion or just refresh after delay
      setTimeout(() => {
        fetchConnectorStatuses()
      }, 3000)
    } catch (err) {
      console.error('Sync failed:', err)
      await fetchConnectorStatuses()
      throw err
    }
  }

  // Calculate total stats
  const connectedCount = Object.values(connectorStates).filter(
    s => s.status === 'connected' || s.status === 'syncing'
  ).length
  const totalDocuments = Object.values(connectorStates).reduce(
    (sum, s) => sum + (s.documents_synced || 0), 0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Sources</h2>
          <p className="text-gray-600 mt-1">
            Connect your apps to automatically sync knowledge into VRIN
          </p>
        </div>
        <button
          onClick={fetchConnectorStatuses}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Connected Apps</p>
              <p className="text-2xl font-bold text-blue-900">{connectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Documents Synced</p>
              <p className="text-2xl font-bold text-green-900">{totalDocuments.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Auto-Sync</p>
              <p className="text-2xl font-bold text-purple-900">
                {connectedCount > 0 ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900">How it works</h4>
            <p className="text-sm text-amber-700 mt-1">
              Connect your apps and VRIN will automatically sync your documents, notes, and conversations.
              New content is processed and added to your knowledge graph within minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Connector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONNECTORS.map((connector) => {
          const state = connectorStates[connector.id]
          return (
            <IntegrationCard
              key={connector.id}
              id={connector.id}
              name={connector.name}
              description={connector.description}
              icon={connector.icon}
              status={state?.status || 'disconnected'}
              lastSync={state?.last_sync_at}
              documentsCount={state?.documents_synced}
              errorMessage={state?.error_message}
              onConnect={() => handleConnect(connector.id)}
              onDisconnect={() => handleDisconnect(connector.id)}
              onSync={() => handleSync(connector.id)}
            />
          )
        })}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {['Asana', 'Linear', 'Confluence', 'Dropbox', 'Trello', 'ClickUp', 'Airtable'].map((name) => (
            <div
              key={name}
              className="flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-400"
            >
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Instructions (shown when no Nango key) */}
      {!process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY && (
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Setup Required</h4>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                To enable app connections, complete the following setup:
              </p>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Create a free account at <a href="https://nango.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">nango.dev</a></li>
                <li>Configure OAuth apps for Notion, Google Drive, and Slack</li>
                <li>Add <code className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">NEXT_PUBLIC_NANGO_PUBLIC_KEY</code> to your environment</li>
                <li>Install the Nango frontend SDK: <code className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">npm install @nangohq/frontend</code></li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
