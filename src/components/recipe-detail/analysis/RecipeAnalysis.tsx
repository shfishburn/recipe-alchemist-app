
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { toast } from 'sonner';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useAnalysisContent } from '@/hooks/use-analysis-content';
import { AnalysisHeader } from './AnalysisHeader';
import { AnalysisPrompt } from './AnalysisPrompt';
import { AnalysisLoading } from './AnalysisLoading';
import { EmptyAnalysis } from './EmptyAnalysis';
import { AnalysisContent } from './AnalysisContent';
import type { Recipe } from '@/types/recipe';

// Define the analysis response type
interface AnalysisResponse {
  textResponse?: string;
  science_notes?: string[];
  techniques?: string[];
  troubleshooting?: string[];
  changes?: any;
  error?: string;
}

interface RecipeAnalysisProps {
  recipe: Recipe;
  isOpen?: boolean;
  onRecipeUpdate?: (updatedRecipe: Recipe) => void;
}

export function RecipeAnalysis({ recipe, isOpen = true, onRecipeUpdate }: RecipeAnalysisProps) {
  const { updateRecipe } = useRecipeUpdates(recipe.id);
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisRequestRef = useRef<AbortController | null>(null);

  // Use our unified science data hook
  const { stepReactions, hasAnalysisData, scienceNotes, refetch: refetchReactions } = useRecipeScience(recipe);
  
  // Fetch general analysis data from recipe-chat
  const { data: analysis, isLoading, refetch } = useQuery<AnalysisResponse, Error>({
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
        const response = await supabase.functions.invoke('recipe-chat', {
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
        
        console.log('Analysis data received:', response);
        return response as AnalysisResponse;
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
  }, [refetch, isLoading, isAnalyzing, analyzeReactions]);

  // Auto-analyze when opened for the first time
  useEffect(() => {
    if (isOpen && !initialAnalysisRef.current && !isAnalyzing && !hasAnalysisData) {
      initialAnalysisRef.current = true;
      handleAnalyze();
    }
  }, [isOpen, handleAnalyze, isAnalyzing, hasAnalysisData]);

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
        
        // Update with safely constructed data - only science notes
        updateRecipe.mutate(
          { science_notes: analysis.science_notes }, 
          {
            onSuccess: (updatedRecipe) => {
              // Pass only the updated recipe to the callback
              onRecipeUpdate(updatedRecipe as Recipe);
              toast.success('Recipe analysis complete');
              setIsAnalyzing(false);
            },
            onError: (error) => {
              console.error('Failed to update recipe with analysis data:', error);
              toast.error('Failed to update recipe with analysis');
              // Reset the flag if there was an error so we can try again
              setHasAppliedUpdates(false);
              setIsAnalyzing(false);
            }
          }
        );
      } else {
        toast.info('Analysis complete, but no changes needed.');
        setIsAnalyzing(false);
      }
    }
  }, [analysis, hasAppliedUpdates, updateRecipe, onRecipeUpdate, recipe.id, isAnalyzing]);

  // Use our hook to extract analysis content
  const { chemistry, techniques, troubleshooting, hasAnyContent } = useAnalysisContent(
    analysis,
    scienceNotes,
    stepReactions
  );

  // Check if we should show the analysis prompt
  const showAnalysisPrompt = (!analysis && !isLoading && (!stepReactions || stepReactions.length === 0) && !isAnalyzing) || 
    (!hasAnyContent && !isAnalyzing && !isLoading);

  return (
    <Card>
      <CardHeader className="pb-3">
        <AnalysisHeader 
          hasContent={hasAnyContent}
          isAnalyzing={isAnalyzing}
          onRegenerate={handleAnalyze}
        />
      </CardHeader>

      <CardContent>
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
          />
        ) : (
          <EmptyAnalysis onAnalyze={handleAnalyze} />
        )}
      </CardContent>
    </Card>
  );
}
