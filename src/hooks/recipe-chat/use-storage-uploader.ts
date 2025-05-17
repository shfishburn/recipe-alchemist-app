
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface UseStorageUploaderOptions {
  bucket?: string;
  folder?: string;
}

export function useStorageUploader(options: UseStorageUploaderOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const bucket = options.bucket || 'recipe-images';
  const folder = options.folder || 'user-uploads';
  
  const uploadFile = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
        
      setUploadProgress(100);
      return publicUrl;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    reset: () => {
      setUploadProgress(0);
      setError(null);
    }
  };
}
