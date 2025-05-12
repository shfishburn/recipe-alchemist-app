import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { QuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { NavigateFunction } from 'react-router-dom';

/**
 * Interface for the loading state
 */
interface LoadingState {
  step: number;
  stepDescription: string;
  percentComplete: number;
  estimatedTimeRemaining?: number;
}

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
  loadingState: LoadingState;
  
  // Actions
  setRecipe: (recipe: QuickRecipe) => void;
  setFormData: (formData: QuickRecipeFormData) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setNavigate: (navigate: NavigateFunction) => void;
  setHasTimeoutError: (hasTimeoutError: boolean) => void;
  updateLoadingState: (loadingState: Partial<LoadingState>) => void;
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
        loadingState: {
          step: 0,
          stepDescription: "Initializing...",
          percentComplete: 0
        },
        
        /**
         * @locked
         * DO NOT MODIFY WITHOUT APPROVAL — S. Fishburn, 2025-05-12
         * Reason: Critical state management logic that handles validation,
         * error categorization, and state transitions for recipe generation.
         */
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
        
        /**
         * @locked
         * DO NOT MODIFY WITHOUT APPROVAL — S. Fishburn, 2025-05-12
         * Reason: Error handling logic that includes timeout detection.
         */
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
        
        updateLoadingState: (loadingState) => set((state) => ({
          loadingState: {
            ...state.loadingState,
            ...loadingState
          }
        })),
        
        reset: () => set({ 
          recipe: null, 
          error: null, 
          isLoading: false,
          hasTimeoutError: false
        }),
        
        /**
         * @locked
         * DO NOT MODIFY WITHOUT APPROVAL — S. Fishburn, 2025-05-12
         * Reason: Critical validation logic that ensures only valid recipes are
         * accepted and displayed to users.
         */
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
