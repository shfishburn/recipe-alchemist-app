
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface QuickRecipeFormData {
  cuisine: string[];
  dietary: string[];
  mainIngredient: string;
}

export interface QuickRecipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  nutritionHighlight: string;
}

export const useQuickRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<QuickRecipe | null>(null);
  const { toast } = useToast();

  const generateQuickRecipe = async (formData: QuickRecipeFormData) => {
    try {
      setIsLoading(true);
      console.log('Starting quick recipe generation with form data:', formData);
      
      const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
        body: JSON.stringify({
          cuisine: formData.cuisine.length > 0 ? formData.cuisine : ['american'], // Default to american if none selected
          dietary: formData.dietary,
          mainIngredient: formData.mainIngredient
        })
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Failed to generate recipe: ${error.message}`);
      }

      if (!data) {
        console.error('No recipe data received');
        throw new Error('No recipe data received');
      }
      
      console.log('Recipe generated successfully:', data);
      setRecipe(data);
      return data;
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Recipe generation failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateQuickRecipe,
    isLoading,
    recipe,
    setRecipe
  };
};
