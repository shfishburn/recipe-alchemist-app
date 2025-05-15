
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingRetryData, setPendingRetryData] = useState<{
    messageText: string;
    messageId: string;
    sourceType?: 'manual' | 'image' | 'url';
    sourceUrl?: string;
    sourceImage?: string;
  } | null>(null);
  
  const { toast } = useToast();
  const mutation = useChatMutations(recipe);

  /**
   * Generate a tracking ID with timestamp and source information
   */
  const generateTrackingId = useCallback((prefix: string): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }, []);

  /**
   * Retry sending a failed message
   */
  const retryMessage = useCallback(() => {
    if (!pendingRetryData) return;
    
    const { messageText, messageId, sourceType, sourceUrl, sourceImage } = pendingRetryData;
    
    // Create new optimistic message with retry flag
    const optimisticMessage: OptimisticMessage = {
      user_message: messageText,
      pending: true,
      id: messageId,
      meta: {
        optimistic_id: messageId,
        tracking_id: messageId,
        processing_stage: 'pending',
        is_retry: true,
        source_info: {
          type: sourceType || 'manual',
          url: sourceUrl,
        }
      }
    };
    
    // Add optimistic message
    addOptimisticMessage(optimisticMessage);
    
    // Send the message with retry flag
    mutation.mutate({
      message: messageText,
      sourceType,
      sourceUrl,
      sourceImage,
      messageId,
      isRetry: true
    });
    
    // Clear retry data
    setPendingRetryData(null);
  }, [pendingRetryData, addOptimisticMessage, mutation]);

  /**
   * Upload and process a recipe image with progress tracking
   */
  const uploadRecipeImage = useCallback(async (file: File) => {
    try {
      console.log("Processing image upload");
      setIsUploading(true);
      setUploadProgress(10); // Start progress
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setIsUploading(false);
        throw new Error('Selected file is not an image');
      }
      
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 50); // Up to 50%
          setUploadProgress(progress);
        }
      };
      
      reader.onload = async (e) => {
        setUploadProgress(60); // Reading complete
        
        const base64Image = e.target?.result as string;
        
        // Create a unique message ID to help with tracking and cleanup
        const messageId = generateTrackingId('image');
        
        // Save retry data
        setPendingRetryData({
          messageText: "Analyzing recipe image...",
          messageId,
          sourceType: 'image',
          sourceImage: base64Image
        });
        
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
        setUploadProgress(80); // Added optimistic message
        
        // Set a timeout to ensure progress animation is visible
        setTimeout(() => {
          setUploadProgress(100);
          setIsUploading(false);
          mutation.mutate({
            message: "Please analyze this recipe image",
            sourceType: 'image',
            sourceImage: base64Image,
            messageId
          });
        }, 500);
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
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
    
    // Save retry data
    setPendingRetryData({
      messageText: `Analyzing recipe from: ${url}`,
      messageId,
      sourceType: 'url',
      sourceUrl: url
    });
    
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
    
    // Save retry data
    setPendingRetryData({
      messageText: trimmedMessage,
      messageId,
      sourceType: 'manual'
    });
    
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
    retryMessage,
    uploadProgress,
    isUploading,
    isSending: mutation.isPending
  };
};
