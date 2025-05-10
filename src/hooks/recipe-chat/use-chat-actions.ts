
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useChatMutations } from './use-chat-mutations';
import type { Recipe } from '@/types/recipe';
import type { OptimisticMessage } from '@/types/chat';

/**
 * Hook for chat actions like sending messages, uploading images, and submitting URLs
 */
export const useChatActions = (
  recipe: Recipe,
  addOptimisticMessage: (message: OptimisticMessage) => void
) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const mutation = useChatMutations(recipe);

  /**
   * Generate a tracking ID with timestamp and source information
   */
  const generateTrackingId = useCallback((prefix: string): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }, []);

  /**
   * Upload and process a recipe image
   */
  const uploadRecipeImage = useCallback(async (file: File) => {
    try {
      console.log("Processing image upload");
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Selected file is not an image');
      }
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        // Create a unique message ID to help with tracking and cleanup
        const messageId = generateTrackingId('image');
        
        // Add optimistic message
        const optimisticMessage: OptimisticMessage = {
          user_message: "Analyzing recipe image...",
          pending: true,
          id: messageId,
          meta: {
            optimistic_id: messageId,
            tracking_id: messageId,
            processing_stage: 'pending',
            source_info: {
              type: 'image'
            }
          }
        };
        
        addOptimisticMessage(optimisticMessage);
        
        mutation.mutate({
          message: "Please analyze this recipe image",
          sourceType: 'image',
          sourceImage: base64Image,
          messageId
        });
      };
      
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process image",
        variant: "destructive",
      });
    }
  }, [toast, mutation, addOptimisticMessage, generateTrackingId]);

  /**
   * Submit a recipe URL for analysis
   */
  const submitRecipeUrl = useCallback((url: string) => {
    console.log("Processing URL submission:", url);
    
    // Basic URL validation
    if (!url.match(/^https?:\/\/.+\..+/)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }
    
    // Create a unique message ID
    const messageId = generateTrackingId('url');
    
    // Add optimistic message
    const optimisticMessage: OptimisticMessage = {
      user_message: `Analyzing recipe from: ${url}`,
      pending: true,
      id: messageId,
      meta: {
        optimistic_id: messageId,
        tracking_id: messageId,
        processing_stage: 'pending',
        source_info: {
          type: 'url',
          url: url
        }
      }
    };
    addOptimisticMessage(optimisticMessage);
    
    mutation.mutate({
      message: "Please analyze this recipe URL",
      sourceType: 'url',
      sourceUrl: url,
      messageId
    });
  }, [toast, mutation, addOptimisticMessage, generateTrackingId]);

  /**
   * Send a chat message
   */
  const sendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    
    // Create a unique ID for tracking
    const messageId = generateTrackingId('msg');
    
    // Create optimistic message with unique ID
    const optimisticMessage: OptimisticMessage = {
      user_message: trimmedMessage,
      pending: true,
      id: messageId,
      meta: {
        optimistic_id: messageId,
        tracking_id: messageId,
        processing_stage: 'pending',
        source_info: {
          type: 'manual'
        }
      }
    };
    
    // Add to optimistic messages queue
    addOptimisticMessage(optimisticMessage);
    
    console.log("Sending chat message:", 
      trimmedMessage.length > 30 
        ? `${trimmedMessage.substring(0, 30)}...` 
        : trimmedMessage
    );
    
    mutation.mutate({ 
      message: trimmedMessage,
      messageId
    });
    
    setMessage(''); // Clear the input after sending
  }, [message, toast, mutation, addOptimisticMessage, generateTrackingId]);

  return {
    message,
    setMessage,
    sendMessage,
    uploadRecipeImage,
    submitRecipeUrl,
    isSending: mutation.isPending
  };
};
