
import { create } from 'zustand';
import { QuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';

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
  setRecipe: (recipe: QuickRecipe | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFormData: (formData: QuickRecipeFormData | null) => void;
  updateLoadingState: (state: Partial<LoadingState>) => void;
  setCompletedLoading: (completed: boolean) => void;
  reset: () => void;
}

const initialLoadingState: LoadingState = {
  step: 0,
  totalSteps: 4,
  stepDescription: "Initializing...",
  percentComplete: 0,
  estimatedTimeRemaining: 15 // default 15 seconds
};

export const useQuickRecipeStore = create<QuickRecipeStore>((set) => ({
  recipe: null,
  isLoading: false,
  error: null,
  formData: null,
  loadingState: initialLoadingState,
  completedLoading: false,
  setRecipe: (recipe) => set({ recipe }),
  setLoading: (isLoading) => set({ 
    isLoading,
    // Reset loading state when starting a new load
    ...(isLoading ? { 
      loadingState: initialLoadingState,
      completedLoading: false 
    } : {})
  }),
  setError: (error) => set({ error }),
  setFormData: (formData) => set({ formData }),
  updateLoadingState: (state) => set((prev) => ({
    loadingState: { ...prev.loadingState, ...state }
  })),
  setCompletedLoading: (completedLoading) => set({ completedLoading }),
  reset: () => set({ 
    recipe: null, 
    isLoading: false, 
    error: null, 
    formData: null,
    loadingState: initialLoadingState,
    completedLoading: false
  }),
}));
