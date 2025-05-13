
import { useState, useCallback } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { authStateManager, PendingActionType } from '@/lib/auth/auth-state-manager';

// Define which fields are valid in the database and their mappings
const FIELD_MAPPINGS = {
  // Frontend camelCase to database snake_case mappings
  prepTime: 'prep_time_min',
  cookTime: 'cook_time_min',
  cookingTip: 'cooking_tip',
  flavorTags: 'flavor_tags',
  scienceNotes: 'science_notes',
  steps: 'instructions', // Map steps to instructions (they're the same content)
  description: 'tagline', // Map description to tagline since description doesn't exist in DB
};

// Define a whitelist of valid database column names
const VALID_DB_FIELDS = [
  'id',
  'title',
  'tagline', // Only tagline exists in DB, not description
  'ingredients',
  'instructions',
  'steps', // This will be transformed to instructions
  'servings',
  'prep_time_min',
  'cook_time_min',
  'nutrition',
  'cooking_tip',
  'cuisine',
  'dietary',
  'flavor_tags',
  'science_notes',
  'chef_notes',
  'image_url',
  'reasoning',
  'original_request',
  'version_number',
  'previous_version_id',
  'deleted_at',
  'created_at',
  'updated_at',
  'slug',
  'nutri_score',
  'cuisine_category',
  'user_id'
];

// Define the save-recipe action type
const SAVE_RECIPE_ACTION: PendingActionType = 'save-recipe';

/**
 * Helper function to transform recipe data to match database schema
 */
function transformRecipeForDB(recipe: any): Record<string, any> {
  const transformedRecipe: Record<string, any> = {};
  
  // Process all keys from the recipe
  for (const key in recipe) {
    // Skip null or undefined values
    if (recipe[key] === null || recipe[key] === undefined) {
      continue;
    }
    
    // Skip functions and unsupported types
    if (typeof recipe[key] === 'function' || typeof recipe[key] === 'symbol') {
      continue;
    }
    
    // Check if we need to remap this field
    const remappedKey = FIELD_MAPPINGS[key as keyof typeof FIELD_MAPPINGS] || key;
    
    // Only include fields that are valid in the database
    if (VALID_DB_FIELDS.includes(remappedKey)) {
      // Special case: handle steps -> instructions mapping
      if (key === 'steps' && Array.isArray(recipe[key])) {
        transformedRecipe['instructions'] = recipe[key];
      } else {
        transformedRecipe[remappedKey] = recipe[key];
      }
    }
  }
  
  return transformedRecipe;
}

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
          
          // Also store in localStorage as a fallback mechanism
          authStateManager.storeRecipeDataFallback(recipe);
          
          console.log("Stored recipe save request with action ID:", actionId);
          
          // Store the current URL for more robust state preservation
          const currentUrl = window.location.pathname;
          authStateManager.setRedirectAfterAuth(currentUrl, {
            state: { 
              pendingSave: true,
              resumingAfterAuth: true,
              timestamp: Date.now()
            }
          });
          
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
          
          // Clear any fallbacks since save succeeded
          authStateManager.clearRecipeDataFallback();
          
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
  }, [session, openAuthDrawer]);

  return {
    saveRecipe,
    isSaving,
    savedRecipe
  };
}
