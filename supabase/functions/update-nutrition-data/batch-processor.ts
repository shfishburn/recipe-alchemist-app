
import { standardizeNutrition, validateNutrition, standardizeScienceNotes } from './utils.ts';

// Process a batch of recipes
export async function processRecipeBatch(recipes: any[], supabase: any, options: any = {}) {
  const { updateType = 'nutrition' } = options;
  console.log(`Processing batch of ${recipes.length} recipes for ${updateType} updates`);
  
  let updatedCount = 0;
  let errorCount = 0;

  for (const recipe of recipes) {
    try {
      if (updateType === 'nutrition') {
        const result = await processNutritionUpdate(recipe, supabase);
        if (result.updated) updatedCount++;
        if (result.error) errorCount++;
      } 
      else if (updateType === 'science') {
        const result = await processScienceUpdate(recipe, supabase);
        if (result.updated) updatedCount++;
        if (result.error) errorCount++;
      }
    } catch (error) {
      console.error(`Error processing recipe ${recipe.id}:`, error);
      errorCount++;
    }
  }
  
  return { updatedCount, errorCount };
}

// Process nutrition data updates
async function processNutritionUpdate(recipe: any, supabase: any) {
  // Skip if no nutrition data at all
  if (!recipe.nutrition) {
    console.log(`Recipe ${recipe.id} has no nutrition data, skipping`);
    return { updated: false, error: false };
  }

  // Parse nutrition if it's a string
  let nutritionData;
  if (typeof recipe.nutrition === 'string') {
    try {
      nutritionData = JSON.parse(recipe.nutrition);
    } catch (e) {
      console.error(`Error parsing nutrition JSON for recipe ${recipe.id}:`, e);
      return { updated: false, error: true };
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
      return { updated: false, error: true };
    } else {
      return { updated: true, error: false };
    }
  } else {
    console.log(`Recipe ${recipe.id} nutrition data failed validation`);
    return { updated: false, error: false };
  }
}

// Process science notes updates
async function processScienceUpdate(recipe: any, supabase: any) {
  // Skip if no science notes at all
  if (!recipe.science_notes) {
    console.log(`Recipe ${recipe.id} has no science notes, skipping`);
    return { updated: false, error: false };
  }

  // Parse science notes if it's a string
  let scienceNotes;
  if (typeof recipe.science_notes === 'string') {
    try {
      scienceNotes = JSON.parse(recipe.science_notes);
    } catch (e) {
      console.error(`Error parsing science notes JSON for recipe ${recipe.id}:`, e);
      return { updated: false, error: true };
    }
  } else {
    scienceNotes = recipe.science_notes;
  }

  // Standardize the science notes
  const standardizedNotes = standardizeScienceNotes(scienceNotes);
  
  // Update the recipe with standardized science notes
  const { error } = await supabase
    .from('recipes')
    .update({ science_notes: standardizedNotes })
    .eq('id', recipe.id);
  
  if (error) {
    console.error(`Error updating science notes for recipe ${recipe.id}:`, error);
    return { updated: false, error: true };
  } else {
    return { updated: true, error: false };
  }
}
