import { useState, useEffect } from 'react';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';

/**
 * Hook to manage optimistic message states and cleanup with improved ID tracking
 */
export const useOptimisticMessages = (chatHistory: ChatMessage[]) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  // Enhanced cleanup using IDs rather than just content matching
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0 && optimisticMessages.length > 0) {
      // Clear optimistic messages when we have real messages
      const newOptimisticMessages = optimisticMessages.filter(optMsg => {
        // First, try to match by optimistic_id stored in meta
        const matchById = !chatHistory.some(realMsg => 
          realMsg.meta?.optimistic_id === optMsg.id
        );
        
        // If no ID match, fall back to content matching as a safety measure
        const matchByContent = !chatHistory.some(realMsg => 
          realMsg.user_message === optMsg.user_message
        );
        
        // Only keep messages that don't match by either method
        return matchById && matchByContent;
      });
      
      // Only update state if we actually cleared some messages
      if (newOptimisticMessages.length < optimisticMessages.length) {
        console.log(`Cleared ${optimisticMessages.length - newOptimisticMessages.length} optimistic messages using ID-based tracking`);
        setOptimisticMessages(newOptimisticMessages);
      }
    }
  }, [chatHistory, optimisticMessages]);

  const addOptimisticMessage = (message: OptimisticMessage) => {
    // Ensure each optimistic message has a unique ID if not already provided
    if (!message.id) {
      message.id = `opt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    setOptimisticMessages([...optimisticMessages, message]);
  };

  const clearOptimisticMessages = () => {
    setOptimisticMessages([]);
  };

  return {
    optimisticMessages,
    addOptimisticMessage,
    clearOptimisticMessages
  };
};
