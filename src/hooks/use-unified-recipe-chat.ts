
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';
import { RecipeChatService } from '@/services/recipe-chat-service';
import { useRecipeChatMessages } from '@/store/unified-chat-store';
import { useApplyChanges } from '@/hooks/recipe-chat/use-apply-changes';

/**
 * Unified hook for recipe chat functionality, works with both Recipe and QuickRecipe types
 */
export function useUnifiedRecipeChat(recipe: Recipe | QuickRecipe) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  // Get chat state from the unified store
  const {
    messages,
    optimisticMessages,
    messageStates,
    isLoadingMessages,
    addMessage,
    addOptimisticMessage,
    removeOptimisticMessage,
    clearOptimisticMessages,
    clearChatHistory,
    loadChatHistory,
    markMessageAsFailed,
    markMessageAsSuccess,
  } = useRecipeChatMessages(recipe);
  
  // Use the existing apply changes hook
  const { applyChanges, isApplying } = useApplyChanges();

  // Load chat history when the component mounts
  const fetchChatHistory = useCallback(async () => {
    try {
      await loadChatHistory();
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  }, [loadChatHistory, toast]);
  
  // Send a chat message
  const sendMessage = useCallback(async () => {
    if (!message.trim() || isSending) return false;
    
    const userMessage = message.trim();
    const messageId = `msg-${uuidv4()}`;
    
    // Create optimistic message
    const optimisticMessage: OptimisticMessage = {
      id: messageId,
      user_message: userMessage,
      meta: { optimistic_id: messageId, created_at: Date.now() }
    };
    
    // Add to optimistic messages for immediate feedback
    addOptimisticMessage(optimisticMessage);
    
    // Clear input
    setMessage('');
    setIsSending(true);
    
    try {
      // Call the API service
      const aiResponse = await RecipeChatService.sendMessage(recipe, userMessage, messageId);
      
      // Save the chat message
      const savedMessage = await RecipeChatService.saveChatMessage(
        recipe, 
        userMessage, 
        aiResponse, 
        messageId
      );
      
      // Add the confirmed message to our store
      addMessage(savedMessage);
      
      // Remove the optimistic message
      removeOptimisticMessage(messageId);
      
      // Mark as success in the store
      markMessageAsSuccess(messageId, savedMessage);
      
      return true;
    } catch (error: any) {
      console.error("Error in send message:", error);
      
      // Mark message as failed
      markMessageAsFailed(messageId);
      
      // Show error toast
      toast({
        title: "Error sending message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, recipe, addOptimisticMessage, addMessage, removeOptimisticMessage, markMessageAsSuccess, markMessageAsFailed, toast]);
  
  // Apply changes suggested by the AI
  const handleApplyChanges = useCallback(async (chatMessage: ChatMessage): Promise<boolean> => {
    try {
      // Apply changes using existing function
      const success = await applyChanges(recipe as Recipe, chatMessage);
      
      if (success && chatMessage.id) {
        // Mark as applied in the database if this is a real message
        await RecipeChatService.markMessageAsApplied(chatMessage.id);
      }
      
      return success;
    } catch (error) {
      console.error("Error applying changes:", error);
      
      toast({
        title: "Error",
        description: "Failed to apply changes",
        variant: "destructive",
      });
      
      return false;
    }
  }, [applyChanges, recipe, toast]);

  // Upload an image for analysis
  const uploadRecipeImage = useCallback(async (file: File) => {
    if (isSending) return false;
    
    const messageId = `img-${uuidv4()}`;
    
    // Create optimistic message
    const optimisticMessage: OptimisticMessage = {
      id: messageId,
      user_message: "Analyzing recipe image...",
      meta: { optimistic_id: messageId, created_at: Date.now() }
    };
    
    // Add optimistic message
    addOptimisticMessage(optimisticMessage);
    setIsSending(true);
    
    try {
      // Process the image
      const aiResponse = await RecipeChatService.processImageForRecipe(recipe, file, messageId);
      
      // Save the message
      const savedMessage = await RecipeChatService.saveChatMessage(
        recipe,
        "Analyzing recipe image...",
        aiResponse,
        messageId,
        'image'
      );
      
      // Add the confirmed message
      addMessage(savedMessage);
      
      // Remove optimistic message
      removeOptimisticMessage(messageId);
      
      // Mark as success
      markMessageAsSuccess(messageId, savedMessage);
      
      return true;
    } catch (error: any) {
      console.error("Error processing image:", error);
      
      // Mark as failed
      markMessageAsFailed(messageId);
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to analyze image",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSending(false);
    }
  }, [isSending, recipe, addOptimisticMessage, addMessage, removeOptimisticMessage, markMessageAsSuccess, markMessageAsFailed, toast]);

  // Submit a URL for analysis
  const submitRecipeUrl = useCallback(async (url: string) => {
    if (!url.trim() || isSending) return false;
    
    const messageId = `url-${uuidv4()}`;
    
    // Create optimistic message
    const optimisticMessage: OptimisticMessage = {
      id: messageId,
      user_message: `Analyzing recipe from: ${url}`,
      meta: { optimistic_id: messageId, created_at: Date.now() }
    };
    
    // Add optimistic message
    addOptimisticMessage(optimisticMessage);
    setIsSending(true);
    
    try {
      // Process the URL
      const aiResponse = await RecipeChatService.processUrlForRecipe(recipe, url, messageId);
      
      // Save the message
      const savedMessage = await RecipeChatService.saveChatMessage(
        recipe,
        `Analyzing recipe from: ${url}`,
        aiResponse,
        messageId,
        'url'
      );
      
      // Add the confirmed message
      addMessage(savedMessage);
      
      // Remove optimistic message
      removeOptimisticMessage(messageId);
      
      // Mark as success
      markMessageAsSuccess(messageId, savedMessage);
      
      return true;
    } catch (error: any) {
      console.error("Error processing URL:", error);
      
      // Mark as failed
      markMessageAsFailed(messageId);
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to analyze URL",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSending(false);
    }
  }, [isSending, recipe, addOptimisticMessage, addMessage, removeOptimisticMessage, markMessageAsSuccess, markMessageAsFailed, toast]);

  // Handle clearing chat history
  const handleClearChatHistory = useCallback(async () => {
    try {
      await clearChatHistory();
      
      toast({
        title: "Chat cleared",
        description: "Chat history has been cleared",
      });
      
      return true;
    } catch (error) {
      console.error("Error clearing chat history:", error);
      
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
      
      return false;
    }
  }, [clearChatHistory, toast]);

  return {
    // Message state
    message,
    setMessage,
    
    // Message lists
    messages,
    optimisticMessages,
    messageStates,
    
    // Loading states
    isLoadingMessages,
    isSending,
    isApplying,
    
    // Actions
    sendMessage,
    applyChanges: handleApplyChanges,
    uploadRecipeImage,
    submitRecipeUrl,
    clearChatHistory: handleClearChatHistory,
    fetchChatHistory,
  };
}
