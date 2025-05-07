
import { useState, useEffect } from 'react';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';
import { getChatMeta } from '@/utils/chat-meta';

/**
 * Hook for managing optimistic UI updates while waiting for real chat responses
 */
export const useOptimisticMessages = (chatHistory: ChatMessage[]) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  // Clear optimistic messages that have actual responses in chat history
  useEffect(() => {
    if (chatHistory.length > 0 && optimisticMessages.length > 0) {
      // Create a map of optimistic message IDs that have been replaced by real messages
      const replacedOptimisticIds = chatHistory.reduce<Record<string, boolean>>((acc, message) => {
        const optimisticId = getChatMeta(message, 'optimistic_id', '');
        if (optimisticId) {
          acc[optimisticId] = true;
        }
        return acc;
      }, {});
      
      // Filter out optimistic messages that now have real counterparts
      const filteredMessages = optimisticMessages.filter(message => {
        const messageId = message.id || getChatMeta(message, 'optimistic_id', '');
        return !messageId || !replacedOptimisticIds[messageId];
      });
      
      // Update if we filtered any messages out
      if (filteredMessages.length !== optimisticMessages.length) {
        setOptimisticMessages(filteredMessages);
      }
    }
  }, [chatHistory, optimisticMessages]);

  const addOptimisticMessage = (message: OptimisticMessage) => {
    console.log("Adding optimistic message:", message);
    
    // Ensure message has an ID and meta data structure
    const enhancedMessage = {
      ...message,
      id: message.id || `optimistic-${Date.now()}`,
      meta: {
        ...(message.meta || {}),
        optimistic_id: message.id || `optimistic-${Date.now()}`
      }
    };
    
    setOptimisticMessages(prev => [...prev, enhancedMessage]);
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
