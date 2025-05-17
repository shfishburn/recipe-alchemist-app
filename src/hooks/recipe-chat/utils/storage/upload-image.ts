
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface UploadImageOptions {
  bucket?: string;
  folder?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Uploads an image to Supabase storage and returns the public URL
 */
export async function uploadImage(
  file: File, 
  options: UploadImageOptions = {}
): Promise<string> {
  const bucket = options.bucket || 'recipe-images';
  const folder = options.folder || 'user-uploads';
  const onProgress = options.onProgress || (() => {});
  
  try {
    // Generate unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Simulate upload progress (Supabase doesn't provide real-time progress)
    const progressInterval = setInterval(() => {
      const randomIncrement = Math.random() * 15;
      onProgress(Math.min(85, randomIncrement));
    }, 300);
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    clearInterval(progressInterval);
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    onProgress(100);
    return publicUrl;
  } catch (err) {
    console.error("Image upload error:", err);
    throw err;
  }
}
