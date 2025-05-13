
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useToast } from '@/hooks/use-toast';

/**
 * A custom hook that handles recipe data recovery after authentication
 * or other navigation events that might cause data loss
 */
export function useRecipeDataRecovery() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipeRecoveryStatus, setRecipeRecoveryStatus] = useState<
    'idle' | 'pending' | 'success' | 'failed'
  >('idle');
  
  const setRecipe = useQuickRecipeStore(state => state.setRecipe);
  const recipe = useQuickRecipeStore(state => state.recipe);
  
  // Helper function to validate QuickRecipe
  function isValidQuickRecipe(recipe: unknown): recipe is QuickRecipe {
    if (!recipe || typeof recipe !== 'object') return false;
    
    const r = recipe as Partial<QuickRecipe>;
    return (
      typeof r.title === 'string' && 
      Array.isArray(r.ingredients) && 
      typeof r.servings === 'number'
    );
  }
  
  /**
   * Attempt to recover recipe data from multiple sources, using a priority-based approach
   */
  const recoverRecipeData = (): QuickRecipe | null => {
    // Priority 1: Check location state (highest priority as it's most recent)
    if (location.state?.recipeData && isValidQuickRecipe(location.state.recipeData)) {
      console.log('[RECOVERY] Found recipe in navigation state:', location.state.recipeData.title);
      return location.state.recipeData as QuickRecipe;
    }
    
    // Priority 2: Check AuthStateManager pending actions
    const pendingActions = authStateManager.getPendingActions();
    const saveAction = pendingActions.find(a => 
      a.type === 'save-recipe' && 
      a.data?.recipe &&
      !a.executed
    );
    
    if (saveAction?.data.recipe && isValidQuickRecipe(saveAction.data.recipe)) {
      console.log('[RECOVERY] Found recipe in pending actions:', 
        (saveAction.data.recipe as QuickRecipe).title);
      return saveAction.data.recipe as QuickRecipe;
    }
    
    // Priority 3: Check localStorage backup
    const backup = authStateManager.getRecipeDataFallback();
    if (backup?.recipe && isValidQuickRecipe(backup.recipe)) {
      console.log('[RECOVERY] Found recipe in localStorage backup:', backup.recipe.title);
      return backup.recipe as QuickRecipe;
    }
    
    // Priority 4: Check existing recipe in store (lowest priority)
    if (recipe && isValidQuickRecipe(recipe)) {
      console.log('[RECOVERY] Using existing recipe from store:', recipe.title);
      return recipe;
    }
    
    console.warn('[RECOVERY] No valid recipe found in any storage location');
    return null;
  };
  
  /**
   * Try to recover recipe data after authentication or navigation events
   */
  const attemptRecipeRecovery = () => {
    // Only attempt recovery if we're resuming after auth or have a pending save
    if (location.state?.resumingAfterAuth || location.state?.pendingSave) {
      console.log('[RECOVERY] Attempting recipe recovery after auth');
      setRecipeRecoveryStatus('pending');
      
      const recoveredRecipe = recoverRecipeData();
      if (recoveredRecipe) {
        setRecipe(recoveredRecipe);
        setRecipeRecoveryStatus('success');
        
        // Clear localStorage backup after successful recovery to prevent duplicates
        setTimeout(() => {
          authStateManager.clearRecipeDataFallback();
        }, 500);
        
        console.log('[RECOVERY] Successfully recovered recipe:', recoveredRecipe.title);
        
        toast({
          title: "Recipe Restored",
          description: "Your recipe has been successfully restored.",
        });
        
        return true;
      } else {
        setRecipeRecoveryStatus('failed');
        
        console.error('[RECOVERY] Failed to recover recipe data');
        
        toast({
          title: "Recovery Failed",
          description: "We couldn't recover your recipe data. Please try again.",
          variant: "destructive",
        });
        
        return false;
      }
    }
    
    return false;
  };
  
  return { 
    recipeRecoveryStatus,
    attemptRecipeRecovery,
    recoverRecipeData,
    isValidQuickRecipe
  };
}
