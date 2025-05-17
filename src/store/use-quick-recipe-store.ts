
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
  
  // Actions
  setRecipe: (recipe: Recipe | null) => void;
  setFormData: (formData: QuickRecipeForm | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setHasTimeoutError: (hasTimeout: boolean) => void;
  updateLoadingState: (updaterFn: (currentState: LoadingState) => LoadingState) => void;
  reset: () => void;
}

export const useQuickRecipeStore = create<QuickRecipeStore>((set) => ({
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
  
  // Actions
  setRecipe: (recipe) => set({ recipe }),
  setFormData: (formData) => set({ formData }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setHasTimeoutError: (hasTimeoutError) => set({ hasTimeoutError }),
  
  // Use a callback to safely update loading state
  updateLoadingState: (updaterFn) => set(state => ({ 
    loadingState: updaterFn(state.loadingState) 
  })),
  
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
