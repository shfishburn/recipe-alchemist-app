
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage, ChangesResponse, ChatMeta } from '@/types/chat';

/**
 * Hook for fetching and processing chat history for a recipe
 */
export const useChatHistory = (recipeId: string) => {
  const { data: chatHistory = [], isLoading: isLoadingHistory, refetch } = useQuery({
    queryKey: ['recipe-chats', recipeId],
    queryFn: async () => {
      console.log(`Fetching chat history for recipe ${recipeId}`);
      
      // Validate recipe ID to prevent API errors
      if (!recipeId) {
        console.warn("Missing recipe ID in useChatHistory");
        return [];
      }
      
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
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} chat messages for recipe ${recipeId}`);
      } else {
        console.log(`No existing chat history for recipe ${recipeId}`);
      }
      
      // Process the chat messages to handle follow_up_questions and changes_suggested
      return data.map(chat => {
        // Initialize chat message with default values
        const chatMessage: ChatMessage = {
          id: chat.id,
          user_message: chat.user_message,
          ai_response: chat.ai_response,
          changes_suggested: null,
          applied: chat.applied || false,
          created_at: chat.created_at,
          follow_up_questions: [], // Default empty array
          meta: (typeof chat.meta === 'object' ? chat.meta || {} : {}) as ChatMeta // Ensure meta is always a valid object
        };

        // Process changes_suggested as a properly typed object
        if (chat.changes_suggested) {
          try {
            // Ensure changes_suggested is properly typed
            chatMessage.changes_suggested = chat.changes_suggested as unknown as ChangesResponse;
          } catch (e) {
            console.error("Error processing changes_suggested data:", e);
          }
        }
        
        // Check if the chat response has followUpQuestions in the response data
        if (typeof chat.ai_response === 'string') {
          try {
            // Try to extract follow-up questions from the AI response if they exist
            const responseObj = JSON.parse(chat.ai_response);
            if (responseObj && Array.isArray(responseObj.followUpQuestions)) {
              chatMessage.follow_up_questions = responseObj.followUpQuestions;
            }
          } catch (e) {
            // If parsing fails, just continue with the empty array
          }
        }
        
        return chatMessage;
      });
    },
    refetchOnWindowFocus: false,
    staleTime: 5000, // Don't refetch too often to avoid flickering
  });

  return {
    chatHistory,
    isLoadingHistory,
    refetchChatHistory: refetch
  };
};
