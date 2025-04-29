
import { useState } from 'react';
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

  const uploadRecipeImage = async (file: File) => {
    try {
      console.log("Processing image upload");
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        // Create a unique message ID to help with tracking and cleanup
        const messageId = `image-${Date.now()}`;
        
        // Add optimistic message
        const optimisticMessage: OptimisticMessage = {
          user_message: "Analyzing recipe image...",
          pending: true,
          id: messageId // Add unique ID to help with cleanup
        };
        addOptimisticMessage(optimisticMessage);
        
        mutation.mutate({
          message: "Please analyze this recipe image",
          sourceType: 'image',
          sourceImage: base64Image,
          messageId // Pass message ID to the mutation
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  const submitRecipeUrl = (url: string) => {
    console.log("Processing URL submission:", url);
    
    // Create a unique message ID
    const messageId = `url-${Date.now()}`;
    
    // Add optimistic message
    const optimisticMessage: OptimisticMessage = {
      user_message: `Analyzing recipe from: ${url}`,
      pending: true,
      id: messageId
    };
    addOptimisticMessage(optimisticMessage);
    
    mutation.mutate({
      message: "Please analyze this recipe URL",
      sourceType: 'url',
      sourceUrl: url,
      messageId
    });
  };

  const sendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    
    // Create a unique ID for tracking
    const messageId = `msg-${Date.now()}`;
    
    // Create optimistic message with unique ID
    const optimisticMessage: OptimisticMessage = {
      user_message: message,
      pending: true,
      id: messageId
    };
    
    // Add to optimistic messages queue
    addOptimisticMessage(optimisticMessage);
    
    console.log("Sending chat message:", message.substring(0, 30) + (message.length > 30 ? '...' : ''));
    mutation.mutate({ 
      message,
      messageId
    });
    setMessage(''); // Clear the input after sending
  };

  return {
    message,
    setMessage,
    sendMessage,
    uploadRecipeImage,
    submitRecipeUrl,
    isSending: mutation.isPending
  };
};
