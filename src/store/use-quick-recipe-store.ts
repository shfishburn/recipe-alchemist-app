
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { QuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { NavigateFunction } from 'react-router-dom';

interface LoadingState {
  step: number;
  stepDescription: string;
  percentComplete: number;
  estimatedTimeRemaining: number;
}

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

// Create the store with properly typed middleware
export const useQuickRecipeStore = create<QuickRecipeState>()(
  devtools(
    persist(
      (set, get) => ({
        recipe: null,
        formData: null,
        error: null,
        isLoading: false,
        navigate: null,
        hasTimeoutError: false,
        loadingState: {
          step: 0,
          stepDescription: "Analyzing your ingredients...",
          percentComplete: 0,
          estimatedTimeRemaining: 30,
        },
        completedLoading: false,
        
        setRecipe: (recipe) => set({ recipe, isLoading: false }),
        setFormData: (formData) => set({ formData }),
        setError: (error) => set({ error, isLoading: false }),
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
          loadingState: {
            step: 0,
            stepDescription: "Analyzing your ingredients...",
            percentComplete: 0,
            estimatedTimeRemaining: 30
          }
        }),
        
        isRecipeValid: (recipe) => {
          if (!recipe) return false;
          
          const requiredFields = ['title', 'ingredients', 'steps'];
          for (const field of requiredFields) {
            if (!recipe[field]) {
              console.error(`Recipe validation failed: missing ${field}`);
              return false;
            }
          }
          
          if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
            console.error('Recipe validation failed: ingredients is not a valid array');
            return false;
          }
          
          if (!Array.isArray(recipe.steps) && !Array.isArray(recipe.instructions)) {
            console.error('Recipe validation failed: neither steps nor instructions is a valid array');
            return false;
          }
          
          return true;
        }
      }),
      {
        name: 'quick-recipe-storage',
      }
    )
  )
);
