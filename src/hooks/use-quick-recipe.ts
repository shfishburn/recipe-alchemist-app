
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
  nutrition?: EnhancedNutrition;
}

export const useQuickRecipe = () => {
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const { toast } = useToast();
  const { 
    recipe, 
    isLoading: storeIsLoading, 
    setRecipe, 
    setLoading, 
    setError,
    setFormData,
    updateLoadingState
  } = useQuickRecipeStore();

  const generateQuickRecipe = async (formData: QuickRecipeFormData) => {
    try {
      setIsLocalLoading(true);
      setLoading(true);
      setError(null); // Clear any previous errors
      setFormData(formData);
      
      console.log('Starting quick recipe generation with form data:', formData);
      
      // Set initial loading state with estimated time based on complexity
      const complexity = calculateComplexity(formData);
      const estimatedTime = estimateGenerationTime(complexity);
      
      updateLoadingState({
        step: 0,
        totalSteps: 5,
        stepDescription: LOADING_STEPS[0],
        percentComplete: 0,
        estimatedTimeRemaining: estimatedTime
      });
      
      // Simulate step 1 completion (real step updates will come from the backend in a production app)
      setTimeout(() => {
        updateLoadingState({
          step: 1,
          stepDescription: LOADING_STEPS[1],
          percentComplete: 15
        });
      }, 2000);
      
      const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
        body: JSON.stringify({
          cuisine: formData.cuisine.length > 0 ? formData.cuisine : ['american'],
          dietary: formData.dietary,
          mainIngredient: formData.mainIngredient,
          servings: formData.servings || 2
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
      
      // Simulate step 3 completion - we got the base recipe
      updateLoadingState({
        step: 3,
        stepDescription: LOADING_STEPS[3],
        percentComplete: 60
      });
      
      console.log('Recipe generated successfully:', data);
      console.log('Recipe steps count:', data.steps.length);

      // Add the cuisine type and servings to the recipe data
      const enhancedRecipe = {
        ...data,
        cuisineType: formData.cuisine.length > 0 ? formData.cuisine[0] : 'american',
        dietaryType: formData.dietary.length > 0 ? formData.dietary[0] : null,
        servings: formData.servings || 2
      };

      // Simulate step 4 - nutrition analysis
      updateLoadingState({
        step: 4,
        stepDescription: LOADING_STEPS[4],
        percentComplete: 80
      });

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
      
      // Final step completion - we're done!
      updateLoadingState({
        step: 5,
        stepDescription: LOADING_STEPS[5],
        percentComplete: 95
      });
      
      // Simulate final step takes a moment for satisfaction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
  
  // Calculate complexity of the recipe request
  const calculateComplexity = (formData: QuickRecipeFormData): number => {
    let complexity = 1; // Base complexity
    
    // More complexity for dietary restrictions
    if (formData.dietary && formData.dietary.length > 0) {
      complexity += 0.5 * formData.dietary.length;
    }
    
    // More servings = slightly more complexity
    if (formData.servings && formData.servings > 2) {
      complexity += 0.2 * (formData.servings - 2);
    }
    
    // Certain ingredients might be more complex
    const complexIngredients = ['duck', 'lamb', 'seafood', 'scallops', 'soufflé'];
    if (formData.mainIngredient) {
      for (const ingredient of complexIngredients) {
        if (formData.mainIngredient.toLowerCase().includes(ingredient)) {
          complexity += 0.5;
          break;
        }
      }
    }
    
    return Math.min(5, complexity); // Cap at 5
  };
  
  // Estimate generation time based on complexity
  const estimateGenerationTime = (complexity: number): number => {
    // Base time is 10 seconds, adjust based on complexity
    return Math.round(10 + (complexity * 2));
  };

  return {
    generateQuickRecipe,
    isLoading: isLocalLoading || storeIsLoading,
    recipe,
    setRecipe
  };
};

// Loading step descriptions - same as in the component for consistency
const LOADING_STEPS = [
  "Analyzing your ingredients...",
  "Finding compatible recipes...",
  "Calculating measurements...",
  "Optimizing cooking techniques...",
  "Adding scientific insights...",
  "Finalizing your perfect recipe..."
];
