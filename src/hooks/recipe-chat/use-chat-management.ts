
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for chat management operations like clearing chat history
 */
export const useChatManagement = (
  recipeId: string,
  refetchChatHistory: () => Promise<any>,
  clearOptimisticMessages: () => void
) => {
  const { toast } = useToast();

  const clearChatHistory = async () => {
    try {
      console.log("Clearing chat history for recipe:", recipeId);
      
      // Soft delete all chat messages for this recipe
      const { error } = await supabase
        .from('recipe_chats')
        .update({ deleted_at: new Date().toISOString() })
        .eq('recipe_id', recipeId)
        .is('deleted_at', null);
        
      if (error) {
        console.error("Error clearing chat history:", error);
        throw error;
      }
      
      // Clear any optimistic messages
      clearOptimisticMessages();
      
      // Refetch chat history to update UI
      await refetchChatHistory();
      
      toast({
        title: "Chat cleared",
        description: "Chat history has been cleared successfully",
      });
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
    }
  };

  return {
    clearChatHistory
  };
};
