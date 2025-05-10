
import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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
        
        // Cache the last successful analysis time
        lastAnalysisTimeRef.current = Date.now();
        
        if (error) {
          console.error('Error fetching recipe analysis:', error);
          throw new Error(error.message || 'Failed to get analysis');
        }
        
        console.log('Analysis data received:', data ? 'success' : 'failed');
        
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
    enabled: false, // Don't auto-fetch on mount, we'll control this
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 1,
    meta: {
      onError: (error: any) => setError(error) // Use the meta option for error handling
    }
  });

  // Function to analyze reactions with OpenAI - now with better fallbacks
  const analyzeReactions = async () => {
    if (!recipe.instructions || recipe.instructions.length === 0) {
      toast({
        title: 'Cannot Analyze',
        description: 'Recipe has no instructions',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Use a subtle toast for background analysis
      if (hasAnalysisData) {
        toast({
          title: 'Analysis Update',
          description: 'Enhancing analysis data...',
          duration: 2000
        });
      } else {
        toast({
          title: 'Analysis Started',
          description: 'Analyzing recipe reactions...',
          duration: 3000
        });
      }
      
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
        
        // Only show success toast if this wasn't a background operation
        if (!hasAnalysisData) {
          toast({
            title: 'Analysis Complete',
            variant: 'success',
            duration: 3000
          });
        }
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
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      // Only reset analyzing state once both operations are complete or have failed
      if (!analysis) {
        setIsAnalyzing(false);
      }
    }
  };

  // Improved function to check if we already have valid analysis data
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

  // Function to manually trigger analysis - now with automatic background refresh
  const handleAnalyze = useCallback(() => {
    // Don't regenerate if already analyzing
    if (isLoading || isAnalyzing) {
      toast({
        title: 'Analysis in Progress',
        description: "Please wait for the current analysis to complete",
        duration: 3000
      });
      return;
    }
    
    // Check if we already have complete analysis data
    const hasComplete = hasValidAnalysisData();
    if (hasComplete && (Date.now() - lastAnalysisTimeRef.current) < 60000) {
      toast({
        title: 'Analysis Already Complete',
        description: "This recipe already has complete analysis data. Still want to regenerate?",
        duration: 5000,
        action: (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              // Force regeneration
              setIsAnalyzing(true);
              clearError();
              
              Promise.all([
                refetch(),
                analyzeReactions()
              ]).finally(() => {
                setIsAnalyzing(false);
              });
            }}
          >
            Regenerate
          </Button>
        )
      });
      return;
    }
    
    // Rate limit analysis - prevent triggering too frequently
    const now = Date.now();
    const analysisCooldown = 10000; // 10 seconds between analysis attempts
    
    if ((now - lastAnalysisTimeRef.current) < analysisCooldown) {
      toast({
        title: 'Please Wait',
        description: "Analysis in progress, please wait before analyzing again",
        duration: 3000
      });
      return;
    }
    
    setIsAnalyzing(true);
    clearError(); // Clear any previous errors
    
    // Use a less intrusive message if we already have content
    if (hasAnalysisData) {
      toast({
        title: 'Background Analysis',
        description: "Enhancing analysis in the background...",
        duration: 3000
      });
    } else {
      toast({
        title: 'Analysis Started',
        description: "Analyzing recipe chemistry and reactions...",
        duration: 5000
      });
    }
    
    // Start both analyses in parallel
    Promise.all([
      refetch().catch(error => {
        console.error("Analysis error:", error);
        setError(error);
        toast({
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
      }),
      analyzeReactions()
    ]).finally(() => {
      setIsAnalyzing(false);
      setHasAppliedUpdates(false); // Reset this flag to allow new updates
    });
  }, [refetch, isLoading, isAnalyzing, clearError, hasAnalysisData, hasValidAnalysisData, analyzeReactions, refetchReactions, setError]);

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
