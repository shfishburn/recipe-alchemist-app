
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { updateRecipe } from './utils/update-recipe';
import { updateRecipeUnified } from './utils/unified-recipe-update';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

/**
 * Helper function to convert database types to Recipe type
 */
function convertToRecipeType(data: any): Recipe {
  return {
    ...data,
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    instructions: Array.isArray(data.instructions) ? data.instructions : [],
    science_notes: Array.isArray(data.science_notes) ? data.science_notes : []
  } as Recipe;
}

export const useApplyChanges = () => {
  const [isApplying, setIsApplying] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const applyChangesMutation = useMutation({
    mutationFn: async ({
      recipe,
      chatMessage,
    }: {
      recipe: Recipe;
      chatMessage: ChatMessage;
    }) => {
      setIsApplying(true);
      
      try {
        let updatedRecipe: Recipe;
        
        // Check if this is a unified recipe update (complete recipe) or a partial update
        if (chatMessage.recipe) {
          console.log('Applying unified recipe update with complete recipe object');
          updatedRecipe = await updateRecipeUnified(recipe, chatMessage);
        } else if (chatMessage.changes_suggested) {
          console.log('Applying partial recipe update with changes_suggested');
          updatedRecipe = await updateRecipe(recipe, chatMessage);
        } else {
          throw new Error('No changes to apply - message contains neither recipe nor changes_suggested');
        }
        
        // Mark the chat message as applied in the database
        const { error } = await supabase
          .from('recipe_chats')
          .update({ applied: true })
          .eq('id', chatMessage.id);
          
        if (error) {
          console.error('Error marking chat as applied:', error);
        }
        
        return updatedRecipe;
      } catch (error) {
        console.error('Error applying changes:', error);
        throw error;
      } finally {
        setIsApplying(false);
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['recipe', data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['recipe-chats', variables.recipe.id],
      });
      
      // Show success toast
      toast({
        title: 'Changes applied successfully',
        description: 'The recipe has been updated with the suggested changes.',
      });
    },
    onError: (error, variables) => {
      // Show error toast
      toast({
        title: 'Failed to apply changes',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });

  // Modified to guarantee recipe_id is properly used and provide better error messages
  const applyChanges = async (chatMessage: ChatMessage): Promise<boolean> => {
    try {
      // Validate the required recipe_id is present
      const recipeId = chatMessage.recipe_id || (chatMessage.meta && chatMessage.meta.recipe_id);
      
      if (!recipeId) {
        console.error("Missing recipe_id in chat message:", chatMessage);
        throw new Error("Cannot apply changes: recipe_id is missing from chat message");
      }
      
      console.log("Fetching recipe with ID:", recipeId);
      
      // First, fetch the current recipe data from the database
      const { data: recipeData, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching recipe:", fetchError);
        throw new Error(`Could not fetch recipe data: ${fetchError.message}`);
      }
      
      if (!recipeData) {
        throw new Error("Recipe not found with the provided ID");
      }
      
      // Transform the raw data to Recipe type with explicit type conversions
      const recipe = convertToRecipeType(recipeData);
      
      // Apply the changes
      await applyChangesMutation.mutateAsync({ recipe, chatMessage });
      return true;
    } catch (error) {
      console.error("Error applying changes:", error);
      throw error; // Rethrow to allow proper handling in UI
    }
  };

  return {
    applyChanges,
    isApplying,
  };
};
