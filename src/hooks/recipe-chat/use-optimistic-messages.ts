import { useState, useEffect } from 'react';
import type { ChatMessage, OptimisticMessage, ChatMeta } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for managing optimistic UI updates for chat messages
 */
export const useOptimisticMessages = (
  chatHistory: ChatMessage[]
) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  // Clean up optimistic messages when real messages arrive
  useEffect(() => {
    // Check for resolved messages
    if (chatHistory.length > 0 && optimisticMessages.length > 0) {
      const remainingMessages = optimisticMessages.filter(optimistic => {
        // Keep messages that don't have an optimistic_id or 
        // where that optimistic_id doesn't match any real message
        const hasMatchingRealMessage = chatHistory.some(real => {
          // Extract optimistic_id from meta
          const meta = real.meta || {};
          const optimisticId = meta.optimistic_id;
          return optimisticId === optimistic.meta?.optimistic_id;
        });
        
        return !hasMatchingRealMessage;
      });
      
      if (remainingMessages.length !== optimisticMessages.length) {
        setOptimisticMessages(remainingMessages);
      }
    }
  }, [chatHistory, optimisticMessages]);
  
  /**
   * Add an optimistic message while waiting for the server response
   */
  const addOptimisticMessage = (message: string, recipeId: string) => {
    const optimisticId = uuidv4();
    
    const optimisticMessage: OptimisticMessage = {
      id: optimisticId,
      recipe_id: recipeId,
      user_message: message,
      ai_response: '', // Empty initially
      pending: true,   // Mark as pending
      meta: {
        optimistic_id: optimisticId, // Use for matching with real message later
        processing_stage: 'sending',
      },
    };
    
    // Add the new optimistic message
    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    
    return optimisticId;
  };
  
  /**
   * Mark an optimistic message as having an error
   */
  const markMessageError = (optimisticId: string) => {
    setOptimisticMessages(prev => 
      prev.map(msg => 
        msg.meta?.optimistic_id === optimisticId
          ? { ...msg, meta: { ...msg.meta, error: true } }
          : msg
      )
    );
  };
  
  /**
   * Clear all optimistic messages (e.g., when clearing chat history)
   */
  const clearOptimisticMessages = () => {
    setOptimisticMessages([]);
  };

  return {
    optimisticMessages,
    addOptimisticMessage,
    markMessageError,
    clearOptimisticMessages,
  };
};
