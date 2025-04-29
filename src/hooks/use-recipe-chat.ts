
import { useApplyChanges } from './recipe-chat/use-apply-changes';
import { useChatHistory } from './recipe-chat/use-chat-history';
import { useOptimisticMessages } from './recipe-chat/use-optimistic-messages';
import { useChatActions } from './recipe-chat/use-chat-actions';
import { useChatManagement } from './recipe-chat/use-chat-management';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

export type { ChatMessage };

/**
 * Main hook for recipe chat functionality, integrating all the specialized hooks
 */
export const useRecipeChat = (recipe: Recipe) => {
  // Get chat history from the database
  const { 
    chatHistory, 
    isLoadingHistory, 
    refetchChatHistory 
  } = useChatHistory(recipe.id);
  
  // Manage optimistic messages
  const { 
    optimisticMessages, 
    addOptimisticMessage, 
    clearOptimisticMessages 
  } = useOptimisticMessages(chatHistory);
  
  // Handle chat actions (sending messages, uploading images, etc.)
  const { 
    message, 
    setMessage, 
    sendMessage, 
    uploadRecipeImage, 
    submitRecipeUrl, 
    isSending 
  } = useChatActions(recipe, addOptimisticMessage);
  
  // Handle chat management operations (clearing history)
  const { 
    clearChatHistory 
  } = useChatManagement(recipe.id, refetchChatHistory, clearOptimisticMessages);
  
  // Apply changes from chat to the recipe
  const applyChanges = useApplyChanges(recipe);

  return {
    // Chat state
    message,
    setMessage,
    chatHistory,
    optimisticMessages,
    isLoadingHistory,
    
    // Chat actions
    sendMessage,
    isSending,
    uploadRecipeImage,
    submitRecipeUrl,
    
    // Recipe change application
    applyChanges,
    isApplying: applyChanges.isPending,
    
    // Management actions
    refetchChatHistory,
    clearChatHistory
  };
};
