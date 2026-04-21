"use client"

import * as React from "react"
import { UploadCloud, File as FileIcon, CheckCircle2, AlertCircle, Loader2, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

import { PageShell } from "@/components/dashboard/v2/primitives/page-shell"
import { SectionHeader } from "@/components/dashboard/v2/primitives/section-header"
import { EmptyState } from "@/components/dashboard/v2/primitives/empty-state"
import { useDashboardAuth } from "@/components/dashboard/v2/shell/auth-context"
import { useFileUploads } from "@/hooks/use-file-uploads"
import { cn } from "@/lib/utils"
import type { FileUpload } from "@/types/chat"

export default function UploadsPage() {
  const { apiKey, sessionJwt } = useDashboardAuth()
  const bearer = sessionJwt || apiKey || ""
  const { uploads, uploadFile, clearCompletedUploads } = useFileUploads(bearer)
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const onFiles = async (files: FileList | File[]) => {
    const list = Array.from(files)
    for (const f of list) {
      try {
        toast.loading(`Uploading ${f.name}…`, { id: `up-${f.name}`, duration: 2000 })
        await uploadFile(f, true)
        toast.success(`${f.name} queued for ingestion`, { id: `up-${f.name}` })
      } catch (err) {
        toast.error(`Upload failed: ${(err as Error).message || "unknown"}`, { id: `up-${f.name}` })
      }
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files)
  }

  const activeUploads = uploads.filter((u) => u.status !== "completed" && u.status !== "failed")
  const finishedUploads = uploads.filter((u) => u.status === "completed" || u.status === "failed")

  return (
    <PageShell
      eyebrow="Ingest"
      title="Uploads"
      description="Drop documents here — VRIN extracts facts, links them to entities, and updates your graph."
      actions={
        finishedUploads.length ? (
          <button
            onClick={clearCompletedUploads}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm hover:bg-surface-3"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear finished
          </button>
        ) : null
      }
    >
      <div className="space-y-8">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-14 text-center cursor-pointer transition-colors",
            dragging
              ? "border-foreground/60 bg-foreground/5"
              : "border-border/80 bg-surface-2/40 hover:border-foreground/30 hover:bg-surface-2"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.txt,.md,.csv,.json,.docx"
            onChange={(e) => e.target.files && onFiles(e.target.files)}
          />
          <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center text-foreground mb-3">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium">Drop files to upload</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, Markdown, text, CSV, JSON, or DOCX · max 10 MB each</p>
        </div>

        <section>
          <SectionHeader title="In progress" description={activeUploads.length ? `${activeUploads.length} active` : "None"} />
          {activeUploads.length === 0 ? (
            <EmptyState
              icon={FileIcon}
              title="Nothing ingesting right now"
              description="Uploads you start will appear here as they extract facts and write to your graph."
            />
          ) : (
            <ul className="rounded-xl border border-border/60 bg-surface-2/40 divide-y divide-border/60">
              {activeUploads.map((u) => (
                <UploadRow key={u.upload_id} upload={u} />
              ))}
            </ul>
          )}
        </section>

        {finishedUploads.length > 0 && (
          <section>
            <SectionHeader title="Completed" />
            <ul className="rounded-xl border border-border/60 bg-surface-2/40 divide-y divide-border/60">
              {finishedUploads.map((u) => (
                <UploadRow key={u.upload_id} upload={u} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </PageShell>
  )
}

function UploadRow({ upload }: { upload: FileUpload }) {
  const statusBadge = statusOf(upload)
  const progress = Math.min(100, Math.max(0, upload.progress ?? 0))
  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-3">
        <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm truncate">{upload.filename}</p>
          <p className="text-[11px] text-muted-foreground">
            {formatBytes(upload.file_size)} · {upload.file_type || "unknown"}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-medium px-2 h-6 rounded-md",
            statusBadge.class
          )}
        >
          <statusBadge.Icon className="w-3 h-3" />
          {statusBadge.label}
        </span>
      </div>
      {upload.status !== "completed" && upload.status !== "failed" && (
        <div className="mt-2 h-1 rounded-full bg-surface-3 overflow-hidden">
          <div
            className="h-full bg-vrin-sage transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </li>
  )
}

function statusOf(upload: FileUpload) {
  if (upload.status === "completed") {
    return { label: "Completed", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 }
  }
  if (upload.status === "failed") {
    return { label: "Failed", class: "bg-destructive/10 text-destructive", Icon: AlertCircle }
  }
  if (upload.status === "processing") {
    return { label: "Processing", class: "bg-blue-500/10 text-blue-500", Icon: Loader2 }
  }
  return { label: "Uploaded", class: "bg-foreground/5 text-muted-foreground", Icon: Loader2 }
}

function formatBytes(bytes: number): string {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
