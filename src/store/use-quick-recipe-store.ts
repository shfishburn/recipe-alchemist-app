
import { create } from 'zustand';
import { QuickRecipe, QuickRecipeFormData } from '@/types/quick-recipe';
import { useNavigate } from 'react-router-dom';

interface LoadingState {
  step: number;
  stepDescription: string;
  percentComplete: number;
  estimatedTimeRemaining?: number;
}

interface QuickRecipeState {
  recipe: QuickRecipe | null;
  formData: QuickRecipeFormData | null;
  isLoading: boolean;
  error: string | null;
  hasTimeoutError: boolean;
  loadingState: LoadingState;
  navigate: ((to: string, options?: any) => void) | null;
  generationInProgress: boolean;
  
  // Actions
  setRecipe: (recipe: QuickRecipe) => void;
  setFormData: (formData: QuickRecipeFormData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasTimeoutError: (hasTimeoutError: boolean) => void;
  setNavigate: (navigate: ((to: string, options?: any) => void)) => void;
  reset: () => void;
  isRecipeValid: () => boolean;
  updateLoadingState: (newState: Partial<LoadingState>) => void;
  setGenerationInProgress: (inProgress: boolean) => void;
}

export const useQuickRecipeStore = create<QuickRecipeState>((set, get) => ({
  recipe: null,
  formData: null,
  isLoading: false,
  error: null,
  hasTimeoutError: false,
  generationInProgress: false,
  loadingState: {
    step: 0,
    stepDescription: 'Analyzing your ingredients...',
    percentComplete: 0,
    estimatedTimeRemaining: 30 // Default 30 seconds estimate
  },
  navigate: null,
  
  // Actions
  setRecipe: (recipe) => set({ recipe }),
  setFormData: (formData) => set({ formData }),
  setLoading: (loading) => set({ 
    isLoading: loading,
    // Reset loading state when turning off loading
    ...(loading === false && {
      loadingState: {
        step: 0,
        stepDescription: 'Analyzing your ingredients...',
        percentComplete: 0,
        estimatedTimeRemaining: 30
      }
    })
  }),
  setError: (error) => set({ error }),
  setHasTimeoutError: (hasTimeoutError) => set({ hasTimeoutError }),
  setNavigate: (navigate) => set({ navigate }),
  setGenerationInProgress: (inProgress) => set({ generationInProgress: inProgress }),
  
  reset: () => set({
    recipe: null,
    isLoading: false,
    error: null,
    hasTimeoutError: false,
    generationInProgress: false,
    loadingState: {
      step: 0,
      stepDescription: 'Analyzing your ingredients...',
      percentComplete: 0,
      estimatedTimeRemaining: 30
    },
    // Don't reset formData as we might need it for retries
  }),
  
  isRecipeValid: () => {
    const { recipe } = get();
    return !!recipe && !recipe.isError && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  },
  
  updateLoadingState: (newState) => set(state => ({
    loadingState: {
      ...state.loadingState,
      ...newState
    }
  }))
}));
