
import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useDebounce } from '@/hooks/use-debounce';
import type { Recipe } from '@/types/recipe';
import { fetchRecipeAnalysis, hasValidAnalysisData as checkValidAnalysisData, AnalysisResponse } from './analysis-utils';
import { useAnalyzeRecipe } from './useAnalyzeRecipe.tsx';

// Key for tracking already analyzed recipes in localStorage
const ANALYZED_RECIPES_KEY = 'recipe-analysis-cache';

interface AnalyzedRecipeCache {
  [recipeId: string]: {
    timestamp: number;  // When the analysis was performed
    hasAnalyzedData: boolean; // Whether analysis was already performed
  };
}

/**
 * Hook to manage recipe analysis data fetching and state
 * with auto-analysis in the background
 */
export function useRecipeAnalysisData(recipe: Recipe, onRecipeUpdate?: (updatedRecipe: Recipe) => void) {
  // Cache for tracking recipes we've already analyzed
  const [analyzedRecipesCache, setAnalyzedRecipesCache] = useLocalStorage<AnalyzedRecipeCache>(
    ANALYZED_RECIPES_KEY, 
    {}
  );
  
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisRequestRef = useRef<AbortController | null>(null);
  const recipeIdRef = useRef<string>(recipe.id);
  const lastAnalysisTimeRef = useRef<number>(0);
  const hasTriggeredInitialAnalysisRef = useRef<boolean>(false);
  const updateVersionRef = useRef<number>(0);
  
  // Track the exact content of science notes to prevent duplicate updates
  const scienceNotesHashRef = useRef<string>(JSON.stringify(recipe.science_notes || []));
  
  // Debounce updates to prevent rapid successive updates
  const debouncedRecipe = useDebounce(recipe, 300);
  
  // Check if this recipe has been analyzed before using our cache
  const cachedAnalysis = analyzedRecipesCache[recipe.id];
  const hasBeenAnalyzedBefore = Boolean(cachedAnalysis?.hasAnalyzedData);
  
  // Track if we've seen this recipe before
  useEffect(() => {
    // If recipe ID changes, reset state
    if (recipeIdRef.current !== recipe.id) {
      recipeIdRef.current = recipe.id;
      initialAnalysisRef.current = false;
      setHasAppliedUpdates(false);
      hasTriggeredInitialAnalysisRef.current = false;
      scienceNotesHashRef.current = JSON.stringify(recipe.science_notes || []);
      updateVersionRef.current = 0;
    }
  }, [recipe.id]);
  
  // Use error handler for standardized error handling
  const { error, setError, clearError } = useErrorHandler({
    toastTitle: 'Analysis Error',
    showToast: false // We'll handle toasts manually for better UX
  });

  // Use our unified science data hook
  const { stepReactions, hasAnalysisData, scienceNotes, refetch: refetchReactions } = useRecipeScience(recipe);
  
  // Fetch general analysis data from recipe-chat
  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['recipe-analysis', recipe.id],
    queryFn: async () => {
      clearError();
      
      // Create an AbortController for timeout handling
      const abortController = new AbortController();
      analysisRequestRef.current = abortController;
      
      try {
        const data = await fetchRecipeAnalysis(recipe, abortController);
        
        // Cache the last successful analysis time
        lastAnalysisTimeRef.current = Date.now();
        analysisRequestRef.current = null;
        
        // Fix TypeScript error by using a new object that matches the expected type
        setAnalyzedRecipesCache(prevCache => {
          return {
            ...prevCache,
            [recipe.id]: {
              timestamp: Date.now(),
              hasAnalyzedData: true
            }
          };
        });
        
        return data;
      } catch (error) {
        throw error;
      }
    },
    enabled: false, // Don't auto-fetch on mount, we'll control this
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 1,
    meta: {
      onError: (error: any) => setError(error) // Use the meta option for error handling
    }
  });

  // Wrap hasValidAnalysisData to match the expected function signature
  const hasValidAnalysisData = useCallback(() => {
    return checkValidAnalysisData(hasAnalysisData, stepReactions, scienceNotes);
  }, [hasAnalysisData, stepReactions, scienceNotes]);

  // Use our custom hook for analysis handling
  const { handleAnalyze } = useAnalyzeRecipe(
    recipe,
    isLoading,
    isAnalyzing,
    hasAnalysisData, 
    stepReactions,
    scienceNotes,
    lastAnalysisTimeRef,
    setIsAnalyzing,
    clearError,
    setError,
    async () => {
      await refetch();
    },
    async () => {
      await refetchReactions();
    }
  );

  // Auto-analyze when opened for the first time - with improved logic to avoid unnecessary analysis
  useEffect(() => {
    // Skip auto-analysis if any of these are true:
    // 1. We're currently analyzing
    // 2. We've triggered initial analysis for this recipe already
    // 3. This recipe has been analyzed before according to our cache (within the last 24 hours)
    // 4. We already have complete analysis data
    if (
      !isAnalyzing && 
      !hasTriggeredInitialAnalysisRef.current && 
      !initialAnalysisRef.current
    ) {
      // Mark that we've triggered the initial analysis check for this recipe
      hasTriggeredInitialAnalysisRef.current = true;
      initialAnalysisRef.current = true;
      
      // Check if we should trigger analysis by seeing if we have complete data OR
      // if this recipe was analyzed recently according to our cache
      const hasComplete = hasValidAnalysisData();
      const recentlyCached = hasBeenAnalyzedBefore && 
                            cachedAnalysis && 
                            (Date.now() - cachedAnalysis.timestamp < 24 * 60 * 60 * 1000); // 24 hours
      
      if (!hasComplete && !recentlyCached) {
        console.log('Auto-triggering analysis for recipe:', recipe.title);
        
        // Small delay to prevent immediate analysis on mount
        const timer = setTimeout(() => {
          handleAnalyze();
        }, 500);
        
        return () => clearTimeout(timer);
      } else {
        console.log('Skipping auto-analysis - complete data already exists or recent cache for:', recipe.title);
      }
    }
  }, [handleAnalyze, isAnalyzing, recipe.title, hasValidAnalysisData, hasBeenAnalyzedBefore, cachedAnalysis]);

  // Apply analysis updates to recipe when data is available - IMPROVED WITH DEEP COMPARISON
  useEffect(() => {
    // Only run this effect if we have analysis data, we haven't applied updates yet,
    // and there's a callback for updates
    if (analysis && 
        analysis.science_notes && 
        onRecipeUpdate && 
        !hasAppliedUpdates && 
        initialAnalysisRef.current) {
      
      // Only proceed if we have meaningful science notes to update
      if (Array.isArray(analysis.science_notes) && analysis.science_notes.length > 0) {
        // Check if the science notes are different from what we already have
        const currentScienceNotesJson = JSON.stringify(recipe.science_notes || []);
        const newScienceNotesJson = JSON.stringify(analysis.science_notes);
        
        // Create a version hash to track updates
        const newVersionHash = newScienceNotesJson;
        
        // Only update if the notes are actually different and haven't been updated with this exact version before
        if (currentScienceNotesJson !== newScienceNotesJson && 
            scienceNotesHashRef.current !== newVersionHash) {
          console.log('Applying science notes from analysis:', analysis.science_notes.length);
          setHasAppliedUpdates(true); // Mark updates as applied to prevent further runs
          
          // Store the updated hash to prevent future updates with the same data
          scienceNotesHashRef.current = newVersionHash;
          updateVersionRef.current += 1;
          
          // Update with safely constructed data - pass only the updated recipe to the callback
          if (onRecipeUpdate) {
            const updatedRecipe = { ...recipe, science_notes: analysis.science_notes };
            onRecipeUpdate(updatedRecipe);
            toast({
              title: 'Analysis Saved',
              description: 'Recipe analysis data saved',
              variant: 'success'
            });
          }
        } else {
          console.log('Science notes already up to date, skipping update');
          setHasAppliedUpdates(true); // Mark as applied anyway to prevent future attempts
          toast({
            title: 'Analysis Complete',
            description: 'No changes needed.',
          });
        }
      } else {
        setHasAppliedUpdates(true); // Mark as applied so we don't try again
        toast({
          title: 'Analysis Complete',
          description: 'No changes needed.',
        });
      }
      
      setIsAnalyzing(false);
    }
  }, [analysis, hasAppliedUpdates, onRecipeUpdate, recipe, isAnalyzing]);

  return {
    analysis,
    isLoading,
    isAnalyzing,
    stepReactions,
    scienceNotes,
    hasAnalysisData,
    handleAnalyze,
    error
  };
}
