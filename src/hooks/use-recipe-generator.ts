
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { RecipeFormData } from '@/components/recipe-builder/RecipeForm';

export const useRecipeGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecipe = async (formData: RecipeFormData) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: JSON.stringify({
          cuisine: formData.cuisine,
          dietary: formData.dietary,
          flavorTags: formData.flavorTags,
          servings: formData.servings,
          maxCalories: formData.maxCalories,
          maxMinutes: formData.maxMinutes
        })
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success!",
          description: `Recipe "${data.title}" generated successfully.`,
        });
        return data;
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Something went wrong.",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateRecipe,
    isLoading
  };
};
