import type { Recipe, Ingredient, Nutrition } from '@/types/recipe';
import type { ChangesResponse, IngredientChange } from '@/types/chat';

/**
 * Process recipe updates based on changes from the AI
 */
export function processRecipeUpdates(recipe: Recipe, changes: ChangesResponse): Recipe {
  // Create a deep copy of the recipe to avoid mutating the original
  const updatedRecipe = JSON.parse(JSON.stringify(recipe)) as Recipe;
  
  // Update title if provided and different
  if (changes.title && changes.title !== recipe.title) {
    console.log(`Updating recipe title: ${recipe.title} -> ${changes.title}`);
    updatedRecipe.title = changes.title;
  }
  
  // Process ingredient changes
  if (changes.ingredients) {
    const mode = changes.ingredients.mode;
    
    // If replacement mode, completely replace ingredients
    if (mode === 'replace' && Array.isArray(changes.ingredients.items) && changes.ingredients.items.length > 0) {
      console.log('Replacing all ingredients');
      // Convert from IngredientChange to Ingredient format
      updatedRecipe.ingredients = changes.ingredients.items.map(convertToIngredient);
    } 
    // If add mode, append new ingredients
    else if (mode === 'add' && Array.isArray(changes.ingredients.items) && changes.ingredients.items.length > 0) {
      console.log('Adding new ingredients');
      // Combine existing ingredients with new ones, converting format
      updatedRecipe.ingredients = [
        ...(updatedRecipe.ingredients || []), 
        ...changes.ingredients.items.map(convertToIngredient)
      ];
    }
    // If none mode or invalid items, keep original ingredients
    else {
      console.log('No ingredient changes or invalid items array');
    }
  }
  
  // Process instruction/steps changes
  if (Array.isArray(changes.instructions) && changes.instructions.length > 0) {
    console.log('Updating recipe instructions/steps');
    
    // Handle whether recipe uses 'steps' or 'instructions' field
    if (Array.isArray(updatedRecipe.steps)) {
      updatedRecipe.steps = changes.instructions.map(item => 
        typeof item === 'string' ? item : item.text
      );
    } else if (Array.isArray(updatedRecipe.instructions)) {
      updatedRecipe.instructions = changes.instructions.map(item => 
        typeof item === 'string' ? item : item.text
      );
    }
  }
  
  // Update science notes if provided
  if (Array.isArray(changes.science_notes) && changes.science_notes.length > 0) {
    console.log('Updating science notes');
    updatedRecipe.science_notes = [...changes.science_notes];
  }
  
  // Update nutrition data if provided
  if (changes.nutrition) {
    console.log('Updating nutrition data');
    // Ensure we have a valid nutrition object
    updatedRecipe.nutrition = { ...(updatedRecipe.nutrition || createEmptyNutrition()), ...changes.nutrition };
  }
  
  return updatedRecipe;
}

/**
 * Convert an IngredientChange to Ingredient format
 */
function convertToIngredient(item: IngredientChange): Ingredient {
  // Create a base ingredient with required fields
  const ingredient: Ingredient = {
    qty_imperial: item.qty || 0,
    unit_imperial: item.unit || '',
    qty_metric: item.qty || 0, // Default to same value, should be converted properly
    unit_metric: '', // Should be converted properly based on unit_imperial
    item: item.item || ''
  };
  
  // Add any additional fields that might exist on the item
  return {
    ...ingredient,
    // Add any other fields from the original item that might be useful
    notes: item.notes
  };
}

/**
 * Create an empty nutrition object with default values
 */
function createEmptyNutrition(): Nutrition {
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
    sugar: 0
  };
}
