import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';

/**
 * Hook to manage optimistic message states and cleanup with robust ID tracking
 */
export const useOptimisticMessages = (chatHistory: ChatMessage[]) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const previousChatHistoryRef = useRef<ChatMessage[]>([]);

  // Enhanced cleanup using IDs with stale message detection
  useEffect(() => {
    if (chatHistory && optimisticMessages.length > 0) {
      // Track if we've processed this exact set of messages before
      const chatHistoryIds = chatHistory.map(msg => msg.id).join(',');
      const previousChatHistoryIds = previousChatHistoryRef.current.map(msg => msg.id).join(',');
      
      // Only process if we have new messages
      if (chatHistoryIds !== previousChatHistoryIds) {
        console.log(`Chat history changed, processing ${optimisticMessages.length} optimistic messages`);
        
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
        
        // Update the previous chat history reference
        previousChatHistoryRef.current = chatHistory;
      }
    }
  }, [chatHistory, optimisticMessages]);

  const addOptimisticMessage = useCallback((message: OptimisticMessage) => {
    // Ensure each optimistic message has a unique ID if not already provided
    if (!message.id) {
      message.id = `opt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    
    // Deduplicate: don't add if a very similar message is already in the optimistic queue
    setOptimisticMessages(prev => {
      if (prev.some(msg => msg.user_message === message.user_message && 
                          Date.now() - new Date(msg.created_at || Date.now()).getTime() < 5000)) {
        console.log("Preventing duplicate optimistic message");
        return prev;
      }
      return [...prev, { ...message, created_at: message.created_at || new Date().toISOString() }];
    });
  }, []);

  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages([]);
  }, []);

  return {
    optimisticMessages,
    addOptimisticMessage,
    clearOptimisticMessages
  };
};
