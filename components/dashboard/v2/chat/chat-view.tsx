"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUp, Plus, Square, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatSession } from "@/hooks/use-chat-session"
import { useConversations } from "@/hooks/use-conversations"
import { useDashboardAuth } from "@/components/dashboard/v2/shell/auth-context"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import type { ChatMessage } from "@/types/chat"

export function DashboardChatView() {
  const { apiKey, user } = useDashboardAuth()
  const chat = useChatSession(apiKey)
  const { loadConversation } = useConversations(apiKey)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [draft, setDraft] = React.useState("")
  const [loadingSession, setLoadingSession] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const sessionParam = searchParams.get("session")

  // Load a saved conversation when ?session=<id> changes.
  React.useEffect(() => {
    if (!sessionParam || sessionParam === loadingSession) return
    let cancelled = false
    setLoadingSession(sessionParam)
    loadConversation(sessionParam)
      .then((conv) => {
        if (cancelled || !conv) return
        const msgs: ChatMessage[] = conv.messages.map((m, idx) => ({
          id: `${conv.session_id}-${idx}`,
          role: m.role as ChatMessage["role"],
          content: m.content,
          timestamp: typeof m.timestamp === "string" ? Date.parse(m.timestamp) || Date.now() : Number(m.timestamp) || Date.now(),
          sources: m.metadata?.sources as ChatMessage["sources"],
          metadata: m.metadata as ChatMessage["metadata"],
        }))
        chat.loadMessages(conv.session_id, msgs)
      })
      .finally(() => {
        if (!cancelled) setLoadingSession(null)
      })
    return () => {
      cancelled = true
    }
    // We intentionally depend only on sessionParam so the effect fires once per session deep-link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionParam])

  // Auto-scroll to bottom as streaming content arrives.
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [chat.messages.length, chat.streamingContent])

  const canSend = !!draft.trim() && !chat.isStreaming && !chat.isLoading

  const send = React.useCallback(async () => {
    const text = draft.trim()
    if (!text) return
    setDraft("")
    await chat.sendMessage(text, "chat", true)
  }, [draft, chat])

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (canSend) send()
      }
    },
    [canSend, send]
  )

  const newChat = React.useCallback(async () => {
    router.replace("/dashboard/chat")
    await chat.startNewSession()
    setDraft("")
    inputRef.current?.focus()
  }, [router, chat])

  const hasMessages = chat.messages.length > 0 || chat.isStreaming

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-1px)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60">
        <p className="text-sm text-muted-foreground">
          {chat.messages.length > 0 ? `${chat.messages.length} messages` : "New conversation"}
        </p>
        <button
          onClick={newChat}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border text-xs hover:bg-surface-3"
        >
          <Plus className="w-3.5 h-3.5" /> New chat
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
          {!hasMessages && (
            <div className="text-center py-16">
              <p className="font-display text-2xl text-foreground">
                Hi {user.name || user.email.split("@")[0]} — ask VRIN anything.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Every answer is grounded in your knowledge graph and traces back to source facts.
              </p>
            </div>
          )}

          {chat.messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {chat.isStreaming && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-md bg-foreground/5 flex items-center justify-center shrink-0 mt-0.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="eyebrow text-[10px] text-muted-foreground mb-1">VRIN</p>
                <div className="markdown-content text-sm leading-relaxed">
                  {chat.streamingContent ? (
                    <MarkdownRenderer content={chat.streamingContent} />
                  ) : (
                    <span className="text-muted-foreground italic">Thinking…</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {chat.error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 text-sm p-3">
              {chat.error}
              <button onClick={chat.clearError} className="ml-2 underline text-xs">
                dismiss
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border/60 bg-surface-2/40">
        <div className="max-w-3xl mx-auto w-full px-4 py-3">
          <div className="flex items-end gap-2 rounded-xl border border-border/80 bg-background p-2 focus-within:border-foreground/40 transition-colors">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask VRIN…"
              className="flex-1 resize-none bg-transparent outline-none text-sm py-1.5 px-2 max-h-48 min-h-[32px]"
              style={{ lineHeight: "1.5" }}
            />
            {chat.isStreaming ? (
              <button
                onClick={chat.cancelStreaming}
                className="w-8 h-8 rounded-md bg-foreground text-background flex items-center justify-center hover:opacity-90"
                aria-label="Stop streaming"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={send}
                disabled={!canSend}
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center transition-opacity",
                  canSend ? "bg-foreground text-background hover:opacity-90" : "bg-surface-3 text-muted-foreground cursor-not-allowed"
                )}
                aria-label="Send"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground text-center">
            Shift + Enter for newline · Responses stream · Powered by your knowledge graph
          </p>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <div className="flex gap-3">
      <div
        className={cn(
          "w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-medium shrink-0 mt-0.5",
          isUser ? "bg-foreground text-background" : "bg-foreground/5 text-foreground"
        )}
      >
        {isUser ? "You" : "VR"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-[10px] text-muted-foreground mb-1">{isUser ? "You" : "VRIN"}</p>
        <div className={cn("text-sm leading-relaxed", isUser ? "text-foreground" : "markdown-content")}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>
    </div>
  )
}
