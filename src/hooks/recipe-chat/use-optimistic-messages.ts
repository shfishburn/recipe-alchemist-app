
import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';
import { getChatMeta, hasChatMeta } from '@/utils/chat-meta';

/**
 * Hook for managing optimistic UI updates while waiting for real chat responses
 */
export const useOptimisticMessages = (chatHistory: ChatMessage[]) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  // Clear optimistic messages that have actual responses in chat history
  useEffect(() => {
    if (chatHistory.length > 0 && optimisticMessages.length > 0) {
      // Create a map of optimistic message IDs that have been replaced by real messages
      const replacedOptimisticIds = new Map<string, boolean>();
      
      chatHistory.forEach(message => {
        const optimisticId = getChatMeta(message, 'optimistic_id', '');
        if (optimisticId) {
          replacedOptimisticIds.set(optimisticId, true);
        }
      });
      
      // Filter out optimistic messages that now have real counterparts
      const filteredMessages = optimisticMessages.filter(message => {
        const messageId = message.id || getChatMeta(message, 'optimistic_id', '');
        return !messageId || !replacedOptimisticIds.has(messageId);
      });
      
      // Update if we filtered any messages out
      if (filteredMessages.length !== optimisticMessages.length) {
        setOptimisticMessages(filteredMessages);
      }
    }
  }, [chatHistory, optimisticMessages]);

  const addOptimisticMessage = useCallback((message: OptimisticMessage) => {
    console.log("Adding optimistic message:", message);
    
    // Ensure message has an ID and meta data structure
    const enhancedMessage = {
      ...message,
      id: message.id || `optimistic-${Date.now()}`,
      meta: {
        ...(message.meta || {}),
        optimistic_id: message.id || `optimistic-${Date.now()}`,
        created_at: Date.now()
      }
    };
    
    // Remove any duplicate optimistic messages
    setOptimisticMessages(prev => {
      const existing = prev.find(m => m.user_message === enhancedMessage.user_message);
      if (existing) {
        return prev.filter(m => m.id !== existing.id).concat(enhancedMessage);
      }
      return [...prev, enhancedMessage];
    });
  }, []);

  const removeOptimisticMessage = useCallback((id: string) => {
    setOptimisticMessages(prev => 
      prev.filter(msg => {
        const msgId = msg.id || getChatMeta(msg, 'optimistic_id', '');
        return msgId !== id;
      })
    );
  }, []);

  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages([]);
  }, []);

  return {
    optimisticMessages,
    addOptimisticMessage,
    removeOptimisticMessage,
    clearOptimisticMessages
  };
};
