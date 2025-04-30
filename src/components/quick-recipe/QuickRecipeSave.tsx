
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipe } from '@/hooks/use-quick-recipe';

export const useQuickRecipeSave = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveRecipe = async (recipe: QuickRecipe) => {
    try {
      setIsSaving(true);
      
      if (!recipe) {
        throw new Error("No recipe data to save");
      }

      console.log("Saving recipe:", recipe);
      
      // Convert the quick recipe format to database format
      const recipeData = {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.steps,
        prep_time_min: recipe.prepTime,
        cook_time_min: recipe.cookTime,
        cuisine: recipe.cuisineType,
        dietary: recipe.dietaryType,
        cooking_tip: recipe.cookingTip,
        science_notes: recipe.scienceNotes || [],
        servings: recipe.servings || 2
      };

      // Insert the recipe into the database
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select('id')
        .single();

      if (error) {
        console.error("Error saving recipe:", error);
        throw new Error(`Failed to save recipe: ${error.message}`);
      }

      toast({
        title: "Recipe saved",
        description: "Your recipe has been saved to your collection.",
      });

      console.log("Recipe saved successfully with ID:", data.id);
      return true;
    } catch (error) {
      console.error("Error in saveRecipe:", error);
      toast({
        title: "Save failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveRecipe, isSaving, navigate };
};
