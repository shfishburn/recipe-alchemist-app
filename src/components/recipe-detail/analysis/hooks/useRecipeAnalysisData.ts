
import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from 'sonner';
import type { Recipe } from '@/types/recipe';

/**
 * Type definition for the analysis response from the edge function
 */
interface AnalysisResponse {
  textResponse?: string;
  science_notes?: string[];
  techniques?: string[];
  troubleshooting?: string[];
  error?: string;
}

/**
 * Hook to manage recipe analysis data fetching and state
 */
export function useRecipeAnalysisData(recipe: Recipe, onRecipeUpdate?: (updatedRecipe: Recipe) => void) {
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisRequestRef = useRef<AbortController | null>(null);
  const recipeIdRef = useRef<string>(recipe.id);
  const lastAnalysisTimeRef = useRef<number>(0);
  
  // Track if we've seen this recipe before
  useEffect(() => {
    // If recipe ID changes, reset state
    if (recipeIdRef.current !== recipe.id) {
      recipeIdRef.current = recipe.id;
      initialAnalysisRef.current = false;
      setHasAppliedUpdates(false);
    }
  }, [recipe.id]);
  
  // Use error handler for standardized error handling
  const { error, setError, clearError } = useErrorHandler({
    toastTitle: 'Analysis Error',
    showToast: false // We'll handle toasts manually for better UX
  });

  // Use our unified science data hook
  const { stepReactions, hasAnalysisData, scienceNotes, globalAnalysis, refetch: refetchReactions } = useRecipeScience(recipe);
  
  // Fetch general analysis data from recipe-chat
  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['recipe-analysis', recipe.id],
    queryFn: async () => {
      console.log('Fetching recipe analysis for', recipe.title);
      clearError();
      
      try {
        // Create an AbortController for timeout handling
        const abortController = new AbortController();
        analysisRequestRef.current = abortController;
        
        // Set a timeout
        const timeoutId = setTimeout(() => {
          if (analysisRequestRef.current) {
            analysisRequestRef.current.abort();
          }
        }, 45000); // Increased timeout for larger recipes
        
        // The actual fetch operation
        const { data, error } = await supabase.functions.invoke('recipe-chat', {
          body: { 
            recipe,
            userMessage: `As a culinary scientist specializing in food chemistry and cooking techniques, analyze this recipe through the lens of López-Alt-style precision cooking. 

Please provide:
1. A detailed breakdown of the key chemical processes occurring (Maillard reactions, protein denaturation, emulsification)
2. An analysis of the cooking techniques with temperature-dependent explanations
3. Scientific rationale for ingredient choices and potential substitutions with their impacts
4. Troubleshooting guide for common issues with this recipe, explaining the underlying science
5. Suggestions for enhancing flavors through scientifically-validated methods

Include specific temperature thresholds, timing considerations, and visual/tactile indicators of doneness.`,
            sourceType: 'analysis'
          }
        });

        clearTimeout(timeoutId);
        analysisRequestRef.current = null;
        
        console.log('Analysis data received:', data ? 'success' : 'failed');

        if (error) {
          throw new Error(error.message || 'Failed to get analysis');
        }
        
        // Cache the last successful analysis time
        lastAnalysisTimeRef.current = Date.now();
        
        // Return properly typed response
        return data as AnalysisResponse;
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('timed out')) {
          console.error('Recipe analysis request timed out');
          throw new Error('Analysis request timed out. Please try again later.');
        }
        console.error('Error in recipe analysis:', error);
        throw error;
      }
    },
    enabled: false, // Don't auto-fetch on mount
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes (previously cacheTime)
    retry: 1,
    meta: {
      onError: (error: any) => setError(error) // Use the meta option for error handling
    }
  });

  // Function to analyze reactions with OpenAI
  const analyzeReactions = async () => {
    if (!recipe.instructions || recipe.instructions.length === 0) {
      toast.error('Cannot analyze: Recipe has no instructions');
      return;
    }
    
    try {
      toast.info('Analyzing recipe reactions...', { duration: 3000 });
      
      console.log('Starting analysis of recipe reactions for recipe ID:', recipe.id);
      
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 45000); // Increased timeout
      
      try {
        const response = await supabase.functions.invoke('analyze-reactions', {
          body: {
            recipe_id: recipe.id,
            title: recipe.title,
            instructions: recipe.instructions
          }
        });
        
        clearTimeout(timeoutId);
        
        console.log('Reaction analysis response:', response ? 'success' : 'failed');
        
        if (response.error) {
          throw new Error(response.error as string || 'Failed to analyze reactions');
        }
        
        // Cache the last successful analysis time
        lastAnalysisTimeRef.current = Date.now();
        
        toast.success('Reaction analysis complete');
        await refetchReactions();
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('timed out')) {
          throw new Error('Analysis request timed out. Please try again later.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error analyzing reactions:', error);
      setError(error);
      toast.error('Failed to analyze reactions: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      // Only reset analyzing state once both operations are complete or have failed
      if (!analysis) {
        setIsAnalyzing(false);
      }
    }
  };

  // Function to manually trigger analysis
  const handleAnalyze = useCallback(() => {
    if (!isLoading && !isAnalyzing) {
      // Rate limit analysis - prevent triggering too frequently
      const now = Date.now();
      const analysisCooldown = 10000; // 10 seconds between analysis attempts
      
      if ((now - lastAnalysisTimeRef.current) < analysisCooldown) {
        toast.info("Please wait before analyzing again", { duration: 3000 });
        return;
      }
      
      setIsAnalyzing(true);
      clearError(); // Clear any previous errors
      toast.info("Analyzing recipe chemistry and reactions...", { duration: 5000 });
      
      // Start both analyses in parallel
      Promise.all([
        refetch().catch(error => {
          console.error("Analysis error:", error);
          setError(error);
          toast.error("Failed to analyze recipe: " + (error instanceof Error ? error.message : "Unknown error"));
        }),
        analyzeReactions()
      ]).finally(() => {
        setIsAnalyzing(false);
        setHasAppliedUpdates(false); // Reset this flag to allow new updates
      });
    }
  }, [refetch, isLoading, isAnalyzing, clearError]);

  // Improved logic to check if we already have valid analysis data
  const hasValidAnalysisData = useCallback(() => {
    // Check for complete analysis data
    const hasCompleteAnalysis = hasAnalysisData && 
      stepReactions && 
      stepReactions.length > 0 && 
      !stepReactions.some(r => r.metadata?.isTempFallback) &&
      scienceNotes && 
      scienceNotes.length > 0;
    
    console.log('Analysis data check:', { 
      hasAnalysisData, 
      stepReactionsCount: stepReactions?.length, 
      hasFallbacks: stepReactions?.some(r => r.metadata?.isTempFallback),
      scienceNotesCount: scienceNotes?.length,
      hasCompleteAnalysis
    });
    
    return hasCompleteAnalysis;
  }, [hasAnalysisData, stepReactions, scienceNotes]);

  // Auto-analyze when opened for the first time, but only if needed
  useEffect(() => {
    // Only trigger analysis if:
    // 1. We haven't analyzed this recipe before
    // 2. We're not currently analyzing
    // 3. We don't already have valid analysis data
    if (!initialAnalysisRef.current && !isAnalyzing && !hasValidAnalysisData()) {
      console.log('Auto-triggering analysis for recipe:', recipe.title);
      initialAnalysisRef.current = true;
      
      // Small delay to prevent immediate analysis on mount
      const timer = setTimeout(() => {
        handleAnalyze();
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (!initialAnalysisRef.current) {
      console.log('Skipping auto-analysis - data already present for:', recipe.title);
      initialAnalysisRef.current = true;
    }
  }, [handleAnalyze, isAnalyzing, hasValidAnalysisData, recipe.title]);

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
          toast.success('Recipe analysis data saved');
        }
      } else {
        toast.info('Analysis complete, but no changes needed.');
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
    globalAnalysis,
    hasAnalysisData,
    handleAnalyze,
    error
  };
}
