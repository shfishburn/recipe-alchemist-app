
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import { useChatMutations } from './use-chat-mutations';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { OptimisticMessage } from '@/types/chat';

export const useChatActions = (recipe: Recipe, addOptimisticMessage: (message: OptimisticMessage) => void) => {
  const [message, setMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();
  const mutation = useChatMutations(recipe);

  const sendMessage = async (messageToSend: string = message) => {
    if (!messageToSend.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending",
        variant: "destructive",
      });
      return;
    }

    const messageId = nanoid();
    
    // Create optimistic message
    addOptimisticMessage({
      id: messageId,
      user_message: messageToSend,
      pending: true,
      meta: {
        optimistic_id: messageId,
        timestamp: Date.now(),
        use_unified_approach: true // Indicate that we want the unified recipe approach
      }
    });

    // Reset input field after sending
    setMessage('');

    try {
      // Send with source_type 'manual' instead of 'analysis'
      await mutation.mutateAsync({
        message: messageToSend,
        sourceType: 'manual', // Changed from 'analysis' to valid value 'manual'
        messageId,
        meta: {
          use_unified_approach: true // Pass metadata to indicate we want unified recipe approach
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Send a failed optimistic message to show the error
      addOptimisticMessage({
        id: messageId + '-error',
        user_message: messageToSend,
        pending: false,
        meta: {
          optimistic_id: messageId,
          error: true,
          error_details: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      });
      
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  };

  const uploadRecipeImage = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Generate a unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${recipe.id}/${timestamp}.${fileExt}`;
      const filePath = `recipe-uploads/${fileName}`;

      // Get the signed URL directly from Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-uploads')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL without accessing protected properties
      const { data } = supabase.storage
        .from('recipe-uploads')
        .getPublicUrl(fileName);
      
      const publicUrl = data.publicUrl;

      // Once upload is complete, send the image URL to the chat
      const messageId = nanoid();
      
      // Create optimistic message
      addOptimisticMessage({
        id: messageId,
        user_message: `[Uploaded image: ${file.name}]`,
        pending: true,
        meta: {
          optimistic_id: messageId,
          timestamp: Date.now()
        }
      });

      // Send the actual message with the image
      await mutation.mutateAsync({
        message: "Analyze this image of a recipe",
        sourceType: "image",
        sourceImage: publicUrl,
        messageId
      });

      setUploadProgress(100);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and is being analyzed",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Failed to upload image",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const submitRecipeUrl = async (url: string) => {
    if (!url) {
      toast({
        title: "Empty URL",
        description: "Please enter a URL before submitting",
        variant: "destructive",
      });
      return;
    }

    const messageId = nanoid();
    
    // Create optimistic message
    addOptimisticMessage({
      id: messageId,
      user_message: `[Analyze recipe from URL: ${url}]`,
      pending: true,
      meta: {
        optimistic_id: messageId,
        timestamp: Date.now()
      }
    });

    try {
      await mutation.mutateAsync({
        message: "Analyze this recipe URL",
        sourceType: "url",
        sourceUrl: url,
        messageId
      });
    } catch (error) {
      console.error("Error submitting URL:", error);
      toast({
        title: "Failed to analyze URL",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const retryMessage = async (failedMessage: string, failedMessageId: string) => {
    const messageId = nanoid();
    
    // Create optimistic message
    addOptimisticMessage({
      id: messageId,
      user_message: failedMessage,
      pending: true,
      meta: {
        optimistic_id: messageId,
        is_retry: true,
        retry_of: failedMessageId,
        timestamp: Date.now(),
        use_unified_approach: true // Indicate that we want the unified recipe approach
      }
    });

    try {
      await mutation.mutateAsync({
        message: failedMessage,
        sourceType: 'manual', // Changed from 'analysis' to 'manual'
        messageId,
        meta: {
          use_unified_approach: true // Pass metadata to indicate we want unified recipe approach
        }
      });
    } catch (error) {
      console.error("Error retrying message:", error);
      toast({
        title: "Failed to retry message",
        description: error instanceof Error ? error.message : "An error occurred",
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
