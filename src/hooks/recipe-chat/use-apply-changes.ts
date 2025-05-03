
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useRecipes } from '@/hooks/use-recipes';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { updateRecipe } from './utils/update-recipe';
import { validateRecipeUpdate } from './utils/validation/validate-recipe-update';
import { ChatMessage } from '@/types/chat';

export const useApplyChanges = () => {
  const { toast } = useToast();
  const { refetch: refetchRecipes } = useRecipes();
  const { refetch: refetchRecipeDetail } = useRecipeDetail();
  const [isTimeoutExceeded, setIsTimeoutExceeded] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ recipeId, changes, originalRecipe }: { 
      recipeId: string, 
      changes: ChatMessage, 
      originalRecipe: Recipe 
    }) => {
      if (!recipeId || !changes) {
        console.warn("No recipe ID or changes provided.");
        return false;
      }

      console.log("Applying changes:", { 
        recipeId, 
        changeTitle: changes.changes_suggested?.title,
        changeIngredients: changes.changes_suggested?.ingredients ? 'present' : 'none',
        changeInstructions: changes.changes_suggested?.instructions ? 'present' : 'none',
      });
      
      // Set a timeout to detect stuck operations
      const timeoutId = setTimeout(() => {
        setIsTimeoutExceeded(true);
        console.warn("Apply changes operation timeout threshold exceeded");
      }, 15000);

      try {
        // Validate updates before applying
        const validationResult = validateRecipeUpdate(originalRecipe, changes.changes_suggested);
        if (!validationResult) {
          clearTimeout(timeoutId);
          toast({
            title: "Validation Error",
            description: "Failed to validate updates.",
            variant: "destructive",
          });
          return false;
        }

        // Process and apply updates to the recipe
        const updatedRecipe = await updateRecipe(originalRecipe, changes);

        // Revalidate cache after successful update
        await Promise.all([
          refetchRecipes(),
          recipeId ? refetchRecipeDetail() : Promise.resolve()
        ]);
        
        clearTimeout(timeoutId);
        setIsTimeoutExceeded(false);

        toast({
          title: "Recipe Updated",
          description: "Your recipe has been successfully updated.",
        });

        return true;
      } catch (error) {
        clearTimeout(timeoutId);
        setIsTimeoutExceeded(false);
        console.error("Error applying changes:", error);
        toast({
          title: "Update Failed",
          description: "Failed to update recipe. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    },
    onError: (error) => {
      setIsTimeoutExceeded(false);
      console.error("Recipe chat mutation error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  });

  const applyChanges = useCallback((chat: ChatMessage): Promise<boolean> => {
    if (!chat.recipe_id) {
      console.error("Missing recipe ID in chat message");
      return Promise.resolve(false);
    }
    
    // Reset state
    setIsTimeoutExceeded(false);
    
    // We need the original recipe for the update
    return new Promise<boolean>((resolve, reject) => {
      // Set a timeout for the entire operation
      const operationTimeout = setTimeout(() => {
        console.error("Total operation timeout exceeded");
        setIsTimeoutExceeded(true);
        resolve(false);
      }, 30000);
      
      supabase
        .from('recipes')
        .select('*')
        .eq('id', chat.recipe_id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching recipe:", error);
            clearTimeout(operationTimeout);
            resolve(false);
            return;
          }
          
          // Cast the data to Recipe type to ensure type safety
          const recipeData = data as unknown as Recipe;
          
          mutation.mutateAsync({ 
            recipeId: chat.recipe_id as string, 
            changes: chat, 
            originalRecipe: recipeData 
          })
          .then(result => {
            clearTimeout(operationTimeout);
            resolve(result);
          })
          .catch(err => {
            console.error("Error in mutation:", err);
            clearTimeout(operationTimeout);
            resolve(false);
          });
        })
        .catch(err => {
          console.error("Error fetching recipe:", err);
          clearTimeout(operationTimeout);
          resolve(false);
        });
    });
  }, [mutation]);

  return { applyChanges, isPending: mutation.isPending, isTimeoutExceeded };
};
