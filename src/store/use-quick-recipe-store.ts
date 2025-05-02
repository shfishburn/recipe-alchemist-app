
import { create } from 'zustand';
import { QuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { NavigateFunction } from 'react-router-dom';

export interface LoadingState {
  step: number;
  totalSteps: number;
  stepDescription: string;
  percentComplete: number;
  estimatedTimeRemaining: number; // in seconds
}

interface QuickRecipeStore {
  recipe: QuickRecipe | null;
  isLoading: boolean;
  error: string | null;
  formData: QuickRecipeFormData | null;
  loadingState: LoadingState;
  completedLoading: boolean;
  navigate: NavigateFunction | null;
  setRecipe: (recipe: QuickRecipe | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFormData: (formData: QuickRecipeFormData | null) => void;
  setNavigate: (navigate: NavigateFunction) => void;
  updateLoadingState: (state: Partial<LoadingState>) => void;
  setCompletedLoading: (completed: boolean) => void;
  reset: () => void;
  isRecipeValid: (recipe: any) => boolean;
}

const initialLoadingState: LoadingState = {
  step: 0,
  totalSteps: 6,
  stepDescription: "Analyzing your ingredients...",
  percentComplete: 0,
  estimatedTimeRemaining: 25 // increased to give more time for generation
};

export const useQuickRecipeStore = create<QuickRecipeStore>((set, get) => ({
  recipe: null,
  isLoading: false,
  error: null,
  formData: null,
  loadingState: initialLoadingState,
  completedLoading: false,
  navigate: null,
  setNavigate: (navigate) => set({ navigate }),
  setRecipe: (recipe) => set({ 
    recipe,
    // If recipe is successfully set, ensure loading is turned off
    ...(recipe ? { isLoading: false } : {})
  }),
  setLoading: (isLoading) => set({ 
    isLoading,
    // Reset loading state when starting a new load
    ...(isLoading ? { 
      loadingState: initialLoadingState,
      completedLoading: false,
      error: null // Clear any previous errors
    } : {})
  }),
  setError: (error) => set({ 
    error,
    // Turn off loading state when there's an error
    ...(error ? { isLoading: false } : {})
  }),
  setFormData: (formData) => set({ formData }),
  updateLoadingState: (state) => set((prev) => ({
    loadingState: { ...prev.loadingState, ...state }
  })),
  setCompletedLoading: (completedLoading) => set({ completedLoading }),
  reset: () => set({ 
    recipe: null, 
    isLoading: false, 
    error: null,
    loadingState: initialLoadingState,
    completedLoading: false
    // Keep formData and navigate as is for regeneration purposes
  }),
  isRecipeValid: (recipe) => {
    if (!recipe) return false;
    
    // Check for required fields
    if (!recipe.title || !Array.isArray(recipe.ingredients) || 
        (!Array.isArray(recipe.steps) && !Array.isArray(recipe.instructions))) {
      console.error("Recipe validation failed: missing required fields", recipe);
      return false;
    }
    
    // Recipe must have at least one ingredient and one step
    if (recipe.ingredients.length === 0 && 
       (recipe.steps?.length === 0 && recipe.instructions?.length === 0)) {
      console.error("Recipe validation failed: no ingredients or steps", recipe);
      return false;
    }
    
    return true;
  }
}));
