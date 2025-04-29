import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';

/**
 * Hook to manage optimistic message states and cleanup with robust ID tracking
 */
export const useOptimisticMessages = (chatHistory: ChatMessage[]) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const previousChatHistoryRef = useRef<ChatMessage[]>([]);
  const messageHashMapRef = useRef<Map<string, string>>(new Map());
  
  // Enhanced cleanup using multiple strategies for matching messages
  useEffect(() => {
    if (!chatHistory || optimisticMessages.length === 0) return;
    
    // Track if we've processed this exact set of messages before
    const chatHistoryIds = chatHistory.map(msg => msg.id).join(',');
    const previousChatHistoryIds = previousChatHistoryRef.current.map(msg => msg.id).join(',');
    
    // Only process if we have new messages
    if (chatHistoryIds !== previousChatHistoryIds) {
      console.log(`Chat history changed, processing ${optimisticMessages.length} optimistic messages`);
      
      // Multiple matching strategies to identify corresponding messages
      const newOptimisticMessages = optimisticMessages.filter(optMsg => {
        // Strategy 1: Match by stored optimistic_id in meta
        const matchById = !chatHistory.some(realMsg => 
          realMsg.meta?.optimistic_id === optMsg.id
        );
        
        // Strategy 2: Match by content (user message)
        const matchByContent = !chatHistory.some(realMsg => 
          realMsg.user_message === optMsg.user_message
        );
        
        // Strategy 3: Match by content hash (for complex content comparison)
        const contentHash = messageHashMapRef.current.get(optMsg.id || '');
        const matchByHash = !contentHash || !chatHistory.some(realMsg => {
          const realHash = `${realMsg.user_message}:${realMsg.ai_response?.substring(0, 100) || ''}`;
          return realHash === contentHash;
        });
        
        // Strategy 4: Match by creation time proximity (within 10 seconds)
        const matchByTime = !chatHistory.some(realMsg => {
          if (!optMsg.created_at || !realMsg.created_at) return false;
          const optTime = new Date(optMsg.created_at).getTime();
          const realTime = new Date(realMsg.created_at).getTime();
          return Math.abs(optTime - realTime) < 10000; // Within 10 seconds
        });
        
        // Only keep messages that don't match by any method
        return matchById && matchByContent && matchByHash && matchByTime;
      });
      
      // Only update state if we actually cleared some messages
      if (newOptimisticMessages.length < optimisticMessages.length) {
        console.log(`Cleared ${optimisticMessages.length - newOptimisticMessages.length} optimistic messages using multi-strategy matching`);
        setOptimisticMessages(newOptimisticMessages);
      }
      
      // Update the previous chat history reference
      previousChatHistoryRef.current = chatHistory;
    }
  }, [chatHistory, optimisticMessages]);

  const addOptimisticMessage = useCallback((message: OptimisticMessage) => {
    // Ensure each optimistic message has a unique ID if not already provided
    const messageId = message.id || `opt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const enhancedMessage = {
      ...message,
      id: messageId,
      created_at: message.created_at || new Date().toISOString()
    };
    
    // Store a content hash for more reliable cleanup
    const contentHash = `${enhancedMessage.user_message}:${enhancedMessage.ai_response?.substring(0, 100) || ''}`;
    messageHashMapRef.current.set(messageId, contentHash);
    
    // Deduplicate: don't add if a very similar message is already in the optimistic queue
    setOptimisticMessages(prev => {
      // Check for duplicates by content
      if (prev.some(msg => msg.user_message === message.user_message && 
                          Date.now() - new Date(msg.created_at || Date.now()).getTime() < 5000)) {
        console.log("Preventing duplicate optimistic message");
        return prev;
      }
      
      // Check for duplicates by ID
      if (prev.some(msg => msg.id === messageId)) {
        console.log("Preventing duplicate optimistic message with same ID");
        return prev;
      }
      
      return [...prev, enhancedMessage];
    });
  }, []);

  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages([]);
    messageHashMapRef.current.clear();
  }, []);

  return {
    optimisticMessages,
    addOptimisticMessage,
    clearOptimisticMessages
  };
};
