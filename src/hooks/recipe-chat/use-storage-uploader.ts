
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from './utils/storage/upload-image';

/**
 * Hook for uploading files to storage with progress tracking
 */
export const useStorageUploader = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  /**
   * Upload a file to storage with progress tracking
   */
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Generate a unique ID for this upload
      const uploadId = uuidv4();
      
      // Upload the file
      const publicUrl = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadedUrl(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Reset the upload state
   */
  const resetUpload = () => {
    setUploadProgress(0);
    setUploadedUrl(null);
    setIsUploading(false);
  };

  return {
    uploadFile,
    resetUpload,
    uploadProgress,
    isUploading,
    uploadedUrl
  };
};
