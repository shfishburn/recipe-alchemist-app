
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { RecipeFormData } from '@/components/recipe-builder/RecipeForm';

export const useRecipeGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateRecipe = async (formData: RecipeFormData) => {
    try {
      setIsLoading(true);
      
      // Call the edge function to generate the recipe
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

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No recipe data received');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Save the recipe to the database
      const { data: savedRecipe, error: saveError } = await supabase
        .from('recipes')
        .insert({
          title: data.title,
          tagline: data.tagline,
          cuisine: formData.cuisine,
          dietary: formData.dietary,
          flavor_tags: formData.flavorTags,
          servings: data.servings,
          prep_time_min: data.prep_time_min,
          cook_time_min: data.cook_time_min,
          ingredients: data.ingredients,
          instructions: data.instructions,
          nutrition: data.nutrition,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (saveError) {
        console.error('Database save error:', saveError);
        throw new Error(`Failed to save recipe: ${saveError.message}`);
      }

      toast({
        title: "Success!",
        description: `Recipe "${data.title}" generated and saved successfully.`,
      });

      // Navigate to the recipe detail page
      if (savedRecipe) {
        navigate(`/recipes/${savedRecipe.id}`);
      }

      return data;
    } catch (error) {
      console.error('Error generating or saving recipe:', error);
      toast({
        title: "Something went wrong.",
        description: error.message || "Failed to generate or save recipe. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateRecipe,
    isLoading
  };
};
