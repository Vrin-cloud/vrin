'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import {
  ArrowUp,
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
  Check,
  Globe
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
import type { ChatMessage as BackendChatMessage, ResponseMode, QueryDepth, SourceDocument, FileAttachment } from '@/types/chat'
import { FileAttachmentCard, FileAttachmentCardLight } from '@/components/chat/file-attachment-card'
import { getModelDisplayName, getModelInfo, MODEL_METADATA, PROVIDERS } from '@/components/chat/model-selector'
import vrinIcon from '@/app/icon.svg'

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
  const [queryDepth, setQueryDepth] = useState<QueryDepth | null>(null)  // null = default VRIN, 'thinking' or 'research' = upgraded modes
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)  // "+" button popover
  const [showUploadZone, setShowUploadZone] = useState(false)
  const [showResponseModeMenu, setShowResponseModeMenu] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [currentSources, setCurrentSources] = useState<SourceDocument[]>([])
  const [currentMetadata, setCurrentMetadata] = useState<any>({})
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [pendingAttachments, setPendingAttachments] = useState<FileAttachment[]>([])
  // Track all upload IDs for this conversation (for temporary doc isolation)
  const [conversationUploadIds, setConversationUploadIds] = useState<string[]>([])
  // Model selection and user plan limits
  const [selectedModel, setSelectedModel] = useState<string>('gpt-5.2')
  const [userPlan, setUserPlan] = useState<string>('free')
  const [allowedModels, setAllowedModels] = useState<string[]>(['gpt-5.2', 'claude-4-haiku', 'gemini-3-flash', 'grok-3'])
  const [userFeatures, setUserFeatures] = useState<{ brainstorm_mode: boolean; web_search: boolean }>({
    brainstorm_mode: false,
    web_search: true,  // Web search is available to all users
  })
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // NextAuth session for Google OAuth
  const { data: nextAuthSession, status: sessionStatus } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const authService = new AuthService()

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Set new height based on content, with min and max limits
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 56), 200)
      textarea.style.height = `${newHeight}px`
    }
  }

  // Streaming is ALWAYS enabled - this is the default VRIN experience
  const enableStreaming = true

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
    resetChat,
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
    // Check for existing auth from localStorage first
    let storedUser = authService.getStoredUser()
    let storedApiKey = authService.getStoredApiKey()

    // SECURITY FIX: If NextAuth session exists, validate it matches localStorage
    // This prevents cross-account data leakage where a previous user's data persists
    if (nextAuthSession?.user?.email && storedUser?.email) {
      if (nextAuthSession.user.email !== storedUser.email) {
        // MISMATCH DETECTED - Clear stale data from previous user
        console.warn(`Security: Session mismatch detected! localStorage: ${storedUser.email}, NextAuth: ${nextAuthSession.user.email}. Clearing stale data.`)
        localStorage.removeItem('vrin_api_key')
        localStorage.removeItem('vrin_user')
        localStorage.removeItem('vrin_chat_session_id')
        // Clear local variables so we fall through to NextAuth sync
        storedApiKey = null
        storedUser = null
      }
    }

    if (storedUser && storedApiKey) {
      // Validate that stored user data has required fields
      if (!storedUser.user_id || !storedUser.email) {
        console.warn('Incomplete user data in localStorage, clearing and redirecting to login...')
        localStorage.removeItem('vrin_user')
        localStorage.removeItem('vrin_api_key')
        setIsCheckingAuth(false)
        window.location.href = '/auth'
        return
      }
      setUser(storedUser)
      setApiKey(storedApiKey)
      setIsCheckingAuth(false)
      console.log('Chat initialized with user:', storedUser.email)
      console.log('API key loaded:', storedApiKey.substring(0, 10) + '...')
    } else if (sessionStatus === 'loading') {
      // Wait for NextAuth session to load
      return
    } else if (nextAuthSession?.user) {
      // Google OAuth: Sync NextAuth session to localStorage
      const nextAuthUser = nextAuthSession.user as any
      const nextAuthApiKey = nextAuthUser.apiKey
      const nextAuthUserId = nextAuthUser.userId

      if (nextAuthApiKey && nextAuthUserId) {
        // Save to localStorage for compatibility
        const userData = {
          user_id: nextAuthUserId,
          email: nextAuthUser.email || '',
          name: nextAuthUser.name || nextAuthUser.email?.split('@')[0] || '',
          created_at: new Date().toISOString()
        }

        localStorage.setItem('vrin_api_key', nextAuthApiKey)
        localStorage.setItem('vrin_user', JSON.stringify(userData))

        // Update component state
        setApiKey(nextAuthApiKey)
        setUser(userData)
        console.log('Chat: Synced NextAuth session to localStorage:', { apiKey: nextAuthApiKey, user: userData })
      }
      setIsCheckingAuth(false)
    } else {
      console.warn('Missing authentication:', { hasUser: !!storedUser, hasApiKey: !!storedApiKey })
      setIsCheckingAuth(false)
    }
  }, [nextAuthSession, sessionStatus])

  // Fetch conversations when API key is available
  useEffect(() => {
    if (apiKey) {
      console.log('Fetching conversation list...')
      fetchConversations()
    }
  }, [apiKey, fetchConversations])

  // Fetch user limits and allowed models when API key is available
  useEffect(() => {
    if (!apiKey) return

    const fetchUserLimits = async () => {
      try {
        const response = await fetch('/api/user/limits', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUserPlan(data.plan || 'free')
            setAllowedModels(data.allowed_models || ['gpt-5.2', 'claude-4-haiku', 'gemini-3-flash', 'grok-3'])
            // Set user features (brainstorm, web search availability)
            if (data.features) {
              setUserFeatures({
                brainstorm_mode: data.features.brainstorm_mode || false,
                web_search: data.features.web_search || false,
              })
            }
            // Ensure selected model is allowed, otherwise reset to default
            if (!data.allowed_models?.includes(selectedModel)) {
              setSelectedModel(data.allowed_models?.[0] || 'gpt-5.2')
            }
            console.log('User limits loaded:', { plan: data.plan, allowedModels: data.allowed_models, features: data.features })
          }
        } else {
          console.warn('Failed to fetch user limits, using defaults')
        }
      } catch (error) {
        console.error('Error fetching user limits:', error)
      }
    }

    fetchUserLimits()
  }, [apiKey])

  // Auto-scroll only when messages change or streaming starts (not on every chunk)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])  // Only scroll when streaming state changes or new message added

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

  // Close model selector when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showModelSelector) {
        setShowModelSelector(false)
      }
    }

    if (showModelSelector) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showModelSelector])

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showOptionsMenu) {
        setShowOptionsMenu(false)
      }
    }

    if (showOptionsMenu) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showOptionsMenu])

  const handleLogout = async () => {
    if (session) {
      endSession()
    }
    authService.logout()
    setUser(null)

    // Also sign out from NextAuth (for Google OAuth users)
    await signOut({ redirect: false })

    window.location.href = '/auth'
  }

  // Check if any attachment is still processing (uploading or processing)
  const hasProcessingAttachments = pendingAttachments.some(a => a.status === 'uploading' || a.status === 'processing')
  const hasErrorAttachments = pendingAttachments.some(a => a.status === 'error')
  const allAttachmentsReady = pendingAttachments.length === 0 || pendingAttachments.every(a => a.status === 'ready')

  const handleSendMessage = async () => {
    // Allow sending if there's text OR attachments (that are ready)
    const hasContent = inputMessage.trim() || (pendingAttachments.length > 0 && allAttachmentsReady)
    if (!hasContent || isLoading || hasProcessingAttachments) {
      console.log('Send message blocked:', {
        hasMessage: !!inputMessage.trim(),
        hasAttachments: pendingAttachments.length > 0,
        allAttachmentsReady,
        hasProcessingAttachments,
        isLoading
      })
      return
    }

    if (!apiKey) {
      console.error('Cannot send message: No API key')
      return
    }

    console.log('Sending message:', inputMessage.substring(0, 50) + '...')
    console.log('With attachments:', pendingAttachments.length)
    const message = inputMessage
    const attachmentsToSend = [...pendingAttachments]  // Copy attachments
    const wasNewConversation = !session?.session_id || messages.length === 0
    setInputMessage('')
    setPendingAttachments([])  // Clear attachments
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px'
    }

    try {
      await sendMessage(message || '(Uploaded file)', responseMode, enableStreaming, webSearchEnabled, attachmentsToSend, conversationUploadIds, selectedModel, queryDepth)
      console.log('Message sent successfully')

      // Refresh conversation list after first message in new conversation
      if (wasNewConversation) {
        console.log('New conversation started, refreshing list...')
        setTimeout(() => refreshConversations(), 1500)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Restore message and attachments on error
      setInputMessage(message)
      setPendingAttachments(attachmentsToSend)
    }
  }

  const handleNewChat = () => {
    setActiveConversationId(null)
    setConversationUploadIds([])  // Clear upload tracking for new conversation
    setPendingAttachments([])  // Clear pending attachments
    // Just reset UI state — session is auto-created on first message send
    resetChat()
  }

  const handleLoadConversation = async (sessionId: string) => {
    if (isLoadingConversation) return
    setConversationUploadIds([])  // Clear upload tracking when loading different conversation
    setPendingAttachments([])  // Clear pending attachments
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

        // Save session_id to localStorage for continuity
        localStorage.setItem('vrin_chat_session_id', sessionId)

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

  // Helper to update attachment status
  const updateAttachmentStatus = (attachmentId: string, status: FileAttachment['status'], errorMessage?: string) => {
    setPendingAttachments(prev => prev.map(a =>
      a.id === attachmentId ? { ...a, status, error_message: errorMessage } : a
    ))
  }

  // Poll for document processing completion with adaptive intervals
  const pollForProcessingComplete = async (uploadId: string, attachmentId: string) => {
    let attempts = 0
    let consecutiveErrors = 0

    const poll = async (): Promise<boolean> => {
      try {
        const status = await chatAPI.getUploadStatus(uploadId, apiKey)
        consecutiveErrors = 0  // Reset error counter on success
        console.log(`📊 Processing status for ${uploadId}:`, status.status, `(attempt ${attempts + 1})`)

        if (status.status === 'completed') {
          updateAttachmentStatus(attachmentId, 'ready')
          toast.success(`${status.filename} is ready`)
          return true
        } else if (status.status === 'failed') {
          updateAttachmentStatus(attachmentId, 'error', status.error_message || 'Processing failed')
          toast.error(`Failed to process file: ${status.error_message || 'Unknown error'}`)
          return true
        }

        // Still processing - check for timeout
        attempts++

        // Adaptive timeout: 2 minutes for chat-only docs, 5 minutes for memory docs
        // Chat-only should use fast path and complete in seconds
        const maxAttempts = 24  // ~2 minutes with adaptive intervals

        if (attempts >= maxAttempts) {
          updateAttachmentStatus(attachmentId, 'error', 'Processing taking too long - please try again')
          toast.error('File processing timed out. The file may be too large or complex.')
          return true
        }

        // Adaptive polling: fast at first (2s), then slow down (5s after 5 attempts, 10s after 10)
        let delay = 2000  // First 5 attempts: 2 seconds
        if (attempts > 10) {
          delay = 10000  // After 10 attempts: 10 seconds
        } else if (attempts > 5) {
          delay = 5000  // After 5 attempts: 5 seconds
        }

        await new Promise(resolve => setTimeout(resolve, delay))
        return poll()
      } catch (error) {
        console.error('❌ Error polling status:', error)
        consecutiveErrors++

        // Fail after 3 consecutive network errors
        if (consecutiveErrors >= 3) {
          updateAttachmentStatus(attachmentId, 'error', 'Connection error - please check your network')
          return true
        }
        await new Promise(resolve => setTimeout(resolve, 3000))
        return poll()
      }
    }

    poll()
  }

  const handleFileUpload = async (file: File, saveToMemory: boolean = true) => {
    console.log('🔄 handleFileUpload called with file:', file.name)
    console.log('  - Size:', (file.size / 1024).toFixed(2), 'KB')
    console.log('  - Type:', file.type)
    console.log('  - Save to memory:', saveToMemory)
    console.log('  - API Key present:', !!apiKey)

    if (!apiKey) {
      console.error('❌ Cannot upload: No API key available')
      alert('Cannot upload file: Please log in again')
      return
    }

    // Create attachment with 'uploading' status immediately
    const tempId = `attachment-${Date.now()}`
    const attachment: FileAttachment = {
      id: tempId,
      filename: file.name,
      file_type: file.type,
      file_size: file.size,
      status: 'uploading'
    }
    setPendingAttachments(prev => [...prev, attachment])
    setShowUploadZone(false)

    try {
      console.log('📤 Calling uploadFile...')
      const result = await uploadFile(file, saveToMemory)
      console.log('✅ Upload initiated successfully:', result)

      // Update attachment with upload_id and set to 'processing'
      const uploadId = result?.upload_id
      setPendingAttachments(prev => prev.map(a =>
        a.id === tempId ? {
          ...a,
          id: uploadId || tempId,
          upload_id: uploadId,
          status: 'processing' as const
        } : a
      ))

      // Track upload_id for conversation-level isolation of temporary docs
      if (uploadId) {
        setConversationUploadIds(prev => [...prev, uploadId])
        console.log('📎 Added upload_id to conversation:', uploadId)

        // Start polling for processing completion
        pollForProcessingComplete(uploadId, uploadId || tempId)
      } else {
        // No upload_id means instant ready (shouldn't happen but handle gracefully)
        updateAttachmentStatus(tempId, 'ready')
      }
    } catch (error) {
      console.error('❌ File upload failed:', error)
      updateAttachmentStatus(tempId, 'error', error instanceof Error ? error.message : 'Upload failed')
      toast.error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    setPendingAttachments(prev => prev.filter(a => a.id !== attachmentId))
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

  // Show loading state while checking authentication
  if (isCheckingAuth || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Loading...</h1>
            <p className="text-gray-600 mt-2">Checking authentication</p>
          </div>
        </div>
      </div>
    )
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
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {(!isSidebarCollapsed || isMobileSidebarOpen) ? (
                <>
                  <div className="flex flex-col gap-0.5">
                    <Image
                      src="/og-image.png"
                      alt="VRIN"
                      width={80}
                      height={28}
                      className="object-contain object-left"
                      priority
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (isMobileSidebarOpen) {
                        setIsMobileSidebarOpen(false)
                      } else {
                        setIsSidebarCollapsed(!isSidebarCollapsed)
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title={isMobileSidebarOpen ? "Close sidebar" : "Collapse sidebar"}
                  >
                    {isMobileSidebarOpen ? (
                      <X className="w-5 h-5 text-gray-700" />
                    ) : (
                      <Menu className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="relative group rounded-lg transition-colors flex items-center justify-center hover:bg-gray-100"
                    title="Expand sidebar"
                  >
                    <Image
                      src={vrinIcon}
                      alt="VRIN"
                      width={40}
                      height={40}
                      className="group-hover:opacity-0 transition-opacity duration-200"
                      priority
                      unoptimized
                    />
                    <Menu className="w-5 h-5 text-gray-600 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                </div>
              )}
            </div>
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
                  title={isSidebarCollapsed && !isMobileSidebarOpen ? (user.email || '') : ''}
                >
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                    <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                      {user.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
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

          {/* Response Mode Selector */}
          <div className="flex items-center gap-3">
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

                {/* Divider */}
                <div className="my-2 border-t border-gray-200" />

                {/* Brainstorm Mode */}
                <button
                  onClick={() => {
                    setResponseMode('brainstorm')
                    setShowResponseModeMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="font-medium text-sm">Brainstorm</div>
                      <div className="text-xs text-gray-500">Creative ideation mode</div>
                    </div>
                  </div>
                  {responseMode === 'brainstorm' && <Check className="w-4 h-4 text-blue-600" />}
                </button>

                {/* Web Search Toggle - Only show in brainstorm mode */}
                {responseMode === 'brainstorm' && (
                  <div className="px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setWebSearchEnabled(!webSearchEnabled)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className={`w-4 h-4 ${webSearchEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Web Search</span>
                      </div>
                      <div className={`w-8 h-5 rounded-full transition-colors ${webSearchEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform mt-0.5 ${webSearchEnabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                      </div>
                    </button>
                    <p className="text-xs text-gray-500 mt-1 px-1">
                      {webSearchEnabled ? 'Augment with real-time web data' : 'Use knowledge base only'}
                    </p>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <LayoutGroup>
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {messages.length === 0 && !isLoading ? (
            /* ========== CENTERED WELCOME VIEW ========== */
            <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-16">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
              >
                <Image
                  src={vrinIcon}
                  alt="VRIN"
                  width={40}
                  height={40}
                  unoptimized
                />
                <span
                  className="text-2xl md:text-3xl text-gray-800 tracking-tight"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 500 }}
                >
                  Reason through your knowledge
                </span>
              </motion.div>

              {/* Centered Input Form */}
              <motion.div
                layout
                layoutId="chat-input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-2xl"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="relative bg-white rounded-2xl border border-gray-300 shadow-lg focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
                >
                  {/* Pending Attachments Preview */}
                  {pendingAttachments.length > 0 && (
                    <div className="px-4 pt-3 pb-1 flex flex-wrap gap-2 border-b border-gray-200">
                      {pendingAttachments.map((attachment) => (
                        <FileAttachmentCard
                          key={attachment.id}
                          attachment={attachment}
                          onRemove={() => handleRemoveAttachment(attachment.id)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Text Input Area */}
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => {
                      setInputMessage(e.target.value)
                      adjustTextareaHeight()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                        if (textareaRef.current) {
                          textareaRef.current.style.height = '48px'
                        }
                      }
                    }}
                    placeholder="Ask anything about your knowledge..."
                    rows={1}
                    className="w-full bg-transparent text-gray-900 placeholder-gray-400 px-5 pt-5 pb-2 resize-none outline-none overflow-y-auto text-base"
                    style={{
                      minHeight: '52px',
                      maxHeight: '160px',
                    }}
                    disabled={isLoading}
                    autoFocus
                  />

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-between px-3 pb-3">
                    {/* Left Side - Options Menu */}
                    <div className="flex items-center gap-2">
                      {/* Options "+" Button */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowOptionsMenu(!showOptionsMenu)
                          }}
                          disabled={isLoading || isStreaming}
                          className={`
                            flex items-center justify-center w-8 h-8 rounded-lg transition-all
                            ${(webSearchEnabled || responseMode === 'brainstorm' || queryDepth)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-500 hover:bg-gray-100'
                            }
                          `}
                          title="Query options"
                        >
                          <Plus className="w-5 h-5" />
                        </button>

                        {/* Options Popover */}
                        {showOptionsMenu && (
                          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Query Depth
                            </div>

                            {/* Thinking Mode */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setQueryDepth(queryDepth === 'thinking' ? null : 'thinking')
                              }}
                              className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                                queryDepth === 'thinking' ? 'bg-blue-50' : ''
                              }`}
                            >
                              <Sparkles className={`w-5 h-5 ${queryDepth === 'thinking' ? 'text-blue-600' : 'text-gray-400'}`} />
                              <div className="flex-1">
                                <div className={`font-medium text-sm ${queryDepth === 'thinking' ? 'text-blue-700' : 'text-gray-700'}`}>
                                  Thinking
                                </div>
                                <div className="text-xs text-gray-500">Cross-document analysis</div>
                              </div>
                              {queryDepth === 'thinking' && <Check className="w-4 h-4 text-blue-600" />}
                            </button>

                            {/* Research Mode */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setQueryDepth(queryDepth === 'research' ? null : 'research')
                              }}
                              className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                                queryDepth === 'research' ? 'bg-purple-50' : ''
                              }`}
                            >
                              <Search className={`w-5 h-5 ${queryDepth === 'research' ? 'text-purple-600' : 'text-gray-400'}`} />
                              <div className="flex-1">
                                <div className={`font-medium text-sm ${queryDepth === 'research' ? 'text-purple-700' : 'text-gray-700'}`}>
                                  Research
                                </div>
                                <div className="text-xs text-gray-500">Deep exhaustive analysis</div>
                              </div>
                              {queryDepth === 'research' && <Check className="w-4 h-4 text-purple-600" />}
                            </button>

                            <div className="my-2 border-t border-gray-100" />
                            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Enhancements
                            </div>

                            {/* Web Search Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setWebSearchEnabled(!webSearchEnabled)
                              }}
                              className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                                webSearchEnabled ? 'bg-blue-50' : ''
                              }`}
                            >
                              <Globe className={`w-5 h-5 ${webSearchEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                              <div className="flex-1">
                                <div className={`font-medium text-sm ${webSearchEnabled ? 'text-blue-700' : 'text-gray-700'}`}>
                                  Web Search
                                </div>
                                <div className="text-xs text-gray-500">Search the internet</div>
                              </div>
                              {webSearchEnabled && <Check className="w-4 h-4 text-blue-600" />}
                            </button>

                            {/* Brainstorm Mode Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (userFeatures.brainstorm_mode) {
                                  setResponseMode(responseMode === 'brainstorm' ? 'chat' : 'brainstorm')
                                } else {
                                  setShowUpgradeModal(true)
                                  setShowOptionsMenu(false)
                                }
                              }}
                              className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                                responseMode === 'brainstorm' ? 'bg-purple-50' : ''
                              }`}
                            >
                              <Brain className={`w-5 h-5 ${responseMode === 'brainstorm' ? 'text-purple-600' : 'text-gray-400'}`} />
                              <div className="flex-1">
                                <div className={`font-medium text-sm ${responseMode === 'brainstorm' ? 'text-purple-700' : 'text-gray-700'}`}>
                                  Brainstorm
                                </div>
                                <div className="text-xs text-gray-500">
                                  {userFeatures.brainstorm_mode ? 'Creative ideation mode' : 'Upgrade to Pro'}
                                </div>
                              </div>
                              {responseMode === 'brainstorm' && <Check className="w-4 h-4 text-purple-600" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Active Mode Indicators */}
                      {queryDepth === 'thinking' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          <Sparkles className="w-3 h-3" /> Thinking
                        </span>
                      )}
                      {queryDepth === 'research' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                          <Search className="w-3 h-3" /> Research
                        </span>
                      )}
                      {webSearchEnabled && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          <Globe className="w-3 h-3" /> Search
                        </span>
                      )}
                      {responseMode === 'brainstorm' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                          <Brain className="w-3 h-3" /> Brainstorm
                        </span>
                      )}
                    </div>

                    {/* Right Side - Model, Attach, Send */}
                    <div className="flex items-center gap-1">
                      {/* Model Selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowModelSelector(!showModelSelector)
                          }}
                          disabled={isLoading || isStreaming}
                          className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm
                            ${showModelSelector
                              ? 'bg-gray-200 text-gray-800'
                              : 'text-gray-500 hover:bg-gray-100'
                            }
                          `}
                          title="Select model"
                        >
                          <Zap className="w-4 h-4" />
                          <span className="hidden sm:inline max-w-[100px] truncate">{getModelDisplayName(selectedModel)}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Model Selector Popup */}
                        {showModelSelector && (
                          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                            {userPlan === 'free' && (
                              <div className="px-4 py-2 border-b border-gray-100">
                                <a href="/pricing" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                  Upgrade for best models
                                </a>
                              </div>
                            )}
                            <div className="py-1">
                              {MODEL_METADATA.map((model) => {
                                const isAllowed = allowedModels.includes(model.id)
                                const isSelected = selectedModel === model.id
                                const providerInfo = PROVIDERS[model.provider]
                                return (
                                  <button
                                    key={model.id}
                                    type="button"
                                    onClick={() => {
                                      if (isAllowed) {
                                        setSelectedModel(model.id)
                                        setShowModelSelector(false)
                                      }
                                    }}
                                    disabled={!isAllowed}
                                    className={`
                                      w-full px-4 py-2.5 text-left flex items-center justify-between
                                      ${isAllowed ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                                      ${isSelected ? 'bg-blue-50' : ''}
                                    `}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: providerInfo?.color || '#888' }} />
                                      <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                                        {model.displayName}
                                      </span>
                                      {model.tierRequired === 'pro' && !isAllowed && (
                                        <span className="text-[10px] font-medium text-white bg-blue-500 px-1.5 py-0.5 rounded">PRO</span>
                                      )}
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* File Attachment Button */}
                      <button
                        type="button"
                        onClick={() => setShowUploadZone(true)}
                        disabled={isLoading || isStreaming}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                        title="Upload files"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      {/* Send Button */}
                      <button
                        type="submit"
                        disabled={(!inputMessage.trim() && !allAttachmentsReady) || isLoading || hasProcessingAttachments}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center transition-all
                          ${(inputMessage.trim() || allAttachmentsReady) && !isLoading && !hasProcessingAttachments
                            ? 'bg-gray-900 hover:bg-black text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }
                        `}
                        title={hasProcessingAttachments ? "Wait for file processing to complete" : "Send message"}
                      >
                        <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          ) : (
            /* ========== CONVERSATION VIEW ========== */
            <>
              {/* Scrollable Messages Area */}
              <div className="flex-1 overflow-y-auto pb-4">
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
                    <div className="max-w-2xl space-y-2">
                      {/* Show attachments above message text */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-end">
                          {message.attachments.map((attachment) => (
                            <FileAttachmentCardLight key={attachment.id} attachment={attachment} />
                          ))}
                        </div>
                      )}
                      <div className="bg-gray-100 text-gray-900 rounded-2xl px-5 py-3">
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    // Assistant message: No background, full center space, max-width for content
                    <div className="w-full max-w-3xl">
                      {/* Reasoning Panel - Show BEFORE response if thinking_steps or reasoning_tokens exist */}
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

                      <div className="text-gray-900">
                        <MarkdownRenderer content={message.content} />

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
                      <MarkdownRenderer content={streamingContent} isStreaming={true} />

                      {/* Streaming cursor */}
                      <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loading indicator (shows when waiting for response, but NOT when streaming) */}
              {isLoading && !isStreaming && (
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
              </div>

              {/* Bottom Input Area for Conversation View */}
              <motion.div
                layout
                layoutId="chat-input"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white px-6 pb-4 pt-3"
              >
                <div className="max-w-3xl mx-auto">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all"
                  >
                    {/* Pending Attachments Preview */}
                    {pendingAttachments.length > 0 && (
                      <div className="px-4 pt-3 pb-1 flex flex-wrap gap-2 border-b border-gray-200">
                        {pendingAttachments.map((attachment) => (
                          <FileAttachmentCard
                            key={attachment.id}
                            attachment={attachment}
                            onRemove={() => handleRemoveAttachment(attachment.id)}
                          />
                        ))}
                      </div>
                    )}

                    {/* Text Input Area */}
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => {
                        setInputMessage(e.target.value)
                        adjustTextareaHeight()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                          if (textareaRef.current) {
                            textareaRef.current.style.height = '48px'
                          }
                        }
                      }}
                      placeholder="Ask a follow-up..."
                      rows={1}
                      className="w-full bg-transparent text-gray-900 placeholder-gray-400 px-4 pt-4 pb-2 resize-none outline-none overflow-y-auto"
                      style={{
                        minHeight: '48px',
                        maxHeight: '160px',
                      }}
                      disabled={isLoading}
                    />

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between px-3 pb-3">
                      {/* Left Side - Options Menu */}
                      <div className="flex items-center gap-2">
                        {/* Options "+" Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowOptionsMenu(!showOptionsMenu)
                            }}
                            disabled={isLoading || isStreaming}
                            className={`
                              flex items-center justify-center w-8 h-8 rounded-lg transition-all
                              ${(webSearchEnabled || responseMode === 'brainstorm' || queryDepth)
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:bg-gray-100'
                              }
                            `}
                            title="Query options"
                          >
                            <Plus className="w-5 h-5" />
                          </button>

                          {/* Options Popover */}
                          {showOptionsMenu && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Query Depth
                              </div>

                              {/* Thinking Mode */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setQueryDepth(queryDepth === 'thinking' ? null : 'thinking')
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                                  queryDepth === 'thinking' ? 'bg-blue-50' : ''
                                }`}
                              >
                                <Sparkles className={`w-5 h-5 ${queryDepth === 'thinking' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                  <div className={`font-medium text-sm ${queryDepth === 'thinking' ? 'text-blue-700' : 'text-gray-700'}`}>
                                    Thinking
                                  </div>
                                  <div className="text-xs text-gray-500">Cross-document analysis</div>
                                </div>
                                {queryDepth === 'thinking' && <Check className="w-4 h-4 text-blue-600" />}
                              </button>

                              {/* Research Mode */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setQueryDepth(queryDepth === 'research' ? null : 'research')
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                                  queryDepth === 'research' ? 'bg-purple-50' : ''
                                }`}
                              >
                                <Search className={`w-5 h-5 ${queryDepth === 'research' ? 'text-purple-600' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                  <div className={`font-medium text-sm ${queryDepth === 'research' ? 'text-purple-700' : 'text-gray-700'}`}>
                                    Research
                                  </div>
                                  <div className="text-xs text-gray-500">Deep exhaustive analysis</div>
                                </div>
                                {queryDepth === 'research' && <Check className="w-4 h-4 text-purple-600" />}
                              </button>

                              <div className="my-2 border-t border-gray-100" />
                              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Enhancements
                              </div>

                              {/* Web Search Toggle */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setWebSearchEnabled(!webSearchEnabled)
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                                  webSearchEnabled ? 'bg-blue-50' : ''
                                }`}
                              >
                                <Globe className={`w-5 h-5 ${webSearchEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                  <div className={`font-medium text-sm ${webSearchEnabled ? 'text-blue-700' : 'text-gray-700'}`}>
                                    Web Search
                                  </div>
                                  <div className="text-xs text-gray-500">Search the internet</div>
                                </div>
                                {webSearchEnabled && <Check className="w-4 h-4 text-blue-600" />}
                              </button>

                              {/* Brainstorm Mode Toggle */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (userFeatures.brainstorm_mode) {
                                    setResponseMode(responseMode === 'brainstorm' ? 'chat' : 'brainstorm')
                                  } else {
                                    setShowUpgradeModal(true)
                                    setShowOptionsMenu(false)
                                  }
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 ${
                                  responseMode === 'brainstorm' ? 'bg-purple-50' : ''
                                }`}
                              >
                                <Brain className={`w-5 h-5 ${responseMode === 'brainstorm' ? 'text-purple-600' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                  <div className={`font-medium text-sm ${responseMode === 'brainstorm' ? 'text-purple-700' : 'text-gray-700'}`}>
                                    Brainstorm
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {userFeatures.brainstorm_mode ? 'Creative ideation mode' : 'Upgrade to Pro'}
                                  </div>
                                </div>
                                {responseMode === 'brainstorm' && <Check className="w-4 h-4 text-purple-600" />}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Active Mode Indicators */}
                        {queryDepth === 'thinking' && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                            <Sparkles className="w-3 h-3" /> Thinking
                          </span>
                        )}
                        {queryDepth === 'research' && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                            <Search className="w-3 h-3" /> Research
                          </span>
                        )}
                        {webSearchEnabled && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                            <Globe className="w-3 h-3" /> Search
                          </span>
                        )}
                        {responseMode === 'brainstorm' && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                            <Brain className="w-3 h-3" /> Brainstorm
                          </span>
                        )}
                      </div>

                      {/* Right Side - Model, Attach, Send */}
                      <div className="flex items-center gap-1">
                        {/* Model Selector */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowModelSelector(!showModelSelector)
                            }}
                            disabled={isLoading || isStreaming}
                            className={`
                              flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm
                              ${showModelSelector
                                ? 'bg-gray-200 text-gray-800'
                                : 'text-gray-500 hover:bg-gray-100'
                              }
                            `}
                            title="Select model"
                          >
                            <Zap className="w-4 h-4" />
                            <span className="hidden sm:inline max-w-[100px] truncate">{getModelDisplayName(selectedModel)}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Model Selector Popup */}
                          {showModelSelector && (
                            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                              {userPlan === 'free' && (
                                <div className="px-4 py-2 border-b border-gray-100">
                                  <a href="/pricing" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Upgrade for best models
                                  </a>
                                </div>
                              )}
                              <div className="py-1">
                                {MODEL_METADATA.map((model) => {
                                  const isAllowed = allowedModels.includes(model.id)
                                  const isSelected = selectedModel === model.id
                                  const providerInfo = PROVIDERS[model.provider]
                                  return (
                                    <button
                                      key={model.id}
                                      type="button"
                                      onClick={() => {
                                        if (isAllowed) {
                                          setSelectedModel(model.id)
                                          setShowModelSelector(false)
                                        }
                                      }}
                                      disabled={!isAllowed}
                                      className={`
                                        w-full px-4 py-2.5 text-left flex items-center justify-between
                                        ${isAllowed ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                                        ${isSelected ? 'bg-blue-50' : ''}
                                      `}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: providerInfo?.color || '#888' }} />
                                        <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                                          {model.displayName}
                                        </span>
                                        {model.tierRequired === 'pro' && !isAllowed && (
                                          <span className="text-[10px] font-medium text-white bg-blue-500 px-1.5 py-0.5 rounded">PRO</span>
                                        )}
                                      </div>
                                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* File Attachment Button */}
                        <button
                          type="button"
                          onClick={() => setShowUploadZone(true)}
                          disabled={isLoading || isStreaming}
                          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                          title="Upload files"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>

                        {/* Send Button */}
                        <button
                          type="submit"
                          onClick={(e) => {
                            if (isStreaming) {
                              e.preventDefault()
                              cancelStreaming()
                            }
                          }}
                          disabled={!isStreaming && ((!inputMessage.trim() && !allAttachmentsReady) || isLoading || hasProcessingAttachments)}
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-all
                            ${isStreaming
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : (inputMessage.trim() || allAttachmentsReady) && !isLoading && !hasProcessingAttachments
                              ? 'bg-gray-900 hover:bg-black text-white'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                          `}
                          title={isStreaming ? 'Cancel streaming' : hasProcessingAttachments ? 'Wait for file processing to complete' : 'Send message'}
                        >
                          {isStreaming ? (
                            <StopCircle className="w-4 h-4" />
                          ) : isLoading ? (
                            <StopCircle className="w-4 h-4 opacity-50" />
                          ) : (
                            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </div>
        </LayoutGroup>
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

      {/* Upgrade Modal - Perplexity Style */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Popular Badge */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Pro</h2>
                <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-sm font-medium rounded-full border border-teal-500/30">
                  Popular
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$19</span>
                  <span className="text-gray-400">/ month</span>
                </div>
                <p className="text-gray-400 mt-2">
                  Unlock advanced reasoning and premium models
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  // TODO: Integrate with Stripe checkout
                  window.location.href = '/auth?plan=pro'
                }}
                className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-gray-900 font-semibold rounded-xl transition-all mb-6"
              >
                Get Pro
              </button>

              {/* Features List */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">1,000 queries per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Access to all AI models including GPT-5.2 Turbo, o3, Claude 4 Sonnet & Opus</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Brainstorm mode for creative reasoning</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Expert mode with deep analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">100 file uploads & 5 GB storage</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Unlimited conversations</span>
                </li>
              </ul>

              {/* Footer */}
              <p className="mt-6 text-sm text-gray-500">
                Existing subscriber?{' '}
                <a href="/account/billing" className="text-teal-400 hover:underline">
                  See billing help
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
