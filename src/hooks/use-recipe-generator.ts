
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { generateQuickRecipe } from '@/api/generate-quick-recipe';
import { QuickRecipe } from '@/types/quick-recipe';
 
// Define the expected input shape for the recipe generator
export interface RecipeGeneratorInput {
  ingredients: string;
  cuisine?: string | string[];
  dietary?: string | string[];
  servings?: number;
}

// Type for generated recipe response
export interface GeneratedRecipeResponse {
  recipe: QuickRecipe | null;
  error: string | null;
}

export function useRecipeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<QuickRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  
  const generateRecipe = async (input: RecipeGeneratorInput): Promise<GeneratedRecipeResponse> => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Generate the recipe
      console.log("Generating recipe with input:", input);
      const result = await generateQuickRecipe({
        mainIngredient: input.ingredients,
        cuisine: input.cuisine || [],
        dietary: input.dietary || [],
        servings: input.servings || 2,
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (!result.recipe) {
        throw new Error("Failed to generate recipe. Please try again.");
      }
      
      // Store the recipe in state
      setRecipe(result.recipe);
      
      // If user is authenticated, save to database
      if (session?.user) {
        try {
          console.log("Saving recipe to database...");
          
          // This is passing a SINGLE object now, not an array
          const { data, error } = await supabase
            .from('recipes')
            .insert({
              user_id: session.user.id,
              recipe_data: result.recipe,
              description: result.recipe.description || '',
              cuisine: typeof result.recipe.cuisine === 'string' ? result.recipe.cuisine : '',
              name: result.recipe.title,
              // IMPORTANT: Don't include properties that don't exist in the table schema
              // title is not in the schema, so don't include it
            });
          
          if (error) {
            console.error("Error saving recipe:", error);
            // Don't throw - we want to continue even if save fails
          }
        } catch (saveError) {
          console.error("Exception saving recipe:", saveError);
          // Continue even if save fails
        }
      }
      
      return { 
        recipe: result.recipe,
        error: null
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An unexpected error occurred";
      
      console.error("Recipe generation error:", err);
      setError(errorMessage);
      
      toast({
        title: "Recipe Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return {
        recipe: null,
        error: errorMessage
      };
      
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateRecipe,
    isGenerating,
    recipe,
    error,
  };
}
