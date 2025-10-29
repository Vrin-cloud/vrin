'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Plus,
  Brain,
  User,
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
  Check
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
import { AuthService } from '@/lib/services/vrin-service'
import { useChatSession } from '@/hooks/use-chat-session'
import { useFileUploads } from '@/hooks/use-file-uploads'
import { useConversations } from '@/hooks/use-conversations'
import { FileUploadZone } from '@/components/chat/file-upload-zone'
import { MarkdownRenderer } from '@/components/chat/markdown-renderer'
import { SourcesPanel } from '@/components/chat/sources-panel'
import { ThinkingPanel } from '@/components/dashboard/thinking-panel'
import { LoadingAnimation } from '@/components/chat/loading-animation'
import { formatRelativeTime } from '@/lib/utils/time'
import { chatAPI } from '@/lib/services/chat-api'
import toast from 'react-hot-toast'
import type { ChatMessage as BackendChatMessage, ResponseMode, SourceDocument } from '@/types/chat'

interface LocalChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: BackendChatMessage[]
}

interface User {
  user_id: string
  email: string
  name?: string
  created_at: string
  api_keys?: Array<{ key: string }>
}


// Expert Analysis Panel Component
function ExpertAnalysisPanel({ analysis }: { analysis: any }) {
  const [showAnalysis, setShowAnalysis] = useState(true)

  const hasContent = (
    (analysis.reasoning_chains && analysis.reasoning_chains.length > 0) ||
    (analysis.multi_hop_chains && analysis.multi_hop_chains.length > 0) ||
    (analysis.cross_document_patterns && analysis.cross_document_patterns.length > 0)
  )

  if (!hasContent) return null

  return (
    <div className="mt-2 space-y-2">
      <button
        onClick={() => setShowAnalysis(!showAnalysis)}
        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
      >
        <Brain className="w-4 h-4" />
        {showAnalysis ? 'Hide' : 'Show'} Expert Analysis
      </button>

      {showAnalysis && (
        <div className="bg-purple-50 rounded-lg p-3 space-y-3 border border-purple-200">
          {analysis.reasoning_chains && analysis.reasoning_chains.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-purple-900 mb-2">Reasoning Chains</div>
              <div className="space-y-2">
                {analysis.reasoning_chains.map((chain: any, idx: number) => (
                  <div key={idx} className="text-sm text-purple-800 bg-white rounded p-2">
                    <div className="font-medium">{chain.description || chain.final_conclusion}</div>
                    {chain.overall_confidence && (
                      <div className="text-xs text-purple-600 mt-1">
                        Confidence: {(chain.overall_confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.multi_hop_chains && analysis.multi_hop_chains.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-purple-900 mb-2">Multi-Hop Insights</div>
              <div className="space-y-1 text-sm text-purple-800">
                {analysis.multi_hop_chains.map((insight: any, idx: number) => (
                  <div key={idx} className="bg-white rounded p-2">
                    {insight.insight || insight}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null)
  const [apiKey, setApiKey] = useState<string>('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [responseMode, setResponseMode] = useState<ResponseMode>('chat')
  const [enableStreaming, setEnableStreaming] = useState(true)
  const [showUploadZone, setShowUploadZone] = useState(false)
  const [showResponseModeMenu, setShowResponseModeMenu] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [currentSources, setCurrentSources] = useState<SourceDocument[]>([])
  const [currentMetadata, setCurrentMetadata] = useState<any>({})
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const authService = new AuthService()

  // Use backend chat session hook
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
  } = useChatSession(apiKey)

  // Use file uploads hook
  const {
    uploads,
    uploadFile,
    clearCompletedUploads
  } = useFileUploads(apiKey)

  // Use conversations hook
  const {
    conversations,
    isLoading: isLoadingConversations,
    error: conversationsError,
    fetchConversations,
    loadConversation,
    refreshConversations
  } = useConversations(apiKey)

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

  useEffect(() => {
    // Check for existing auth
    const storedUser = authService.getStoredUser()
    const storedApiKey = authService.getStoredApiKey()

    if (storedUser && storedApiKey) {
      setUser(storedUser)
      setApiKey(storedApiKey)
      console.log('Chat initialized with user:', storedUser.email)
      console.log('API key loaded:', storedApiKey.substring(0, 10) + '...')
    } else {
      console.warn('Missing authentication:', { hasUser: !!storedUser, hasApiKey: !!storedApiKey })
    }
  }, [])

  // Fetch conversations when API key is available
  useEffect(() => {
    if (apiKey) {
      console.log('Fetching conversation list...')
      fetchConversations()
    }
  }, [apiKey, fetchConversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

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
    authService.logout()
    setUser(null)
    window.location.href = '/auth'
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {
      console.log('Send message blocked:', { hasMessage: !!inputMessage.trim(), isLoading })
      return
    }

    if (!apiKey) {
      console.error('Cannot send message: No API key')
      return
    }

    console.log('Sending message:', inputMessage.substring(0, 50) + '...')
    const message = inputMessage
    const wasNewConversation = !session?.session_id
    setInputMessage('')

    try {
      await sendMessage(message, responseMode, enableStreaming)
      console.log('Message sent successfully')

      // Refresh conversation list after first message in new conversation
      if (wasNewConversation) {
        console.log('New conversation started, refreshing list...')
        setTimeout(() => refreshConversations(), 1500)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Restore message on error
      setInputMessage(message)
    }
  }

  const handleNewChat = async () => {
    setActiveConversationId(null)
    await startNewSession()
    // Refresh conversations after creating new session
    setTimeout(() => refreshConversations(), 1000)
  }

  const handleLoadConversation = async (sessionId: string) => {
    if (isLoadingConversation) return

    console.log('Loading conversation:', sessionId)
    setIsLoadingConversation(true)
    setActiveConversationId(sessionId)

    try {
      const conversation = await loadConversation(sessionId)
      if (conversation) {
        console.log('📥 Full conversation response:', {
          session_id: conversation.session_id,
          message_count: conversation.messages?.length || 0,
          messages: conversation.messages
        })

        // Convert backend message format to frontend format WITH METADATA
        const formattedMessages: BackendChatMessage[] = conversation.messages.map((msg, idx) => {
          // Debug: Log metadata for each message
          console.log(`📋 Message ${idx} (${msg.role}):`, {
            has_metadata: !!msg.metadata,
            metadata_keys: msg.metadata ? Object.keys(msg.metadata) : [],
            thinking_steps_length: msg.metadata?.thinking_steps?.length || 0,
            reasoning_tokens: msg.metadata?.reasoning_tokens,
            sources_count: msg.metadata?.sources?.length || 0
          })

          return {
            id: `${msg.role}-${idx}-${Date.now()}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp).getTime(),
            // IMPORTANT: Preserve metadata (thinking_steps, sources, etc.)
            metadata: msg.metadata || undefined,
            // IMPORTANT: Preserve sources at message level for "View Sources" button
            sources: msg.metadata?.sources || undefined
          }
        })

        // Load messages into the chat session
        loadMessages(sessionId, formattedMessages)

        console.log('✅ Loaded conversation with', formattedMessages.length, 'messages (metadata preserved)')

        // Close mobile sidebar if open
        setIsMobileSidebarOpen(false)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    } finally {
      setIsLoadingConversation(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    console.log('🔄 handleFileUpload called with file:', file.name)
    console.log('  - Size:', (file.size / 1024).toFixed(2), 'KB')
    console.log('  - Type:', file.type)
    console.log('  - API Key present:', !!apiKey)

    if (!apiKey) {
      console.error('❌ Cannot upload: No API key available')
      alert('Cannot upload file: Please log in again')
      return
    }

    try {
      console.log('📤 Calling uploadFile...')
      const result = await uploadFile(file)
      console.log('✅ Upload initiated successfully:', result)
      // Optionally close the upload zone after upload
      // setShowUploadZone(false)
    } catch (error) {
      console.error('❌ File upload failed:', error)
      alert(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteConversation = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return
    }

    try {
      await chatAPI.deleteConversation(sessionId, apiKey)
      toast.success('Conversation deleted successfully')

      // If we deleted the active conversation, start a new one
      if (activeConversationId === sessionId || session?.session_id === sessionId) {
        setActiveConversationId(null)
        await startNewSession()
      }

      // Refresh conversation list
      await refreshConversations()
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete conversation')
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

    try {
      await chatAPI.updateConversationTitle(sessionId, editingTitle.trim(), apiKey)
      toast.success('Conversation renamed successfully')
      setEditingConversationId(null)
      setEditingTitle('')

      // Refresh conversation list
      await refreshConversations()
    } catch (error) {
      console.error('Failed to rename conversation:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to rename conversation')
    }
  }

  const handleCancelRename = () => {
    setEditingConversationId(null)
    setEditingTitle('')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowUploadZone(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to VRIN Chat</h1>
            <p className="text-gray-600 mt-2">Please log in to access your knowledge assistant</p>
          </div>
          <div className="text-center">
            <a
              href="/auth"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen bg-white text-gray-900 flex overflow-hidden"
      onDragOver={handleDragOver}
    >
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
          {/* Sidebar Header with Toggle */}
          <div className="p-3 flex items-center justify-between">
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <Image
                src="/og-image.png"
                alt="VRIN"
                width={100}
                height={32}
                className="h-7 w-auto"
              />
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
              title={isMobileSidebarOpen ? "Close sidebar" : isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isMobileSidebarOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="px-3 pt-3 pb-4 space-y-1">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className={`w-full flex items-center gap-3 px-3 py-2 text-gray-900 hover:bg-gray-200 rounded-lg transition-colors ${
                isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''
              }`}
              title="New Chat"
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && <span className="font-medium">New Chat</span>}
            </button>

            {/* Search Button */}
            <button
              className={`w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors ${
                isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''
              }`}
              title="Search Chats"
            >
              <Search className="w-5 h-5 flex-shrink-0" />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && <span className="font-medium">Search Chats</span>}
            </button>
          </div>

          {/* Chat History - Only show when sidebar is expanded */}
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
                          ? 'bg-gray-200 border-2 border-blue-500'
                          : 'hover:bg-gray-200'
                        }
                      `}
                    >
                      {isEditing ? (
                        // Editing mode: Show input field
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
                            className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault() // Prevent blur from firing
                              handleSaveRename(conv.session_id)
                            }}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault() // Prevent blur from firing
                              handleCancelRename()
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        // Normal mode: Show title and menu
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

                          {/* Chat Options Menu */}
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
                                onClick={() => handleStartRename(conv.session_id, displayTitle)}
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-200" />
                              <DropdownMenuItem
                                className="text-red-600 focus:bg-gray-100 focus:text-red-600 cursor-pointer"
                                onClick={() => handleDeleteConversation(conv.session_id)}
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
            // Spacer when collapsed to push user section to bottom
            <div className="flex-1" />
          )}

          {/* User Section */}
          <div className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 transition-colors ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''}`}
                  title={isSidebarCollapsed && !isMobileSidebarOpen ? user.email : ''}
                >
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                    <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || user.email.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border-gray-200">
                <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100">
                  <Link href="/dashboard" className="flex items-center">
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
                  onClick={handleLogout}
                  className="text-red-600 focus:bg-gray-100 focus:text-red-600"
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
        <div className="h-14 flex items-center justify-between px-4 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileSidebarOpen(!isMobileSidebarOpen)
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Response Mode Selector and Streaming Toggle */}
          <div className="flex items-center gap-3">
            {/* Streaming Toggle */}
            <button
              onClick={() => setEnableStreaming(!enableStreaming)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
                enableStreaming
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={enableStreaming ? 'Streaming enabled' : 'Streaming disabled'}
            >
              <Sparkles className={`w-4 h-4 ${enableStreaming ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{enableStreaming ? 'Streaming' : 'Standard'}</span>
            </button>

            {/* Response Mode Selector */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowResponseModeMenu(!showResponseModeMenu)
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span className="capitalize">{responseMode}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

            {showResponseModeMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => {
                    setResponseMode('chat')
                    setShowResponseModeMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-sm">Chat</div>
                    <div className="text-xs text-gray-500">Concise responses</div>
                  </div>
                  {responseMode === 'chat' && <Check className="w-4 h-4 text-blue-600" />}
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
                  {responseMode === 'expert' && <Check className="w-4 h-4 text-blue-600" />}
                </button>
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
                  {responseMode === 'raw_facts' && <Check className="w-4 h-4 text-blue-600" />}
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  What would you like to know?
                </h2>
                <p className="text-gray-600 mb-8">
                  Ask questions about your knowledge base. I can help you search, analyze, and extract insights from the information you&apos;ve stored in VRIN.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    'Summarize my recent documents',
                    'Find connections between concepts',
                    'What are the key insights?',
                    'Search for specific information'
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
                    // User message: Background box, aligned right, max-width
                    <div className="max-w-2xl">
                      <div className="bg-gray-100 text-gray-900 rounded-2xl px-5 py-3">
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    // Assistant message: No background, full center space, max-width for content
                    <div className="w-full max-w-3xl">
                      <div className="text-gray-900">
                        <MarkdownRenderer content={message.content} />

                        {/* Reasoning Panel - Show if thinking_steps or reasoning_tokens exist */}
                        {message.metadata && ((message.metadata.thinking_steps && message.metadata.thinking_steps.length > 0) || (message.metadata.reasoning_tokens && message.metadata.reasoning_tokens > 0)) && (
                          <ThinkingPanel
                            metadata={{
                              model: message.metadata.model || 'gpt-5-mini',
                              reasoning_tokens: message.metadata.reasoning_tokens || 0,
                              input_tokens: message.metadata.input_tokens || 0,
                              output_tokens: message.metadata.output_tokens || 0,
                              total_tokens: message.metadata.total_tokens || 0,
                              processing_time: message.metadata.response_time || message.metadata.search_time,
                              thinking_steps: message.metadata.thinking_steps || [],  // Use actual thinking steps from backend
                              reasoning_summary: message.metadata.reasoning_summary  // GPT-5 reasoning summary
                            }}
                          />
                        )}

                        {/* Metadata for assistant messages */}
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
                            {message.metadata.constraints_applied && message.metadata.constraints_applied > 0 && (
                              <span>🎯 {message.metadata.constraints_applied} constraints</span>
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

                      {/* Sources button for assistant messages */}
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

                      {/* Expert analysis panel for expert mode */}
                      {message.expert_analysis && (
                        <ExpertAnalysisPanel analysis={message.expert_analysis} />
                      )}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Streaming message (shows AI response as it streams in) */}
              {isStreaming && streamingContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="w-full max-w-3xl">
                    <div className="text-gray-900">
                      <MarkdownRenderer content={streamingContent} />

                      {/* Streaming cursor */}
                      <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1" />

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span>Streaming response...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loading indicator (shows when waiting for response) */}
              {isLoading && (
                <LoadingAnimation isStreaming={isStreaming} />
              )}

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
                    <button
                      onClick={clearError}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
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
        {/* <div className="sticky bottom-0 left-0 right-0 pointer-events-none"> */}
          <div className="bg-gradient-to-t from-white via-white to-transparent pb-4 px-6">
            <div className="max-w-3xl mx-auto pointer-events-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                console.log('Form submitted - calling handleSendMessage')
                handleSendMessage()
              }}
              className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 focus-within:shadow-xl focus-within:border-blue-400/50 transition-all"
            >
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    console.log('Enter pressed - calling handleSendMessage')
                    handleSendMessage()
                  }
                }}
                placeholder="Ask VRIN anything about your knowledge..."
                rows={1}
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 px-5 py-4 pr-32 resize-none outline-none max-h-32"
                style={{
                  minHeight: '56px',
                  height: 'auto',
                }}
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    console.log('📎 Paperclip clicked - opening upload zone')
                    setShowUploadZone(true)
                  }}
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
                      ? 'bg-blue-500/90 hover:bg-blue-600/90 text-white shadow-lg'
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
              VRIN can make mistakes. Verify important information from your knowledge base.
            </p>
            </div>
          </div>
        {/* </div> */}
      </div>

      {/* File Upload Zone */}
      {showUploadZone && (
        <>
          {console.log('🎨 Rendering FileUploadZone', {
            uploadsCount: uploads.length,
            apiKeyPresent: !!apiKey,
            handlerType: typeof handleFileUpload
          })}
          <FileUploadZone
            uploads={uploads}
            onUpload={handleFileUpload}
            onClose={() => {
              console.log('❌ Closing upload zone')
              setShowUploadZone(false)
            }}
            onDragLeave={() => setShowUploadZone(false)}
          />
        </>
      )}

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
