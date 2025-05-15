
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage, ChatMeta } from '@/types/chat';

/**
 * Custom hook for retrieving chat history for a recipe
 */
export const useChatHistory = (recipeId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recipe-chats', recipeId],
    queryFn: async () => {
      if (!recipeId) {
        console.warn("useChatHistory called without a recipe ID");
        return [];
      }
      
      console.log(`Fetching chat history for recipe ${recipeId}`);
      
      const { data, error } = await supabase
        .from('recipe_chats')
        .select('*')
        .eq('recipe_id', recipeId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Error fetching chat history:", error);
        throw error;
      }
      
      if (!data) {
        return [];
      }

      // Transform the response to match the ChatMessage type
      const chatMessages = data.map((item): ChatMessage => {
        // Handle possible JSON fields
        let meta: ChatMeta = {};
        if (item.meta) {
          meta = typeof item.meta === 'string' ? JSON.parse(item.meta) : item.meta;
        }
        
        let changes_suggested: any = null;
        if (item.changes_suggested) {
          changes_suggested = typeof item.changes_suggested === 'string' 
            ? JSON.parse(item.changes_suggested) 
            : item.changes_suggested;
        }
        
        // Extract follow-up questions from the response if available
        const follow_up_questions: string[] = [];
        
        return {
          id: item.id,
          recipe_id: item.recipe_id,
          user_message: item.user_message,
          ai_response: item.ai_response,
          changes_suggested: changes_suggested,
          source_type: item.source_type,
          source_url: item.source_url,
          source_image: item.source_image,
          applied: item.applied,
          created_at: item.created_at,
          meta: meta,
          follow_up_questions: follow_up_questions
        };
      });
      
      console.log(`Retrieved ${chatMessages.length} chat messages for recipe ${recipeId}`);
      return chatMessages;
    },
    staleTime: 30000, // 30 seconds
    enabled: !!recipeId, // Only run the query if recipeId is provided
  });
  
  return {
    chatHistory: data || [],
    isLoadingHistory: isLoading,
    historyError: error,
    refetchChatHistory: refetch
  };
};
