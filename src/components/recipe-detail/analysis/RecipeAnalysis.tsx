
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
  const showAnalysisPrompt = (!analysis && !isLoading && (!stepReactions || stepReactions.length === 0 || 
    (stepReactions.length > 0 && stepReactions[0].metadata?.isTempFallback)) && !isAnalyzing) || 
    (!hasAnyContent && !isAnalyzing && !isLoading);

  // Effect to check for duplicate fallback messages and trigger a refresh if needed
  useEffect(() => {
    if (stepReactions && stepReactions.length > 0) {
      // Check if we have fallbacks that look like duplicates
      const hasFallbacks = stepReactions.some(r => r.metadata?.isTempFallback);
      const hasDuplicateMessages = stepReactions.some(r => 
        r.reaction_details && 
        Array.isArray(r.reaction_details) && 
        r.reaction_details.some(detail => 
          detail.includes("Automatic fallback analysis") || 
          detail.includes("fallback data")
        )
      );
      
      // If we detect suspicious fallbacks and we're not already analyzing
      if ((hasFallbacks || hasDuplicateMessages) && !isAnalyzing && !isLoading) {
        console.log("Detected fallbacks or duplicate messages, will refresh analysis");
        // Don't immediately trigger to avoid loops, wait a moment
        const timer = setTimeout(() => {
          if (onRecipeUpdate) {
            toast({
              title: "Refreshing Analysis",
              description: "Improving recipe analysis data...",
              duration: 3000
            });
            handleAnalyze();
          }
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
        <AnalysisContent
          chemistry={chemistry}
          techniques={techniques}
          troubleshooting={troubleshooting}
          rawResponse={analysis?.textResponse || null}
          stepReactions={stepReactions}
          globalAnalysis={globalAnalysis}
          onRegenerate={handleAnalyze}
        />
      ) : (
        <EmptyAnalysis onAnalyze={handleAnalyze} />
      )}
    </CardWrapper>
  );
}
