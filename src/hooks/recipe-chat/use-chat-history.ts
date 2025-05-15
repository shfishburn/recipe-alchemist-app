
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage, ChatMeta } from '@/types/chat';

/**
 * Custom hook for retrieving chat history for a recipe
 */
export const useChatHistory = (recipeId: string) => {
  const fetchChatHistory = async (): Promise<ChatMessage[]> => {
    if (!recipeId) {
      console.warn('No recipe ID provided to useChatHistory');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('recipe_chats')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      // Process and normalize the data
      const normalizedChats = data.map(chat => ({
        id: chat.id,
        recipe_id: chat.recipe_id,
        user_message: chat.user_message,
        ai_response: chat.ai_response,
        changes_suggested: chat.changes_suggested,
        source_type: chat.source_type,
        source_url: chat.source_url,
        source_image: chat.source_image,
        applied: chat.applied,
        created_at: chat.created_at,
        meta: chat.meta as ChatMeta || {},
        follow_up_questions: chat.follow_up_questions || []
      }));
      
      return normalizedChats;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  };

  // Query hook with proper error handling
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['recipe-chats', recipeId],
    queryFn: fetchChatHistory,
    enabled: !!recipeId,
    refetchOnWindowFocus: false,
    retry: 1
  });

  // Enhanced error handling for development debugging
  if (error) {
    console.error('Chat history query error:', error);
  }

  return {
    chatHistory: data,
    isLoadingHistory: isLoading,
    refetchChatHistory: refetch
  };
};
