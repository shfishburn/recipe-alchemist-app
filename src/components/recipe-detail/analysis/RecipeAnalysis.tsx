
import React from 'react';
import { CardWrapper } from "@/components/ui/card-wrapper";
import { useRecipeAnalysis } from '@/hooks/use-recipe-analysis';
import { AnalysisHeader } from './AnalysisHeader';
import { AnalysisErrorDisplay } from './AnalysisErrorDisplay';
import { AnalysisContentContainer } from './content/AnalysisContentContainer';
import type { Recipe } from '@/types/recipe';

interface RecipeAnalysisProps {
  recipe: Recipe;
  isOpen?: boolean;
  onRecipeUpdate?: (updatedRecipe: Recipe) => void;
}

export function RecipeAnalysis({ recipe, isOpen = true, onRecipeUpdate }: RecipeAnalysisProps) {
  // Use our custom hook for analysis data
  const {
    analysis,
    isLoading,
    isAnalyzing,
    stepReactions,
    scienceNotes,
    hasAnalysisData,
    handleAnalyze,
    error
  } = useRecipeAnalysis(recipe, onRecipeUpdate);

  // If there's an error, show the error display
  if (error) {
    return <AnalysisErrorDisplay error={error} onRetry={handleAnalyze} />;
  }

  return (
    <CardWrapper
      variant="bordered"
      padding="default"
      headerClassName="pb-3"
      headerAction={
        <AnalysisHeader 
          hasContent={hasAnalysisData}
          isAnalyzing={isAnalyzing}
          onRegenerate={handleAnalyze}
        />
      }
    >
      <AnalysisContentContainer 
        analysis={analysis}
        isLoading={isLoading}
        isAnalyzing={isAnalyzing}
        stepReactions={stepReactions}
        scienceNotes={scienceNotes} 
        hasAnalysisData={hasAnalysisData}
        onAnalyze={handleAnalyze}
      />
    </CardWrapper>
  );
}
