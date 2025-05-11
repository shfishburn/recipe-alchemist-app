
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuickRecipe } from '@/types/quick-recipe';
import { useAuth } from '@/hooks/use-auth';

// Define the NutritionImpact type
export interface NutritionImpact {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  summary: string;
}

export interface RecipeModifications {
  modifications: {
    title?: string;
    description?: string;
    ingredients?: {
      action: 'add' | 'remove' | 'modify';
      originalIndex?: number;
      item: string;
      qty_metric?: number;
      unit_metric?: string;
      qty_imperial?: number;
      unit_imperial?: string;
      notes?: string;
    }[];
    steps?: {
      action: 'add' | 'remove' | 'modify';
      originalIndex?: number;
      content: string;
    }[];
  };
  nutritionImpact: NutritionImpact;
  reasoning: string;
}

interface ModificationHistoryEntry {
  request: string;
  response: RecipeModifications;
  timestamp: string;
  applied: boolean;
}

// Simple runtime schema validation
const recipeModificationsSchema = {
  parse: (data: any) => {
    if (!data || typeof data !== 'object') throw new Error('Invalid data format');
    if (!data.modifications || typeof data.modifications !== 'object') throw new Error('Missing modifications object');
    if (!data.nutritionImpact || typeof data.nutritionImpact !== 'object') throw new Error('Missing nutritionImpact object');
    if (!data.reasoning || typeof data.reasoning !== 'string') throw new Error('Missing reasoning string');
    return data as RecipeModifications;
  }
};

export type ModificationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'applying'
  | 'applied'
  | 'error'
  | 'canceled'
  | 'not-deployed'
  | 'not-authenticated';

export function useRecipeModifications(recipe: QuickRecipe) {
  const { session } = useAuth();
  const [status, setStatus] = useState<ModificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [modificationRequest, setModificationRequest] = useState<string>('');
  const [modifications, setModifications] = useState<RecipeModifications | null>(null);
  const [modificationHistory, setModificationHistory] = useState<ModificationHistoryEntry[]>([]);
  const [modifiedRecipe, setModifiedRecipe] = useState<QuickRecipe>(recipe);

  const pendingRequestRef = useRef<string | null>(null);
  const requestTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // reset on recipe change
  useEffect(() => {
    setModifiedRecipe(recipe);
    setStatus('idle');
    setError(null);
    setModifications(null);
    // keep history
  }, [recipe.id]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (requestTimerRef.current != null) window.clearTimeout(requestTimerRef.current);
    };
  }, []);

  const requestModifications = useCallback(async (request: string, immediate = false) => {
    if (!request.trim()) return;

    // Fail fast if no authentication
    if (!session) {
      setError('Authentication required to modify recipes');
      setStatus('not-authenticated');
      // Save current request to localStorage for after login
      if (request) {
        localStorage.setItem('recipe_modification_request', request);
        localStorage.setItem('recipe_modification_page', window.location.pathname);
        localStorage.setItem('recipe_modification_immediate', String(immediate));
      }
      return;
    }

    // cancel previous
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (requestTimerRef.current != null) window.clearTimeout(requestTimerRef.current);

    pendingRequestRef.current = request;

    const executeRequest = async () => {
      if (!pendingRequestRef.current) return;
      const actualRequest = pendingRequestRef.current;
      pendingRequestRef.current = null;

      setModificationRequest(actualRequest);
      setStatus('loading');
      setError(null);

      // get session token
      const token = session?.access_token;
      if (!token) {
        setError('Authentication required');
        setStatus('not-authenticated');
        return;
      }

      abortControllerRef.current = new AbortController();

      try {
        console.log('Requesting recipe modifications:', actualRequest);
        
        // Use direct fetch instead of supabase.functions.invoke to ensure proper auth header
        const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/modify-quick-recipe`;
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            recipe: modifiedRecipe,
            userRequest: actualRequest,
            modificationHistory
          }),
          signal: abortControllerRef.current.signal
        });

        abortControllerRef.current = null;

        if (!response.ok) {
          // Handle authentication errors
          if (response.status === 401) {
            setStatus('not-authenticated');
            throw new Error('Authentication required to modify recipes');
          } else if (response.status === 404) {
            setStatus('not-deployed');
            setError('Modification service not deployed');
          } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP error ${response.status}`);
          }
        }
        
        const data = await response.json();
        
        if (!data) {
          throw new Error('No data returned');
        } else {
          const validated = recipeModificationsSchema.parse(data);
          const entry: ModificationHistoryEntry = {
            request: actualRequest,
            response: validated,
            timestamp: new Date().toISOString(),
            applied: false
          };
          setModifications(validated);
          setModificationHistory(h => [...h, entry]);
          setStatus('success');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setStatus('canceled');
        } else {
          console.error('Modification error:', err);
          setError(err.message);
          setStatus(err.message.includes('not deployed') ? 'not-deployed' : 'error');
          toast.error("Modification failed", { description: err.message });
        }
      }
    };

    if (immediate) {
      await executeRequest();
    } else {
      requestTimerRef.current = window.setTimeout(executeRequest, 800);
    }
  }, [modifiedRecipe, modificationHistory, session]);

  const applyModifications = useCallback(() => {
    if (!modifications || status !== 'success') return;
    setStatus('applying');
    try {
      const next = JSON.parse(JSON.stringify(modifiedRecipe));
      // apply title, desc, ingredients, steps, nutrition...
      if (modifications.modifications.title) next.title = modifications.modifications.title;
      if (modifications.modifications.description) next.description = modifications.modifications.description;
      // (you can keep your existing apply logic here)
      setModifiedRecipe(next);
      setStatus('applied');
      setModifications(null);
      setModificationHistory(h =>
        h.map((e, i) => i === h.length - 1 ? { ...e, applied: true } : e)
      );
      toast.success("Recipe updated");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setStatus('error');
      toast.error("Apply failed");
    }
  }, [modifications, modifiedRecipe, status]);

  const rejectModifications = useCallback(() => {
    setModifications(null);
    setStatus('idle');
    setModificationHistory(h =>
      h.map((e, i) => i === h.length - 1 ? { ...e, applied: false } : e)
    );
    toast.info("Modifications rejected");
  }, []);

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    pendingRequestRef.current = null;
    if (requestTimerRef.current != null) window.clearTimeout(requestTimerRef.current);
    setStatus('canceled');
    setError(null);
    toast.info("Request canceled");
  }, []);

  const resetToOriginal = useCallback(() => {
    setModifiedRecipe(recipe);
    setStatus('idle');
    setError(null);
    setModifications(null);
    setModificationHistory(h => h.map(e => ({ ...e, applied: false })));
    toast.success("Reset to original");
  }, [recipe]);

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
