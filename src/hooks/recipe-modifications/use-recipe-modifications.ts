
import { useState, useCallback, useRef, useEffect } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { 
  ModificationStatus, 
  RecipeModifications, 
  ModificationHistoryEntry,
  VersionHistoryEntry 
} from './types';
import { requestRecipeModifications } from './api-client';
import { saveModificationRequest } from './storage-utils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing recipe modifications
 */
export function useRecipeModifications(recipe: QuickRecipe) {
  const { session } = useAuth();
  const [status, setStatus] = useState<ModificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [modificationRequest, setModificationRequest] = useState<string>('');
  const [modifications, setModifications] = useState<RecipeModifications | null>(null);
  const [modificationHistory, setModificationHistory] = useState<ModificationHistoryEntry[]>([]);
  const [modifiedRecipe, setModifiedRecipe] = useState<QuickRecipe>(recipe);
  const [versionHistory, setVersionHistory] = useState<VersionHistoryEntry[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  const pendingRequestRef = useRef<string | null>(null);
  const requestTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset on recipe change
  useEffect(() => {
    console.log("Recipe changed in useRecipeModifications:", recipe.id);
    setModifiedRecipe(recipe);
    setStatus('idle');
    setError(null);
    setModifications(null);
    // keep history
    
    // Fetch version history when recipe changes
    if (recipe.id) {
      fetchVersionHistory(recipe.id);
    }
  }, [recipe.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (requestTimerRef.current != null) window.clearTimeout(requestTimerRef.current);
    };
  }, []);
  
  // Fetch recipe version history
  const fetchVersionHistory = async (recipeId: string) => {
    if (!session) {
      console.log("Cannot fetch version history: No session");
      return;
    }
    
    try {
      console.log("Fetching version history for recipe:", recipeId);
      setStatus('loading');
      
      const token = session.access_token;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recipe-versions/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch version history');
      }
      
      const versions = await response.json();
      console.log(`Fetched ${versions.length} versions for recipe:`, recipeId);
      setVersionHistory(versions);
      
      // Set selected version to the latest one
      if (versions.length > 0) {
        const latestVersion = versions[0]; // Already sorted descending
        console.log("Setting selected version to latest:", latestVersion.version_id);
        setSelectedVersionId(latestVersion.version_id);
        
        // If the recipe doesn't have a version_id, use the latest version data
        if (!recipe.version_id) {
          console.log("Recipe has no version_id, using latest version data");
          setModifiedRecipe({
            ...recipe,
            ...latestVersion.recipe_data,
            version_id: latestVersion.version_id
          });
        }
      }
      
      setStatus('idle');
    } catch (err) {
      console.error("Error fetching version history:", err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching versions');
      setStatus('error');
    }
  };
  
  // Select a specific version
  const selectVersion = useCallback((versionId: string) => {
    console.log("Selecting version:", versionId);
    const version = versionHistory.find(v => v.version_id === versionId);
    if (version) {
      setSelectedVersionId(versionId);
      setModifiedRecipe({
        ...recipe,
        ...version.recipe_data,
        version_id: version.version_id
      });
      setStatus('applied');
      console.log("Version selected successfully:", versionId);
    } else {
      console.warn("Version not found:", versionId);
    }
  }, [versionHistory, recipe]);

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

    console.log("Initiating modification request:", request.substring(0, 50) + (request.length > 50 ? "..." : ""));
    
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
        console.log("Executing modification request:", actualRequest.substring(0, 50) + (actualRequest.length > 50 ? "..." : ""));
        console.log("Using recipe version:", modifiedRecipe.version_id || "none");
        
        const validated = await requestRecipeModifications(
          modifiedRecipe,
          actualRequest,
          modificationHistory,
          token,
          abortControllerRef.current
        );
        
        abortControllerRef.current = null;
        
        console.log("Modification request succeeded, response:", {
          recipeId: validated.recipe?.id,
          recipeTitle: validated.recipe?.title,
          versionId: validated.recipe?.version_id
        });
        
        const entry: ModificationHistoryEntry = {
          request: actualRequest,
          response: validated,
          timestamp: new Date().toISOString(),
          applied: false
        };
        
        setModifications(validated);
        setModificationHistory(h => [...h, entry]);
        setStatus('success');
        
        // Refresh version history
        if (recipe.id) {
          console.log("Refreshing version history after successful modification");
          fetchVersionHistory(recipe.id);
        }
      } catch (err: any) {
        abortControllerRef.current = null;
        
        if (err.name === 'AbortError') {
          console.log("Modification request aborted");
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
      console.log("Executing modification request immediately");
      await executeRequest();
    } else {
      console.log("Scheduling modification request with delay");
      requestTimerRef.current = window.setTimeout(executeRequest, 800);
    }
  }, [modifiedRecipe, modificationHistory, session, recipe.id]);

  const applyModifications = useCallback(() => {
    if (!modifications || status !== 'success') {
      console.warn("Cannot apply modifications - status is not 'success' or modifications are null");
      return;
    }
    
    console.log("Applying modifications to recipe", modifiedRecipe.id);
    setStatus('applying');
    
    try {
      // With the complete recipe update approach, we can just use the complete recipe
      const next = modifications.recipe;
      console.log("New recipe data:", {
        id: next.id,
        title: next.title,
        versionId: next.version_id,
        ingredientsCount: next.ingredients?.length || 0,
        stepsCount: next.steps?.length || 0
      });
      
      setModifiedRecipe(next);
      setStatus('applied');
      setModifications(null);
      setModificationHistory(h =>
        h.map((e, i) => i === h.length - 1 ? { ...e, applied: true } : e)
      );
      toast.success("Recipe updated");
      console.log("Modifications applied successfully");
      
      // Refresh version history
      if (recipe.id) {
        console.log("Refreshing version history after applying modifications");
        fetchVersionHistory(recipe.id);
      }
    } catch (err: any) {
      console.error("Error applying modifications:", err);
      setError(err.message);
      setStatus('error');
      toast.error("Apply failed");
    }
  }, [modifications, status, recipe.id]);

  const rejectModifications = useCallback(() => {
    console.log("Rejecting modifications");
    setModifications(null);
    setStatus('idle');
    setModificationHistory(h =>
      h.map((e, i) => i === h.length - 1 ? { ...e, applied: false } : e)
    );
    toast.info("Modifications rejected");
  }, []);

  const cancelRequest = useCallback(() => {
    console.log("Canceling modification request");
    abortControllerRef.current?.abort();
    pendingRequestRef.current = null;
    if (requestTimerRef.current != null) window.clearTimeout(requestTimerRef.current);
    setStatus('canceled');
    setError(null);
    toast.info("Request canceled");
  }, []);

  const resetToOriginal = useCallback(() => {
    console.log("Resetting recipe to original version");
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
    versionHistory,
    selectedVersionId,
    isModified: JSON.stringify(recipe) !== JSON.stringify(modifiedRecipe),
    requestModifications,
    applyModifications,
    rejectModifications,
    cancelRequest,
    resetToOriginal,
    selectVersion,
    refreshVersionHistory: () => recipe.id && fetchVersionHistory(recipe.id)
  };
}
