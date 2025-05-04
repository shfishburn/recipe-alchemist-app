
import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeScience } from '@/hooks/use-recipe-science';
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

  // Use our unified science data hook
  const { stepReactions, hasAnalysisData, scienceNotes, refetch: refetchReactions } = useRecipeScience(recipe);
  
  // Fetch general analysis data from recipe-chat
  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['recipe-analysis', recipe.id],
    queryFn: async () => {
      console.log('Fetching recipe analysis for', recipe.title);
      
      try {
        // Create an AbortController for timeout handling
        const abortController = new AbortController();
        analysisRequestRef.current = abortController;
        
        // Set a timeout
        const timeoutId = setTimeout(() => {
          if (analysisRequestRef.current) {
            analysisRequestRef.current.abort();
          }
        }, 30000);
        
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
        
        console.log('Analysis data received:', data);

        if (error) {
          throw new Error(error.message || 'Failed to get analysis');
        }
        
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  // Function to analyze reactions with OpenAI
  const analyzeReactions = async () => {
    if (!recipe.instructions || recipe.instructions.length === 0) {
      toast.error('Cannot analyze: Recipe has no instructions');
      return;
    }
    
    try {
      toast.info('Analyzing recipe reactions...');
      
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 30000);
      
      try {
        const response = await supabase.functions.invoke('analyze-reactions', {
          body: {
            recipe_id: recipe.id,
            title: recipe.title,
            instructions: recipe.instructions
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.error) {
          throw new Error(response.error as string || 'Failed to analyze reactions');
        }
        
        toast.success('Reaction analysis complete');
        refetchReactions();
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('timed out')) {
          throw new Error('Analysis request timed out. Please try again later.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error analyzing reactions:', error);
      toast.error('Failed to analyze reactions: ' + error.message);
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
      setIsAnalyzing(true);
      toast.info("Analyzing recipe chemistry and reactions...", { duration: 5000 });
      
      // Start both analyses in parallel
      Promise.all([
        refetch().catch(error => {
          console.error("Analysis error:", error);
          toast.error("Failed to analyze recipe: " + (error instanceof Error ? error.message : "Unknown error"));
        }),
        analyzeReactions()
      ]).finally(() => {
        setIsAnalyzing(false);
      });
    }
  }, [refetch, isLoading, isAnalyzing]);

  // Auto-analyze when opened for the first time
  useEffect(() => {
    if (!initialAnalysisRef.current && !isAnalyzing && !hasAnalysisData) {
      initialAnalysisRef.current = true;
      handleAnalyze();
    }
  }, [handleAnalyze, isAnalyzing, hasAnalysisData]);

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
        if (onRecipeUpdate) {
          const updatedRecipe = { ...recipe, science_notes: analysis.science_notes };
          onRecipeUpdate(updatedRecipe);
          toast.success('Recipe analysis complete');
        }
        
        setIsAnalyzing(false);
      } else {
        toast.info('Analysis complete, but no changes needed.');
        setIsAnalyzing(false);
      }
    }
  }, [analysis, hasAppliedUpdates, onRecipeUpdate, recipe, isAnalyzing]);

  return {
    analysis,
    isLoading,
    isAnalyzing,
    stepReactions,
    scienceNotes,
    hasAnalysisData,
    handleAnalyze
  };
}
