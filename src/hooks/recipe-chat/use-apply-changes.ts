
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ChatMessage } from '@/types/chat';
import type { Recipe } from '@/types/recipe';
import { updateRecipe } from './utils/update-recipe';
import { updateRecipeUnified } from './utils/unified-recipe-update';
import { supabase } from '@/integrations/supabase/client';

interface ApplyChangesOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for applying recipe changes from AI chat responses
 */
export const useApplyChanges = (options: ApplyChangesOptions = {}) => {
  const [isApplying, setIsApplying] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ 
      chatMessage, 
      recipe 
    }: { 
      chatMessage: ChatMessage; 
      recipe: Recipe 
    }) => {
      console.log("Applying changes from chat message:", {
        messageId: chatMessage.id,
        hasRecipeObject: !!chatMessage.recipe,
        hasChangesSuggested: !!chatMessage.changes_suggested,
        recipeId: recipe.id
      });

      try {
        setIsApplying(true);
        let updatedRecipe: Recipe;
        
        if (chatMessage.recipe) {
          // Use the unified approach if we have a complete recipe object
          console.log("Using unified recipe update approach with complete recipe object");
          updatedRecipe = await updateRecipeUnified(recipe, chatMessage);
        } else if (chatMessage.changes_suggested) {
          // Fall back to the legacy approach for partial updates
          console.log("Using legacy recipe update approach with partial changes");
          updatedRecipe = await updateRecipe(recipe, chatMessage);
        } else {
          throw new Error("Chat message contains no changes to apply");
        }
        
        // Mark the chat message as applied in the database
        const { error } = await supabase
          .from('recipe_chats')
          .update({ applied: true })
          .eq('id', chatMessage.id);

        if (error) {
          console.error("Error updating recipe chat applied status:", error);
          // Continue anyway - the recipe update still worked
        }
        
        // Return the updated recipe
        return updatedRecipe;
      } finally {
        setIsApplying(false);
      }
    },
    onSuccess: (updatedRecipe) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['recipe', updatedRecipe.id] });
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', updatedRecipe.id] });
      
      // Call the success callback if provided
      if (options.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error applying changes:", error);
      
      // Call the error callback if provided
      if (options.onError) {
        options.onError(error as Error);
      }
    }
  });

  const applyChanges = async (chatMessage: ChatMessage) => {
    // Ensure we have the latest recipe data
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', chatMessage.recipe_id)
      .single();

    if (recipeError) {
      console.error("Error fetching recipe:", recipeError);
      throw new Error("Could not fetch recipe data");
    }

    // Apply the changes
    const result = await mutation.mutateAsync({ 
      chatMessage, 
      recipe: recipeData as Recipe 
    });
    
    return !!result;
  };

  return {
    applyChanges,
    isApplying
  };
};
