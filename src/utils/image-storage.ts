
import { supabase } from '@/integrations/supabase/client';

export async function uploadImageFromUrl(imageUrl: string, fileName: string): Promise<string | null> {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}
