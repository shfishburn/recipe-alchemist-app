
import React, { useEffect, useRef } from 'react';
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
  const updatePendingRef = useRef(false);
  const hasUpdatedRef = useRef(false);
  
  // Deep compare science notes to prevent infinite updates
  const existingNotesRef = useRef<string[]>(recipe.science_notes || []);
  
  // Use our custom hook for analysis data with automatic analysis enabled
  const {
    analysis,
    isLoading,
    isAnalyzing,
    stepReactions,
    scienceNotes,
    hasAnalysisData,
    handleAnalyze,
    error
  } = useRecipeAnalysisData(recipe, (updatedRecipe) => {
    // Avoid unnecessary updates if science notes haven't actually changed
    const existingScienceNotesJson = JSON.stringify(existingNotesRef.current);
    const newScienceNotesJson = JSON.stringify(updatedRecipe.science_notes);
    
    if (existingScienceNotesJson !== newScienceNotesJson && !updatePendingRef.current) {
      updatePendingRef.current = true;
      console.log('Science notes have actually changed, updating recipe');

      // Update the recipe with the new science notes
      updateRecipe.mutate(
        { science_notes: updatedRecipe.science_notes }, 
        {
          onSuccess: () => {
            updatePendingRef.current = false;
            hasUpdatedRef.current = true;
            existingNotesRef.current = updatedRecipe.science_notes;
            
            // Call the parent's update callback if provided
            if (onRecipeUpdate) {
              onRecipeUpdate(updatedRecipe);
            }
          },
          onError: (error) => {
            updatePendingRef.current = false;
            console.error('Failed to update recipe with analysis data:', error);
            toast({
              title: "Update Failed",
              description: "Failed to save analysis data. Please try again.",
              variant: "destructive"
            });
          }
        }
      );
    } else {
      console.log('Science notes unchanged or update already pending, skipping update');
    }
  });

  // Update the ref whenever recipe changes
  useEffect(() => {
    existingNotesRef.current = recipe.science_notes || [];
  }, [recipe.id, recipe.science_notes]);

  // Use our hook to extract analysis content
  const { chemistry, techniques, troubleshooting, hasAnyContent } = useAnalysisContent(
    analysis,
    scienceNotes,
    stepReactions
  );

  // Show analysis prompt only when there is absolutely no data and we're not analyzing
  const showAnalysisPrompt = !hasAnyContent && !isAnalyzing && !isLoading && !hasAnalysisData;

  // Handle force regeneration - will bypass all the caching mechanisms
  const handleForceRegenerate = () => {
    toast({
      title: "Force Regenerating Analysis",
      description: "Re-analyzing recipe with enhanced scientific detail...",
      duration: 5000
    });
    
    // Force the analysis to regenerate
    handleAnalyze();
  };

  // Show a subtle background refresh message when we're analyzing
  useEffect(() => {
    if (isAnalyzing && hasAnyContent) {
      toast({
        title: "Refreshing Analysis",
        description: "Enhancing analysis data in the background...",
        duration: 3000
      });
    }
  }, [isAnalyzing, toast, hasAnyContent]);

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
          onRegenerate={handleForceRegenerate}
        />
      }
    >
      {isLoading ? (
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
          onRegenerate={null} // Remove regenerate button from here
        />
      ) : (
        <EmptyAnalysis onAnalyze={handleAnalyze} />
      )}
    </CardWrapper>
  );
}
