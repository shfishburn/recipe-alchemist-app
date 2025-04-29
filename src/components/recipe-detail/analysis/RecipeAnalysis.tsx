
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Beaker, BookOpen, BookOpenText, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import type { Recipe, Ingredient } from '@/types/recipe';

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
}

export function RecipeAnalysis({ recipe, isOpen, onToggle, onRecipeUpdated }: RecipeAnalysisProps) {
  const { updateRecipe } = useRecipeUpdates(recipe.id);
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  const [activeTab, setActiveTab] = useState("chemistry");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Store parsed content to ensure consistency between tab switches
  const [parsedContent, setParsedContent] = useState<TabContent>({
    chemistry: [],
    techniques: [],
    troubleshooting: []
  });
  
  // Flag to track if content has been parsed
  const contentParsedRef = useRef(false);
  
  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['recipe-analysis', recipe.id],
    queryFn: async () => {
      console.log('Fetching recipe analysis for', recipe.title);
      const { data, error } = await supabase.functions.invoke('recipe-chat', {
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

      if (error) {
        console.error('Error fetching recipe analysis:', error);
        throw error;
      }
      
      console.log('Analysis data received:', data);
      return data;
    },
    enabled: false, // Don't auto-fetch on mount
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  // Function to manually trigger analysis
  const handleAnalyze = useCallback(() => {
    if (!isLoading) {
      // Reset content parsing state when manually retrying
      contentParsedRef.current = false;
      setParsedContent({
        chemistry: [],
        techniques: [],
        troubleshooting: []
      });
      
      setIsAnalyzing(true);
      refetch().finally(() => {
        setIsAnalyzing(false);
      });
      toast.info("Analyzing recipe...");
    }
  }, [refetch, isLoading]);

  // Apply analysis updates to recipe when data is available, but only once
  useEffect(() => {
    // Only run this effect if we have analysis data, we haven't applied updates yet,
    // and there's a callback for updates
    if (analysis && 
        analysis.changes && 
        onRecipeUpdated && 
        !hasAppliedUpdates && 
        initialAnalysisRef.current) {
      
      console.log('Preparing to apply analysis updates to recipe:', analysis.changes);
      
      // SAFETY CHECK: Only apply updates if we actually have content to apply
      const hasNewScienceNotes = Array.isArray(analysis.science_notes) && analysis.science_notes.length > 0;
      const hasNewInstructions = Array.isArray(analysis.changes.instructions) && 
                                 analysis.changes.instructions.length > 0;
      const hasNewTitle = !!analysis.changes.title;
      const hasNewIngredients = analysis.changes.ingredients?.mode === 'replace' && 
                               Array.isArray(analysis.changes.ingredients.items) && 
                               analysis.changes.ingredients.items.length > 0;
      
      // Only proceed if we have something meaningful to update
      if (hasNewScienceNotes || hasNewInstructions || hasNewTitle || hasNewIngredients) {
        setHasAppliedUpdates(true); // Mark updates as applied to prevent further runs
        
        try {
          // Prepare a safe update object that won't overwrite existing data with empty values
          const updatedData: Partial<Recipe> = {
            // Always include the ID
            id: recipe.id
          };
          
          // Only update title if there's a new one
          if (hasNewTitle) {
            updatedData.title = analysis.changes.title;
          }
          
          // Only update science notes if we have new ones
          if (hasNewScienceNotes) {
            updatedData.science_notes = analysis.science_notes;
          }
          
          // Only update instructions if we have new ones
          if (hasNewInstructions) {
            // Format instructions to ensure they're all strings
            const formattedInstructions = analysis.changes.instructions.map(instr => 
              typeof instr === 'string' ? instr : (instr.action || '')
            ).filter(Boolean);
            
            if (formattedInstructions.length > 0) {
              updatedData.instructions = formattedInstructions;
            }
          }
          
          // Only update ingredients if we have new ones and they're set to replace mode
          if (hasNewIngredients) {
            updatedData.ingredients = analysis.changes.ingredients.items;
          }
          
          console.log('Applying recipe updates with data:', updatedData);
          
          // Update with safely constructed data
          updateRecipe.mutate(updatedData, {
            onSuccess: (updatedRecipe) => {
              console.log('Recipe updated with analysis data:', updatedRecipe);
              onRecipeUpdated(updatedRecipe as Recipe);
              toast.success('Recipe updated with analysis insights');
            },
            onError: (error) => {
              console.error('Failed to update recipe with analysis data:', error);
              toast.error('Failed to update recipe with analysis');
              // Reset the flag if there was an error so we can try again
              setHasAppliedUpdates(false);
            }
          });
        } catch (e) {
          console.error("Error processing analysis data:", e);
          toast.error("Failed to process recipe analysis data");
          setHasAppliedUpdates(false);
        }
      } else {
        console.log('No meaningful updates to apply from analysis.');
        toast.info('Analysis complete, but no changes needed.');
      }
    }
  }, [analysis, hasAppliedUpdates, updateRecipe, onRecipeUpdated, recipe.id]);

  // Set initialAnalysisRef to true after initial render
  useEffect(() => {
    if (analysis && !initialAnalysisRef.current) {
      // Use a small delay to ensure this runs after the data is loaded
      const timer = setTimeout(() => {
        initialAnalysisRef.current = true;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [analysis]);

  // Pre-process content once when analysis data is available
  useEffect(() => {
    if (analysis && !contentParsedRef.current) {
      console.log("Pre-processing analysis content for consistency");
      
      // Process each content section and store it for consistent display
      const newContent: TabContent = {
        chemistry: [],
        techniques: [],
        troubleshooting: []
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
  }, [analysis]);

  // Helper function to check if a data section has content
  const hasContent = (section: any[]): boolean => {
    return Array.isArray(section) && section.length > 0;
  };

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

  // Enhanced extract section function with better pattern matching and caching
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
    (analysis?.textResponse && analysis.textResponse.length > 50);

  // Check if we should show the analysis prompt
  const showAnalysisPrompt = !analysis && !isLoading;

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
              {!isLoading && hasAnyAnalysisContent && (
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
            ) : hasAnyAnalysisContent ? (
              <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full flex justify-between overflow-x-auto">
                  <TabsTrigger value="chemistry" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Chemistry
                  </TabsTrigger>
                  <TabsTrigger value="techniques" className="flex items-center gap-2">
                    <BookOpenText className="h-4 w-4" />
                    Techniques
                  </TabsTrigger>
                  <TabsTrigger value="troubleshooting" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Troubleshooting
                  </TabsTrigger>
                </TabsList>
                
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
