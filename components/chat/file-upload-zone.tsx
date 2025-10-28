// FileUploadZone component for drag-and-drop file uploads
// Displays upload progress and status

'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import type { FileUpload } from '@/types/chat';

interface FileUploadZoneProps {
  uploads: FileUpload[];
  onUpload: (file: File) => void;
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
  console.log('🎨 FileUploadZone component rendered', {
    uploadsCount: uploads.length,
    onUploadType: typeof onUpload,
    onCloseType: typeof onClose
  });

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Check if ref is set
  useEffect(() => {
    console.log('📌 File input ref status:', {
      refSet: !!fileInputRef.current,
      inputElement: fileInputRef.current
    });
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    onDragLeave?.();
  }, [onDragLeave]);

  const handleMouseLeave = useCallback(() => {
    console.log('🐭 Mouse left upload zone - NOT closing (user might be in file picker)');
    setIsDragActive(false);
    // Don't close the modal when mouse leaves - user might be in file picker
    // onDragLeave?.();
  }, [onDragLeave]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    console.log('📥 File dropped');
    const files = Array.from(e.dataTransfer.files);
    console.log('  - Files count:', files.length);

    files.forEach(file => {
      console.log('  - Processing file:', file.name, file.type, (file.size / 1024).toFixed(2), 'KB');
      if (validateFile(file)) {
        console.log('  ✅ File validated, calling onUpload');
        onUpload(file);
      } else {
        console.log('  ❌ File validation failed');
      }
    });
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File selected from input');
    const files = Array.from(e.target.files || []);
    console.log('  - Files count:', files.length);

    files.forEach(file => {
      console.log('  - Processing file:', file.name, file.type, (file.size / 1024).toFixed(2), 'KB');
      if (validateFile(file)) {
        console.log('  ✅ File validated, calling onUpload');
        onUpload(file);
      } else {
        console.log('  ❌ File validation failed');
      }
    });
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onUpload]);

  const validateFile = (file: File): boolean => {
    console.log('🔍 Validating file:', file.name);
    console.log('  - Type:', file.type);
    console.log('  - Size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('  - Accepted types:', ACCEPTED_FILE_TYPES);

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      console.error('❌ File type not supported:', file.type);
      alert(`File type ${file.type} is not supported. Supported: PDF, DOCX, TXT, MD, PNG, JPG`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      console.error('❌ File too large:', file.size, 'bytes');
      alert(`File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return false;
    }
    console.log('✅ File validation passed');
    return true;
  };

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Upload Files</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="p-6">
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={(e) => {
              console.log('🖱️ Drop zone clicked - opening file picker');
              console.log('  - Current target:', e.currentTarget);
              console.log('  - Target:', e.target);
              console.log('  - Input ref exists:', !!fileInputRef.current);

              if (fileInputRef.current) {
                console.log('  - Triggering input click...');
                fileInputRef.current.click();
                console.log('  - Input click triggered');
              } else {
                console.error('  ❌ Input ref is null!');
              }
            }}
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
              onChange={(e) => {
                console.log('⚡ INPUT onChange fired!');
                console.log('  - Files:', e.target.files);
                console.log('  - Files length:', e.target.files?.length);
                handleFileSelect(e);
              }}
              onClick={(e) => {
                console.log('🖱️ INPUT clicked');
              }}
              onFocus={() => {
                console.log('🔍 INPUT focused');
              }}
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

        {/* Upload List */}
        {uploads.length > 0 && (
          <div className="px-6 pb-6 max-h-64 overflow-y-auto">
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
                    <div className="w-24">
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
    </div>
  );
}
