
import { useState, useCallback } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { authStateManager, PendingActionType } from '@/lib/auth/auth-state-manager';
import { transformRecipeForDb } from '@/utils/db-transformers';
import { asDbRecipeInsert } from '@/types/database';

// Define the save-recipe action type
const SAVE_RECIPE_ACTION: PendingActionType = 'save-recipe';

export function useQuickRecipeSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecipe, setSavedRecipe] = useState<QuickRecipe | null>(null);
  const { session } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();

  const saveRecipe = useCallback(async (recipe: QuickRecipe, bypassAuth = false) => {
    try {
      setIsSaving(true);
      
      // Check if user is logged in
      if (!session?.user && !bypassAuth) {
        // Store the current recipe in authStateManager before redirecting to auth
        try {
          // Queue the action using authStateManager
          const actionId = authStateManager.queueAction({
            type: SAVE_RECIPE_ACTION,
            data: { recipe },
            sourceUrl: window.location.pathname
          });
          
          console.log("Stored recipe save request with action ID:", actionId);
          
          toast.info("Please sign in to save your recipe", { 
            duration: 4000,
            action: {
              label: "Sign In",
              onClick: openAuthDrawer
            }
          });
          
          // Open auth drawer
          openAuthDrawer();
          
          setIsSaving(false);
          return null;
        } catch (err) {
          console.error("Error storing recipe for auth:", err);
          toast.error("Unable to prepare recipe for saving");
          setIsSaving(false);
          return null;
        }
      }
      
      // Add user ID to the recipe
      const recipeWithUser = {
        ...recipe,
        user_id: session?.user?.id || null  // Allow null for special cases that bypass auth
      };
      
      // Transform recipe for database compatibility using our utility
      // This handles ingredient type conversion and other normalizations
      const recipeForDb = transformRecipeForDb(recipeWithUser);
      
      // Cast the transformed recipe to the specific database type
      const dbRecipe = asDbRecipeInsert(recipeForDb);
      
      // Implement robust circuit-breaker style retry logic
      const maxRetries = 3;
      let retries = 0;
      let success = false;
      
      while (retries < maxRetries && !success) {
        try {
          console.log("Saving recipe with data:", dbRecipe);
          const { data, error } = await supabase
            .from('recipes')
            .insert(dbRecipe)
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
  }, [session, openAuthDrawer]);
  
  return { saveRecipe, isSaving, savedRecipe };
}
