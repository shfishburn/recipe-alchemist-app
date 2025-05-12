
import { create } from 'zustand';

interface AuthContextState {
  // Context information
  context: 'recipe-save' | 'general' | null;
  returnPath: string | null;
  formData: any | null;
  recipe: any | null;
  
  // Actions
  setContext: (context: 'recipe-save' | 'general' | null, options?: {
    returnPath?: string | null;
    formData?: any | null;
    recipe?: any | null;
  }) => void;
  clearContext: () => void;
}

/**
 * Store for maintaining auth context between pages/components
 * This is used to provide context-aware auth messaging and return paths
 */
export const useAuthContext = create<AuthContextState>((set) => ({
  // Initial state
  context: null,
  returnPath: null,
  formData: null,
  recipe: null,
  
  // Set auth context with optional parameters
  setContext: (context, options = {}) => set({
    context,
    returnPath: options.returnPath || null,
    formData: options.formData || null,
    recipe: options.recipe || null,
  }),
  
  // Clear all context data
  clearContext: () => set({
    context: null,
    returnPath: null,
    formData: null,
    recipe: null
  })
}));

export default useAuthContext;
