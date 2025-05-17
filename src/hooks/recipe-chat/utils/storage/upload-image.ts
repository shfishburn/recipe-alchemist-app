
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image to Supabase storage
 */
export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!file) {
    throw new Error('No file selected');
  }
  
  // Only allow image files
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image');
  }
  
  // Generate a unique file name
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  
  try {
    // Upload to Supabase storage with a random UUID as the filename
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(`uploads/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (event) => {
          if (onProgress && event.totalBytes) {
            const progress = Math.round((event.bytesUploaded / event.totalBytes) * 100);
            onProgress(progress);
          }
        }
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
