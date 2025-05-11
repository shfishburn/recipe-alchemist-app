
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { QuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { NavigateFunction } from 'react-router-dom';

/**
 * Interface for the quick recipe store
 */
interface QuickRecipeState {
  // State properties
  recipe: QuickRecipe | null;
  formData: QuickRecipeFormData | null;
  error: string | null;
  isLoading: boolean;
  navigate: NavigateFunction | null;
  hasTimeoutError: boolean;
  
  // Actions
  setRecipe: (recipe: QuickRecipe) => void;
  setFormData: (formData: QuickRecipeFormData) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setNavigate: (navigate: NavigateFunction) => void;
  setHasTimeoutError: (hasTimeoutError: boolean) => void;
  reset: () => void;
  
  // Helper functions
  isRecipeValid: (recipe: any) => boolean;
}

/**
 * Create the store with properly typed middleware
 */
export const useQuickRecipeStore = create<QuickRecipeState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        recipe: null,
        formData: null,
        error: null,
        isLoading: false,
        navigate: null,
        hasTimeoutError: false,
        
        // Actions
        setRecipe: (recipe) => {
          // Check for error conditions to distinguish between error and valid recipe
          if (recipe && (recipe.isError === true || recipe.error_message)) {
            console.log('Recipe contains an error:', recipe.error_message || recipe.error || 'Unknown error');
            set({ 
              // Don't set the recipe if it's an error
              recipe: null,
              // Set the error message for user feedback
              error: recipe.error_message || recipe.error || 'Unknown error',
              isLoading: false,
              hasTimeoutError: (recipe.error_message || recipe.error || '')
                                .toLowerCase().includes('timeout') ?? false
            });
          } else {
            // Only set the recipe if it's valid
            if (get().isRecipeValid(recipe)) {
              set({ recipe, isLoading: false, error: null });
            } else {
              // Invalid recipe format
              set({ 
                recipe: null,
                error: "The recipe format is not valid. Please try again.",
                isLoading: false 
              });
            }
          }
        },
        
        setFormData: (formData) => set({ formData }),
        
        setError: (error) => set({ 
          error, 
          isLoading: false,
          hasTimeoutError: error?.toLowerCase().includes('timeout') ?? false
        }),
        
        setLoading: (isLoading) => {
          // If switching to loading state, reset error
          if (isLoading) {
            set({ isLoading, error: null });
          } else {
            set({ isLoading });
          }
        },
        
        setNavigate: (navigate) => set({ navigate }),
        
        setHasTimeoutError: (hasTimeoutError) => set({ hasTimeoutError }),
        
        reset: () => set({ 
          recipe: null, 
          error: null, 
          isLoading: false,
          hasTimeoutError: false
        }),
        
        // Recipe validation function
        isRecipeValid: (recipe) => {
          if (!recipe) return false;
          
          // Explicitly check for error flags
          if (recipe.isError === true || recipe.error || recipe.error_message) {
            console.log('Recipe validation: has error flags');
            return false;
          }
          
          // Check for title
          if (!recipe.title) {
            console.log('Recipe validation: missing title');
            return false;
          }
          
          // Require ingredients array
          const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
          if (!hasIngredients) {
            console.log('Recipe validation: missing ingredients');
            return false;
          }
          
          // Require steps or instructions
          const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;
          const hasInstructions = Array.isArray(recipe.instructions) && recipe.instructions.length > 0;
          
          if (!hasSteps && !hasInstructions) {
            console.log('Recipe validation: missing steps/instructions');
            return false;
          }
          
          return true;
        }
      }),
      {
        name: 'quick-recipe-storage',
        // Don't persist certain fields that shouldn't be stored between sessions
        partialize: (state) => ({
          recipe: state.recipe,
          formData: state.formData
        })
      }
    )
  )
);

export default useQuickRecipeStore;
