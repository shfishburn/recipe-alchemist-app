
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useRef } from 'react';

/**
 * Type definition for the analysis response from the edge function
 */
export interface AnalysisResponse {
  textResponse?: string;
  science_notes?: string[];
  techniques?: string[];
  troubleshooting?: string[];
  error?: string;
}

/**
 * Hook to fetch recipe analysis data from edge function
 */
export function useRecipeAnalysisData(recipeId: string) {
  const analysisRequestRef = useRef<AbortController | null>(null);
  
  // Use error handler for standardized error handling
  const { error, setError, clearError } = useErrorHandler({
    toastTitle: 'Analysis Error',
    showToast: false // We'll handle toasts manually for better UX
  });

  // Fetch general analysis data from recipe-chat
  const {
    data: analysis,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['recipe-analysis', recipeId],
    queryFn: async () => {
      console.log('Fetching recipe analysis for recipe ID:', recipeId);
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
        }, 30000);
        
        // The actual fetch operation
        const { data, error } = await supabase.functions.invoke('recipe-chat', {
          body: { 
            recipeId,
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
    meta: {
      onError: (error: any) => {
        setError(error);
      }
    }
  });
  
  // Function to fetch analysis data
  const fetchAnalysis = async () => {
    try {
      const result = await refetch();
      return result.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  return {
    analysis,
    isLoading,
    error,
    fetchAnalysis,
    clearError
  };
}
