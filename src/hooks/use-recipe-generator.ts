
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
      
      if (result.error_message || result.isError) {
        throw new Error(result.error_message || "Failed to generate recipe. Please try again.");
      }
      
      if (!result) {
        throw new Error("Failed to generate recipe. Please try again.");
      }
      
      // Store the recipe in state
      setRecipe(result);
      
      // If user is authenticated, save to database
      if (session?.user) {
        try {
          console.log("Saving recipe to database...");
          
          // The recipes table expects specific fields, let's extract them from the result
          const { data, error } = await supabase
            .from('recipes')
            .insert({
              user_id: session.user.id,
              title: result.title,
              description: result.description || '',
              cuisine: typeof result.cuisine === 'string' ? result.cuisine : '',
              servings: result.servings,
              ingredients: result.ingredients,
              instructions: result.steps || result.instructions || [],
              prep_time_min: result.prep_time_min || 0,
              cook_time_min: result.cook_time_min || 0
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
        recipe: result,
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
