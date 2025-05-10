
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { analyzeReactions, hasValidAnalysisData } from './analysis-utils';
import type { Recipe } from '@/types/recipe';
import { Button } from '@/components/ui/button';

/**
 * Custom hook to handle the recipe analysis workflow
 */
export function useAnalyzeRecipe(
  recipe: Recipe,
  isLoading: boolean,
  isAnalyzing: boolean,
  hasAnalysisData: boolean,
  stepReactions: any[] | undefined,
  scienceNotes: string[] | undefined,
  lastAnalysisTimeRef: React.MutableRefObject<number>,
  setIsAnalyzing: (value: boolean) => void,
  clearError: () => void,
  setError: (error: Error) => void,
  refetch: () => Promise<any>,
  refetchReactions: () => Promise<void>
) {
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
    const hasComplete = hasValidAnalysisData(hasAnalysisData, stepReactions, scienceNotes);
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
                analyzeReactions(recipe).then(refetchReactions)
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
      analyzeReactions(recipe).then(refetchReactions).catch(error => {
        console.error("Reaction analysis error:", error);
        setError(error);
      })
    ]).finally(() => {
      setIsAnalyzing(false);
    });
  }, [
    refetch, isLoading, isAnalyzing, clearError, hasAnalysisData, 
    stepReactions, scienceNotes, recipe, refetchReactions, setError, 
    setIsAnalyzing, lastAnalysisTimeRef
  ]);

  return {
    handleAnalyze
  };
}
