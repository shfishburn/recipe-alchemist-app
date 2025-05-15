
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatMutations } from './use-chat-mutations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';

export const useChatActions = (recipe: Recipe, addOptimisticMessage: (message: string, recipeId: string) => string) => {
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Use mutation hook for API interactions
  const mutation = useChatMutations(recipe);
  
  /**
   * Send a message to the recipe chat
   */
  const sendMessage = () => {
    if (!message.trim()) return;

    const optimisticId = addOptimisticMessage(message, recipe.id);
    
    mutation.mutate({
      message: message,
      messageId: optimisticId
    });
    
    setMessage('');
  };

  /**
   * Retry a failed message
   */
  const retryMessage = () => {
    if (!message.trim()) return;

    const optimisticId = addOptimisticMessage(message, recipe.id);
    
    mutation.mutate({
      message: message,
      messageId: optimisticId,
      isRetry: true
    });
    
    setMessage('');
  };
  
  /**
   * Upload a recipe image for analysis
   */
  const uploadRecipeImage = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${uuidv4()}.${fileExt}`;
      const filePath = `recipe-uploads/${uniqueFileName}`;
      
      // Start upload with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);
      
      // Create optimistic message
      const promptText = "Analyze the ingredients and recipe details from this image.";
      const optimisticId = addOptimisticMessage(promptText, recipe.id);
      
      // Send the image to the chat
      mutation.mutate({
        message: promptText,
        sourceType: 'image',
        sourceImage: publicUrl,
        messageId: optimisticId
      });
      
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Submit a URL for recipe extraction
   */
  const submitRecipeUrl = (url: string) => {
    if (!url) return;
    
    try {
      // Validate URL format
      const parsedUrl = new URL(url);
      
      // Create optimistic message
      const promptText = `Extract the recipe from ${url}`;
      const optimisticId = addOptimisticMessage(promptText, recipe.id);
      
      // Submit URL to chat
      mutation.mutate({
        message: promptText,
        sourceType: 'url',
        sourceUrl: url,
        messageId: optimisticId
      });
      
    } catch (error: any) {
      console.error("Invalid URL:", error);
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
    }
  };
  
  return {
    message,
    setMessage,
    sendMessage,
    uploadRecipeImage,
    submitRecipeUrl,
    retryMessage,
    uploadProgress,
    isUploading,
    isSending: mutation.isPending
  };
};
