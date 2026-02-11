'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import Nango from '@nangohq/frontend'
import {
  Link2,
  RefreshCw,
  FileText,
  AlertTriangle,
  Upload,
  File,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { IntegrationCard, ConnectorStatus } from '../integration-card'
import { NotionIcon, GoogleDriveIcon, SlackIcon, ConfluenceIcon, LinearIcon, AsanaIcon, DropboxIcon } from '../connector-icons'

// All supported connectors
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
  {
    id: 'confluence',
    name: 'Confluence',
    description: 'Sync your enterprise wiki and documentation',
    icon: <ConfluenceIcon className="w-7 h-7" />,
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Import issues, projects, and comments',
    icon: <LinearIcon className="w-7 h-7" />,
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Sync tasks, projects, and team updates',
    icon: <AsanaIcon className="w-7 h-7" />,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Import files and documents from Dropbox',
    icon: <DropboxIcon className="w-7 h-7" />,
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
  userId?: string
  userEmail?: string
}

export function DataSourcesSection({ apiKey, userId, userEmail }: DataSourcesSectionProps) {
  const [connectorStates, setConnectorStates] = useState<Record<string, ConnectorState>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectingTo, setConnectingTo] = useState<string | null>(null)

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
    console.log(`[DataSources] Connecting to ${connectorId}...`)

    if (!userId) {
      console.error('User ID is required for connecting')
      alert('Please log in to connect apps')
      return
    }

    setConnectingTo(connectorId)

    try {
      // Step 1: Get a session token from our backend
      const sessionResponse = await fetch('/api/connectors/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          userId,
          userEmail,
          allowedIntegrations: [connectorId], // Only show this specific connector
        }),
      })

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json()
        throw new Error(errorData.error || 'Failed to create session')
      }

      const { sessionToken } = await sessionResponse.json()

      // Step 2: Open Nango Connect UI with the session token
      const nango = new Nango()

      const connectUI = nango.openConnectUI({
        onEvent: async (event) => {
          console.log('[Nango] Event:', event)

          if (event.type === 'close') {
            // User closed the modal
            setConnectingTo(null)
          } else if (event.type === 'connect') {
            // Connection successful!
            const { connectionId, providerConfigKey } = event.payload
            console.log(`[Nango] Connected! connectionId: ${connectionId}, provider: ${providerConfigKey}`)

            // Register the connection with our backend
            try {
              await fetch(`/api/user/connectors/${connectorId}/connect`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  connectionId,
                  providerConfigKey,
                }),
              })
            } catch (err) {
              console.error('Failed to register connection with backend:', err)
            }

            // Refresh connector statuses
            await fetchConnectorStatuses()
            setConnectingTo(null)
          }
        },
      })

      // Set the session token to start the flow
      connectUI.setSessionToken(sessionToken)

    } catch (err) {
      console.error('Nango connection failed:', err)
      setConnectingTo(null)
      throw err
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

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadedCount, setUploadedCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return

    setUploading(true)
    let successCount = 0

    for (const file of uploadedFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', file.name)

        const response = await fetch('/api/knowledge/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          body: formData,
        })

        if (response.ok) {
          successCount++
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err)
      }
    }

    setUploadedCount(prev => prev + successCount)
    setUploadedFiles([])
    setUploadProgress({})
    setUploading(false)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Data Sources</h2>
          <p className="text-gray-600 mt-1">
            Connect apps or upload files to add knowledge to VRIN
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Link2 className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Connected Apps</p>
              <p className="text-2xl font-semibold text-gray-900">{connectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Documents Synced</p>
              <p className="text-2xl font-semibold text-gray-900">{totalDocuments.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Upload className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Files Uploaded</p>
              <p className="text-2xl font-semibold text-gray-900">{uploadedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload PDFs, images, text files, and other documents to add to your knowledge base.
        </p>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Drop files here or click to browse</p>
          <p className="text-sm text-gray-500 mt-1">
            Supports PDF, images, text files, and more
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.gif,.csv,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-gray-200 rounded-lg">
                    {getFileIcon(file)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-4 px-4 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Connected Apps Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Apps</h3>
        <p className="text-sm text-gray-600 mb-4">
          Link your favorite apps to automatically sync content into VRIN.
        </p>

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
                apiKey={apiKey}
                onConnect={() => handleConnect(connector.id)}
                onDisconnect={() => handleDisconnect(connector.id)}
                onSync={() => handleSync(connector.id)}
              />
            )
          })}
        </div>
      </div>

      {/* Coming Soon Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {['Jira', 'Trello', 'ClickUp', 'Airtable', 'GitHub', 'Microsoft Teams'].map((name) => (
            <div
              key={name}
              className="flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-400"
            >
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Instructions (shown when userId is missing) */}
      {!userId && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Login Required</h4>
              <p className="text-sm text-gray-600 mt-1">
                Please log in to connect your apps to VRIN.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
