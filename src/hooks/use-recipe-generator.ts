
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { RecipeFormData } from '@/components/recipe-builder/RecipeForm';
import { generateQuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { Ingredient } from '@/types/recipe';
import { Json } from '@/integrations/supabase/types';

/**
 * @deprecated This hook is deprecated and internally uses the QuickRecipe functionality.
 * Please use the useQuickRecipe hook and related components instead.
 */
export const useRecipeGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper function to convert ingredients to a database-safe format
  const convertIngredientsToJson = (ingredients: any[]): Json => {
    return ingredients.map(ingredient => {
      if (typeof ingredient === 'string') {
        return {
          qty: 1,
          unit: '',
          item: ingredient,
          qty_metric: 1,
          unit_metric: '',
          qty_imperial: 1,
          unit_imperial: ''
        };
      }
      
      return {
        qty: ingredient.qty || 1,
        unit: ingredient.unit || '',
        item: typeof ingredient.item === 'string' ? ingredient.item : 
              (ingredient.item ? JSON.stringify(ingredient.item) : ''),
        qty_metric: ingredient.qty_metric || ingredient.qty || 1,
        unit_metric: ingredient.unit_metric || ingredient.unit || '',
        qty_imperial: ingredient.qty_imperial || ingredient.qty || 1,
        unit_imperial: ingredient.unit_imperial || ingredient.unit || ''
      };
    }) as Json;
  };

  const generateRecipe = async (formData: RecipeFormData) => {
    try {
      setIsLoading(true);
      console.log('DEPRECATED: Using generateRecipe which redirects to QuickRecipe');
      console.log('Starting recipe generation with form data:', formData);
      
      // Convert RecipeFormData to QuickRecipeFormData
      const quickFormData: QuickRecipeFormData = {
        cuisine: formData.cuisine ? [formData.cuisine] : ['Any'],
        dietary: formData.dietary ? [formData.dietary] : [],
        mainIngredient: formData.title || "Chef's choice",
        servings: formData.servings || 4,
        // Added maxCalories to the interface, so now it's valid
        maxCalories: formData.maxCalories
      };
      
      // Show toast about using the new system
      toast({
        title: "Using Quick Recipe",
        description: "We're using our improved recipe generation system.",
      });
      
      // Use the QuickRecipe generator instead
      const generatedRecipe = await generateQuickRecipe(quickFormData);
      
      // Handle saving if the user is logged in
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!userError && user) {
          console.log('Logged in user detected, saving recipe to database');
          
          // Convert ingredients to a JSON-compatible format
          const ingredientsJson = convertIngredientsToJson(generatedRecipe.ingredients);
          
          // Save the recipe to the database for authenticated users - FIX: use insert() with single object, not an array
          const { data: savedRecipe, error: saveError } = await supabase
            .from('recipes')
            .insert({
              title: generatedRecipe.title,
              tagline: generatedRecipe.tagline || generatedRecipe.description,
              cuisine: formData.cuisine,
              dietary: formData.dietary,
              flavor_tags: formData.flavorTags,
              servings: generatedRecipe.servings,
              prep_time_min: generatedRecipe.prep_time_min || generatedRecipe.prepTime,
              cook_time_min: generatedRecipe.cook_time_min || generatedRecipe.cookTime,
              ingredients: ingredientsJson,
              instructions: generatedRecipe.steps || generatedRecipe.instructions,
              nutrition: generatedRecipe.nutrition as Json,
              user_id: user.id
            })
            .select();

          if (saveError) {
            console.error('Database save error:', saveError);
            throw new Error(`Failed to save recipe: ${saveError.message}`);
          }

          console.log('Recipe saved successfully:', savedRecipe);

          toast({
            title: "Success!",
            description: `Recipe "${generatedRecipe.title}" generated and saved successfully.`,
          });

          if (savedRecipe && savedRecipe.length > 0) {
            // Navigate to the recipe detail page for saved recipes
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate(`/recipes/${savedRecipe[0].id}`);
            return generatedRecipe;
          }
        }
      } catch (saveError) {
        console.error('Error saving recipe:', saveError);
        // Continue without saving if there's an error
      }

      // For users who aren't logged in or if saving fails, navigate to the quick-recipe page
      navigate('/quick-recipe', { 
        state: { 
          fromForm: true,
          recipeData: generatedRecipe
        } 
      });

      return generatedRecipe;
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
