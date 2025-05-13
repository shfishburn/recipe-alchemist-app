
import { useState, useEffect, useCallback } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { QuickRecipe } from '@/types/quick-recipe';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';

// Define type for recipe recovery status
type RecoveryStatus = 'pending' | 'success' | 'failed' | 'idle';

/**
 * Hook for managing recipe data recovery across navigation and auth flows
 */
export function useRecipeDataRecovery() {
  const [recipeRecoveryStatus, setRecoveryStatus] = useState<RecoveryStatus>('idle');
  const location = useLocation();
  const setRecipe = useQuickRecipeStore(state => state.setRecipe);
  const recipe = useQuickRecipeStore(state => state.recipe);
  
  /**
   * Generates a unique ID for a recipe
   */
  const generateRecipeId = useCallback(() => {
    return uuidv4().slice(0, 8); // Short UUID for URL friendliness
  }, []);
  
  /**
   * Gets the recipe ID from the URL if present
   */
  const getRecipeIdFromUrl = useCallback(() => {
    // Check for ID in path params (for routes like /recipe-preview/:id)
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'recipe-preview') {
      const urlId = pathParts[2];
      if (urlId && urlId.length > 0) {
        return urlId;
      }
    }
    
    // Check for ID in query params (for routes like /recipe-preview?id=123)
    const urlParams = new URLSearchParams(location.search);
    const paramId = urlParams.get('id');
    
    // Return the ID if it exists
    return paramId;
  }, [location]);
  
  /**
   * Validates if an object is a valid QuickRecipe
   */
  const isValidQuickRecipe = useCallback((recipe: unknown): recipe is QuickRecipe => {
    if (!recipe || typeof recipe !== 'object') return false;
    
    const r = recipe as Partial<QuickRecipe>;
    return (
      typeof r.title === 'string' && 
      Array.isArray(r.ingredients) && 
      (typeof r.servings === 'number' || r.servings === undefined)
    );
  }, []);
  
  /**
   * Stores recipe data with an ID in localStorage
   */
  const storeRecipeWithId = useCallback((recipe: QuickRecipe, id?: string) => {
    try {
      const recipeId = id || generateRecipeId();
      
      // Store recipe with ID in localStorage
      localStorage.setItem(`recipe_${recipeId}`, JSON.stringify({
        recipe,
        timestamp: Date.now()
      }));
      
      console.log(`Stored recipe '${recipe.title}' with ID: ${recipeId}`);
      return recipeId;
    } catch (error) {
      console.error('Failed to store recipe with ID:', error);
      return null;
    }
  }, [generateRecipeId]);
  
  /**
   * Retrieves recipe data by ID from localStorage
   */
  const getRecipeById = useCallback((id: string): QuickRecipe | null => {
    try {
      if (!id) {
        console.log("No recipe ID provided for retrieval");
        return null;
      }
      
      const storedData = localStorage.getItem(`recipe_${id}`);
      if (!storedData) {
        console.log(`No stored recipe found for ID: ${id}`);
        return null;
      }
      
      const parsedData = JSON.parse(storedData);
      if (isValidQuickRecipe(parsedData.recipe)) {
        console.log(`Retrieved recipe with ID: ${id}`);
        return parsedData.recipe as QuickRecipe;
      }
      
      console.log(`Invalid recipe data for ID: ${id}`);
      return null;
    } catch (error) {
      console.error(`Failed to retrieve recipe with ID: ${id}`, error);
      return null;
    }
  }, [isValidQuickRecipe]);
  
  /**
   * Attempts to recover recipe data from various sources
   */
  const attemptRecipeRecovery = useCallback(() => {
    // Don't attempt recovery if we already have a recipe
    if (recipe) {
      console.log('Recipe already exists in store, no need for recovery');
      return true;
    }
    
    setRecoveryStatus('pending');
    console.log('Attempting recipe recovery...');
    
    try {
      // Check for recipe ID in URL
      const recipeId = getRecipeIdFromUrl();
      
      if (recipeId) {
        console.log(`Found recipe ID in URL: ${recipeId}`);
        const recipeFromId = getRecipeById(recipeId);
        
        if (recipeFromId) {
          setRecipe(recipeFromId);
          console.log("Recipe recovered from URL ID:", recipeFromId.title);
          setRecoveryStatus('success');
          return true;
        } else {
          console.log(`No valid recipe found for ID: ${recipeId}`);
        }
      }
      
      // If ID-based approach failed, try fallback strategies
      
      // Try getting from location state
      if (location.state && location.state.recipeData) {
        const recipeData = location.state.recipeData;
        if (isValidQuickRecipe(recipeData)) {
          console.log("Recovered recipe from location state");
          setRecipe(recipeData as QuickRecipe);
          setRecoveryStatus('success');
          return true;
        }
      }
      
      // Try getting from pendingActions in authStateManager
      const nextAction = authStateManager.getNextPendingAction();
      if (nextAction && nextAction.type === 'save-recipe' && nextAction.data.recipe) {
        const recipeData = nextAction.data.recipe;
        
        if (isValidQuickRecipe(recipeData)) {
          console.log('Recovered recipe from pending action');
          setRecipe(recipeData as QuickRecipe);
          authStateManager.markActionExecuted(nextAction.id);
          setRecoveryStatus('success');
          return true;
        }
      }
      
      // Try legacy fallback in localStorage
      const recipeBackup = authStateManager.getRecipeDataFallback();
      if (recipeBackup && recipeBackup.recipe) {
        if (isValidQuickRecipe(recipeBackup.recipe)) {
          console.log('Recovered recipe from localStorage fallback');
          setRecipe(recipeBackup.recipe as QuickRecipe);
          setRecoveryStatus('success');
          return true;
        }
      }
      
      // All recovery methods failed
      console.log('Recipe recovery failed - no valid data found');
      setRecoveryStatus('failed');
      return false;
    } catch (error) {
      console.error('Error during recipe recovery:', error);
      setRecoveryStatus('failed');
      return false;
    }
  }, [recipe, setRecipe, getRecipeIdFromUrl, getRecipeById, isValidQuickRecipe, location.state]);
  
  /**
   * Ensures a recipe has an ID and is properly stored
   */
  const ensureRecipeHasId = useCallback((recipe: QuickRecipe): string | null => {
    // Generate and store a new ID if one doesn't exist
    return storeRecipeWithId(recipe);
  }, [storeRecipeWithId]);
  
  // Return all the functions and state
  return {
    recipeRecoveryStatus,
    attemptRecipeRecovery,
    generateRecipeId,
    storeRecipeWithId,
    getRecipeById,
    ensureRecipeHasId,
    isValidQuickRecipe,
    getRecipeIdFromUrl
  };
}
