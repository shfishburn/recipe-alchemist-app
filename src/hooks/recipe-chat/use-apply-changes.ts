
import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useRecipes } from '@/hooks/use-recipes';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { updateRecipe } from './utils/update-recipe';
import { validateRecipeUpdate } from './utils/validation/validate-recipe-update';
import { standardizeNutrition } from '@/types/nutrition-utils';

interface Update {
  path: string;
  value: any;
}

export const useApplyChanges = () => {
  const { toast } = useToast();
  const { refetch: refetchRecipes } = useRecipes();
  const { refetch: refetchRecipeDetail } = useRecipeDetail();

  const mutation = useMutation({
    mutationFn: async ({ recipeId, updates, originalRecipe }: { 
      recipeId: string, 
      updates: Update[], 
      originalRecipe: Recipe 
    }) => {
      if (!recipeId || !updates || updates.length === 0) {
        console.warn("No recipe ID or updates provided.");
        return false;
      }

      // Validate updates before applying
      const validationResult = validateRecipeUpdate(originalRecipe, updates);
      if (!validationResult) {
        toast({
          title: "Validation Error",
          description: "Failed to validate updates.",
          variant: "destructive",
        });
        return false;
      }

      // Optimistically apply updates to local state
      let updatedRecipe = { ...originalRecipe };
      updates.forEach(update => {
        updatedRecipe = updateRecipe(updatedRecipe, update.path, update.value);
      });

      // Standardize nutrition data after applying updates
      if (updatedRecipe.nutrition) {
        updatedRecipe.nutrition = standardizeNutrition(updatedRecipe.nutrition);
      }

      // Send updates to Supabase
      const { error } = await supabase
        .from('recipes')
        .update(updatedRecipe)
        .eq('id', recipeId);

      if (error) {
        console.error("Failed to update recipe in Supabase:", error);
        toast({
          title: "Update Failed",
          description: "Failed to update recipe. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Revalidate cache
      await refetchRecipes();
      await refetchRecipeDetail(recipeId);

      toast({
        title: "Recipe Updated",
        description: "Your recipe has been successfully updated.",
      });

      return true;
    },
    onError: (error) => {
      console.error("Error applying changes:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  });

  const applyChanges = useCallback((recipeId: string, updates: Update[], originalRecipe: Recipe) => {
    return mutation.mutateAsync({ recipeId, updates, originalRecipe });
  }, [mutation]);

  return { applyChanges, isPending: mutation.isPending };
};
