
import { useState, useCallback } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { authStateManager, PendingActionType } from '@/lib/auth/auth-state-manager';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecipeDataRecovery } from '@/hooks/use-recipe-data-recovery';
import { transformRecipeForDB } from './utils/recipe-transform';
import { useSaveRecipeState } from './hooks/use-save-recipe-state';

// Define the save-recipe action type
const SAVE_RECIPE_ACTION: PendingActionType = 'save-recipe';

export function useQuickRecipeSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecipe, setSavedRecipe] = useState<QuickRecipe | null>(null);
  const { session } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  const navigate = useNavigate();
  const location = useLocation();
  const { storeRecipeWithId, ensureRecipeHasId, getRecipeIdFromUrl } = useRecipeDataRecovery();
  const { storeRecipeForAuth, clearStoredRecipes } = useSaveRecipeState();

  const saveRecipe = useCallback(async (recipe: QuickRecipe, bypassAuth = false) => {
    try {
      setIsSaving(true);
      
      // Check if user is logged in
      if (!session?.user && !bypassAuth) {
        // Handle auth flow
        const recipeId = ensureRecipeHasId(recipe);
        storeRecipeForAuth(recipe, recipeId, location.pathname);
        
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
      }
      
      // Add user ID to the recipe
      const recipeWithUser = {
        ...recipe,
        user_id: session?.user?.id || null  // Allow null for special cases that bypass auth
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
          
          // Clear data after successful save
          clearStoredRecipes();
          
          // Load the saved recipe
          setSavedRecipe(recipe);
          
          // Return success data including the slug for navigation
          return data;
        } catch (err) {
          retries++;
          console.error(`Error saving recipe (attempt ${retries}/${maxRetries}):`, err);
          
          if (retries >= maxRetries) {
            throw err;
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
        }
      }
      
      // Should never reach here due to success or throw in the loop
      return null;
    } catch (error) {
      console.error("Failed to save recipe:", error);
      throw error; // Re-throw for the caller to handle
    } finally {
      setIsSaving(false);
    }
  }, [session, openAuthDrawer, ensureRecipeHasId, storeRecipeWithId, getRecipeIdFromUrl, 
      storeRecipeForAuth, clearStoredRecipes]);

  return {
    saveRecipe,
    isSaving,
    savedRecipe
  };
}
