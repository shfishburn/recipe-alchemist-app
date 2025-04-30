
import { create } from 'zustand';
import { QuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';

interface QuickRecipeStore {
  recipe: QuickRecipe | null;
  isLoading: boolean;
  formData: QuickRecipeFormData | null;
  setRecipe: (recipe: QuickRecipe | null) => void;
  setLoading: (loading: boolean) => void;
  setFormData: (formData: QuickRecipeFormData | null) => void;
  reset: () => void;
}

export const useQuickRecipeStore = create<QuickRecipeStore>((set) => ({
  recipe: null,
  isLoading: false,
  formData: null,
  setRecipe: (recipe) => set({ recipe }),
  setLoading: (isLoading) => set({ isLoading }),
  setFormData: (formData) => set({ formData }),
  reset: () => set({ recipe: null, isLoading: false, formData: null }),
}));
