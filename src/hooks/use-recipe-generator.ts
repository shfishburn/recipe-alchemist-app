
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
      console.log('Starting recipe generation with form data:', formData);
      
      console.log('Calling generate-recipe edge function');
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: JSON.stringify({
          cuisine: formData.cuisine,
          dietary: formData.dietary,
          flavorTags: formData.flavorTags,
          servings: formData.servings,
          maxCalories: formData.maxCalories,
          recipeRequest: formData.title || undefined
        })
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data) {
        console.error('No recipe data received');
        throw new Error('No recipe data received from the AI');
      }
      
      if (data.error) {
        console.error('Recipe generation error:', data.error);
        throw new Error(data.error);
      }

      console.log('Recipe generated successfully:', data);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('Authentication error. Please try logging in again.');
      }

      if (!user) {
        console.error('No user found');
        throw new Error('You must be logged in to save recipes');
      }

      console.log('Saving recipe to database');
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
          reasoning: data.reasoning,
          user_id: user.id
        })
        .select()
        .single();

      if (saveError) {
        console.error('Database save error:', saveError);
        throw new Error(`Failed to save recipe: ${saveError.message}`);
      }

      console.log('Recipe saved successfully:', savedRecipe);

      toast({
        title: "Success!",
        description: `Recipe "${data.title}" generated and saved successfully.`,
      });

      if (savedRecipe) {
        // Add a small delay before navigation for smoother transition
        await new Promise(resolve => setTimeout(resolve, 1000));
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
