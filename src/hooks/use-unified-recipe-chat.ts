
import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';
import { RecipeChatService } from '@/services/recipe-chat-service';
import { useRecipeChatMessages } from '@/store/unified-chat-store';
import { useApplyChanges } from '@/hooks/recipe-chat/use-apply-changes';
import { logChatEvent } from '@/utils/chat-debug';

// Configuration constants
const MESSAGE_TIMEOUT = 60000; // 60 seconds
const SCROLL_DEBOUNCE = 100; // 100ms
const RETRY_MAX_COUNT = 3;

/**
 * Unified hook for recipe chat functionality, works with both Recipe and QuickRecipe types
 */
export function useUnifiedRecipeChat(recipe: Recipe | QuickRecipe) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sendingRef = useRef(false); // For avoiding race conditions
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
    markMessageAsApplied,
  } = useRecipeChatMessages(recipe);
  
  // Use the existing apply changes hook
  const { applyChanges: applyRecipeChanges, isApplying } = useApplyChanges();

  // Load chat history when the component mounts
  const fetchChatHistory = useCallback(async () => {
    try {
      logChatEvent("Loading chat history", { recipeId: 'id' in recipe ? recipe.id : 'quick-recipe' });
      await loadChatHistory();
    } catch (error: any) {
      logChatEvent("Error loading chat history", { error: error.message }, "error");
      
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  }, [loadChatHistory, toast]);
  
  // Load chat history on mount
  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);
  
  // Send a chat message with debounce protection and retries
  const sendMessage = useCallback(async (retryCount = 0) => {
    if (!message.trim() || sendingRef.current) return false;
    
    const userMessage = message.trim();
    const messageId = `msg-${uuidv4()}`;
    
    // Update our local ref to prevent duplicate submissions
    sendingRef.current = true;
    
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
      logChatEvent("Sending chat message", { messageId, isRetry: retryCount > 0 });
      
      // Create a timeout promise to race against actual API call
      let timeoutId: NodeJS.Timeout;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Request timed out. Please try again."));
        }, MESSAGE_TIMEOUT);
      });
      
      // Race between API call and timeout
      const sendPromise = RecipeChatService.sendMessage(recipe, userMessage, messageId);
      const aiResponse = await Promise.race([sendPromise, timeoutPromise]);
      
      // Clear timeout since we got a response
      clearTimeout(timeoutId!);
      
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
      
      logChatEvent("Message sent successfully", { messageId });
      
      return true;
    } catch (error: any) {
      logChatEvent("Error in send message", { error: error.message, retryCount }, "error");
      
      // Auto retry network errors but with a limit
      if (retryCount < RETRY_MAX_COUNT && 
          (error.message?.includes('network') || 
           error.message?.includes('timeout'))) {
        
        const delay = Math.min(1000 * Math.pow(2, retryCount), 8000); // Exponential backoff
        
        toast({
          title: "Retrying message...",
          description: `Connection issue. Retrying in ${delay/1000} seconds.`,
          duration: delay - 500,
        });
        
        setTimeout(() => {
          // This message is still in the optimistic queue, retry sending
          sendingRef.current = false;
          setMessage(userMessage);
          sendMessage(retryCount + 1);
        }, delay);
        
        return false;
      }
      
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
      sendingRef.current = false;
    }
  }, [message, recipe, addOptimisticMessage, addMessage, removeOptimisticMessage, markMessageAsSuccess, markMessageAsFailed, toast]);
  
  // Apply changes suggested by the AI
  const handleApplyChanges = useCallback(async (chatMessage: ChatMessage): Promise<boolean> => {
    try {
      // Apply changes using existing function
      const success = await applyRecipeChanges(recipe as Recipe, chatMessage);
      
      if (success && chatMessage.id) {
        // Mark as applied in the database if this is a real message
        await RecipeChatService.markMessageAsApplied(chatMessage.id);
        
        // Mark as applied in our local state
        markMessageAsApplied(chatMessage.id);
        
        toast({
          title: "Changes applied",
          description: "Recipe updated successfully"
        });
      }
      
      return success;
    } catch (error: any) {
      logChatEvent("Error applying changes", { error: error.message }, "error");
      
      toast({
        title: "Error",
        description: "Failed to apply changes: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
      
      return false;
    }
  }, [applyRecipeChanges, recipe, markMessageAsApplied, toast]);

  // Upload an image for analysis
  const uploadRecipeImage = useCallback(async (file: File) => {
    if (sendingRef.current) return false;
    
    const messageId = `img-${uuidv4()}`;
    sendingRef.current = true;
    
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
      logChatEvent("Error processing image", { error: error.message }, "error");
      
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
      sendingRef.current = false;
    }
  }, [recipe, addOptimisticMessage, addMessage, removeOptimisticMessage, markMessageAsSuccess, markMessageAsFailed, toast]);

  // Submit a URL for analysis
  const submitRecipeUrl = useCallback(async (url: string) => {
    if (!url.trim() || sendingRef.current) return false;
    
    const messageId = `url-${uuidv4()}`;
    sendingRef.current = true;
    
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
      logChatEvent("Error processing URL", { error: error.message }, "error");
      
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
      sendingRef.current = false;
    }
  }, [recipe, addOptimisticMessage, addMessage, removeOptimisticMessage, markMessageAsSuccess, markMessageAsFailed, toast]);

  // Handle clearing chat history
  const handleClearChatHistory = useCallback(async () => {
    try {
      await clearChatHistory();
      
      toast({
        title: "Chat cleared",
        description: "Chat history has been cleared",
      });
      
      return true;
    } catch (error: any) {
      logChatEvent("Error clearing chat history", { error: error.message }, "error");
      
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
