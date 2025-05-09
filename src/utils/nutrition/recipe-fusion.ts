
import { supabase } from "@/integrations/supabase/client";
import { Recipe, Nutrition, Ingredient } from "./types";
import { fuseIngredientNutrition } from "./ingredient-fusion";

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
        nutrition_fused: fusedNutrition as any, // Type assertion to solve the Json constraint
        nutrition_confidence: fusedNutrition.data_quality as any
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
