
import { useRecipeAnalysisData } from '@/hooks/use-recipe-analysis/use-recipe-analysis-data';
import { useRecipeReactions } from '@/hooks/use-recipe-analysis/use-recipe-reactions';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { Recipe } from '@/types/recipe';

/**
 * Main hook to manage recipe analysis data fetching and state
 */
export function useRecipeAnalysis(recipe: Recipe, onRecipeUpdate?: (updatedRecipe: Recipe) => void) {
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use our separate hooks for analysis data and reactions
  const {
    analysis,
    isLoading: isLoadingAnalysis,
    error: analysisError,
    fetchAnalysis,
    clearError: clearAnalysisError
  } = useRecipeAnalysisData(recipe.id);

  const {
    stepReactions,
    isLoading: isLoadingReactions,
    error: reactionsError,
    fetchReactions,
    hasAnalysisData,
    scienceNotes
  } = useRecipeReactions(recipe);

  // Clean merged error handling
  const error = analysisError || reactionsError;
  
  const clearError = () => {
    clearAnalysisError();
  };

  // Function to manually trigger analysis
  const handleAnalyze = async () => {
    if (!isAnalyzing) {
      setIsAnalyzing(true);
      clearError();
      toast.info("Analyzing recipe chemistry and reactions...", { duration: 5000 });
      
      try {
        // Start both analyses in parallel
        const results = await Promise.allSettled([
          fetchAnalysis(),
          fetchReactions()
        ]);
        
        // Check for any errors
        const errors = results
          .filter(result => result.status === 'rejected')
          .map(result => (result as PromiseRejectedResult).reason);
        
        if (errors.length > 0) {
          console.error("Analysis errors:", errors);
          throw errors[0];
        }
      } catch (err) {
        console.error("Analysis error:", err);
        toast.error("Failed to analyze recipe: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Auto-analyze when opened for the first time
  useEffect(() => {
    if (!initialAnalysisRef.current && !isAnalyzing && !hasAnalysisData) {
      initialAnalysisRef.current = true;
      handleAnalyze();
    }
  }, [isAnalyzing, hasAnalysisData]);

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
        setHasAppliedUpdates(true); // Mark updates as applied to prevent further runs
        
        // Update with safely constructed data - pass only the updated recipe to the callback
        const updatedRecipe = { ...recipe, science_notes: analysis.science_notes };
        onRecipeUpdate(updatedRecipe);
        toast.success('Recipe analysis complete');
        
        setIsAnalyzing(false);
      } else {
        toast.info('Analysis complete, but no changes needed.');
        setIsAnalyzing(false);
      }
    }
  }, [analysis, hasAppliedUpdates, onRecipeUpdate, recipe, isAnalyzing]);

  return {
    analysis,
    isLoading: isLoadingAnalysis || isLoadingReactions || isAnalyzing,
    isAnalyzing,
    stepReactions,
    scienceNotes,
    hasAnalysisData,
    handleAnalyze,
    error
  };
}
