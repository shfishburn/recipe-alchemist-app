
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useOptimisticMessages } from '@/hooks/recipe-chat/use-optimistic-messages';
import { generateQuickRecipeResponse } from '@/api/quick-recipe-chat'; // We'll create this API function

// We need to generate a unique ID for the quick recipe
// This helps us track chat history in local storage
const getRecipeStorageId = (recipe: QuickRecipe) => {
  if (recipe.id) return recipe.id;
  
  // Generate consistent ID based on recipe content for temporary recipes
  const identifier = recipe.title 
    ? `${recipe.title.substring(0, 20)}-${recipe.ingredients.length}`
    : `quick-recipe-${Date.now()}`;
    
  return `temp-${identifier}`;
};

export const useQuickRecipeChat = (recipe: QuickRecipe) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Generate a storage key for this recipe
  const recipeStorageId = getRecipeStorageId(recipe);
  const chatStorageKey = `quick-recipe-chat-${recipeStorageId}`;
  
  // Use local storage to persist chat history
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>(chatStorageKey, []);
  
  // Get recipe update function from store
  const updateRecipe = useQuickRecipeStore(state => state.setRecipe);
  
  // Use the existing optimistic messages hook
  const { optimisticMessages, addOptimisticMessage, clearOptimisticMessages } = 
    useOptimisticMessages(chatHistory);
  
  // Send a message to the AI
  const sendMessage = useCallback(async () => {
    if (!message.trim() || isSending) return;
    
    const messageId = `temp-${uuidv4()}`;
    const userMessage = message.trim();
    
    // Create optimistic message
    addOptimisticMessage({
      id: messageId,
      user_message: userMessage,
      pending: true,
      meta: { optimistic_id: messageId }
    });
    
    // Clear the input
    setMessage('');
    setIsSending(true);
    
    try {
      // Call API to get response
      const response = await generateQuickRecipeResponse(recipe, userMessage);
      
      // Add the message to chat history
      const newMessage: ChatMessage = {
        id: messageId,
        user_message: userMessage,
        ai_response: response.textResponse,
        changes_suggested: response.changes || null,
        follow_up_questions: response.followUpQuestions || [],
        meta: { optimistic_id: messageId }
      };
      
      setChatHistory((prev: ChatMessage[]) => [...prev, newMessage]);
      
    } catch (error) {
      console.error('Error sending chat message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  }, [message, recipe, isSending, toast, addOptimisticMessage, setChatHistory]);
  
  // Apply changes suggested by the AI to the recipe
  const applyChanges = useCallback(async (chatMessage: ChatMessage) => {
    if (isApplying || !chatMessage.changes_suggested) return false;
    
    setIsApplying(true);
    
    try {
      // Create a copy of the recipe with the changes applied
      const updatedRecipe = { ...recipe };
      const changes = chatMessage.changes_suggested;
      
      // Apply title changes
      if (changes.title) {
        updatedRecipe.title = changes.title;
      }
      
      // Apply ingredients changes
      if (changes.ingredients?.items && changes.ingredients.items.length > 0) {
        if (changes.ingredients.mode === 'replace') {
          updatedRecipe.ingredients = changes.ingredients.items;
        } else if (changes.ingredients.mode === 'add') {
          updatedRecipe.ingredients = [...updatedRecipe.ingredients, ...changes.ingredients.items];
        }
      }
      
      // Apply instructions changes
      if (changes.instructions && changes.instructions.length > 0) {
        updatedRecipe.steps = changes.instructions.map(instruction => 
          typeof instruction === 'string' ? instruction : instruction.action || ''
        );
      }
      
      // Apply nutrition, science notes, etc.
      if (changes.nutrition) {
        updatedRecipe.nutrition = changes.nutrition;
      }
      
      if (changes.science_notes && changes.science_notes.length > 0) {
        updatedRecipe.science_notes = changes.science_notes;
      }
      
      // Update chat message to mark as applied
      setChatHistory((prev: ChatMessage[]) => prev.map(msg => 
        msg.id === chatMessage.id ? { ...msg, applied: true } : msg
      ));
      
      // Update the recipe in the store
      updateRecipe(updatedRecipe);
      
      // Show success toast
      toast({
        title: 'Changes Applied',
        description: 'Recipe has been successfully updated.',
      });
      
      return true;
    } catch (error) {
      console.error('Error applying changes:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply changes to recipe',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsApplying(false);
    }
  }, [recipe, isApplying, updateRecipe, setChatHistory, toast]);
  
  // Clear chat history
  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
    clearOptimisticMessages();
    return Promise.resolve(); // For compatibility with RecipeChat interface
  }, [setChatHistory, clearOptimisticMessages]);
  
  return {
    message,
    setMessage,
    chatHistory,
    optimisticMessages,
    isLoadingHistory: false, // Local storage is instant
    sendMessage,
    isSending,
    applyChanges,
    isApplying,
    clearChatHistory,
  };
};
