
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { findDuplicateIngredients, validateIngredientQuantities } from './ingredients/ingredient-validation';
import { processRecipeUpdates } from './process-recipe-updates';
import { saveRecipeUpdate } from './db/save-recipe-update';
import { validateRecipeUpdate } from './validation/validate-recipe-update';
import { ensureRecipeIntegrity } from './validation/validate-recipe-integrity';

export async function updateRecipe(
  recipe: Recipe,
  chatMessage: ChatMessage
): Promise<Recipe> {
  // Initial validation of inputs
  if (!validateRecipeUpdate(recipe, chatMessage.changes_suggested)) {
    throw new Error("Failed to validate recipe update");
  }
  
  console.log("Starting recipe update with changes:", {
    hasTitle: !!chatMessage.changes_suggested?.title,
    hasIngredients: !!chatMessage.changes_suggested?.ingredients,
    ingredientMode: chatMessage.changes_suggested?.ingredients?.mode,
    ingredientCount: chatMessage.changes_suggested?.ingredients?.items?.length,
    hasInstructions: !!chatMessage.changes_suggested?.instructions,
    hasNutrition: !!chatMessage.changes_suggested?.nutrition,
    hasScienceNotes: !!chatMessage.changes_suggested?.science_notes,
    scienceNoteCount: chatMessage.changes_suggested?.science_notes?.length
  });

  try {
    // Process basic recipe updates - this now returns a complete recipe copy with changes applied
    const updatedRecipeData = processRecipeUpdates(recipe, chatMessage);
    
    // First convert to unknown to ensure type safety during conversion
    const intermediateData = updatedRecipeData as unknown;
    
    // Properly transform data to ensure type safety for ingredients
    const updatedRecipe: Recipe = {
      ...recipe, // Start with the original recipe to ensure all properties exist
      
      // Safely apply updates with explicit property assignments
      id: recipe.id, // Always preserve original ID
      title: updatedRecipeData.title || recipe.title || "Untitled Recipe",
      description: updatedRecipeData.description || recipe.description,
      
      // Ensure array fields are properly handled
      instructions: Array.isArray(updatedRecipeData.instructions)
        ? updatedRecipeData.instructions.map(instr => typeof instr === 'string' ? instr : String(instr))
        : recipe.instructions || [],
      
      // Transform ingredients with strict type checking for each property
      ingredients: Array.isArray(updatedRecipeData.ingredients)
        ? updatedRecipeData.ingredients.map(ing => ({
            // Required fields with strong type checking
            qty_metric: typeof ing.qty_metric === 'number' ? ing.qty_metric : 0,
            unit_metric: typeof ing.unit_metric === 'string' ? ing.unit_metric : '',
            qty_imperial: typeof ing.qty_imperial === 'number' ? ing.qty_imperial : 0,
            unit_imperial: typeof ing.unit_imperial === 'string' ? ing.unit_imperial : '',
            item: typeof ing.item === 'string' ? ing.item : '',
            
            // Optional fields
            notes: typeof ing.notes === 'string' ? ing.notes : undefined,
            shop_size_qty: typeof ing.shop_size_qty === 'number' ? ing.shop_size_qty : undefined,
            shop_size_unit: typeof ing.shop_size_unit === 'string' ? ing.shop_size_unit : undefined,
            qty: typeof ing.qty === 'number' ? ing.qty : undefined,
            unit: typeof ing.unit === 'string' ? ing.unit : undefined
          }))
        : recipe.ingredients || [],
      
      // Handle science_notes safely
      science_notes: Array.isArray(updatedRecipeData.science_notes)
        ? updatedRecipeData.science_notes.map(note => typeof note === 'string' ? note : String(note))
        : recipe.science_notes || [],
      
      // Copy other fields that might be updated
      nutrition: updatedRecipeData.nutrition || recipe.nutrition,
      image_url: updatedRecipeData.image_url || recipe.image_url,
      prep_time_min: updatedRecipeData.prep_time_min || recipe.prep_time_min,
      cook_time_min: updatedRecipeData.cook_time_min || recipe.cook_time_min,
      servings: updatedRecipeData.servings || recipe.servings,
      cuisine: updatedRecipeData.cuisine || recipe.cuisine,
      cuisine_category: updatedRecipeData.cuisine_category || recipe.cuisine_category,
      tags: updatedRecipeData.tags || recipe.tags,
      updated_at: new Date().toISOString()
    };

    // Verify recipe integrity before saving
    ensureRecipeIntegrity(updatedRecipe);
    
    // Advanced ingredient validations if ingredients are being modified
    if (chatMessage.changes_suggested?.ingredients?.items) {
      const { mode = 'none', items = [] } = chatMessage.changes_suggested.ingredients;
      
      if (mode !== 'none' && items.length > 0) {
        // Validate ingredient format
        const validIngredients = items.every(item => 
          typeof item.qty === 'number' && 
          typeof item.unit === 'string' && 
          typeof item.item === 'string'
        );

        if (!validIngredients) {
          console.error("Invalid ingredient format detected");
          throw new Error("Invalid ingredient format in suggested changes");
        }

        // Check for duplicates in add mode
        if (mode === 'add') {
          const duplicates = findDuplicateIngredients(recipe.ingredients, items);
          if (duplicates.length > 0) {
            console.error("Duplicate ingredients detected:", duplicates);
            throw new Error(
              `These ingredients (or similar ones) already exist in the recipe: ${
                duplicates.map(d => d.new).join(', ')
              }`
            );
          }
        }

        // Validate quantities
        const quantityValidation = validateIngredientQuantities(recipe, items, mode);
        if (!quantityValidation.valid) {
          console.error("Ingredient quantity validation failed:", quantityValidation.message);
          throw new Error(quantityValidation.message || "Invalid ingredient quantities");
        }
      }
    }

    console.log("Final recipe update ready to save:", {
      id: updatedRecipe.id,
      hasIngredients: updatedRecipe.ingredients?.length > 0,
      ingredientCount: updatedRecipe.ingredients?.length,
      hasInstructions: updatedRecipe.instructions?.length > 0,
      instructionCount: updatedRecipe.instructions?.length
    });
    
    // Save the recipe update and return the updated recipe
    const dbResponse = await saveRecipeUpdate(updatedRecipe);
    
    // Process database response to ensure it conforms to Recipe type
    const savedRecipe: Recipe = {
      ...updatedRecipe,
      // Transform ingredients from database JSON to proper Ingredient[]
      ingredients: Array.isArray(dbResponse.ingredients) 
        ? dbResponse.ingredients.map(ing => ({
            qty_metric: typeof ing.qty_metric === 'number' ? ing.qty_metric : 0,
            unit_metric: typeof ing.unit_metric === 'string' ? ing.unit_metric : '',
            qty_imperial: typeof ing.qty_imperial === 'number' ? ing.qty_imperial : 0,
            unit_imperial: typeof ing.unit_imperial === 'string' ? ing.unit_imperial : '',
            item: typeof ing.item === 'string' ? ing.item : String(ing.item || ''),
            notes: typeof ing.notes === 'string' ? ing.notes : undefined,
            shop_size_qty: typeof ing.shop_size_qty === 'number' ? ing.shop_size_qty : undefined,
            shop_size_unit: typeof ing.shop_size_unit === 'string' ? ing.shop_size_unit : undefined,
            qty: typeof ing.qty === 'number' ? ing.qty : undefined,
            unit: typeof ing.unit === 'string' ? ing.unit : undefined
          }))
        : updatedRecipe.ingredients,
        
      // Ensure science_notes is always string array
      science_notes: Array.isArray(dbResponse.science_notes)
        ? dbResponse.science_notes.map(note => typeof note === 'string' ? note : String(note))
        : updatedRecipe.science_notes,
        
      // Copy other fields that might be updated in the database
      updated_at: dbResponse.updated_at || new Date().toISOString(),
    };
    
    return savedRecipe;
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
}
