
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { useAuth } from '@/hooks/use-auth';
import { Json } from '@/integrations/supabase/types';
import { estimateNutrition } from './nutrition-estimation';
import { useQueryClient } from '@tanstack/react-query';
import { standardizeNutrition } from '@/utils/nutrition-utils';
import { getCuisineCategoryByValue } from '@/config/cuisine-config';

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
      
      // Enhanced error handling for nutrition data
      try {
        // Validate nutrition data to ensure it's well-formed
        if (nutritionData && typeof nutritionData === 'object') {
          console.log("Nutrition fields present:", Object.keys(nutritionData));
        } else {
          console.warn("Nutrition data is not an object:", nutritionData);
          nutritionData = estimateNutrition(recipe.ingredients, recipe.servings || 2);
          console.log("Using estimated nutrition instead:", nutritionData);
        }
      } catch (nutritionError) {
        console.error("Error processing nutrition data:", nutritionError);
        // Fallback to estimated nutrition
        nutritionData = estimateNutrition(recipe.ingredients, recipe.servings || 2);
      }
      
      // Ensure science_notes is an array of strings
      const scienceNotes = Array.isArray(recipe.science_notes) 
        ? recipe.science_notes.map(note => (note !== null && note !== undefined) ? String(note) : '')
        : (recipe.science_notes ? [String(recipe.science_notes)] : []);
      
      // Process cuisine value properly - ensure it's never null/undefined/empty
      const originalCuisine = recipe.cuisine;
      const cuisineString = originalCuisine && originalCuisine.trim() !== '' 
        ? originalCuisine.trim() 
        : "any";
      
      // Always use 'Global' as the cuisine_category regardless of the cuisine
      // This is a temporary fix to ensure recipes can be saved
      // The database will handle categorization properly via trigger or function
      const cuisineCategoryValue = "Global";
      
      console.log(`Recipe cuisine being saved: "${cuisineString}" (type: ${typeof cuisineString})`);
      console.log(`Using cuisine category: "${cuisineCategoryValue}" for all cuisines to avoid errors`);
      
      // Convert the quick recipe format to database format
      const recipeData = {
        title: recipe.title || "Untitled Recipe",
        tagline: recipe.description || "", // Map description to tagline
        ingredients: recipe.ingredients as unknown as Json,
        instructions: recipe.steps || recipe.instructions || [],
        prep_time_min: recipe.prepTime,
        cook_time_min: recipe.cookTime,
        cuisine: cuisineString, // Use processed cuisine value
        cuisine_category: cuisineCategoryValue, // Always use Global to avoid enum errors
        dietary: recipe.dietary || "", // Use dietary instead of dietaryType
        cooking_tip: recipe.cookingTip,
        science_notes: scienceNotes as unknown as Json, // Ensure it's array of strings
        servings: recipe.servings || 2,
        user_id: user.id, // Add the user_id to the recipe data
        nutrition: nutritionData as unknown as Json // Add enhanced nutrition data
      };
      
      console.log("Recipe data prepared for database:", {
        title: recipeData.title,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.length + " items" : "no ingredients",
        science_notes: Array.isArray(scienceNotes) ? scienceNotes.length + " notes" : "no notes",
        nutrition: nutritionData ? "present" : "missing",
        nutrition_type: nutritionData ? typeof nutritionData : "N/A",
        cuisine: cuisineString,
        cuisine_category: cuisineCategoryValue
      });

      // Insert the recipe into the database
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select('id')
        .single();

      if (error) {
        console.error("Error saving recipe:", error);
        console.error("Error details:", error.details, error.hint, error.code);
        
        // Provide more helpful error messages based on the error
        if (error.message.includes('cuisine_category')) {
          throw new Error(`Failed to save recipe: Database issue with cuisine category. We're using a simplified approach to fix this. Please try again.`);
        } else if (error.message.includes('violates foreign key constraint')) {
          throw new Error(`Failed to save recipe: There was an issue with the user account. Please try logging in again.`);
        } else {
          throw new Error(`Failed to save recipe: ${error.message}`);
        }
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
