import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';

/**
 * Hook for managing optimistic UI updates for chat messages
 * before they are confirmed by the server
 */
export function useOptimisticMessages(chatHistory: ChatMessage[]) {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  
  // Reset optimistic messages when chat history changes
  useEffect(() => {
    // Find any optimistic messages that have been confirmed in chat history
    const confirmedOptimisticIds = new Set(
      chatHistory
        .filter(msg => msg.meta?.optimistic_id)
        .map(msg => msg.meta?.optimistic_id)
    );
    
    // Keep only messages that haven't been confirmed yet
    setOptimisticMessages(prev => 
      prev.filter(msg => !confirmedOptimisticIds.has(msg.id))
    );
  }, [chatHistory]);
  
  // Subscription for realtime updates
  useEffect(() => {
    // Remove subscription on unmount
    const subscription = supabase
      .channel('recipe_chats_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recipe_chats'
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // If message has an optimistic counterpart
          if (newMessage.meta?.optimistic_id) {
            // Filter out the optimistic message
            setOptimisticMessages(prev =>
              prev.filter(msg => msg.id !== newMessage.meta.optimistic_id)
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'recipe_chats'
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          
          // If message has an optimistic counterpart and now has an AI response
          if (updatedMessage.meta?.optimistic_id && updatedMessage.ai_response) {
            // Filter out the optimistic message
            setOptimisticMessages(prev =>
              prev.filter(msg => msg.id !== updatedMessage.meta.optimistic_id)
            );
          }
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Add optimistic message
  const addOptimisticMessage = useCallback((message: OptimisticMessage) => {
    // Ensure message has required fields
    const optimisticMessage: OptimisticMessage = {
      ...message,
      id: message.id || nanoid(),
      status: message.status || 'pending',
      timestamp: message.timestamp || Date.now(),
      meta: {
        ...message.meta,
        optimistic_id: message.meta?.optimistic_id || message.id || nanoid(),
      }
    };
    
    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    
    // Setup timeout to mark message as error if not confirmed
    setTimeout(() => {
      setOptimisticMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id && msg.status === 'pending'
            ? { ...msg, status: 'error', meta: { ...msg.meta, error: true, error_details: 'Request timed out' } }
            : msg
        )
      );
    }, 30000); // 30 seconds timeout
  }, []);
  
  // Clear all optimistic messages
  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages([]);
  }, []);
  
  return {
    optimisticMessages,
    addOptimisticMessage,
    clearOptimisticMessages
  };
}
