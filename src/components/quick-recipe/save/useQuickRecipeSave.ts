
import { useState, useCallback } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { transformRecipeForDB } from './recipe-transform-utils';

export function useQuickRecipeSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecipe, setSavedRecipe] = useState<QuickRecipe | null>(null);
  const { session } = useAuth();
  const navigate = useNavigate();

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
      
      // Transform recipe for database compatibility
      const transformedRecipe = transformRecipeForDB(recipeWithUser);
      
      // Serialize the recipe to handle complex objects and ensure JSON compatibility
      const serializedRecipe = JSON.parse(JSON.stringify(transformedRecipe));
      
      // Implement robust circuit-breaker style retry logic
      const maxRetries = 3;
      let retries = 0;
      let success = false;
      
      while (retries < maxRetries && !success) {
        try {
          console.log("Saving recipe with data:", serializedRecipe);
          const { data, error } = await supabase
            .from('recipes')
            .insert(serializedRecipe)
            .select('id, title, slug')
            .single();
          
          if (error) {
            console.error("Database error:", error);
            throw new Error(`Database error: ${error.message}`);
          }
          
          // Success!
          success = true;
          
          // Load the saved recipe
          if (data) {
            const { data: savedRecipeData, error: fetchError } = await supabase
              .from('recipes')
              .select('*')
              .eq('id', data.id)
              .single();
              
            if (fetchError) {
              console.error("Error fetching saved recipe:", fetchError);
              // Still show success even if we couldn't fetch the complete recipe
              toast.success("Recipe saved successfully!");
            } else {
              console.log("Saved recipe loaded:", savedRecipeData);
              setSavedRecipe(savedRecipeData as unknown as QuickRecipe);
              // Show success toast without the action button
              toast.success("Recipe saved successfully!");
            }
          } else {
            toast.success("Recipe saved successfully!");
          }
          
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
  }, [session, navigate]);
  
  return { saveRecipe, isSaving, savedRecipe };
}
