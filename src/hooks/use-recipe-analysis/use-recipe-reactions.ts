
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from 'sonner';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import type { Recipe } from '@/types/recipe';

/**
 * Hook to handle recipe reaction analysis
 */
export function useRecipeReactions(recipe: Recipe) {
  const { 
    stepReactions, 
    scienceNotes, 
    hasAnalysisData, 
    isLoading,
    error: recipeScienceError,
    refetch: refetchReactions 
  } = useRecipeScience(recipe);
  
  // Use error handler for standardized error handling
  const { error, setError, clearError } = useErrorHandler({
    toastTitle: 'Reactions Analysis Error',
    showToast: false // We'll handle toasts manually for better UX
  });

  // Function to analyze reactions with OpenAI
  const fetchReactions = async () => {
    if (!recipe.instructions || recipe.instructions.length === 0) {
      toast.error('Cannot analyze: Recipe has no instructions');
      return;
    }
    
    try {
      clearError();
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
        await refetchReactions();
        return response.data;
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('timed out')) {
          throw new Error('Analysis request timed out. Please try again later.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error analyzing reactions:', error);
      setError(error);
      throw error;
    }
  };

  return {
    stepReactions: stepReactions || [],
    scienceNotes,
    hasAnalysisData,
    isLoading,
    error: error || recipeScienceError,
    fetchReactions,
    clearError
  };
}
