
import { toast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import { supabase } from '@/integrations/supabase/client';

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
 * Helper function to check if we already have valid analysis data
 */
export function hasValidAnalysisData(
  hasAnalysisData: boolean, 
  stepReactions: any[] | undefined, 
  scienceNotes: string[] | undefined
): boolean {
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
}

/**
 * Function to analyze reactions with OpenAI - with better fallbacks
 */
export async function analyzeReactions(recipe: Recipe): Promise<void> {
  if (!recipe.instructions || recipe.instructions.length === 0) {
    toast({
      title: 'Cannot Analyze',
      description: 'Recipe has no instructions',
      variant: 'destructive'
    });
    return Promise.reject(new Error('Recipe has no instructions'));
  }
  
  try {
    // Use a subtle toast for background analysis
    toast({
      title: 'Analysis Started',
      description: 'Analyzing recipe reactions...',
      duration: 3000
    });
    
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
      
      return Promise.resolve();
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('timed out')) {
        throw new Error('Analysis request timed out. Please try again later.');
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Error analyzing reactions:', error);
    throw error;
  }
}

/**
 * Fetches general analysis data from recipe-chat
 */
export async function fetchRecipeAnalysis(recipe: Recipe, abortController: AbortController): Promise<AnalysisResponse> {
  console.log('Fetching recipe analysis for', recipe.title);
  
  try {
    // Set a timeout
    const timeoutId = setTimeout(() => {
      if (abortController) {
        abortController.abort();
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
}
