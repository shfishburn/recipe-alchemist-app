
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';
import { toast } from 'sonner';

/**
 * Hook to fetch and manage chat history for a recipe
 */
export const useChatHistory = (recipeId?: string) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Fetch chat history when recipeId changes
  const fetchChatHistory = async () => {
    if (!recipeId) {
      setChatHistory([]);
      setIsLoadingHistory(false);
      return;
    }

    try {
      setIsLoadingHistory(true);
      const { data, error } = await supabase
        .from('recipe_chats')
        .select('*')
        .eq('recipe_id', recipeId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Convert database records to ChatMessage format with type safety
      const typeSafeChatMessages: ChatMessage[] = data.map(item => ({
        id: item.id,
        user_message: item.user_message,
        ai_response: item.ai_response || '',
        // Need to parse the changes_suggested into the correct type
        changes_suggested: item.changes_suggested || {},
        meta: item.meta || {},
        applied: Boolean(item.applied),
        timestamp: new Date(item.created_at).getTime()
      }));

      setChatHistory(typeSafeChatMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchChatHistory();
  }, [recipeId]);

  return {
    chatHistory,
    isLoadingHistory,
    refetchChatHistory: fetchChatHistory
  };
};
