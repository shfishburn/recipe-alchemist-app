
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Beaker, BookOpen, BookOpenText, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { toast } from 'sonner';
import type { Recipe, Ingredient } from '@/types/recipe';

interface RecipeAnalysisProps {
  recipe: Recipe;
  isVisible: boolean;
  onRecipeUpdated?: (updatedRecipe: Recipe) => void;
}

export function RecipeAnalysis({ recipe, isVisible, onRecipeUpdated }: RecipeAnalysisProps) {
  const { updateRecipe } = useRecipeUpdates(recipe.id);
  const initialAnalysisRef = useRef(false);
  const [hasAppliedUpdates, setHasAppliedUpdates] = useState(false);
  
  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['recipe-analysis', recipe.id],
    queryFn: async () => {
      if (!isVisible) return null;
      
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
    enabled: isVisible,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  // Function to manually retry analysis
  const handleRetryAnalysis = () => {
    refetch();
    toast.info("Regenerating recipe analysis...");
  };

  // Apply analysis updates to recipe when data is available, but only once
  useEffect(() => {
    // Only run this effect if we have analysis data, we haven't applied updates yet,
    // and there's a callback for updates
    if (analysis && 
        analysis.changes && 
        onRecipeUpdated && 
        !hasAppliedUpdates && 
        initialAnalysisRef.current) {
      
      console.log('Applying analysis updates to recipe:', analysis.changes);
      setHasAppliedUpdates(true); // Mark updates as applied to prevent further runs
      
      try {
        // Ensure the data has the correct structure before updating
        const updatedData: Partial<Recipe> = {
          // Copy essential properties from existing recipe
          id: recipe.id,
          // Apply changes from analysis while ensuring proper types
          title: analysis.changes.title || recipe.title,
          science_notes: Array.isArray(analysis.science_notes) ? analysis.science_notes : recipe.science_notes,
          instructions: Array.isArray(analysis.changes.instructions) ? analysis.changes.instructions : recipe.instructions,
          ingredients: Array.isArray(analysis.changes.ingredients?.items) && analysis.changes.ingredients?.mode === 'replace' 
            ? analysis.changes.ingredients.items
            : recipe.ingredients,
        };

        // Update with properly structured data
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

  // Reset the applied flag when the recipe changes
  useEffect(() => {
    if (!isVisible) {
      setHasAppliedUpdates(false);
      initialAnalysisRef.current = false;
    }
  }, [isVisible, recipe.id]);

  if (!isVisible) return null;

  // Helper function to check if a data section has content
  const hasContent = (section: any[]): boolean => {
    return Array.isArray(section) && section.length > 0;
  };

  // Helper to extract text content from raw response if needed
  const extractSectionFromText = (rawText: string | undefined, sectionName: string): React.ReactNode => {
    if (!rawText) return null;
    
    const sectionRegex = new RegExp(`#+\\s*${sectionName}[^#]*`, 'i');
    const match = rawText.match(sectionRegex);
    
    if (match) {
      return <div dangerouslySetInnerHTML={{ __html: match[0].replace(/^#+\s*[^:]*:?\s*/i, '') }} />;
    }
    
    return null;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            <span>Scientific Analysis</span>
          </CardTitle>
          {!isLoading && (
            <button 
              onClick={handleRetryAnalysis} 
              className="text-xs text-primary hover:underline"
            >
              Regenerate
            </button>
          )}
        </div>
        <CardDescription>
          In-depth breakdown of cooking chemistry and techniques
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Analyzing recipe chemistry...</span>
          </div>
        ) : (
          <Tabs defaultValue="chemistry" className="w-full">
            <TabsList className="mb-4 w-full flex justify-between overflow-x-auto">
              <TabsTrigger value="chemistry" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Key Chemistry
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
              {hasContent(analysis?.science_notes) ? (
                <div className="space-y-3">
                  {analysis.science_notes.map((note, i) => (
                    <div key={i} className="mb-4">
                      <p>{note}</p>
                    </div>
                  ))}
                </div>
              ) : analysis?.textResponse ? (
                // Try to extract chemistry section from raw text
                extractSectionFromText(analysis.textResponse, "(Chemistry|Chemical|Science)") || (
                  <div dangerouslySetInnerHTML={{ __html: analysis.textResponse }} />
                )
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No chemical analysis available for this recipe.</p>
                  <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="techniques" className="prose prose-zinc dark:prose-invert max-w-none">
              {hasContent(analysis?.techniques) ? (
                <div className="space-y-3">
                  {analysis.techniques.map((technique, i) => (
                    <div key={i} className="mb-4">
                      <p>{technique}</p>
                    </div>
                  ))}
                </div>
              ) : analysis?.textResponse ? (
                // Try to extract techniques section from raw text
                extractSectionFromText(analysis.textResponse, "(Technique|Method|Cooking)") || (
                  <div dangerouslySetInnerHTML={{ __html: analysis.textResponse }} />
                )
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No technique analysis available for this recipe.</p>
                  <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="troubleshooting" className="prose prose-zinc dark:prose-invert max-w-none">
              {hasContent(analysis?.troubleshooting) ? (
                <div className="space-y-3">
                  {analysis.troubleshooting.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              ) : analysis?.textResponse ? (
                // Try to extract troubleshooting section from raw text
                extractSectionFromText(analysis.textResponse, "(Troubleshoot|Problem|Issue)") || (
                  <div dangerouslySetInnerHTML={{ __html: analysis.textResponse }} />
                )
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No troubleshooting tips available for this recipe.</p>
                  <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
