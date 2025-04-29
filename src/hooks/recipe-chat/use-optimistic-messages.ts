import { useState, useEffect } from 'react';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';

/**
 * Hook to manage optimistic message states and cleanup
 */
export const useOptimisticMessages = (chatHistory: ChatMessage[]) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  // Clear optimistic messages once they appear in the real chat history
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0 && optimisticMessages.length > 0) {
      // Clear optimistic messages when we have real messages
      // We match based on user_message content
      const newOptimisticMessages = optimisticMessages.filter(optMsg => {
        // Only keep optimistic messages that don't have a matching real message
        return !chatHistory.some(realMsg => 
          realMsg.user_message === optMsg.user_message
        );
      });
      
      // Only update state if we actually cleared some messages
      if (newOptimisticMessages.length < optimisticMessages.length) {
        console.log(`Cleared ${optimisticMessages.length - newOptimisticMessages.length} optimistic messages`);
        setOptimisticMessages(newOptimisticMessages);
      }
    }
  }, [chatHistory, optimisticMessages]);

  const addOptimisticMessage = (message: OptimisticMessage) => {
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
