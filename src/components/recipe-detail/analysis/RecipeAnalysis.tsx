
import React from 'react';
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
import type { Recipe } from '@/types/recipe';

interface RecipeAnalysisProps {
  recipe: Recipe;
  isOpen?: boolean;
  onRecipeUpdate?: (updatedRecipe: Recipe) => void;
}

export function RecipeAnalysis({ recipe, isOpen = true, onRecipeUpdate }: RecipeAnalysisProps) {
  const { updateRecipe } = useRecipeUpdates(recipe.id);
  
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
        },
        onError: (error) => {
          console.error('Failed to update recipe with analysis data:', error);
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
  const showAnalysisPrompt = (!analysis && !isLoading && (!stepReactions || stepReactions.length === 0) && !isAnalyzing) || 
    (!hasAnyContent && !isAnalyzing && !isLoading);

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
        <AnalysisContent
          chemistry={chemistry}
          techniques={techniques}
          troubleshooting={troubleshooting}
          rawResponse={analysis?.textResponse || null}
          stepReactions={stepReactions}
          globalAnalysis={globalAnalysis}
        />
      ) : (
        <EmptyAnalysis onAnalyze={handleAnalyze} />
      )}
    </CardWrapper>
  );
}
