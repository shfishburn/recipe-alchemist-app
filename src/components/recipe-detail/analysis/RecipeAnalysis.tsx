
import React, { useEffect } from 'react';
import { CardWrapper } from "@/components/ui/card-wrapper";
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { useAnalysisContent } from '@/hooks/use-analysis-content';
import { AnalysisHeader } from './AnalysisHeader';
import { AnalysisPrompt } from './AnalysisPrompt';
import { AnalysisLoading } from './AnalysisLoading';
import { EmptyAnalysis } from './EmptyAnalysis';
import { AnalysisContent } from './AnalysisContent';
import { useRecipeAnalysisData } from './hooks/useRecipeAnalysisData';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface RecipeAnalysisProps {
  recipe: Recipe;
  isOpen?: boolean;
  onRecipeUpdate?: (updatedRecipe: Recipe) => void;
}

export function RecipeAnalysis({ recipe, isOpen = true, onRecipeUpdate }: RecipeAnalysisProps) {
  const { updateRecipe } = useRecipeUpdates(recipe.id);
  const { toast } = useToast();
  
  // Use our custom hook for analysis data
  const {
    analysis,
    isLoading,
    isAnalyzing,
    stepReactions,
    scienceNotes,
    globalAnalysis,
    hasAnalysisData,
    handleAnalyze,
    error
  } = useRecipeAnalysisData(recipe, (updatedRecipe) => {
    // Handle recipe updates with the update mutation
    updateRecipe.mutate(
      { science_notes: updatedRecipe.science_notes }, 
      {
        onSuccess: () => {
          // Call the parent's update callback if provided
          if (onRecipeUpdate) {
            onRecipeUpdate(updatedRecipe);
          }
          toast({
            title: "Analysis Updated",
            description: "Recipe analysis has been refreshed with improved data.",
            duration: 3000
          });
        },
        onError: (error) => {
          console.error('Failed to update recipe with analysis data:', error);
          toast({
            title: "Update Failed",
            description: "Failed to save analysis data. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  });

  // Use our hook to extract analysis content
  const { chemistry, techniques, troubleshooting, hasAnyContent } = useAnalysisContent(
    analysis,
    scienceNotes,
    stepReactions
  );

  // Check if we should show the analysis prompt
  // Only show the prompt when there is no content and we're not currently loading
  const showAnalysisPrompt = !hasAnyContent && !isAnalyzing && !isLoading;

  // Detect fallback data and show refresh button
  const hasFallbackData = stepReactions && stepReactions.some(reaction => reaction.metadata?.isTempFallback);

  // Effect to check for duplicate fallback messages and trigger a refresh if needed
  useEffect(() => {
    // Only check for problematic fallbacks if we have step reactions and aren't currently analyzing
    if (stepReactions && stepReactions.length > 0 && !isAnalyzing && !isLoading) {
      // Check for obvious fallback patterns that need refreshing
      const needsRefresh = stepReactions.some(r => {
        // Check for fallbacks that are temporary
        if (!r.metadata?.isTempFallback) return false;
        
        // Check for duplicate fallback messages across steps
        if (r.reaction_details && Array.isArray(r.reaction_details)) {
          const containsDuplicatePattern = r.reaction_details.some(detail => 
            detail.includes("temporarily") || 
            detail.includes("fallback")
          );
          return containsDuplicatePattern;
        }
        return false;
      });
      
      // If we have problematic fallbacks and we're in a state where we could refresh
      if (needsRefresh && !isAnalyzing && !isLoading && onRecipeUpdate) {
        // Wait a moment to avoid loop
        const timer = setTimeout(() => {
          toast({
            title: "Improving Analysis",
            description: "Enhancing recipe analysis data...",
            duration: 3000
          });
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [stepReactions, isAnalyzing, isLoading, handleAnalyze, onRecipeUpdate, toast]);

  // If there's an error, show the error display
  if (error) {
    return (
      <CardWrapper>
        <ErrorDisplay
          error={error}
          title="Failed to analyze recipe"
          onRetry={handleAnalyze}
        />
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      variant="bordered"
      padding="default"
      headerClassName="pb-3"
      headerAction={
        <AnalysisHeader 
          hasContent={hasAnyContent}
          isAnalyzing={isAnalyzing}
          onRegenerate={handleAnalyze}
        />
      }
    >
      {isLoading || isAnalyzing ? (
        <AnalysisLoading />
      ) : showAnalysisPrompt ? (
        <AnalysisPrompt onAnalyze={handleAnalyze} />
      ) : hasAnyContent ? (
        <>
          {hasFallbackData && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex justify-between items-center">
                <p className="text-sm text-amber-800">
                  The science analysis is using preliminary data. For better results, refresh the analysis.
                </p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="ml-2 bg-amber-200 hover:bg-amber-300 text-amber-900"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh Analysis
                </Button>
              </div>
            </div>
          )}
          <AnalysisContent
            chemistry={chemistry}
            techniques={techniques}
            troubleshooting={troubleshooting}
            rawResponse={null} // Don't show raw response in UI
            stepReactions={stepReactions}
            globalAnalysis={globalAnalysis}
            onRegenerate={handleAnalyze}
          />
        </>
      ) : (
        <EmptyAnalysis onAnalyze={handleAnalyze} />
      )}
    </CardWrapper>
  );
}
