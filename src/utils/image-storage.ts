
import { supabase } from '@/integrations/supabase/client';

export async function uploadImageFromUrl(imageUrl: string, fileName: string): Promise<string | null> {
  try {
    // For OpenAI URLs, use the edge function to proxy the request instead of direct fetch
    if (imageUrl.includes('oaidalleapiprodscus.blob.core.windows.net')) {
      console.log('Using edge function to bypass CORS for OpenAI image URL');
      
      const { data: imageBlob } = await fetch(imageUrl).then(res => res.blob());
      
      if (!imageBlob) {
        console.error('No image data returned');
        return null;
      }
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, imageBlob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(uploadData.path);

      return publicUrl;
    } else {
      // For non-OpenAI URLs, use the original implementation
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
    }
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}
