import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Beaker } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { FormattedText } from '@/components/recipe-chat/response/FormattedText';
import { useRecipeScience, formatReactionName } from '@/hooks/use-recipe-science';
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
  isOpen: boolean;
  onToggle: () => void;
  onRecipeUpdated?: (updatedRecipe: Recipe) => void;
}

export function RecipeAnalysis({ recipe, isOpen, onToggle, onRecipeUpdated }: RecipeAnalysisProps) {
  const { updateRecipe } = useRecipeUpdates(recipe.id);
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisRequestRef = useRef<AbortController | null>(null);

  // Use our new unified science data hook
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
      
      // Track analysis completion status for both operations
      let analysisCompleted = false;
      let reactionsCompleted = false;
      
      // Start both analyses in parallel
      refetch().then(() => {
        analysisCompleted = true;
        if (reactionsCompleted) {
          setIsAnalyzing(false);
        }
      }).catch(error => {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze recipe: " + (error instanceof Error ? error.message : "Unknown error"));
        analysisCompleted = true;
        if (reactionsCompleted) {
          setIsAnalyzing(false);
        }
      });
      
      analyzeReactions().then(() => {
        reactionsCompleted = true;
        if (analysisCompleted) {
          setIsAnalyzing(false);
        }
      });
    }
  }, [refetch, isLoading, isAnalyzing, analyzeReactions]);

  // Auto-analyze when opened for the first time
  useEffect(() => {
    if (isOpen && !initialAnalysisRef.current && !isAnalyzing) {
      initialAnalysisRef.current = true;
      handleAnalyze();
    }
  }, [isOpen, handleAnalyze, isAnalyzing]);

  // Apply analysis updates to recipe when data is available
  useEffect(() => {
    // Only run this effect if we have analysis data, we haven't applied updates yet,
    // and there's a callback for updates
    if (analysis && 
        analysis.science_notes && 
        onRecipeUpdated && 
        !hasAppliedUpdates && 
        initialAnalysisRef.current) {
      
      // SAFETY CHECK: Only apply updates if we actually have content to apply
      const hasNewScienceNotes = Array.isArray(analysis.science_notes) && analysis.science_notes.length > 0;
      
      // Only proceed if we have meaningful science notes to update
      if (hasNewScienceNotes) {
        setHasAppliedUpdates(true); // Mark updates as applied to prevent further runs
        
        // Prepare a safe update object that won't overwrite existing data
        const updatedData: Partial<Recipe> = {
          // Always include the ID
          id: recipe.id,
          // Only update science notes, not core recipe data
          science_notes: analysis.science_notes
        };
        
        // Update with safely constructed data - only science notes
        updateRecipe.mutate(updatedData, {
          onSuccess: (updatedRecipe) => {
            // Pass only the updated recipe to the callback
            onRecipeUpdated(updatedRecipe as Recipe);
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
        });
      } else {
        toast.info('Analysis complete, but no changes needed.');
        setIsAnalyzing(false);
      }
    } else if (analysis && !isLoading) {
      // If we have analysis data but aren't updating the recipe
      setIsAnalyzing(false);
    }
  }, [analysis, hasAppliedUpdates, updateRecipe, onRecipeUpdated, recipe.id, isLoading]);

  // Build reaction content with improved display
  const buildReactionContent = useCallback(() => {
    if (!stepReactions || stepReactions.length === 0) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
          Step-by-Step Reaction Analysis
        </h3>
        <div className="space-y-4">
          {stepReactions.map((reaction, index) => {
            // Skip entries without step text
            if (!reaction.step_text) return null;
            
            // Safely access reaction details
            const reactionDetails = Array.isArray(reaction.reaction_details) && reaction.reaction_details.length > 0 
              ? reaction.reaction_details[0] 
              : '';
              
            return (
              <div key={`reaction-${index}`} className="p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Step {index + 1}: {reaction.step_text}</p>
                    {reactionDetails && (
                      <p className="text-sm text-slate-600 mt-2">{reactionDetails}</p>
                    )}
                  </div>
                </div>
                {reaction.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200">
                    {reaction.reactions.map((type, i) => (
                      <span 
                        key={`${index}-${i}`} 
                        className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full"
                      >
                        {formatReactionName(type)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [stepReactions]);

  // Extract and format the content sections from the analysis
  const extractAnalysisContent = useCallback(() => {
    // First check for pre-existing notes in the recipe
    const existingNotes = scienceNotes.length > 0;
    
    // If we don't have analysis data, fall back to recipe notes
    if (!analysis) {
      return { 
        chemistry: existingNotes ? scienceNotes.join('\n\n') : null,
        techniques: null,
        troubleshooting: null
      };
    }
    
    // Helper to extract sections from raw text
    const extractSectionFromText = (rawText: string | undefined, sectionName: string) => {
      if (!rawText) return null;
      
      // Look for markdown headers (### Section Name)
      const sectionRegex = new RegExp(`#+\\s*${sectionName}([^#]*?)(?=(?:#+\\s|$))`, 'is');
      const match = rawText.match(sectionRegex);
      
      if (match && match[1] && match[1].trim().length > 20) {
        return match[1].trim();
      }
      
      // Enhanced paragraph pattern matching for blocks of text
      const paragraphsRegex = new RegExp(`(${sectionName}[^.!?]*(?:[.!?][^.!?]*){1,5})`, 'i');
      const paragraphMatch = rawText.match(paragraphsRegex);
      
      if (paragraphMatch && paragraphMatch[0].length > 40) {
        return paragraphMatch[0];
      }
      
      // If still no content, look for keyword-rich paragraphs
      const keywords = sectionName.replace(/[()]/g, '').split('|');
      const paragraphs = rawText.split(/\n\n+/);
      
      for (const keyword of keywords) {
        for (const paragraph of paragraphs) {
          if (paragraph.toLowerCase().includes(keyword.toLowerCase()) && paragraph.length > 60) {
            return paragraph;
          }
        }
      }
      
      return null;
    };

    // Extract chemistry section with more robust fallbacks
    const chemistry = (analysis.science_notes && Array.isArray(analysis.science_notes) && analysis.science_notes.length > 0)
      ? analysis.science_notes.join('\n\n')
      : extractSectionFromText(analysis.textResponse, "(Chemistry|Chemical|Science|Maillard|Reaction)")
        || (existingNotes ? scienceNotes.join('\n\n') : null);
    
    // Extract techniques section
    const techniques = (analysis.techniques && Array.isArray(analysis.techniques) && analysis.techniques.length > 0)
      ? analysis.techniques.join('\n\n')
      : extractSectionFromText(analysis.textResponse, "(Technique|Method|Cooking|Temperature)");
    
    // Extract troubleshooting section
    const troubleshooting = (analysis.troubleshooting && Array.isArray(analysis.troubleshooting) && analysis.troubleshooting.length > 0)
      ? analysis.troubleshooting.join('\n\n')
      : extractSectionFromText(analysis.textResponse, "(Troubleshoot|Problem|Issue|Common)");
    
    return { chemistry, techniques, troubleshooting };
  }, [analysis, scienceNotes]);

  const { chemistry, techniques, troubleshooting } = extractAnalysisContent();
  const reactionsContent = buildReactionContent();

  // Determine if there's any analysis content available
  const hasAnyContent = 
    (chemistry !== null && chemistry !== undefined) || 
    (techniques !== null && techniques !== undefined) || 
    (troubleshooting !== null && troubleshooting !== undefined) ||
    (analysis?.textResponse && analysis.textResponse.length > 50) ||
    (stepReactions && stepReactions.length > 0);

  // Check if we should show the analysis prompt
  const showAnalysisPrompt = (!analysis && !isLoading && (!stepReactions || stepReactions.length === 0) && !isAnalyzing) || 
    (!hasAnyContent && !isAnalyzing && !isLoading);

  // Show only section headers that have content
  const hasChemistry = chemistry !== null && chemistry !== undefined && chemistry.length > 0;
  const hasTechniques = techniques !== null && techniques !== undefined && techniques.length > 0;
  const hasTroubleshooting = troubleshooting !== null && troubleshooting !== undefined && troubleshooting.length > 0;
  const hasReactions = stepReactions && stepReactions.length > 0;
  const hasRawResponse = analysis?.textResponse && analysis.textResponse.length > 50 &&
    !hasChemistry && !hasTechniques && !hasTroubleshooting;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="mt-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
              <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
              Scientific Analysis
            </CardTitle>
            <div className="flex items-center space-x-2">
              {!isAnalyzing && hasAnyContent && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnalyze();
                  }}
                  className="text-xs"
                >
                  Regenerate
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  {isOpen ? (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  )}
                  <span className="sr-only">Toggle section</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CardDescription>
            In-depth breakdown of cooking chemistry and techniques
          </CardDescription>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            {isLoading || isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Analyzing recipe chemistry...</span>
              </div>
            ) : showAnalysisPrompt ? (
              <div className="text-center py-6">
                <p className="mb-4 text-muted-foreground">Click the Analyze Recipe button to generate a scientific analysis of this recipe.</p>
                <Button onClick={handleAnalyze}>
                  <Beaker className="h-5 w-5 mr-2" />
                  Analyze Recipe
                </Button>
              </div>
            ) : hasAnyContent ? (
              <div className="space-y-6">
                {/* Chemistry Section - only show if we have content */}
                {hasChemistry && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                      <Beaker className="h-5 w-5 mr-2 text-blue-600" />
                      Chemistry
                    </h3>
                    <div className="prose prose-sm max-w-none bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                      <FormattedText text={chemistry} preserveWhitespace={true} />
                    </div>
                  </div>
                )}
                
                {/* Techniques Section - only show if we have content */}
                {hasTechniques && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-amber-600">
                        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/>
                        <path d="m8 12 4 4 4-4"/>
                        <path d="M12 8v8"/>
                      </svg>
                      Cooking Techniques
                    </h3>
                    <div className="prose prose-sm max-w-none bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                      <FormattedText text={techniques} preserveWhitespace={true} />
                    </div>
                  </div>
                )}
                
                {/* Troubleshooting Section - only show if we have content */}
                {hasTroubleshooting && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-600">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      Troubleshooting Guide
                    </h3>
                    <div className="prose prose-sm max-w-none bg-green-50/50 p-4 rounded-lg border border-green-100">
                      <FormattedText text={troubleshooting} preserveWhitespace={true} />
                    </div>
                  </div>
                )}
                
                {/* Reaction Analysis Section - only show if we have content */}
                {hasReactions && reactionsContent}
                
                {/* Fallback when structured sections aren't extracted */}
                {hasRawResponse && (
                  <div className="prose prose-sm max-w-none bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <FormattedText text={analysis.textResponse} preserveWhitespace={true} />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="mb-4 text-muted-foreground">No analysis data available for this recipe.</p>
                <Button onClick={handleAnalyze}>
                  <Beaker className="h-5 w-5 mr-2" />
                  Generate Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
