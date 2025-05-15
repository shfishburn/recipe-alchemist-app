
import { useState, useEffect } from 'react';
import type { ChatMessage, OptimisticMessage, ChatMeta } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export const useOptimisticMessages = (chatHistory: ChatMessage[]) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  
  // Remove optimistic messages that have been replaced by real ones
  useEffect(() => {
    if (chatHistory?.length > 0 && optimisticMessages.length > 0) {
      const newOptimisticMessages = optimisticMessages.filter(optimisticMsg => {
        // Check if this optimistic message has a corresponding real message
        const isReplaced = chatHistory.some(realMsg => {
          const meta = realMsg.meta as ChatMeta | undefined;
          return meta?.optimistic_id === optimisticMsg.id;
        });
        
        return !isReplaced;
      });
      
      if (newOptimisticMessages.length !== optimisticMessages.length) {
        setOptimisticMessages(newOptimisticMessages);
      }
    }
  }, [chatHistory, optimisticMessages]);
  
  // Add a new optimistic message
  const addOptimisticMessage = (message: string, recipeId: string): string => {
    const id = uuidv4();
    
    const optimisticMessage: OptimisticMessage = {
      id,
      recipe_id: recipeId,
      user_message: message,
      isOptimistic: true,
      created_at: new Date().toISOString()
    };
    
    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    return id;
  };
  
  // Clear all optimistic messages
  const clearOptimisticMessages = () => {
    setOptimisticMessages([]);
  };
  
  return {
    optimisticMessages,
    addOptimisticMessage,
    clearOptimisticMessages
  };
};
