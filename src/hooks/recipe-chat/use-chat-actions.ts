
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatMutations } from '../use-chat-mutations';
import { useErrorHandler } from '../use-error-handler';
import type { Recipe } from '@/types/recipe';
import type { OptimisticMessage, ChatMessage } from '@/types/chat';

export const useChatActions = (
  recipe: Recipe,
  addOptimisticMessage: (message: OptimisticMessage) => void
) => {
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { handleError } = useErrorHandler();
  const mutation = useChatMutations(recipe);

  // Function to send a message
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    // Create a unique ID for this message for optimistic updates
    const messageId = `msg_${uuidv4()}`;
    
    // Create an optimistic message object
    const optimisticMessage: OptimisticMessage = {
      id: messageId,
      recipe_id: recipe.id,
      user_message: message,
      ai_response: '',
      pending: true,
      meta: {
        optimistic_id: messageId,
        tracking_id: uuidv4(),
        processing_stage: 'sending',
      }
    };
    
    // Add to optimistic messages
    addOptimisticMessage(optimisticMessage);
    
    try {
      // Reset message input
      setMessage('');
      
      // Send the message
      await mutation.mutateAsync({
        message,
        messageId
      });
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Error sending message:', error);
    }
  };
  
  // Function to retry a failed message
  const retryMessage = async (originalMessage?: string) => {
    if (!originalMessage) return;
    
    // Create a unique ID for this retry attempt
    const messageId = `retry_${uuidv4()}`;
    
    // Create an optimistic message object for the retry
    const optimisticMessage: OptimisticMessage = {
      id: messageId,
      recipe_id: recipe.id,
      user_message: originalMessage,
      ai_response: '',
      pending: true,
      meta: {
        optimistic_id: messageId,
        tracking_id: uuidv4(),
        processing_stage: 'sending',
        is_retry: true,
      }
    };
    
    // Add to optimistic messages
    addOptimisticMessage(optimisticMessage);
    
    try {
      // Send the message as a retry
      await mutation.mutateAsync({
        message: originalMessage,
        messageId,
        isRetry: true
      });
    } catch (error) {
      handleError(error, {
        title: 'Retry Failed',
        message: 'Could not retry your message. Please try again later.'
      });
    }
  };
  
  // Function to handle file uploads
  const uploadRecipeImage = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a unique message ID for the upload
      const messageId = `upload_${uuidv4()}`;
      
      // Create a FileReader to read the image
      const reader = new FileReader();
      
      // Set up progress tracking
      let lastLoaded = 0;
      const updateProgress = (event: ProgressEvent) => {
        const percentLoaded = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentLoaded);
        
        // Track loaded bytes for logging
        const loadedDiff = event.loaded - lastLoaded;
        lastLoaded = event.loaded;
        
        console.log(`Upload progress: ${percentLoaded}% (${loadedDiff} bytes)`);
      };
      
      // Return a promise that resolves when the file is read
      const readFile = () => new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.onprogress = updateProgress;
        reader.readAsDataURL(file);
      });
      
      // Read the file
      const dataUrl = await readFile();
      setUploadProgress(100);
      
      // Create an optimistic message
      const optimisticMessage: OptimisticMessage = {
        id: messageId,
        recipe_id: recipe.id,
        user_message: `Analyzing uploaded image...`,
        ai_response: '',
        pending: true,
        meta: {
          optimistic_id: messageId,
          tracking_id: uuidv4(),
          processing_stage: 'uploading',
          source_info: {
            type: 'image',
            url: dataUrl
          }
        }
      };
      
      // Add optimistic message
      addOptimisticMessage(optimisticMessage);
      
      // Send the image to the server
      await mutation.mutateAsync({
        message: `Analyze this recipe image and provide suggestions`,
        sourceType: 'image',
        sourceImage: dataUrl,
        messageId
      });
    } catch (error) {
      handleError(error, {
        title: 'Upload Failed',
        message: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Function to submit a recipe URL
  const submitRecipeUrl = async (url: string) => {
    if (!url) return;
    
    // Create a unique message ID for the URL submission
    const messageId = `url_${uuidv4()}`;
    
    // Create an optimistic message
    const optimisticMessage: OptimisticMessage = {
      id: messageId,
      recipe_id: recipe.id,
      user_message: `Analyzing recipe from ${url}...`,
      ai_response: '',
      pending: true,
      meta: {
        optimistic_id: messageId,
        tracking_id: uuidv4(),
        processing_stage: 'processing',
        source_info: {
          type: 'url',
          url
        }
      }
    };
    
    // Add optimistic message
    addOptimisticMessage(optimisticMessage);
    
    try {
      // Submit the URL
      await mutation.mutateAsync({
        message: `Extract recipe information from this URL: ${url}`,
        sourceType: 'url',
        sourceUrl: url,
        messageId
      });
    } catch (error) {
      handleError(error, {
        title: 'URL Processing Failed',
        message: 'Failed to process recipe URL. Please try a different URL or try again later.'
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
