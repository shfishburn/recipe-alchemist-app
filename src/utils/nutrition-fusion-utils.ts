import { supabase } from "@/integrations/supabase/client";
import { Recipe, Ingredient, Nutrition } from "@/types/recipe";
import { Json } from "@/integrations/supabase/types";

// Define interfaces for fusion system
interface NutrientValue {
  nutrient: string;
  value: number;
  unit: string;
  confidence_score: number;
}

interface FuseNutritionRequest {
  ingredient_text: string;
  alt_source_values?: NutrientValue[];
  cooking_method?: string;
  override_existing?: boolean;
}

interface FusedNutrient {
  nutrient: string;
  fusedValue: number;
  unit: string;
  confidence: number;
  sources: string[];
}

interface FuseNutritionResponse {
  canonical_ingredient?: {
    id: string;
    name: string;
    similarity_score: number;
  };
  fused: FusedNutrient[];
  overall_confidence: number;
  source_count: number;
  metadata?: Record<string, any>;
}

/**
 * Function to call the fusion edge function and get combined nutrition data
 */
export async function fuseIngredientNutrition(
  ingredient: string | Ingredient,
  alternativeValues?: NutrientValue[],
  cookingMethod?: string
): Promise<FuseNutritionResponse | null> {
  try {
    // Extract ingredient text from either string or Ingredient object
    const ingredientText = typeof ingredient === 'string' 
      ? ingredient 
      : ingredient.item;
    
    // Create the request payload
    const payload: FuseNutritionRequest = {
      ingredient_text: ingredientText,
    };
    
    // Add optional parameters if provided
    if (alternativeValues && alternativeValues.length > 0) {
      payload.alt_source_values = alternativeValues;
    }
    
    if (cookingMethod) {
      payload.cooking_method = cookingMethod;
    }
    
    // Call the edge function
    const { data, error } = await supabase.functions.invoke('fuse-nutrition', {
      body: payload
    });
    
    if (error) {
      console.error('Error calling fuse-nutrition:', error);
      return null;
    }
    
    return data as FuseNutritionResponse;
  } catch (error) {
    console.error('Error in fuseIngredientNutrition:', error);
    return null;
  }
}

/**
 * Function to search the USDA Food Data Central database
 */
export async function searchUsdaFoods(query: string, pageSize = 10, pageNumber = 1) {
  try {
    const { data, error } = await supabase.functions.invoke('usda-food-api', {
      body: {
        query,
        pageSize,
        pageNumber,
        method: 'search'
      }
    });
    
    if (error) {
      console.error('Error searching USDA foods:', error);
      return { foods: [], totalHits: 0 };
    }
    
    return data;
  } catch (error) {
    console.error('Error in searchUsdaFoods:', error);
    return { foods: [], totalHits: 0 };
  }
}

/**
 * Function to import a food from USDA Food Data Central into our database
 */
export async function importUsdaFood(fdcId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('usda-food-api', {
      body: { 
        fdcId,
        method: 'import-food'
      }
    });
    
    if (error) {
      console.error('Error importing USDA food:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in importUsdaFood:', error);
    return null;
  }
}

/**
 * Function to fuse nutrition data for an entire recipe
 */
export async function fuseRecipeNutrition(recipe: Recipe): Promise<Nutrition | null> {
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return null;
  }
  
  try {
    // Create combined nutrition object
    const combinedNutrition: Partial<Nutrition> = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      data_quality: {
        overall_confidence: 'medium',
        overall_confidence_score: 0,
        unmatched_or_low_confidence_ingredients: []
      }
    };
    
    // Track confidence scores and sources
    const confidenceScores: number[] = [];
    const unmatchedIngredients: string[] = [];
    
    // Process each ingredient
    for (const ingredient of recipe.ingredients) {
      // Skip ingredients without names
      if (!ingredient.item) continue;
      
      // Get cooking method from first instruction if available
      const cookingMethod = recipe.instructions && recipe.instructions.length > 0
        ? recipe.instructions[0]
        : undefined;
      
      // Call fusion function for this ingredient
      const fusedData = await fuseIngredientNutrition(
        ingredient,
        [], // No alternative values for now
        cookingMethod
      );
      
      if (fusedData && fusedData.fused.length > 0) {
        // Track overall confidence
        confidenceScores.push(fusedData.overall_confidence);
        
        // Add each nutrient from the fusion results
        for (const nutrient of fusedData.fused) {
          // Calculate scaled value based on quantity
          const quantity = ingredient.qty || ingredient.qty_metric || 1;
          const scaledValue = nutrient.fusedValue * quantity;
          
          // Add to combined nutrition
          const key = nutrient.nutrient as keyof Nutrition;
          if (typeof combinedNutrition[key] === 'number') {
            (combinedNutrition[key] as number) += scaledValue;
          }
        }
      } else {
        // Track ingredients that couldn't be matched
        unmatchedIngredients.push(ingredient.item);
      }
    }
    
    // Calculate overall confidence score
    const overallConfidenceScore = confidenceScores.length > 0
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0.5;
    
    // Determine overall confidence level
    let overallConfidence: 'high' | 'medium' | 'low' = 'medium';
    if (overallConfidenceScore >= 0.8) {
      overallConfidence = 'high';
    } else if (overallConfidenceScore < 0.6) {
      overallConfidence = 'low';
    }
    
    // Update data quality information
    combinedNutrition.data_quality = {
      overall_confidence: overallConfidence,
      overall_confidence_score: overallConfidenceScore,
      unmatched_or_low_confidence_ingredients: unmatchedIngredients
    };
    
    // Round numeric values for better display
    for (const [key, value] of Object.entries(combinedNutrition)) {
      if (typeof value === 'number') {
        combinedNutrition[key as keyof Nutrition] = Math.round(value * 10) / 10 as any;
      }
    }
    
    return combinedNutrition as Nutrition;
  } catch (error) {
    console.error('Error fusing recipe nutrition:', error);
    return null;
  }
}

/**
 * Update a recipe with fused nutrition data
 */
export async function updateRecipeWithFusedNutrition(recipeId: string) {
  try {
    // First get the current recipe
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();
      
    if (recipeError || !recipeData) {
      console.error('Error fetching recipe:', recipeError);
      return false;
    }
    
    // Convert the recipe data to a proper Recipe type
    const recipe = recipeData as unknown as Recipe;
    
    // Fuse the nutrition data
    const fusedNutrition = await fuseRecipeNutrition(recipe);
    
    if (!fusedNutrition) {
      console.error('Failed to fuse nutrition data');
      return false;
    }
    
    // Update the recipe with fused nutrition
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        nutrition_fused: fusedNutrition as unknown as Json,
        nutrition_confidence: fusedNutrition.data_quality as unknown as Json
      })
      .eq('id', recipeId);
      
    if (updateError) {
      console.error('Error updating recipe with fused nutrition:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateRecipeWithFusedNutrition:', error);
    return false;
  }
}
