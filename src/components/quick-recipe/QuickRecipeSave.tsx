
import { useState, useCallback } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export function useQuickRecipeSave() {
  const [isSaving, setIsSaving] = useState(false);
  const { session } = useAuth();

  const saveRecipe = useCallback(async (recipe: QuickRecipe) => {
    try {
      setIsSaving(true);
      
      // Check if user is logged in
      if (!session?.user) {
        toast.error("You need to be logged in to save recipes");
        return;
      }
      
      // Add user ID to the recipe
      const recipeWithUser = {
        ...recipe,
        user_id: session.user.id
      };
      
      // Transform frontend property names to match database column names
      const transformedRecipe = {
        ...recipeWithUser,
        // Map frontend property names to database column names
        prep_time_min: recipeWithUser.prepTime,
        cook_time_min: recipeWithUser.cookTime,
        cooking_tip: recipeWithUser.cookingTip,
      };
      
      // Remove frontend-specific properties to avoid database column mismatch
      if ('prepTime' in transformedRecipe) delete transformedRecipe.prepTime;
      if ('cookTime' in transformedRecipe) delete transformedRecipe.cookTime;
      if ('cookingTip' in transformedRecipe) delete transformedRecipe.cookingTip;
      if ('nutritionHighlight' in transformedRecipe) delete transformedRecipe.nutritionHighlight;
      
      // Serialize the recipe to handle complex objects and ensure JSON compatibility
      const serializedRecipe = JSON.parse(JSON.stringify(transformedRecipe));
      
      // Implement robust circuit-breaker style retry logic
      const maxRetries = 3;
      let retries = 0;
      let success = false;
      
      while (retries < maxRetries && !success) {
        try {
          const { data, error } = await supabase
            .from('recipes')
            .insert(serializedRecipe)
            .select('id')
            .single();
          
          if (error) {
            console.error("Database error:", error);
            throw new Error(`Database error: ${error.message}`);
          }
          
          // Success!
          success = true;
          toast.success("Recipe saved successfully!");
          return data;
          
        } catch (err: any) {
          retries++;
          console.error(`Save attempt ${retries} failed:`, err);
          
          if (retries >= maxRetries) {
            throw err;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, retries) * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
    } catch (error: any) {
      console.error("Error saving recipe:", error);
      toast.error(`Failed to save recipe: ${error.message}`);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [session]);
  
  return { saveRecipe, isSaving };
}
