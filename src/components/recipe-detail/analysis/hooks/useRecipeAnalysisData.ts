
import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import { fetchRecipeAnalysis, hasValidAnalysisData as checkValidAnalysisData, AnalysisResponse } from './analysis-utils';
import { useAnalyzeRecipe } from './useAnalyzeRecipe';

/**
 * Hook to manage recipe analysis data fetching and state
 * with auto-analysis in the background
 */
export function useRecipeAnalysisData(recipe: Recipe, onRecipeUpdate?: (updatedRecipe: Recipe) => void) {
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisRequestRef = useRef<AbortController | null>(null);
  const recipeIdRef = useRef<string>(recipe.id);
  const lastAnalysisTimeRef = useRef<number>(0);
  const hasTriggeredInitialAnalysisRef = useRef<boolean>(false);
  
  // Track if we've seen this recipe before
  useEffect(() => {
    // If recipe ID changes, reset state
    if (recipeIdRef.current !== recipe.id) {
      recipeIdRef.current = recipe.id;
      initialAnalysisRef.current = false;
      setHasAppliedUpdates(false);
      hasTriggeredInitialAnalysisRef.current = false;
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
    refetch,
    refetchReactions
  );

  // Auto-analyze when opened for the first time - with improved logic to avoid unnecessary analysis
  useEffect(() => {
    // Only trigger analysis if:
    // 1. We're not currently analyzing
    // 2. We haven't triggered initial analysis for this recipe yet
    // 3. We don't already have complete analysis data
    if (!isAnalyzing && !hasTriggeredInitialAnalysisRef.current) {
      // Mark that we've triggered the initial analysis for this recipe
      hasTriggeredInitialAnalysisRef.current = true;
      
      // Check if we already have complete data
      const hasComplete = hasValidAnalysisData();
      
      if (!hasComplete) {
        console.log('Auto-triggering analysis for recipe:', recipe.title);
        
        // Small delay to prevent immediate analysis on mount
        const timer = setTimeout(() => {
          handleAnalyze();
        }, 500);
        
        return () => clearTimeout(timer);
      } else {
        console.log('Skipping auto-analysis - complete data already exists for:', recipe.title);
        initialAnalysisRef.current = true;
      }
    } else if (!initialAnalysisRef.current) {
      console.log('Skipping auto-analysis - analysis already running for:', recipe.title);
      initialAnalysisRef.current = true;
    }
  }, [handleAnalyze, isAnalyzing, recipe.title, hasValidAnalysisData]);

  // Apply analysis updates to recipe when data is available
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
        console.log('Applying science notes from analysis:', analysis.science_notes.length);
        setHasAppliedUpdates(true); // Mark updates as applied to prevent further runs
        
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
