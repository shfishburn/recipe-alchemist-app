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
  hasTimeoutError: () => boolean;
}

const initialLoadingState: LoadingState = {
  step: 0,
  totalSteps: 6,
  stepDescription: "Analyzing your ingredients...",
  percentComplete: 0,
  estimatedTimeRemaining: 35 // increased timeout for recipe generation
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
    ...(recipe ? { isLoading: false, completedLoading: true } : {})
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
    ...(error ? { isLoading: false, completedLoading: false } : {})
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
    if (!recipe) {
      console.error("Recipe validation failed: recipe is null or undefined");
      return false;
    }
    
    // Check for required fields
    if (!recipe.title) {
      console.error("Recipe validation failed: missing title", recipe);
      return false;
    }

    // Check ingredients
    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      console.error("Recipe validation failed: missing or empty ingredients array", recipe);
      return false;
    }
    
    // Check instructions/steps
    const hasInstructions = Array.isArray(recipe.instructions) && recipe.instructions.length > 0;
    const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;
    
    if (!hasInstructions && !hasSteps) {
      console.error("Recipe validation failed: missing or empty instructions/steps", recipe);
      return false;
    }
    
    return true;
  },
  hasTimeoutError: () => {
    const { error } = get();
    return error?.toLowerCase().includes('timeout') || false;
  }
}));
