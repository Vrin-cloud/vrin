// FileUploadZone component for drag-and-drop file uploads
// Displays staged files with "Save to memory" toggle before uploading

'use client'

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { FileUpload, StagedFile } from '@/types/chat';

interface FileUploadZoneProps {
  uploads: FileUpload[];
  onUpload: (file: File, saveToMemory: boolean) => void;
  onClose: () => void;
  onDragLeave?: () => void;
}

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'image/png',
  'image/jpeg'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUploadZone({
  uploads,
  onUpload,
  onClose,
  onDragLeave
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      alert(`File type ${file.type} is not supported. Supported: PDF, DOCX, TXT, MD, PNG, JPG`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return false;
    }
    return true;
  };

  const stageFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(file => validateFile(file));

    const newStagedFiles: StagedFile[] = validFiles.map(file => ({
      id: `staged-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      filename: file.name,
      file_size: file.size,
      file_type: file.type,
      saveToMemory: true // Default to saving to memory
    }));

    setStagedFiles(prev => [...prev, ...newStagedFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    stageFiles(files);
  }, [stageFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    stageFiles(files);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [stageFiles]);

  const handleToggleSaveToMemory = useCallback((fileId: string) => {
    setStagedFiles(prev =>
      prev.map(file =>
        file.id === fileId
          ? { ...file, saveToMemory: !file.saveToMemory }
          : file
      )
    );
  }, []);

  const handleRemoveStagedFile = useCallback((fileId: string) => {
    setStagedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const handleUploadAll = useCallback(async () => {
    if (stagedFiles.length === 0) return;

    setIsUploading(true);

    // Upload all staged files
    for (const stagedFile of stagedFiles) {
      try {
        await onUpload(stagedFile.file, stagedFile.saveToMemory);
      } catch (error) {
        console.error(`Failed to upload ${stagedFile.filename}:`, error);
      }
    }

    // Clear staged files after upload
    setStagedFiles([]);
    setIsUploading(false);
  }, [stagedFiles, onUpload]);

  const getStatusIcon = (status: FileUpload['status']) => {
    switch (status) {
      case 'uploaded':
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getFileIcon = (fileType: string) => {
    // Could extend this to show different icons for different file types
    return <FileText className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">Upload Files</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Drop Zone */}
          <div className="p-6">
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors
                ${isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_FILE_TYPES.join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />

              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />

              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to select files
              </p>
              <p className="text-xs text-gray-400">
                Supported: PDF, DOCX, TXT, MD, PNG, JPG (Max 10MB)
              </p>
            </div>
          </div>

          {/* Staged Files (ready to upload) */}
          {stagedFiles.length > 0 && (
            <div className="px-6 pb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Ready to Upload ({stagedFiles.length})
              </h3>
              <div className="space-y-2">
                {stagedFiles.map((stagedFile) => (
                  <div
                    key={stagedFile.id}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    {getFileIcon(stagedFile.file_type)}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {stagedFile.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(stagedFile.file_size / 1024).toFixed(0)} KB • Ready
                      </p>
                    </div>

                    {/* Save to Memory Toggle */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <label
                        htmlFor={`save-${stagedFile.id}`}
                        className="text-xs text-gray-600 cursor-pointer whitespace-nowrap"
                      >
                        Save to memory
                      </label>
                      <Switch
                        id={`save-${stagedFile.id}`}
                        checked={stagedFile.saveToMemory}
                        onCheckedChange={() => handleToggleSaveToMemory(stagedFile.id)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveStagedFile(stagedFile.id)}
                      className="p-1.5 hover:bg-blue-100 rounded transition-colors text-gray-500 hover:text-red-500"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Info about toggle */}
              <p className="text-xs text-gray-500 mt-3 px-1">
                <span className="font-medium">Save to memory:</span> ON = permanently add to your knowledge base. OFF = use for this chat only.
              </p>
            </div>
          )}

          {/* Processing/Completed Uploads */}
          {uploads.length > 0 && (
            <div className="px-6 pb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Recent Uploads
              </h3>
              <div className="space-y-2">
                {uploads.map((upload) => (
                  <div
                    key={upload.upload_id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getStatusIcon(upload.status)}

                    <FileText className="w-5 h-5 text-gray-400" />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {upload.filename}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{(upload.file_size / 1024).toFixed(0)} KB</span>
                        <span>•</span>
                        <span className="capitalize">{upload.status}</span>
                        {upload.saveToMemory !== undefined && (
                          <>
                            <span>•</span>
                            <span className={upload.saveToMemory ? 'text-blue-600' : 'text-gray-500'}>
                              {upload.saveToMemory ? '💾 Saved to memory' : '💬 Chat only'}
                            </span>
                          </>
                        )}
                        {upload.facts_extracted !== undefined && upload.facts_extracted > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">
                              {upload.facts_extracted} facts extracted
                            </span>
                          </>
                        )}
                      </div>
                      {upload.status === 'failed' && upload.error_message && (
                        <p className="text-xs text-red-600 mt-1">
                          Error: {upload.error_message}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {(upload.status === 'uploaded' || upload.status === 'processing') && upload.progress !== undefined && (
                      <div className="w-24 flex-shrink-0">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Upload Button */}
        {stagedFiles.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {stagedFiles.filter(f => f.saveToMemory).length} file(s) will be saved to memory
              </p>
              <button
                onClick={handleUploadAll}
                disabled={isUploading}
                className={`
                  px-6 py-2.5 rounded-lg font-medium transition-all
                  ${isUploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                  }
                `}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  `Upload ${stagedFiles.length} file${stagedFiles.length > 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
