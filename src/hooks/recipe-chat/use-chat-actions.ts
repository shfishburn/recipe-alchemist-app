
import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { toast } from '@/hooks/use-toast';
import { useChatMutations } from './use-chat-mutations';
import { useStorageUploader } from './use-storage-uploader';
import { uploadImageToStorage } from './utils/storage/upload-image';
import { Recipe } from '@/types/recipe';
import { OptimisticMessage } from '@/types/chat';

export function useChatActions(recipe: Recipe) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const chatMutation = useChatMutations(recipe);
  const uploader = useStorageUploader();
  
  // Create a new optimistic message
  const createOptimisticMessage = (userMessage: string, messageId: string): OptimisticMessage => ({
    id: messageId,
    user_message: userMessage,
    status: 'pending',
    timestamp: Date.now(),
    meta: {
      optimistic_id: messageId
    }
  });

  // Update an optimistic message's status
  const updateOptimisticMessageStatus = useCallback((
    messageId: string,
    status: 'pending' | 'complete' | 'error',
    errorDetails?: string
  ) => {
    setOptimisticMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status,
              meta: {
                ...msg.meta,
                error: status === 'error',
                error_details: errorDetails,
              },
            }
          : msg
      )
    );
  }, []);

  // Remove an optimistic message from the list
  const removeOptimisticMessage = useCallback((messageId: string) => {
    setOptimisticMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);
  
  // Send a message to the chat API
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      const messageId = nanoid();
      
      // Create an optimistic message
      const optimisticMsg = createOptimisticMessage(message, messageId);
      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      
      // Make the API call
      await chatMutation.mutateAsync({
        message,
        messageId,
      });
      
      // Update optimistic message to 'complete'
      updateOptimisticMessageStatus(messageId, 'complete');
      
      // Remove optimistic message after a short delay
      setTimeout(() => {
        removeOptimisticMessage(messageId);
      }, 300);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [chatMutation, removeOptimisticMessage, updateOptimisticMessageStatus]);
  
  // Retry a failed message
  const retryMessage = useCallback(async (originalMessage: string, originalMessageId: string) => {
    try {
      // Remove the old optimistic message first
      removeOptimisticMessage(originalMessageId);
      
      // Generate a new message ID
      const newMessageId = nanoid();
      
      // Create a new optimistic message
      const newOptimisticMsg = createOptimisticMessage(originalMessage, newMessageId);
      setOptimisticMessages((prev) => [...prev, newOptimisticMsg]);
      
      // Send the message again
      await chatMutation.mutateAsync({
        message: originalMessage,
        messageId: newMessageId,
        isRetry: true,
      });
      
      // Update optimistic message to 'complete'
      updateOptimisticMessageStatus(newMessageId, 'complete');
      
      // Remove optimistic message after a short delay
      setTimeout(() => {
        removeOptimisticMessage(newMessageId);
      }, 300);
      
    } catch (error) {
      console.error('Error retrying message:', error);
      toast({
        title: "Retry Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  }, [chatMutation, removeOptimisticMessage, updateOptimisticMessageStatus]);
  
  // Upload an image and send it to the chat
  const uploadImage = useCallback(async (file: File) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      const messageId = nanoid();
      
      // Create an optimistic message with placeholder text
      const optimisticMsg = createOptimisticMessage("Analyzing image...", messageId);
      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      
      // Upload the image
      const { path } = await uploadImageToStorage(file);
      
      if (!path) {
        throw new Error("Failed to upload image");
      }
      
      // Make the API call with the image path
      await chatMutation.mutateAsync({
        message: "Analyze this image",
        messageId,
        sourceType: 'image',
        sourceImage: path,
      });
      
      // Update optimistic message to 'complete'
      updateOptimisticMessageStatus(messageId, 'complete');
      
      // Remove optimistic message after a short delay
      setTimeout(() => {
        removeOptimisticMessage(messageId);
      }, 300);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [chatMutation, removeOptimisticMessage, updateOptimisticMessageStatus]);

  return {
    sendMessage,
    retryMessage,
    uploadImage,
    optimisticMessages,
    isProcessing,
  };
}
