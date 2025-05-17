
import { create } from 'zustand';
import type { Recipe } from '@/types/recipe';
import type { QuickRecipeForm } from '@/types/forms';

interface LoadingState {
  step: number;
  stepDescription: string;
  percentComplete: number;
}

interface QuickRecipeStore {
  // Recipe data
  recipe: Recipe | null;
  formData: QuickRecipeForm | null;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  hasTimeoutError: boolean;
  loadingState: LoadingState;
  
  // Navigation
  navigate: ((to: string, options?: any) => void) | null;
  
  // Actions
  setRecipe: (recipe: Recipe | null) => void;
  setFormData: (formData: QuickRecipeForm | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setHasTimeoutError: (hasTimeout: boolean) => void;
  setNavigate: (navigateFn: (to: string, options?: any) => void) => void;
  updateLoadingState: (updaterFn: (currentState: LoadingState) => LoadingState) => void;
  isRecipeValid: () => boolean;
  reset: () => void;
}

export const useQuickRecipeStore = create<QuickRecipeStore>((set, get) => ({
  // Recipe data
  recipe: null,
  formData: null,
  
  // Loading and error states
  isLoading: false,
  error: null,
  hasTimeoutError: false,
  loadingState: {
    step: 0,
    stepDescription: "Analyzing your ingredients...",
    percentComplete: 5
  },
  
  // Navigation
  navigate: null,
  
  // Actions
  setRecipe: (recipe) => set({ recipe }),
  setFormData: (formData) => set({ formData }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setHasTimeoutError: (hasTimeoutError) => set({ hasTimeoutError }),
  setNavigate: (navigateFn) => set({ navigate: navigateFn }),
  
  // Use a callback to safely update loading state
  updateLoadingState: (updaterFn) => set(state => ({ 
    loadingState: updaterFn(state.loadingState) 
  })),
  
  // Validate if recipe has required fields
  isRecipeValid: () => {
    const recipe = get().recipe;
    if (!recipe) return false;
    return !!(recipe.title && recipe.ingredients && recipe.ingredients.length > 0 && recipe.instructions);
  },
  
  // Reset all state
  reset: () => set({ 
    recipe: null, 
    error: null, 
    isLoading: false,
    hasTimeoutError: false,
    loadingState: {
      step: 0,
      stepDescription: "Analyzing your ingredients...",
      percentComplete: 5
    }
  })
}));
