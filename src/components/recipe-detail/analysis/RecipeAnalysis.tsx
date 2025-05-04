import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Beaker, BookOpen, BookOpenText, AlertCircle, ChevronUp, ChevronDown, Atom } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import type { Recipe } from '@/types/recipe';

// Define reaction item type
interface ReactionItem {
  step_index: number;
  step_text: string;
  reactions: string[];
  reaction_details: string[];
  confidence: number;
}

interface RecipeAnalysisProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
  onRecipeUpdated?: (updatedRecipe: Recipe) => void;
}

// Helper type for parsed content storage
interface TabContent {
  chemistry: React.ReactNode[];
  techniques: React.ReactNode[];
  troubleshooting: React.ReactNode[];
  reactions: React.ReactNode[];
}

export function RecipeAnalysis({ recipe, isOpen, onToggle, onRecipeUpdated }: RecipeAnalysisProps) {
  const { updateRecipe } = useRecipeUpdates(recipe.id);
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  const [activeTab, setActiveTab] = useState("chemistry");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reactionData, setReactionData] = useState<ReactionItem[]>([]);
  
  // Store parsed content to ensure consistency between tab switches
  const [parsedContent, setParsedContent] = useState<TabContent>({
    chemistry: [],
    techniques: [],
    troubleshooting: [],
    reactions: []
  });
  
  // Flag to track if content has been parsed
  const contentParsedRef = useRef(false);

  // Fetch reaction data from Supabase
  const { data: reactions, isLoading: isLoadingReactions, refetch: refetchReactions } = useQuery({
    queryKey: ['recipe-reactions', recipe.id],
    queryFn: async () => {
      console.log('Fetching recipe reactions for', recipe.id);
      
      try {
        const { data, error } = await supabase
          .from('recipe_step_reactions')
          .select('*')
          .eq('recipe_id', recipe.id)
          .order('step_index', { ascending: true });
        
        if (error) {
          console.error('Error fetching recipe reactions:', error);
          return [];
        }
        
        return data as ReactionItem[];
      } catch (err) {
        console.error('Error in query execution:', err);
        return [];
      }
    },
    enabled: isOpen, // Only fetch when the analysis section is open
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  // Fetch general analysis data from recipe-chat
  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['recipe-analysis', recipe.id],
    queryFn: async () => {
      console.log('Fetching recipe analysis for', recipe.title);
      
      try {
        // Create an AbortController for timeout handling
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Analysis request timed out')), 30000)
        );
        
        // The actual fetch operation
        const fetchPromise = supabase.functions.invoke('recipe-chat', {
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
        
        // Use Promise.race to implement timeout
        const result = await Promise.race([fetchPromise, timeoutPromise]);
        
        console.log('Analysis data received:', result);
        return result;
      } catch (error: any) {
        if (error.message.includes('timed out')) {
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
      
      try {
        // Use Promise.race to implement timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Reaction analysis timed out')), 30000)
        );
        
        const apiPromise = supabase.functions.invoke('analyze-reactions', {
          body: {
            recipe_id: recipe.id,
            title: recipe.title,
            instructions: recipe.instructions
          }
        });
        
        const response = await Promise.race([apiPromise, timeoutPromise]);
        
        if (response.error) {
          throw new Error(response.error.message || 'Failed to analyze reactions');
        }
        
        toast.success('Reaction analysis complete');
        refetchReactions();
      } catch (error: any) {
        if (error.message.includes('timed out')) {
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
      // Reset content parsing state when manually retrying
      contentParsedRef.current = false;
      setParsedContent({
        chemistry: [],
        techniques: [],
        troubleshooting: [],
        reactions: []
      });
      
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
  }, [isOpen, handleAnalyze]);

  // Process reactions when they're loaded
  useEffect(() => {
    if (reactions && reactions.length > 0) {
      setReactionData(reactions as ReactionItem[]);
      
      // Create content for the reactions tab
      const reactionNodes = reactions.map((reaction: ReactionItem, index) => {
        const reactionTypes = Array.isArray(reaction.reactions) ? reaction.reactions : [];
        const reactionDetails = Array.isArray(reaction.reaction_details) && reaction.reaction_details.length > 0 
          ? reaction.reaction_details[0] 
          : '';
          
        return (
          <div key={`reaction-${index}`} className="mb-6">
            <div className="flex items-start gap-3 mb-2">
              <div className="mt-1 flex-shrink-0">
                <Atom className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{reaction.step_text}</p>
                {reactionDetails && (
                  <p className="text-sm text-slate-600 mt-1">{reactionDetails}</p>
                )}
              </div>
            </div>
            {reactionTypes.length > 0 && (
              <div className="ml-8 flex flex-wrap gap-2 mt-2">
                {reactionTypes.map((type, i) => (
                  <span 
                    key={`${index}-${i}`} 
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >
                    {formatReactionName(type)}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      });
      
      // Update the reactions tab content
      setParsedContent(prev => ({
        ...prev,
        reactions: reactionNodes
      }));
    }
  }, [reactions]);

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

  // Format reaction names for display
  const formatReactionName = (reaction: string): string => {
    return reaction
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Pre-process content once when analysis data is available
  useEffect(() => {
    if (analysis && !contentParsedRef.current) {
      // Process each content section and store it for consistent display
      const newContent: TabContent = {
        chemistry: [],
        techniques: [],
        troubleshooting: [],
        reactions: parsedContent.reactions // Keep existing reaction content
      };
      
      // Process chemistry section
      if (analysis.science_notes && Array.isArray(analysis.science_notes) && analysis.science_notes.length > 0) {
        newContent.chemistry = analysis.science_notes.map((note, i) => formatScienceNote(note, i));
      } else if (analysis.textResponse) {
        // Try to extract chemistry section from raw text
        const chemistryContent = extractSectionFromText(
          analysis.textResponse, 
          "(Chemistry|Chemical|Science|Maillard)", 
          "No structured chemistry analysis available. Try regenerating the analysis."
        );
        newContent.chemistry = [chemistryContent];
      }
      
      // Process techniques section
      if (analysis.techniques && Array.isArray(analysis.techniques) && analysis.techniques.length > 0) {
        newContent.techniques = analysis.techniques.map((technique, i) => formatTechnique(technique, i));
      } else if (analysis.textResponse) {
        // Try to extract techniques section from raw text
        const techniquesContent = extractSectionFromText(
          analysis.textResponse, 
          "(Technique|Method|Cooking|Temperature)", 
          "No structured technique analysis available. Try regenerating the analysis."
        );
        newContent.techniques = [techniquesContent];
      }
      
      // Process troubleshooting section
      if (analysis.troubleshooting && Array.isArray(analysis.troubleshooting) && analysis.troubleshooting.length > 0) {
        newContent.troubleshooting = analysis.troubleshooting.map((tip, i) => formatTroubleshooting(tip, i));
      } else if (analysis.textResponse) {
        // Try to extract troubleshooting section from raw text
        const troubleshootingContent = extractSectionFromText(
          analysis.textResponse, 
          "(Troubleshoot|Problem|Issue)", 
          "No structured troubleshooting tips available. Try regenerating the analysis."
        );
        newContent.troubleshooting = [troubleshootingContent];
      }
      
      // Update parsed content state for consistent display
      setParsedContent(newContent);
      contentParsedRef.current = true;
    }
  }, [analysis, parsedContent.reactions]);

  // Helper to format science notes with icons
  function formatScienceNote(note: string, index: number) {
    return (
      <div key={`science-${index}`} className="mb-4 flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          <Beaker className="h-5 w-5 text-blue-500" />
        </div>
        <p className="flex-1">{note}</p>
      </div>
    );
  }
  
  // Helper to format techniques with icons
  function formatTechnique(technique: string, index: number) {
    return (
      <div key={`technique-${index}`} className="mb-4 flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          <BookOpenText className="h-5 w-5 text-green-500" />
        </div>
        <p className="flex-1">{technique}</p>
      </div>
    );
  }

  // Helper to format troubleshooting with icons
  function formatTroubleshooting(tip: string, index: number) {
    return (
      <div key={`troubleshoot-${index}`} className="mb-4 flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </div>
        <p className="flex-1">{tip}</p>
      </div>
    );
  }

  // Enhanced extract section function with better pattern matching
  function extractSectionFromText(rawText: string | undefined, sectionName: string, defaultText?: string): React.ReactNode {
    if (!rawText) return defaultText ? <p>{defaultText}</p> : null;
    
    // Look for markdown headers (### Section Name) with more flexible matching
    const sectionRegex = new RegExp(`#+\\s*${sectionName}([^#]*?)(?=(?:#+\\s|$))`, 'i');
    const match = rawText.match(sectionRegex);
    
    if (match && match[1] && match[1].trim().length > 20) {
      const sectionContent = match[1].trim();
      return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sectionContent.replace(/\n/g, '<br>') }} />;
    }
    
    // Enhanced paragraph pattern matching
    // First look for blocks of text that seem related to the section
    const paragraphsRegex = new RegExp(`(${sectionName}[^.!?]*(?:[.!?][^.!?]*){1,5})`, 'i');
    const paragraphMatch = rawText.match(paragraphsRegex);
    
    if (paragraphMatch && paragraphMatch[0].length > 40) {
      return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: paragraphMatch[0].replace(/\n/g, '<br>') }} />;
    }
    
    // If still no content, look for keyword-rich paragraphs
    const keywords = sectionName.replace(/[()]/g, '').split('|');
    const paragraphs = rawText.split(/\n\n+/);
    
    for (const keyword of keywords) {
      for (const paragraph of paragraphs) {
        if (paragraph.toLowerCase().includes(keyword.toLowerCase()) && paragraph.length > 60) {
          return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\n/g, '<br>') }} />;
        }
      }
    }
    
    // Return default text if no content found
    return defaultText ? <p>{defaultText}</p> : null;
  }

  // Determine if there's any analysis content available
  const hasAnyAnalysisContent = 
    contentParsedRef.current || // We've parsed content already
    (analysis?.science_notes && analysis.science_notes.length > 0) || 
    (analysis?.techniques && analysis.techniques.length > 0) || 
    (analysis?.troubleshooting && analysis.troubleshooting.length > 0) ||
    (analysis?.textResponse && analysis.textResponse.length > 50) ||
    (reactionData && reactionData.length > 0);

  // Check if we should show the analysis prompt
  const showAnalysisPrompt = !analysis && !isLoading && !reactionData.length && !isAnalyzing;

  // Check if the reactions analysis was done (for tab visibility)
  const hasReactionAnalysis = reactionData && reactionData.length > 0;

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
              {!isAnalyzing && hasAnyAnalysisContent && (
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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
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
            {isLoading || isAnalyzing || isLoadingReactions ? (
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
            ) : hasAnyAnalysisContent ? (
              <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center overflow-x-auto mb-4">
                  <TabsList className="flex w-full h-auto p-1 rounded-md">
                    <TabsTrigger value="chemistry" className="h-auto flex-1 py-2 whitespace-normal">
                      <div className="flex items-center gap-1">
                        <Beaker className="h-4 w-4 shrink-0" />
                        <span>Chemistry</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="techniques" className="h-auto flex-1 py-2 whitespace-normal">
                      <div className="flex items-center gap-1">
                        <BookOpenText className="h-4 w-4 shrink-0" />
                        <span>Techniques</span>
                      </div>
                    </TabsTrigger>
                    {hasReactionAnalysis && (
                      <TabsTrigger value="reactions" className="h-auto flex-1 py-2 whitespace-normal">
                        <div className="flex items-center gap-1">
                          <Atom className="h-4 w-4 shrink-0" />
                          <span>Reactions</span>
                        </div>
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="troubleshooting" className="h-auto flex-1 py-2 whitespace-normal">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>Troubleshoot</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="chemistry" className="prose prose-zinc dark:prose-invert max-w-none">
                  <div className="space-y-2">
                    {parsedContent.chemistry.length > 0 ? 
                      parsedContent.chemistry : 
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No chemical analysis available for this recipe.</p>
                        <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                      </div>
                    }
                  </div>
                </TabsContent>
                
                <TabsContent value="techniques" className="prose prose-zinc dark:prose-invert max-w-none">
                  <div className="space-y-2">
                    {parsedContent.techniques.length > 0 ? 
                      parsedContent.techniques : 
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No technique analysis available for this recipe.</p>
                        <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                      </div>
                    }
                  </div>
                </TabsContent>
                
                {hasReactionAnalysis && (
                  <TabsContent value="reactions" className="prose prose-zinc dark:prose-invert max-w-none">
                    <div className="space-y-2">
                      <h3 className="font-medium text-base text-slate-700 mb-4">Step-by-Step Reaction Analysis</h3>
                      {parsedContent.reactions.length > 0 ? 
                        parsedContent.reactions : 
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No reaction analysis available for this recipe.</p>
                          <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                        </div>
                      }
                    </div>
                  </TabsContent>
                )}
                
                <TabsContent value="troubleshooting" className="prose prose-zinc dark:prose-invert max-w-none">
                  <div className="space-y-2">
                    {parsedContent.troubleshooting.length > 0 ? 
                      parsedContent.troubleshooting : 
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No troubleshooting tips available for this recipe.</p>
                        <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                      </div>
                    }
                  </div>
                </TabsContent>
              </Tabs>
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
