
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { updateRecipe } from './utils/update-recipe';
import { updateRecipeUnified } from './utils/unified-recipe-update';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

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

  // Modified to return boolean for compatibility
  const applyChanges = async (chatMessage: ChatMessage): Promise<boolean> => {
    try {
      // First, fetch the current recipe data from the database
      const { data: recipeData, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', chatMessage.recipe_id)
        .single();
        
      if (fetchError || !recipeData) {
        console.error("Error fetching recipe:", fetchError);
        throw new Error("Could not fetch recipe data");
      }
      
      // Transform the raw data to Recipe type with explicit type conversions
      const recipe: Recipe = {
        ...recipeData,
        // Ensure arrays are properly typed
        ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : [],
        instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : [],
        science_notes: Array.isArray(recipeData.science_notes) ? recipeData.science_notes as string[] : []
      } as Recipe;
      
      // Apply the changes
      await applyChangesMutation.mutateAsync({ recipe, chatMessage });
      return true;
    } catch (error) {
      console.error("Error applying changes:", error);
      return false;
    }
  };

  return {
    applyChanges,
    isApplying,
  };
};
