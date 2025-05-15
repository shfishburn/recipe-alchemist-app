
import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, OptimisticMessage, ChatMeta } from '@/types/chat';

/**
 * Safely gets a value from a chat message's meta property with proper type checking
 * @param message Chat message object
 * @param key Meta property key to retrieve
 * @param defaultValue Default value to return if key doesn't exist
 * @returns The value from meta or the default value
 */
function getMetaProperty<T>(
  message: ChatMessage | OptimisticMessage | null | undefined,
  key: string,
  defaultValue: T
): T {
  if (!message?.meta || typeof message.meta !== 'object') return defaultValue;
  
  try {
    const value = message.meta[key];
    if (value !== undefined && (typeof value === typeof defaultValue || defaultValue === null)) {
      return value as T;
    }
  } catch (e) {
    console.error(`Error getting meta value for key ${key}:`, e);
  }
  
  return defaultValue;
}

/**
 * Hook for managing optimistic UI updates while waiting for real chat responses
 */
export const useOptimisticMessages = (chatHistory: ChatMessage[]) => {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  // Enhanced cleanup function for better reliability
  const cleanupOptimisticMessages = useCallback((messages: OptimisticMessage[], history: ChatMessage[]) => {
    // Create a Set of all optimistic IDs in the real message history
    const replacedOptimisticIds = new Set<string>();
    
    // First pass: collect all optimistic_ids from real messages
    history.forEach(message => {
      const optimisticId = getMetaProperty(message, 'optimistic_id', '');
      if (optimisticId) {
        replacedOptimisticIds.add(optimisticId);
      }
    });
    
    // Second pass: filter out optimistic messages that now have real counterparts
    return messages.filter(message => {
      // Get all possible IDs that might match with history
      const messageOptimisticId = getMetaProperty(message, 'optimistic_id', '');
      const messageId = message.id || messageOptimisticId;
      
      // Keep message only if it doesn't have a corresponding real message
      return !messageId || !replacedOptimisticIds.has(messageId);
    });
  }, []);

  // Clear optimistic messages that have actual responses in chat history
  useEffect(() => {
    if (chatHistory.length > 0 && optimisticMessages.length > 0) {
      const filteredMessages = cleanupOptimisticMessages(optimisticMessages, chatHistory);
      
      // Update only if we filtered any messages out
      if (filteredMessages.length !== optimisticMessages.length) {
        console.log("Clearing optimistic messages that have been replaced by real messages", {
          before: optimisticMessages.length,
          after: filteredMessages.length
        });
        setOptimisticMessages(filteredMessages);
      }
    }
  }, [chatHistory, optimisticMessages, cleanupOptimisticMessages]);

  // Enhanced addOptimisticMessage with improved tracking and recipe_id preservation
  const addOptimisticMessage = useCallback((message: OptimisticMessage) => {
    console.log("Adding optimistic message:", message);
    
    // Generate a unique ID if not provided
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 5);
    const optimisticId = `optimistic-${timestamp}-${randomSuffix}`;
    
    // Ensure message has proper metadata structure
    const messageMeta: ChatMeta = {
      ...(message.meta || {}),
      optimistic_id: message.id || optimisticId,
      tracking_id: message.id || optimisticId,
      processing_stage: 'pending',
      timestamp: timestamp
    };
    
    // Make sure recipe_id is included if available
    if (message.recipe_id) {
      messageMeta.recipe_id = message.recipe_id;
    }
    
    // Create enhanced message with consistent properties
    const enhancedMessage: OptimisticMessage = {
      ...message,
      id: message.id || optimisticId,
      meta: messageMeta,
      timestamp: timestamp,
      pending: true,
      recipe_id: message.recipe_id // Ensure recipe_id is preserved
    };
    
    setOptimisticMessages(prev => [...prev, enhancedMessage]);
    return optimisticId;
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

// Export utility function for general use
export function getChatMeta<T>(
  message: ChatMessage | null | undefined, 
  key: string, 
  defaultValue: T
): T {
  return getMetaProperty(message, key, defaultValue);
}
