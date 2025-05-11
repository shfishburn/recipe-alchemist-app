import { useState, useCallback, useRef, useEffect } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { ModificationStatus, RecipeModifications, ModificationHistoryEntry } from './types';
import { requestRecipeModifications } from './api-client';
import { applyModificationsToRecipe } from './mutation-utils';
import { saveModificationRequest } from './storage-utils';

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
      saveModificationRequest(request, immediate);
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
        const validated = await requestRecipeModifications(
          modifiedRecipe,
          actualRequest,
          modificationHistory,
          token,
          abortControllerRef.current
        );
        
        abortControllerRef.current = null;
        
        const entry: ModificationHistoryEntry = {
          request: actualRequest,
          response: validated,
          timestamp: new Date().toISOString(),
          applied: false
        };
        
        setModifications(validated);
        setModificationHistory(h => [...h, entry]);
        setStatus('success');
      } catch (err: any) {
        abortControllerRef.current = null;
        
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
      const next = applyModificationsToRecipe(modifiedRecipe, modifications);
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
