'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Plus,
  Brain,
  Menu,
  ChevronLeft,
  Settings,
  LogOut,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Paperclip,
  StopCircle,
  MoreVertical,
  Trash2,
  Edit3,
  Copy,
  RotateCcw,
  Search,
  ChevronDown,
  X,
  Zap,
  Check,
  Building2,
  ArrowLeft,
  Key,
  AlertCircle,
  Globe,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { useEnterpriseChatSession } from '@/hooks/use-enterprise-chat-session'
import { useEnterpriseConversations } from '@/hooks/use-enterprise-conversations'
import { EnterpriseAuthContext, setEnterpriseApiKey } from '@/lib/services/enterprise-chat-api'
import { useApiKeys } from '@/hooks/useEnterprise'
import { MarkdownRenderer } from '@/components/chat/markdown-renderer'
import { SourcesPanel } from '@/components/chat/sources-panel'
import { ThinkingPanel } from '@/components/dashboard/thinking-panel'
import { LoadingAnimation } from '@/components/chat/loading-animation'
import toast from 'react-hot-toast'
import type { ChatMessage as BackendChatMessage, ResponseMode, SourceDocument } from '@/types/chat'

export default function EnterpriseChatPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useEnterpriseAuth()

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [responseMode, setResponseMode] = useState<ResponseMode>('chat')
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [showResponseModeMenu, setShowResponseModeMenu] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [currentSources, setCurrentSources] = useState<SourceDocument[]>([])
  const [currentMetadata, setCurrentMetadata] = useState<any>({})
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null)
  const [showApiKeySelector, setShowApiKeySelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get organization ID for API key fetching
  const organizationId = (user as any)?.organizationId || (user as any)?.organization_id

  // Fetch available API keys for this organization
  const { apiKeys, loading: apiKeysLoading } = useApiKeys(organizationId)

  // Get currently stored API key
  const storedApiKey = typeof window !== 'undefined'
    ? localStorage.getItem('enterprise_api_key')
    : null

  // Check if we have an active API key available
  const activeApiKeys: any[] = apiKeys?.filter((k: any) => k.status === 'active') || []
  const hasActiveApiKey = storedApiKey || activeApiKeys.length > 0

  // Auto-select first active API key if none is stored
  useEffect(() => {
    if (!storedApiKey && activeApiKeys.length > 0 && !apiKeysLoading) {
      const firstActiveKey = activeApiKeys[0]
      if (firstActiveKey?.key) {
        console.log('[Enterprise Chat] Auto-selecting first active API key:', firstActiveKey.name)
        setEnterpriseApiKey(firstActiveKey.key)
        setSelectedApiKeyId(firstActiveKey.id)
        toast.success(`Using API key: ${firstActiveKey.name}`)
      }
    }
  }, [storedApiKey, activeApiKeys, apiKeysLoading])

  // Handle API key selection
  const handleSelectApiKey = (apiKey: any) => {
    if (apiKey?.key) {
      setEnterpriseApiKey(apiKey.key)
      setSelectedApiKeyId(apiKey.id)
      setShowApiKeySelector(false)
      toast.success(`Switched to API key: ${apiKey.name}`)
    }
  }

  // Build enterprise auth context for API calls
  const enterpriseAuth = useMemo<EnterpriseAuthContext | null>(() => {
    if (!user) return null

    // Get enterprise API key from localStorage (freshly read)
    const enterpriseApiKey = typeof window !== 'undefined'
      ? localStorage.getItem('enterprise_api_key')
      : null

    // Handle both camelCase and snake_case field names from backend
    const orgId = (user as any).organizationId || (user as any).organization_id
    const userId = (user as any).id || (user as any).user_id

    console.log('[Enterprise Chat] Building auth context:', {
      hasApiKey: !!enterpriseApiKey,
      apiKeyPrefix: enterpriseApiKey ? enterpriseApiKey.substring(0, 15) + '...' : 'NONE',
      organizationId: orgId,
      userId: userId,
    })

    return {
      token: typeof window !== 'undefined'
        ? localStorage.getItem('enterprise_token') || ''
        : '',
      organizationId: orgId,
      userId: userId,
      apiKey: enterpriseApiKey || undefined,
    }
  }, [user, selectedApiKeyId]) // Re-compute when selectedApiKeyId changes

  // Use enterprise chat session hook
  const {
    session,
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    cancelStreaming,
    startNewSession,
    endSession,
    clearError,
    loadMessages
  } = useEnterpriseChatSession(enterpriseAuth)

  // Use enterprise conversations hook
  const {
    conversations,
    isLoading: isLoadingConversations,
    error: conversationsError,
    fetchConversations,
    loadConversation,
    deleteConversation,
    renameConversation,
    refreshConversations
  } = useEnterpriseConversations(enterpriseAuth)

  // Lock body scroll
  useEffect(() => {
    const add = (el: HTMLElement) => {
      el.classList.add('h-screen', 'overflow-hidden')
    }
    const remove = (el: HTMLElement) => {
      el.classList.remove('h-screen', 'overflow-hidden')
    }

    add(document.documentElement)
    add(document.body)
    return () => {
      remove(document.documentElement)
      remove(document.body)
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  // Close response mode menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showResponseModeMenu) {
        setShowResponseModeMenu(false)
      }
    }

    if (showResponseModeMenu) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showResponseModeMenu])

  const handleLogout = () => {
    if (session) {
      endSession()
    }
    logout()
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {
      return
    }

    if (!enterpriseAuth) {
      toast.error('Authentication required')
      return
    }

    const message = inputMessage
    const wasNewConversation = !session?.session_id
    setInputMessage('')

    try {
      // Pass webSearchEnabled (only relevant for brainstorm mode)
      const useWebSearch = responseMode === 'brainstorm' && webSearchEnabled
      await sendMessage(message, responseMode, true, useWebSearch) // Always use streaming

      // Refresh conversation list after first message in new conversation
      if (wasNewConversation) {
        setTimeout(() => refreshConversations(), 1500)
      }
    } catch (error) {
      console.error('[Enterprise Chat] Failed to send message:', error)
      setInputMessage(message)
      toast.error('Failed to send message')
    }
  }

  const handleNewChat = async () => {
    setActiveConversationId(null)
    await startNewSession()
    setTimeout(() => refreshConversations(), 1000)
  }

  const handleLoadConversation = async (sessionId: string) => {
    if (isLoadingConversation) return

    console.log('[Enterprise Chat] Loading conversation:', sessionId)
    setIsLoadingConversation(true)
    setActiveConversationId(sessionId)

    try {
      const conversation = await loadConversation(sessionId)
      if (conversation) {
        console.log('[Enterprise Chat] 📥 Full conversation response:', {
          session_id: conversation.session_id,
          message_count: conversation.messages?.length || 0,
          messages: conversation.messages
        })

        // Convert backend message format to frontend format WITH METADATA PRESERVED
        const formattedMessages: BackendChatMessage[] = conversation.messages.map((msg, idx) => {
          // Debug: Log metadata for each message to ensure it's being loaded
          console.log(`[Enterprise Chat] 📋 Message ${idx} (${msg.role}):`, {
            has_metadata: !!msg.metadata,
            metadata_keys: msg.metadata ? Object.keys(msg.metadata) : [],
            thinking_steps_length: msg.metadata?.thinking_steps?.length || 0,
            reasoning_tokens: msg.metadata?.reasoning_tokens,
            reasoning_summary_length: msg.metadata?.reasoning_summary?.length || 0,
            sources_count: msg.metadata?.sources?.length || 0
          })

          return {
            id: `${msg.role}-${idx}-${Date.now()}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp).getTime(),
            // IMPORTANT: Preserve ALL metadata (thinking_steps, reasoning_tokens, reasoning_summary, etc.)
            metadata: msg.metadata || undefined,
            // IMPORTANT: Preserve sources at message level for "View Sources" button
            sources: msg.metadata?.sources || undefined
          }
        })

        loadMessages(sessionId, formattedMessages)
        console.log('[Enterprise Chat] ✅ Loaded conversation with', formattedMessages.length, 'messages (metadata preserved)')
        setIsMobileSidebarOpen(false)
      }
    } catch (error) {
      console.error('[Enterprise Chat] Failed to load conversation:', error)
      toast.error('Failed to load conversation')
    } finally {
      setIsLoadingConversation(false)
    }
  }

  const handleDeleteConversation = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return
    }

    const success = await deleteConversation(sessionId)
    if (success) {
      toast.success('Conversation deleted')
      if (activeConversationId === sessionId || session?.session_id === sessionId) {
        setActiveConversationId(null)
        await startNewSession()
      }
    } else {
      toast.error('Failed to delete conversation')
    }
  }

  const handleStartRename = (sessionId: string, currentTitle: string) => {
    setEditingConversationId(sessionId)
    setEditingTitle(currentTitle)
  }

  const handleSaveRename = async (sessionId: string) => {
    if (!editingTitle.trim()) {
      toast.error('Title cannot be empty')
      return
    }

    const success = await renameConversation(sessionId, editingTitle.trim())
    if (success) {
      toast.success('Conversation renamed')
      setEditingConversationId(null)
      setEditingTitle('')
    } else {
      toast.error('Failed to rename conversation')
    }
  }

  const handleCancelRename = () => {
    setEditingConversationId(null)
    setEditingTitle('')
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Chat</h1>
            <p className="text-gray-600 mt-2">Please log in to access your organization&apos;s knowledge assistant</p>
          </div>
          <div className="text-center">
            <Link
              href="/enterprise/auth/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // No API key available - prompt user to generate one
  if (!apiKeysLoading && !hasActiveApiKey) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">API Key Required</h1>
            <p className="text-gray-600 mt-2">
              To use the Enterprise Chat, you need to generate an API key that connects to your organization&apos;s infrastructure.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              href="/enterprise/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              <Key className="w-5 h-5" />
              Generate API Key
            </Link>
            <Link
              href="/enterprise/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>
          <p className="text-xs text-gray-500 text-center mt-6">
            Enterprise API keys route your queries to your organization&apos;s private infrastructure for data sovereignty.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white text-gray-900 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-gray-50 flex flex-col border-r border-gray-200
          ${isMobileSidebarOpen ? 'w-64' : isSidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300
          ${isMobileSidebarOpen ? 'fixed' : 'hidden'} lg:flex inset-y-0 left-0 z-50
        `}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Sidebar Header */}
          <div className="p-3 flex items-center justify-between">
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <div className="flex items-center gap-2">
                <Image
                  src="/og-image.png"
                  alt="VRIN"
                  width={80}
                  height={28}
                  className="h-6 w-auto"
                />
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  Enterprise
                </Badge>
              </div>
            )}
            <button
              onClick={() => {
                if (isMobileSidebarOpen) {
                  setIsMobileSidebarOpen(false)
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed)
                }
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-auto"
            >
              {isMobileSidebarOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Back to Dashboard */}
          <div className="px-3 pb-2">
            <Link
              href="/enterprise/dashboard"
              className={`w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors ${
                isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''
              }`}
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && <span className="text-sm">Back to Dashboard</span>}
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="px-3 pt-2 pb-4 space-y-1 border-t border-gray-200">
            <button
              onClick={handleNewChat}
              className={`w-full flex items-center gap-3 px-3 py-2 text-gray-900 hover:bg-gray-200 rounded-lg transition-colors ${
                isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''
              }`}
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && <span className="font-medium">New Chat</span>}
            </button>

            <button
              className={`w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors ${
                isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''
              }`}
            >
              <Search className="w-5 h-5 flex-shrink-0" />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && <span className="font-medium">Search</span>}
            </button>
          </div>

          {/* Conversation History */}
          {(!isSidebarCollapsed || isMobileSidebarOpen) ? (
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {isLoadingConversations ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 px-4 text-gray-500 text-sm">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isEditing = editingConversationId === conv.session_id
                  const displayTitle = conv.title === 'New Conversation'
                    ? conv.preview.substring(0, 40) + (conv.preview.length > 40 ? '...' : '')
                    : conv.title

                  return (
                    <div
                      key={conv.session_id}
                      className={`
                        group relative flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                        ${activeConversationId === conv.session_id || session?.session_id === conv.session_id
                          ? 'bg-gray-200 border-2 border-purple-500'
                          : 'hover:bg-gray-200'
                        }
                      `}
                    >
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSaveRename(conv.session_id)
                              } else if (e.key === 'Escape') {
                                handleCancelRename()
                              }
                            }}
                            className="flex-1 px-2 py-1 text-sm border border-purple-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(conv.session_id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelRename}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleLoadConversation(conv.session_id)}
                            className="flex-1 flex items-center gap-2 text-left min-w-0"
                          >
                            <MessageSquare className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <span className="font-medium text-gray-900 truncate">
                              {displayTitle}
                            </span>
                          </button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded transition-all flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                              <DropdownMenuItem
                                className="text-gray-700 focus:bg-gray-100 cursor-pointer"
                                onSelect={(e) => {
                                  e.preventDefault()
                                  handleStartRename(conv.session_id, displayTitle)
                                }}
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-200" />
                              <DropdownMenuItem
                                className="text-red-600 focus:bg-gray-100 focus:text-red-600 cursor-pointer"
                                onSelect={(e) => {
                                  e.preventDefault()
                                  handleDeleteConversation(conv.session_id)
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* User Section */}
          <div className="p-3 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 transition-colors ${
                    isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 flex-shrink-0">
                    <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                      {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.organizationName || 'Enterprise'}</p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border-gray-200">
                <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100">
                  <Link href="/enterprise/dashboard" className="flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-700 focus:bg-gray-100">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    handleLogout()
                  }}
                  className="text-red-600 focus:bg-gray-100 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">{user.organizationName || 'Enterprise'}</span>
            </div>
          </div>

          {/* Response Mode Selector */}
          <div className="flex items-center gap-3">
            {/* Web Search Toggle (only visible in brainstorm mode) */}
            {responseMode === 'brainstorm' && (
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  webSearchEnabled
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={webSearchEnabled ? 'Web search enabled' : 'Enable web search'}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Web Search</span>
                {webSearchEnabled && <Check className="w-3 h-3" />}
              </button>
            )}

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowResponseModeMenu(!showResponseModeMenu)
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  responseMode === 'brainstorm'
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-300'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {responseMode === 'brainstorm' ? <Lightbulb className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                <span className="capitalize">{responseMode}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showResponseModeMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => {
                      setResponseMode('chat')
                      setShowResponseModeMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm">Chat</div>
                      <div className="text-xs text-gray-500">Concise responses from knowledge base</div>
                    </div>
                    {responseMode === 'chat' && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setResponseMode('expert')
                      setShowResponseModeMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm">Expert</div>
                      <div className="text-xs text-gray-500">Comprehensive analysis</div>
                    </div>
                    {responseMode === 'expert' && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => {
                      setResponseMode('brainstorm')
                      setShowResponseModeMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-amber-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-medium text-sm text-amber-700">Brainstorm</div>
                        <div className="text-xs text-gray-500">Creative ideas + web search</div>
                      </div>
                    </div>
                    {responseMode === 'brainstorm' && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => {
                      setResponseMode('raw_facts')
                      setShowResponseModeMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm">Raw Facts</div>
                      <div className="text-xs text-gray-500">Facts only, no summary</div>
                    </div>
                    {responseMode === 'raw_facts' && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-white pb-32">
          {messages.length === 0 && !isLoading ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Enterprise Knowledge Assistant
                </h2>
                <p className="text-gray-600 mb-8">
                  Ask questions about your organization&apos;s knowledge base. I can help you search, analyze, and extract insights from {user.organizationName || 'your company'}&apos;s data.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    'Summarize recent company documents',
                    'Find relevant policies and procedures',
                    'What are the key insights from reports?',
                    'Search for specific business information'
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputMessage(suggestion)}
                      className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all"
                    >
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-center'}`}
                >
                  {message.role === 'user' ? (
                    <div className="max-w-2xl">
                      <div className="bg-purple-100 text-gray-900 rounded-2xl px-5 py-3">
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-3xl">
                      {/* Reasoning Panel */}
                      {message.metadata && ((message.metadata.thinking_steps && message.metadata.thinking_steps.length > 0) || (message.metadata.reasoning_tokens && message.metadata.reasoning_tokens > 0)) && (
                        <ThinkingPanel
                          metadata={{
                            model: message.metadata.model || 'gpt-5-mini',
                            reasoning_tokens: message.metadata.reasoning_tokens || 0,
                            input_tokens: message.metadata.input_tokens || 0,
                            output_tokens: message.metadata.output_tokens || 0,
                            total_tokens: message.metadata.total_tokens || 0,
                            processing_time: message.metadata.response_time || message.metadata.search_time,
                            thinking_steps: message.metadata.thinking_steps || [],
                            reasoning_summary: message.metadata.reasoning_summary
                          }}
                        />
                      )}

                      <div className="text-gray-900">
                        <MarkdownRenderer content={message.content} />

                        {/* Metadata */}
                        {message.metadata && (
                          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                            {message.metadata.response_time && (
                              <span>⚡ {message.metadata.response_time}</span>
                            )}
                            {(message.metadata.total_facts || message.metadata.facts_retrieved) && (
                              <span>📊 {message.metadata.total_facts || message.metadata.facts_retrieved} facts</span>
                            )}
                            {message.metadata.total_chunks && (
                              <span>📄 {message.metadata.total_chunks} chunks</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
                            onClick={() => navigator.clipboard.writeText(message.content)}
                            title="Copy message"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Sources button */}
                      {message.sources && message.sources.length > 0 && (
                        <button
                          onClick={() => {
                            setCurrentSources(message.sources || [])
                            setCurrentMetadata(message.metadata || {})
                            setSourcesOpen(true)
                          }}
                          className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
                        >
                          📚 Sources ({message.metadata?.documents_used || message.sources.length})
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Streaming message */}
              {isStreaming && streamingContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="w-full max-w-3xl">
                    <div className="text-gray-900">
                      <MarkdownRenderer content={streamingContent} isStreaming={true} />
                      <span className="inline-block w-2 h-5 bg-purple-500 animate-pulse ml-1" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loading indicator */}
              {isLoading && !isStreaming && (
                <LoadingAnimation isStreaming={isStreaming} />
              )}

              {/* Error display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="w-full max-w-3xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Error</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                    <button onClick={clearError} className="text-red-600 hover:text-red-800 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-gradient-to-t from-white via-white to-transparent pb-4 px-6">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 focus-within:shadow-xl focus-within:border-purple-400/50 transition-all"
            >
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder={`Ask about ${user.organizationName || 'your organization'}'s knowledge...`}
                rows={1}
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 px-5 py-4 pr-32 resize-none outline-none max-h-32"
                style={{ minHeight: '56px', height: 'auto' }}
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all text-gray-600 hover:text-gray-800"
                  title="Upload files"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    if (isStreaming) {
                      e.preventDefault()
                      cancelStreaming()
                    }
                  }}
                  disabled={!isStreaming && (!inputMessage.trim() || isLoading)}
                  className={`
                    p-2 rounded-lg transition-all backdrop-blur-sm
                    ${isStreaming
                      ? 'bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg'
                      : inputMessage.trim() && !isLoading
                      ? 'bg-purple-500/90 hover:bg-purple-600/90 text-white shadow-lg'
                      : 'bg-gray-300/50 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  title={isStreaming ? 'Cancel streaming' : 'Send message'}
                >
                  {isStreaming ? (
                    <StopCircle className="w-5 h-5" />
                  ) : isLoading ? (
                    <StopCircle className="w-5 h-5 opacity-50" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-3">
              Enterprise knowledge assistant for {user.organizationName || 'your organization'}. Verify important information.
            </p>
          </div>
        </div>
      </div>

      {/* Sources Panel */}
      <SourcesPanel
        isOpen={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
        sources={currentSources}
        metadata={currentMetadata}
      />
    </div>
  )
}
