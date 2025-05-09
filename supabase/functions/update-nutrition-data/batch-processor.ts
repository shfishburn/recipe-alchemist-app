
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { standardizeNutrition, validateNutrition } from './utils.ts';

// Process a batch of recipes
export async function processRecipeBatch(recipes: any[], supabase: any) {
  console.log(`Processing batch of ${recipes.length} recipes`);
  let updatedCount = 0;
  let errorCount = 0;

  for (const recipe of recipes) {
    try {
      // Skip if no nutrition data at all
      if (!recipe.nutrition) {
        console.log(`Recipe ${recipe.id} has no nutrition data, skipping`);
        continue;
      }

      // Parse nutrition if it's a string
      let nutritionData;
      if (typeof recipe.nutrition === 'string') {
        try {
          nutritionData = JSON.parse(recipe.nutrition);
        } catch (e) {
          console.error(`Error parsing nutrition JSON for recipe ${recipe.id}:`, e);
          continue;
        }
      } else {
        nutritionData = recipe.nutrition;
      }

      // Standardize the nutrition data
      const standardizedNutrition = standardizeNutrition(nutritionData);
      
      // Only update if validation passes
      if (validateNutrition(standardizedNutrition)) {
        // Update the recipe with improved nutrition data
        const { error } = await supabase
          .from('recipes')
          .update({ nutrition: standardizedNutrition })
          .eq('id', recipe.id);
        
        if (error) {
          console.error(`Error updating recipe ${recipe.id}:`, error);
          errorCount++;
        } else {
          updatedCount++;
        }
      } else {
        console.log(`Recipe ${recipe.id} nutrition data failed validation`);
      }
    } catch (error) {
      console.error(`Error processing recipe ${recipe.id}:`, error);
      errorCount++;
    }
  }
  
  return { updatedCount, errorCount };
}
