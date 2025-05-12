
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
      
      // Map fields to match database schema
      // Transform prepTime/cookTime to prep_time_min/cook_time_min
      const transformedRecipe = {
        ...recipeWithUser,
        // Map the time fields to database column names
        prep_time_min: recipeWithUser.prepTime || recipeWithUser.prep_time_min,
        cook_time_min: recipeWithUser.cookTime || recipeWithUser.cook_time_min,
        // Remove fields that don't exist in the database schema
        prepTime: undefined,
        cookTime: undefined,
      };
      
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
            throw error;
          }
          
          // Success!
          success = true;
          toast.success("Recipe saved successfully!");
          return data;
          
        } catch (err) {
          retries++;
          
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
