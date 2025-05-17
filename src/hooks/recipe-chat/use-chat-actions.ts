
import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { OptimisticMessage } from '@/types/chat';
import { useStorageUploader } from './use-storage-uploader';
import { uploadImage } from './utils/storage/upload-image';

// Type for the addOptimisticMessage function
type AddOptimisticMessageFn = (message: OptimisticMessage) => void;

/**
 * Hook for handling recipe chat actions like sending messages and uploading images
 */
export function useChatActions(
  recipe: Recipe,
  addOptimisticMessage: AddOptimisticMessageFn
) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Storage uploader hook
  const { uploadFile } = useStorageUploader({
    bucket: 'recipe-images',
    folder: `recipe-chats/${recipe.id}`
  });

  /**
   * Sends a message to the recipe chat
   */
  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;
    
    try {
      setIsSending(true);
      const messageId = nanoid();
      const timestamp = Date.now();
      
      // Create optimistic message that will be displayed while sending
      const optimisticMessage: OptimisticMessage = {
        id: messageId,
        user_message: message.trim(),
        status: 'pending',
        timestamp,
        meta: { 
          optimistic_id: messageId,
          recipe_id: recipe.id 
        }
      };
      
      // Add optimistic message to UI
      addOptimisticMessage(optimisticMessage);
      
      // Save message to database
      await supabase.from('recipe_chats').insert({
        recipe_id: recipe.id,
        user_message: message.trim(),
        ai_response: null, // Will be updated via webhook/function
        source_type: 'chat'
      });
      
      // Clear message input
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Message will be marked as error by the optimistic messages hook
    } finally {
      setIsSending(false);
    }
  }, [message, recipe.id, addOptimisticMessage]);
  
  /**
   * Retry sending a failed message
   */
  const retryMessage = useCallback(async (originalMessage: string, originalMessageId: string) => {
    try {
      setIsSending(true);
      const timestamp = Date.now();
      
      // Create new optimistic message
      const optimisticMessage: OptimisticMessage = {
        id: nanoid(),
        user_message: originalMessage,
        status: 'pending',
        timestamp,
        meta: { 
          optimistic_id: nanoid(),
          recipe_id: recipe.id 
        }
      };
      
      // Add optimistic message to UI
      addOptimisticMessage(optimisticMessage);
      
      // Save message to database
      await supabase.from('recipe_chats').insert({
        recipe_id: recipe.id,
        user_message: originalMessage,
        ai_response: null,
        source_type: 'chat'
      });
    } catch (error) {
      console.error('Error retrying message:', error);
    } finally {
      setIsSending(false);
    }
  }, [recipe.id, addOptimisticMessage]);
  
  /**
   * Upload a recipe image
   */
  const uploadRecipeImage = useCallback(async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Upload file to storage
      const imageUrl = await uploadImage(file, {
        onProgress: setUploadProgress
      });
      
      // Create optimistic message with image
      const optimisticMessage: OptimisticMessage = {
        id: nanoid(),
        user_message: 'I uploaded an image',
        status: 'pending',
        timestamp: Date.now(),
        meta: { 
          optimistic_id: nanoid(),
          recipe_id: recipe.id,
          image_url: imageUrl
        }
      };
      
      // Add optimistic message to UI
      addOptimisticMessage(optimisticMessage);
      
      // Save message with image to database
      await supabase.from('recipe_chats').insert({
        recipe_id: recipe.id,
        user_message: 'I uploaded an image',
        source_image: imageUrl,
        source_type: 'image',
        ai_response: null
      });
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [recipe.id, addOptimisticMessage]);
  
  /**
   * Submit a URL to analyze
   */
  const submitRecipeUrl = useCallback(async (url: string) => {
    if (!url || !url.trim()) return;
    
    try {
      setIsSending(true);
      
      // Create optimistic message
      const optimisticMessage: OptimisticMessage = {
        id: nanoid(),
        user_message: `Analyze this recipe: ${url}`,
        status: 'pending',
        timestamp: Date.now(),
        meta: { 
          optimistic_id: nanoid(),
          recipe_id: recipe.id,
          url
        }
      };
      
      // Add optimistic message to UI
      addOptimisticMessage(optimisticMessage);
      
      // Save URL submission to database
      await supabase.from('recipe_chats').insert({
        recipe_id: recipe.id,
        user_message: `Analyze this recipe: ${url}`,
        source_url: url,
        source_type: 'url',
        ai_response: null
      });
      
    } catch (error) {
      console.error('Error submitting URL:', error);
    } finally {
      setIsSending(false);
    }
  }, [recipe.id, addOptimisticMessage]);

  return {
    message,
    setMessage,
    sendMessage,
    retryMessage,
    uploadRecipeImage,
    submitRecipeUrl,
    isSending,
    isUploading,
    uploadProgress
  };
}
