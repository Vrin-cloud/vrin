// Custom hook for managing file uploads
// Handles upload status polling and state management

import { useState, useCallback, useEffect } from 'react';
import { chatAPI } from '@/lib/services/chat-api';
import type { FileUpload } from '@/types/chat';

const POLL_INTERVAL = 2000; // 2 seconds

interface UseFileUploadsReturn {
  uploads: FileUpload[];
  uploadFile: (file: File, saveToMemory?: boolean) => Promise<FileUpload>;
  checkUploadStatus: (uploadId: string) => Promise<FileUpload>;
  clearCompletedUploads: () => void;
}

export const useFileUploads = (apiKey: string): UseFileUploadsReturn => {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [pollingIds, setPollingIds] = useState<Set<string>>(new Set());

  // Poll upload status for active uploads
  useEffect(() => {
    if (pollingIds.size === 0 || !apiKey) return;

    const interval = setInterval(async () => {
      const idsToCheck = Array.from(pollingIds);

      for (const uploadId of idsToCheck) {
        try {
          const status = await chatAPI.getUploadStatus(uploadId, apiKey);

          console.log('📡 Status poll result for', uploadId, ':', status);
          console.log('  - Status:', status.status);
          console.log('  - Facts extracted:', status.facts_extracted);

          setUploads(prev =>
            prev.map(upload =>
              upload.upload_id === uploadId
                ? { ...upload, ...status, progress: calculateProgress(status.status) }
                : upload
            )
          );

          // Stop polling if completed or failed
          if (status.status === 'completed' || status.status === 'failed') {
            console.log('🛑 Stopping polling for', uploadId, '- Final status:', status.status);
            setPollingIds(prev => {
              const next = new Set(prev);
              next.delete(uploadId);
              return next;
            });
          }
        } catch (err) {
          console.error(`❌ Failed to check status for ${uploadId}:`, err);
        }
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [pollingIds, apiKey]);

  const uploadFile = useCallback(async (file: File, saveToMemory: boolean = true): Promise<FileUpload> => {
    console.log('🎣 useFileUploads.uploadFile called');
    console.log('  - File:', file.name);
    console.log('  - Save to memory:', saveToMemory);
    console.log('  - API Key present:', !!apiKey);

    if (!apiKey) {
      console.error('❌ No API key in useFileUploads');
      throw new Error('API key is required');
    }

    try {
      console.log('📡 Calling chatAPI.uploadFile...');
      const response = await chatAPI.uploadFile(file, apiKey, saveToMemory);

      console.log('✅ chatAPI.uploadFile response:', response);
      console.log('  - upload_id:', response.upload_id);
      console.log('  - status:', response.status);
      console.log('  - filename:', response.filename);
      console.log('  - saveToMemory:', saveToMemory);

      const upload: FileUpload = {
        upload_id: response.upload_id,
        filename: response.filename,
        file_type: response.file_type,
        file_size: response.file_size,
        status: response.status,
        upload_timestamp: Date.now(),
        progress: 10,
        saveToMemory: saveToMemory
      };

      console.log('📊 Created upload object:', upload);
      setUploads(prev => {
        const newUploads = [upload, ...prev];
        console.log('📊 Updated uploads state:', newUploads);
        return newUploads;
      });

      // Start polling for this upload
      setPollingIds(prev => new Set([...prev, response.upload_id]));

      console.log('✅ Upload tracking started for:', upload.upload_id);
      return upload;
    } catch (err) {
      console.error('❌ Upload failed in useFileUploads:', err);
      throw err;
    }
  }, [apiKey]);

  const checkUploadStatus = useCallback(async (uploadId: string): Promise<FileUpload> => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    try {
      const status = await chatAPI.getUploadStatus(uploadId, apiKey);

      setUploads(prev =>
        prev.map(upload =>
          upload.upload_id === uploadId
            ? { ...upload, ...status }
            : upload
        )
      );

      return status;
    } catch (err) {
      console.error('Failed to check upload status:', err);
      throw err;
    }
  }, [apiKey]);

  const clearCompletedUploads = useCallback(() => {
    setUploads(prev =>
      prev.filter(upload =>
        upload.status === 'uploaded' || upload.status === 'processing'
      )
    );
  }, []);

  return {
    uploads,
    uploadFile,
    checkUploadStatus,
    clearCompletedUploads
  };
};

function calculateProgress(status: FileUpload['status']): number {
  switch (status) {
    case 'uploaded': return 30;
    case 'processing': return 60;
    case 'completed': return 100;
    case 'failed': return 0;
    default: return 10;
  }
}
