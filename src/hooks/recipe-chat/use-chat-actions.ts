import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import { useChatMutations } from './use-chat-mutations';
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
        timestamp: Date.now()
      }
    });

    // Reset input field after sending
    setMessage('');

    try {
      // Set source type to 'analysis' for the unified recipe update approach
      await mutation.mutateAsync({
        message: messageToSend,
        sourceType: 'analysis', // Use analysis type to trigger unified recipe approach
        messageId
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Retry a failed message
  const retryMessage = async (failedMessage: string, failedMessageId: string) => {
    addOptimisticMessage({
      id: failedMessageId,
      user_message: failedMessage,
      pending: true,
      meta: {
        optimistic_id: failedMessageId,
        is_retry: true,
        timestamp: Date.now()
      }
    });

    try {
      await mutation.mutateAsync({
        message: failedMessage, 
        sourceType: 'analysis',
        messageId: failedMessageId,
        isRetry: true
      });
    } catch (error) {
      console.error('Error retrying message:', error);
    }
  };

  const uploadRecipeImage = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
  
    const fileName = `recipe-image-${nanoid()}.${file.name.split('.').pop()}`;
    const filePath = `recipe-images/${fileName}`;
  
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (error) {
        console.error("Supabase upload error:", error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading the image.",
          variant: "destructive",
        });
        return;
      }
  
      const imageUrl = `${supabase.storageUrl}/images/${data.path}`;
      console.log("Image uploaded successfully:", imageUrl);
  
      // Send the image URL to the chat
      const messageId = nanoid();
      addOptimisticMessage({
        id: messageId,
        user_message: 'Analyzing image...',
        pending: true,
        meta: {
          optimistic_id: messageId,
          timestamp: Date.now()
        }
      });
  
      try {
        await mutation.mutateAsync({
          message: 'Analyze this image',
          sourceType: 'image',
          sourceImage: imageUrl,
          messageId
        });
      } catch (error) {
        console.error('Error sending image analysis request:', error);
      }
  
    } catch (e) {
      console.error("General upload error:", e);
      toast({
        title: "Upload failed",
        description: "There was an unexpected error during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const submitRecipeUrl = async (url: string) => {
    if (!url.trim()) {
      toast({
        title: "Empty URL",
        description: "Please enter a URL before submitting",
        variant: "destructive",
      });
      return;
    }
  
    const messageId = nanoid();
    addOptimisticMessage({
      id: messageId,
      user_message: 'Analyzing URL...',
      pending: true,
      meta: {
        optimistic_id: messageId,
        timestamp: Date.now()
      }
    });
  
    try {
      await mutation.mutateAsync({
        message: 'Analyze this URL',
        sourceType: 'url',
        sourceUrl: url,
        messageId
      });
    } catch (error) {
      console.error('Error submitting URL:', error);
    }
  };

  return {
    message,
    setMessage,
    sendMessage,
    uploadRecipeImage,
    submitRecipeUrl,
    retryMessage,
    isUploading,
    uploadProgress,
    isSending: mutation.isPending
  };
};
