
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
  estimatedTimeRemaining: number;
  isStalled?: boolean;
}

/**
 * Initial loading state
 */
const initialLoadingState: LoadingState = {
  step: 0,
  stepDescription: "Analyzing your ingredients...",
  percentComplete: 0,
  estimatedTimeRemaining: 30,
  isStalled: false
};

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
  completedLoading: boolean;
  
  // Actions
  setRecipe: (recipe: QuickRecipe) => void;
  setFormData: (formData: QuickRecipeFormData) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setNavigate: (navigate: NavigateFunction) => void;
  setHasTimeoutError: (hasTimeoutError: boolean) => void;
  updateLoadingState: (state: Partial<LoadingState>) => void;
  setCompletedLoading: (value: boolean) => void;
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
        loadingState: { ...initialLoadingState },
        completedLoading: false,
        
        // Actions
        setRecipe: (recipe) => {
          // Check if recipe is actually an error object
          if (recipe && 'isError' in recipe && recipe.isError) {
            console.log('Recipe is an error object:', recipe);
            set({ 
              recipe: null,
              error: recipe.error || 'Error generating recipe',
              isLoading: false,
              hasTimeoutError: recipe.error?.toLowerCase().includes('timeout') ?? false
            });
          } else {
            set({ recipe, isLoading: false });
          }
        },
        
        setFormData: (formData) => set({ formData }),
        
        setError: (error) => set({ 
          error, 
          isLoading: false,
          hasTimeoutError: error?.toLowerCase().includes('timeout') ?? false
        }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setNavigate: (navigate) => set({ navigate }),
        
        setHasTimeoutError: (hasTimeoutError) => set({ hasTimeoutError }),
        
        updateLoadingState: (state) => 
          set((prev) => ({ 
            loadingState: { ...prev.loadingState, ...state } 
          })),
        
        setCompletedLoading: (value) => 
          set({ completedLoading: value }),
        
        reset: () => set({ 
          recipe: null, 
          error: null, 
          isLoading: false,
          hasTimeoutError: false,
          completedLoading: false,
          loadingState: { ...initialLoadingState }
        }),
        
        // More lenient validation function
        isRecipeValid: (recipe) => {
          if (!recipe) return false;
          
          // If this is an error recipe object, return false
          if ('isError' in recipe && recipe.isError) {
            console.log('Recipe validation skipped: error object detected');
            return false;
          }
          
          // Less strict validation - try to be permissive
          // Just check that there's a title at minimum
          if (!recipe.title) {
            console.log('Recipe validation: missing title');
            return false;
          }
          
          // Consider valid if we have either ingredients, steps or instructions
          const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
          const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;
          const hasInstructions = Array.isArray(recipe.instructions) && recipe.instructions.length > 0;
          
          if (!hasIngredients && !hasSteps && !hasInstructions) {
            console.log('Recipe validation: missing content (no ingredients, steps, or instructions)');
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
