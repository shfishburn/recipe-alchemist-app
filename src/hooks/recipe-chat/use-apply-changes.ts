
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { updateRecipe } from './utils/update-recipe';
import { QuickRecipe } from '@/types/quick-recipe';
import { ChatMessage } from '@/types/chat';
import { useBuildId } from '@/hooks/use-build-id';

/**
 * Hook for applying changes suggested by AI to a recipe
 */
export const useApplyChanges = () => {
  const [isApplying, setIsApplying] = useState(false);
  const { updateBuildId } = useBuildId();

  /**
   * Apply changes from the chat message to the recipe
   */
  const applyChanges = async (recipe: QuickRecipe, chatMessage: ChatMessage): Promise<boolean> => {
    if (!recipe || !chatMessage) {
      toast.error("Cannot apply changes: Missing recipe or chat data");
      return false;
    }

    try {
      setIsApplying(true);
      
      console.log("Applying changes from chat message:", {
        messageId: chatMessage.id,
        hasSuggestedChanges: !!chatMessage.changes_suggested,
      });
      
      // Update the recipe with the changes
      const updatedRecipe = await updateRecipe(recipe, chatMessage);
      
      // Mark the chat message as applied
      if (chatMessage.id) {
        await supabase
          .from('recipe_chats')
          .update({ applied: true })
          .eq('id', chatMessage.id);
      }
      
      // Update the build ID to trigger a refresh
      updateBuildId();
      
      // Show success message
      toast.success("Recipe updated successfully");
      console.log("Recipe updated successfully");
      
      return true;
    } catch (error) {
      console.error("Error applying changes:", error);
      
      toast.error(error instanceof Error ? error.message : "Failed to apply changes");
      return false;
    } finally {
      setIsApplying(false);
    }
  };

  return { applyChanges, isApplying };
};
