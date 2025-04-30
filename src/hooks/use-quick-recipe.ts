
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { Nutrition } from '@/types/recipe';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';

export interface QuickRecipeFormData {
  cuisine: string[];
  dietary: string[];
  mainIngredient: string;
  servings?: number;
}

export interface Ingredient {
  qty: number;
  unit: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
  item: string | { item: string };
  notes?: string;
}

export interface QuickRecipe {
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  nutritionHighlight: string;
  cookingTip: string;
  cuisineType?: string;
  dietaryType?: string;
  servings?: number;
  scienceNotes?: string[];
  calorie_check_pass?: boolean;
  nutrition?: EnhancedNutrition; // Updated to use EnhancedNutrition
}

export const useQuickRecipe = () => {
  // We still use local state for function execution, but results go to the store
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const { toast } = useToast();
  const { 
    recipe, 
    isLoading: storeIsLoading, 
    setRecipe, 
    setLoading, 
    setError,
    setFormData 
  } = useQuickRecipeStore();

  const generateQuickRecipe = async (formData: QuickRecipeFormData) => {
    try {
      setIsLocalLoading(true);
      setLoading(true);
      setError(null); // Clear any previous errors
      setFormData(formData);
      
      console.log('Starting quick recipe generation with form data:', formData);
      
      const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
        body: JSON.stringify({
          cuisine: formData.cuisine.length > 0 ? formData.cuisine : ['american'], // Default to american if none selected
          dietary: formData.dietary,
          mainIngredient: formData.mainIngredient,
          servings: formData.servings || 2 // Default to 2 servings if not specified
        })
      });

      if (error) {
        console.error('Edge function error:', error);
        setError(`Failed to generate recipe: ${error.message}`);
        return null;
      }

      if (!data) {
        console.error('No recipe data received');
        setError('No recipe data received from server');
        return null;
      }
      
      console.log('Recipe generated successfully:', data);
      console.log('Recipe steps count:', data.steps.length);

      // Add the cuisine type and servings to the recipe data
      const enhancedRecipe = {
        ...data,
        cuisineType: formData.cuisine.length > 0 ? formData.cuisine[0] : 'american',
        dietaryType: formData.dietary.length > 0 ? formData.dietary[0] : null,
        servings: formData.servings || 2
      };

      // Enrich nutrition data using NutriSynth
      try {
        console.log('Enhancing nutrition data with NutriSynth analysis');
        
        const { data: nutritionData, error: nutritionError } = await supabase.functions.invoke('nutrisynth-analysis', {
          body: JSON.stringify({
            ingredients: enhancedRecipe.ingredients,
            servings: enhancedRecipe.servings || 2
          })
        });

        if (!nutritionError && nutritionData) {
          console.log('NutriSynth analysis completed:', nutritionData);
          // Add the nutrition data to the recipe
          enhancedRecipe.nutrition = nutritionData;
          
          // Add nutritional highlight based on content
          if (nutritionData?.data_quality?.overall_confidence !== 'low') {
            // Only update nutritionHighlight if we have reasonable confidence
            const macros = [];
            if (nutritionData.protein_g) macros.push(`${Math.round(nutritionData.protein_g)}g protein`);
            if (nutritionData.carbs_g) macros.push(`${Math.round(nutritionData.carbs_g)}g carbs`);
            if (nutritionData.fat_g) macros.push(`${Math.round(nutritionData.fat_g)}g fat`);
            
            if (macros.length > 0) {
              enhancedRecipe.nutritionHighlight = `${Math.round(nutritionData.calories || 0)} calories per serving with ${macros.join(', ')}`;
            }
          }
        } else {
          console.warn('NutriSynth analysis failed:', nutritionError);
          // Fall back to the original nutrition data or estimation
        }
      } catch (nutritionErr) {
        console.error('Error during NutriSynth analysis:', nutritionErr);
        // The recipe generation can still continue without enhanced nutrition
      }
      
      // Update both local state and store
      setRecipe(enhancedRecipe);
      return enhancedRecipe;
    } catch (error: any) {
      console.error('Error generating recipe:', error);
      setError(error.message || "Something went wrong. Please try again.");
      toast({
        title: "Recipe generation failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLocalLoading(false);
      setLoading(false);
    }
  };

  return {
    generateQuickRecipe,
    isLoading: isLocalLoading || storeIsLoading,
    recipe,
    setRecipe
  };
};
