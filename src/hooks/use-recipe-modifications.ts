
import { useState, useCallback, useEffect, useRef } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define modification states for state machine
export type ModificationStatus = 
  | 'idle' 
  | 'loading' 
  | 'success' 
  | 'error' 
  | 'applying' 
  | 'applied'
  | 'rejected'
  | 'not-deployed'
  | 'canceled';

// Define modification types
export type IngredientModification = {
  action: 'add' | 'remove' | 'modify';
  originalIndex?: number;
  item: string;
  qty_metric?: number;
  unit_metric?: string;
  qty_imperial?: number;
  unit_imperial?: string;
  notes?: string;
};

export type StepModification = {
  action: 'add' | 'remove' | 'modify';
  originalIndex?: number;
  content: string;
};

export type NutritionImpact = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  summary: string;
};

export type RecipeModifications = {
  modifications: {
    title?: string;
    description?: string;
    ingredients?: IngredientModification[];
    steps?: StepModification[];
  };
  nutritionImpact: NutritionImpact;
  reasoning: string;
};

export type ModificationHistoryEntry = {
  request: string;
  response: RecipeModifications;
  timestamp: string;
  applied: boolean;
};

// Main hook interface
export function useRecipeModifications(recipe: QuickRecipe) {
  // State machine
  const [status, setStatus] = useState<ModificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [modificationRequest, setModificationRequest] = useState<string>('');
  const [modifications, setModifications] = useState<RecipeModifications | null>(null);
  const [modificationHistory, setModificationHistory] = useState<ModificationHistoryEntry[]>([]);
  const [modifiedRecipe, setModifiedRecipe] = useState<QuickRecipe>(recipe);
  
  // References for managing async operations and prevent race conditions
  const pendingRequestRef = useRef<string | null>(null);
  const requestTimerRef = useRef<number | null>(null);
  const pendingRequestTimestampRef = useRef<number>(0);
  
  // Abort controller for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Reset state when recipe changes
  useEffect(() => {
    setModifiedRecipe(recipe);
    setStatus('idle');
    setError(null);
    setModifications(null);
    // Don't clear history - we want to keep it for context
  }, [recipe.id]);

  // Cleanup function to clear any ongoing requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      if (requestTimerRef.current !== null) {
        window.clearTimeout(requestTimerRef.current);
      }
    };
  }, []);

  // Debounced modification request
  const requestModifications = useCallback(async (request: string, immediate = false) => {
    if (!request.trim()) {
      return;
    }
    
    // Cancel previous request if pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Clear previous timer
    if (requestTimerRef.current !== null) {
      window.clearTimeout(requestTimerRef.current);
      requestTimerRef.current = null;
    }
    
    pendingRequestRef.current = request;
    
    const executeRequest = async () => {
      try {
        if (!pendingRequestRef.current) return;
        
        const actualRequest = pendingRequestRef.current;
        pendingRequestRef.current = null;
        pendingRequestTimestampRef.current = Date.now();
        
        setModificationRequest(actualRequest);
        setStatus('loading');
        setError(null);
        
        // Create new abort controller
        abortControllerRef.current = new AbortController();
        
        // Log the request for debuggability
        console.log('Requesting recipe modifications:', actualRequest);
        
        const response = await supabase.functions.invoke('modify-quick-recipe', {
          body: {
            recipe: modifiedRecipe,
            userRequest: actualRequest,
            modificationHistory
          },
          signal: abortControllerRef.current.signal // Pass the signal properly
        });
        
        // Clear the abort controller reference after successful completion
        abortControllerRef.current = null;
        
        if (response.error) {
          // Check if error is a 404 (function not deployed)
          if (response.error.message?.includes('Not Found') || response.error.status === 404) {
            setStatus('not-deployed');
            setError('Recipe modification service is not yet deployed. Please deploy the edge function "modify-quick-recipe" to your Supabase project.');
            throw new Error('Edge function not deployed: modify-quick-recipe');
          } else {
            throw new Error(response.error.message || 'Error requesting modifications');
          }
        }
        
        if (!response.data) {
          throw new Error('No data returned from modification service');
        }
        
        console.log('Received modification response:', response.data);
        
        const modifications = response.data;
        
        // Add to history but mark as not applied yet
        const historyEntry: ModificationHistoryEntry = {
          request: actualRequest,
          response: modifications,
          timestamp: new Date().toISOString(),
          applied: false
        };
        
        setModifications(modifications);
        setModificationHistory(prev => [...prev, historyEntry]);
        setStatus('success');
        
      } catch (err: any) {
        // Don't update state if the request was aborted
        if (err.name === 'AbortError' || err.message?.includes('aborted')) {
          console.log('Recipe modification request was canceled');
          setStatus('canceled');
          return;
        }
        
        const errorMessage = err.message || 'Failed to get recipe modifications';
        console.error('Recipe modification error:', errorMessage);
        
        setError(errorMessage);
        
        // If the error indicates the function isn't deployed, set status accordingly
        if (errorMessage.includes('not deployed') || errorMessage.includes('Not Found') || errorMessage.includes('404')) {
          setStatus('not-deployed');
          
          toast.error("Modification service not available", {
            description: "The recipe modification service needs to be deployed. Please check the Supabase Edge Functions section.",
          });
        } else {
          setStatus('error');
          
          toast.error("Modification request failed", {
            description: errorMessage.substring(0, 100),
          });
        }
      }
    };
    
    // Execute immediately or with debounce
    if (immediate) {
      await executeRequest();
    } else {
      requestTimerRef.current = window.setTimeout(executeRequest, 800);
    }
  }, [modifiedRecipe, modificationHistory]);

  // Apply modifications to recipe
  const applyModifications = useCallback(() => {
    if (!modifications || status !== 'success') {
      return;
    }
    
    setStatus('applying');
    
    try {
      // Start with a deep copy of the current recipe
      const newRecipe = JSON.parse(JSON.stringify(modifiedRecipe)) as QuickRecipe;
      
      // Apply title change if present
      if (modifications.modifications.title) {
        newRecipe.title = modifications.modifications.title;
      }
      
      // Apply description change if present
      if (modifications.modifications.description) {
        newRecipe.description = modifications.modifications.description;
      }
      
      // Apply ingredient modifications
      if (modifications.modifications.ingredients && modifications.modifications.ingredients.length > 0) {
        const newIngredients = [...newRecipe.ingredients];
        
        // Process in reverse order to handle index changes correctly
        [...modifications.modifications.ingredients]
          .sort((a, b) => {
            // Handle removes first to avoid index issues
            if (a.action === 'remove' && b.action !== 'remove') return -1;
            if (b.action === 'remove' && a.action !== 'remove') return 1;
            
            // Sort by index in reverse order 
            if (a.originalIndex !== undefined && b.originalIndex !== undefined) {
              return b.originalIndex - a.originalIndex;
            }
            return 0;
          })
          .forEach(mod => {
            switch (mod.action) {
              case 'add':
                newIngredients.push({
                  qty_metric: mod.qty_metric,
                  unit_metric: mod.unit_metric,
                  qty_imperial: mod.qty_imperial,
                  unit_imperial: mod.unit_imperial,
                  item: mod.item,
                  notes: mod.notes
                });
                break;
              case 'remove':
                if (mod.originalIndex !== undefined) {
                  newIngredients.splice(mod.originalIndex, 1);
                }
                break;
              case 'modify':
                if (mod.originalIndex !== undefined) {
                  newIngredients[mod.originalIndex] = {
                    ...newIngredients[mod.originalIndex],
                    qty_metric: mod.qty_metric ?? newIngredients[mod.originalIndex].qty_metric,
                    unit_metric: mod.unit_metric ?? newIngredients[mod.originalIndex].unit_metric,
                    qty_imperial: mod.qty_imperial ?? newIngredients[mod.originalIndex].qty_imperial,
                    unit_imperial: mod.unit_imperial ?? newIngredients[mod.originalIndex].unit_imperial,
                    item: mod.item,
                    notes: mod.notes ?? newIngredients[mod.originalIndex].notes
                  };
                }
                break;
            }
          });
          
        newRecipe.ingredients = newIngredients;
      }
      
      // Apply step modifications
      if (modifications.modifications.steps && modifications.modifications.steps.length > 0) {
        // Handle steps or instructions based on what's available
        const steps = newRecipe.steps ? [...newRecipe.steps] : 
                      newRecipe.instructions ? [...newRecipe.instructions] : [];
        
        // Process in reverse order
        [...modifications.modifications.steps]
          .sort((a, b) => {
            // Handle removes first
            if (a.action === 'remove' && b.action !== 'remove') return -1;
            if (b.action === 'remove' && a.action !== 'remove') return 1;
            
            // Sort by index in reverse
            if (a.originalIndex !== undefined && b.originalIndex !== undefined) {
              return b.originalIndex - a.originalIndex;
            }
            return 0;
          })
          .forEach(mod => {
            switch (mod.action) {
              case 'add':
                steps.push(mod.content);
                break;
              case 'remove':
                if (mod.originalIndex !== undefined) {
                  steps.splice(mod.originalIndex, 1);
                }
                break;
              case 'modify':
                if (mod.originalIndex !== undefined) {
                  steps[mod.originalIndex] = mod.content;
                }
                break;
            }
          });
          
        if (newRecipe.steps) {
          newRecipe.steps = steps;
        }
        if (newRecipe.instructions) {
          newRecipe.instructions = steps;
        }
      }
      
      // Update nutrition information if available
      if (modifications.nutritionImpact && newRecipe.nutrition) {
        const impact = modifications.nutritionImpact;
        
        newRecipe.nutrition = {
          ...newRecipe.nutrition,
          calories: Math.max(0, (newRecipe.nutrition.calories || 0) + impact.calories),
          protein: Math.max(0, (newRecipe.nutrition.protein || 0) + impact.protein),
          carbs: Math.max(0, (newRecipe.nutrition.carbs || 0) + impact.carbs),
          fat: Math.max(0, (newRecipe.nutrition.fat || 0) + impact.fat),
        };
      }
      
      // Mark current modification as applied in history
      setModificationHistory(prev => 
        prev.map((entry, index) => 
          index === prev.length - 1 
            ? { ...entry, applied: true }
            : entry
        )
      );
      
      // Update the modified recipe
      setModifiedRecipe(newRecipe);
      setStatus('applied');
      setModifications(null);
      
      toast.success("Recipe modified", {
        description: "The changes have been applied to your recipe."
      });
    } catch (err: any) {
      console.error('Error applying modifications:', err);
      setStatus('error');
      setError(`Failed to apply modifications: ${err.message}`);
      
      toast.error("Failed to apply modifications", {
        description: `Error: ${err.message}`
      });
    }
  }, [modifications, modifiedRecipe, status]);

  // Reject modifications
  const rejectModifications = useCallback(() => {
    setModifications(null);
    setStatus('rejected');
    
    // Mark current modification as not applied in history
    setModificationHistory(prev => 
      prev.map((entry, index) => 
        index === prev.length - 1 
          ? { ...entry, applied: false }
          : entry
      )
    );
    
    toast.info("Modifications rejected", {
      description: "The recipe was not modified."
    });
  }, []);

  // Cancel current request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('Canceling current modification request');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    pendingRequestRef.current = null;
    
    if (requestTimerRef.current !== null) {
      window.clearTimeout(requestTimerRef.current);
      requestTimerRef.current = null;
    }
    
    setStatus('canceled');
    setError(null);
    
    toast.info("Request canceled", {
      description: "The modification request was canceled."
    });
  }, []);
  
  // Revert to original recipe
  const resetToOriginal = useCallback(() => {
    setModifiedRecipe(recipe);
    setStatus('idle');
    setError(null);
    setModifications(null);
    
    // Keep history but mark all as not applied
    setModificationHistory(prev => 
      prev.map(entry => ({ ...entry, applied: false }))
    );
    
    toast.success("Recipe reset", {
      description: "All modifications have been reverted."
    });
  }, [recipe]);
  
  // Return everything the consumer needs
  return {
    status,
    error,
    modifications,
    modifiedRecipe,
    modificationRequest,
    modificationHistory,
    isModified: JSON.stringify(recipe) !== JSON.stringify(modifiedRecipe),
    requestModifications,
    applyModifications,
    rejectModifications,
    cancelRequest,
    resetToOriginal
  };
}
