
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { useAuth } from '@/hooks/use-auth';
import { Json } from '@/integrations/supabase/types';
import { estimateNutrition } from './nutrition-estimation';
import { useQueryClient } from '@tanstack/react-query';
import { standardizeNutrition } from '@/types/nutrition-utils';

// This function is no longer needed as we are getting cuisine values already matched to categories
// The cuisine value from the UI will directly map to a valid cuisine, and the category is determined
// by how we've grouped them in the CuisineSelector component

export const useQuickRecipeSave = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const saveRecipe = async (recipe: QuickRecipe) => {
    try {
      setIsSaving(true);
      
      if (!recipe) {
        throw new Error("No recipe data to save");
      }

      console.log("Saving recipe:", recipe);
      
      if (!user?.id) {
        throw new Error("You must be logged in to save recipes");
      }
      
      // Ensure nutrition data is available or estimate it
      let nutritionData = recipe.nutrition || estimateNutrition(recipe.ingredients, recipe.servings || 2);
      
      // Make sure nutrition data follows the expected format
      if (nutritionData) {
        // Standardize nutrition keys for consistency
        nutritionData = standardizeNutrition(nutritionData);
        
        // Ensure we have at least basic nutrition fields
        if (!nutritionData.calories && !nutritionData.kcal) {
          console.log("Adding basic nutrition values from estimation");
          const estimatedValues = estimateNutrition(recipe.ingredients, recipe.servings || 2);
          nutritionData = {
            ...nutritionData,
            ...estimatedValues
          };
        }
        
        // Log the final nutrition data for debugging
        console.log("Final nutrition data being saved:", nutritionData);
      }
      
      // Ensure science_notes is an array of strings
      const scienceNotes = Array.isArray(recipe.science_notes) 
        ? recipe.science_notes.map(note => (note !== null && note !== undefined) ? String(note) : '')
        : (recipe.science_notes ? [String(recipe.science_notes)] : []);
      
      // Determine cuisine category based on the cuisine grouping in CuisineSelector
      // If we can't determine the category, default to "Global"
      let cuisineCategory = "Global"; // Default value

      // Get the cuisine from the recipe
      const selectedCuisine = recipe.cuisine?.toLowerCase();
      
      // If we have a selected cuisine, determine the correct category
      if (selectedCuisine && selectedCuisine !== "any") {
        // Asian cuisines
        if (["chinese", "indian", "japanese", "korean", "thai", "vietnamese"].includes(selectedCuisine)) {
          cuisineCategory = "Asian";
        } 
        // European cuisines
        else if (["eastern-european", "french", "german", "greek", "italian", "mediterranean", "spanish"].includes(selectedCuisine)) {
          cuisineCategory = "European";
        } 
        // Regional American cuisines
        else if (["cajun-creole", "southern", "southwestern", "tex-mex"].includes(selectedCuisine)) {
          cuisineCategory = "Regional American";
        } 
        // Dietary styles
        else if (["gluten-free", "keto", "low-fodmap", "paleo", "plant-based", "vegetarian", "whole30"].includes(selectedCuisine)) {
          cuisineCategory = "Dietary Styles";
        }
        // Middle Eastern cuisines (added as a separate category)
        else if (["middle-eastern"].includes(selectedCuisine)) {
          cuisineCategory = "Middle Eastern"; // Note: Verify this category exists in the database enum
        }
      }
      
      console.log(`Determined cuisine category: ${cuisineCategory} for cuisine: ${recipe.cuisine}`);
      
      // Convert the quick recipe format to database format
      const recipeData = {
        title: recipe.title,
        tagline: recipe.description, // Map description to tagline
        ingredients: recipe.ingredients as unknown as Json,
        instructions: recipe.steps || recipe.instructions || [],
        prep_time_min: recipe.prepTime,
        cook_time_min: recipe.cookTime,
        cuisine: recipe.cuisine, // Use cuisine from selected value
        cuisine_category: cuisineCategory, // Set the proper enum value
        dietary: recipe.dietary, // Use dietary instead of dietaryType
        cooking_tip: recipe.cookingTip,
        science_notes: scienceNotes as unknown as Json, // Ensure it's array of strings
        servings: recipe.servings || 2,
        user_id: user.id, // Add the user_id to the recipe data
        nutrition: nutritionData as unknown as Json // Add enhanced nutrition data
      };
      
      console.log("Recipe data prepared for database:", {
        ...recipeData,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.length + " items" : "no ingredients",
        science_notes: Array.isArray(scienceNotes) ? scienceNotes.length + " notes" : "no notes",
        nutrition: nutritionData ? "present" : "missing",
        cuisine_category: cuisineCategory
      });

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

      // Invalidate the recipes query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['recipes'] });

      toast({
        title: "Recipe saved",
        description: "Your recipe has been saved to your collection.",
      });

      console.log("Recipe saved successfully with ID:", data.id);
      
      // Navigate to the newly created recipe
      if (data.id) {
        navigate(`/recipes/${data.id}`);
      }
      
      return true;
    } catch (error: any) {
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
