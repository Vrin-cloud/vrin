// FileAttachmentCard component for displaying file attachments in chat
// Shows in input area (with remove button) and in sent messages (without remove button)

'use client'

import React from 'react';
import { X, FileText, Image, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { FileAttachment } from '@/types/chat';

interface FileAttachmentCardProps {
  attachment: FileAttachment;
  onRemove?: () => void;  // If provided, shows remove button (for input area)
  compact?: boolean;  // Smaller version for message display
}

// Get file type label from MIME type
function getFileTypeLabel(mimeType: string): string {
  const typeMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/plain': 'TXT',
    'text/markdown': 'MD',
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG',
  };
  return typeMap[mimeType] || mimeType.split('/').pop()?.toUpperCase() || 'FILE';
}

// Get icon based on file type
function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return Image;
  }
  if (mimeType === 'application/pdf') {
    return FileText;
  }
  return File;
}

// Get icon background color based on file type
function getIconBgColor(mimeType: string): string {
  if (mimeType === 'application/pdf') {
    return 'bg-red-500';
  }
  if (mimeType.startsWith('image/')) {
    return 'bg-purple-500';
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'bg-blue-500';
  }
  if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
    return 'bg-gray-500';
  }
  return 'bg-gray-500';
}

export function FileAttachmentCard({ attachment, onRemove, compact = false }: FileAttachmentCardProps) {
  const FileIcon = getFileIcon(attachment.file_type);
  const typeLabel = getFileTypeLabel(attachment.file_type);
  const iconBgColor = getIconBgColor(attachment.file_type);

  if (compact) {
    // Compact version for inline display in messages
    return (
      <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5">
        <div className={`${iconBgColor} rounded p-1`}>
          <FileIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
          {attachment.filename.replace(/\.[^/.]+$/, '')}
        </span>
      </div>
    );
  }

  // Get status indicator
  const getStatusIndicator = () => {
    switch (attachment.status) {
      case 'uploading':
        return (
          <div className="flex items-center gap-1.5 text-blue-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="text-xs">Uploading...</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-1.5 text-amber-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="text-xs">Processing...</span>
          </div>
        );
      case 'ready':
        return (
          <div className="flex items-center gap-1.5 text-green-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-xs">Ready</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-red-400" title={attachment.error_message}>
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs">Error</span>
          </div>
        );
      default:
        return <span className="text-gray-400 text-xs">{typeLabel}</span>;
    }
  };

  // Full card for input area and sent messages
  const isProcessing = attachment.status === 'uploading' || attachment.status === 'processing';
  const hasError = attachment.status === 'error';

  return (
    <div className={`relative inline-flex items-center gap-3 bg-[#2A2A2A] border rounded-xl px-4 py-3 min-w-[200px] max-w-[350px] ${
      hasError ? 'border-red-500/50' : isProcessing ? 'border-amber-500/50' : 'border-gray-700'
    }`}>
      {/* File Icon */}
      <div className={`${iconBgColor} rounded-lg p-2.5 flex-shrink-0 ${isProcessing ? 'opacity-70' : ''}`}>
        <FileIcon className="w-5 h-5 text-white" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm truncate ${isProcessing ? 'text-gray-300' : 'text-white'}`}>
          {attachment.filename}
        </p>
        {getStatusIndicator()}
      </div>

      {/* Remove Button (only shown if onRemove is provided) */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
          title="Remove file"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}
    </div>
  );
}

// Light theme version for display in chat messages (right side user messages)
export function FileAttachmentCardLight({ attachment }: { attachment: FileAttachment }) {
  const FileIcon = getFileIcon(attachment.file_type);
  const typeLabel = getFileTypeLabel(attachment.file_type);
  const iconBgColor = getIconBgColor(attachment.file_type);

  return (
    <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 min-w-[200px] max-w-[350px] shadow-sm">
      {/* File Icon */}
      <div className={`${iconBgColor} rounded-lg p-2.5 flex-shrink-0`}>
        <FileIcon className="w-5 h-5 text-white" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 font-medium text-sm truncate">
          {attachment.filename}
        </p>
        <p className="text-gray-500 text-xs">
          {typeLabel}
        </p>
      </div>
    </div>
  );
}
