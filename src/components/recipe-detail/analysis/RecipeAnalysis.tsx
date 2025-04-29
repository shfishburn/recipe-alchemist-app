
import React, { useEffect } from 'react';
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
  
  const { data: analysis, isLoading } = useQuery({
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
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Apply analysis updates to recipe when data is available
  useEffect(() => {
    if (analysis && analysis.changes && onRecipeUpdated) {
      console.log('Applying analysis updates to recipe:', analysis.changes);
      
      try {
        // Ensure the data has the correct structure before updating
        const updatedData: Partial<Recipe> = {
          // Copy essential properties from existing recipe
          id: recipe.id,
          // Apply changes from analysis while ensuring proper types
          title: analysis.changes.title || recipe.title,
          science_notes: Array.isArray(analysis.changes.science_notes) ? analysis.changes.science_notes : recipe.science_notes,
          instructions: Array.isArray(analysis.changes.instructions) ? analysis.changes.instructions : recipe.instructions,
          ingredients: Array.isArray(analysis.changes.ingredients?.items) && analysis.changes.ingredients?.mode === 'replace' 
            ? analysis.changes.ingredients.items
            : recipe.ingredients,
        };

        // Now update with properly structured data - only call this once per effect run
        updateRecipe.mutate(updatedData, {
          onSuccess: (updatedRecipe) => {
            console.log('Recipe updated with analysis data:', updatedRecipe);
            if (onRecipeUpdated) {
              onRecipeUpdated(updatedRecipe as Recipe);
            }
            // Using sonner toast here, which doesn't have the same infinite loop issue
            toast.success('Recipe updated with analysis insights');
          },
          onError: (error) => {
            console.error('Failed to update recipe with analysis data:', error);
            toast.error('Failed to update recipe with analysis');
          }
        });
      } catch (e) {
        console.error("Error processing analysis data:", e);
        toast.error("Failed to process recipe analysis data");
      }
    }
  // Important: Dependencies are correctly set to avoid infinite loops
  }, [analysis, updateRecipe, onRecipeUpdated, recipe.id, recipe.title, recipe.science_notes, recipe.instructions, recipe.ingredients]);

  if (!isVisible) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          <span>Scientific Analysis</span>
        </CardTitle>
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
              {analysis?.science_notes?.map((note, i) => (
                <div key={i} className="mb-4">
                  <p>{note}</p>
                </div>
              )) || (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No chemical analysis available for this recipe.</p>
                  <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="techniques" className="prose prose-zinc dark:prose-invert max-w-none">
              {analysis?.techniques ? (
                <div>
                  {analysis.techniques.map((technique, i) => (
                    <div key={i} className="mb-4">
                      <p>{technique}</p>
                    </div>
                  ))}
                </div>
              ) : analysis?.textResponse ? (
                <div dangerouslySetInnerHTML={{ __html: analysis.textResponse.replace(/\n/g, '<br>') }} />
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No technique analysis available for this recipe.</p>
                  <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="troubleshooting" className="prose prose-zinc dark:prose-invert max-w-none">
              <div className="space-y-4">
                {analysis?.troubleshooting?.length > 0 ? (
                  analysis.troubleshooting.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p>{tip}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No troubleshooting tips available for this recipe.</p>
                    <p className="text-sm mt-2">Try regenerating the analysis or check back later.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
