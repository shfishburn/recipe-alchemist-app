
import type { Recipe, Ingredient } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { findDuplicateIngredients, validateIngredientQuantities } from './ingredients/ingredient-validation';
import { processRecipeUpdates } from './process-recipe-updates';
import { saveRecipeUpdate } from './db/save-recipe-update';
import { validateRecipeUpdate } from './validation/validate-recipe-update';
import { ensureRecipeIntegrity } from './validation/validate-recipe-integrity';

// Type guard to ensure ingredient has required properties for Recipe.ingredients
function ensureRequiredIngredientProps(ing: any): ing is Recipe['ingredients'][0] {
  return (
    typeof ing === 'object' &&
    ing !== null &&
    'qty_metric' in ing &&
    'unit_metric' in ing &&
    'qty_imperial' in ing &&
    'unit_imperial' in ing &&
    'item' in ing
  );
}

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
        ? updatedRecipeData.ingredients.map(ing => {
            // Handle ing as potentially any type, including null, string, etc.
            if (!ing || typeof ing !== 'object') {
              // Return default ingredient if ing is null or not an object
              return {
                qty_metric: 0,
                unit_metric: '',
                qty_imperial: 0,
                unit_imperial: '',
                item: 'Unknown ingredient',
              };
            }
            
            // Type cast ing to any to safely access properties
            const ingredient = ing as any;
            
            return {
              // Required fields
              qty_metric: typeof ingredient.qty_metric === 'number' ? ingredient.qty_metric : 0,
              unit_metric: typeof ingredient.unit_metric === 'string' ? ingredient.unit_metric : '',
              qty_imperial: typeof ingredient.qty_imperial === 'number' ? ingredient.qty_imperial : 0,
              unit_imperial: typeof ingredient.unit_imperial === 'string' ? ingredient.unit_imperial : '',
              item: typeof ingredient.item === 'string' ? ingredient.item : String(ingredient.item || 'Unknown ingredient'),
              
              // Optional fields
              notes: typeof ingredient.notes === 'string' ? ingredient.notes : undefined,
              shop_size_qty: typeof ingredient.shop_size_qty === 'number' ? ingredient.shop_size_qty : undefined,
              shop_size_unit: typeof ingredient.shop_size_unit === 'string' ? ingredient.shop_size_unit : undefined,
              qty: typeof ingredient.qty === 'number' ? ingredient.qty : undefined,
              unit: typeof ingredient.unit === 'string' ? ingredient.unit : undefined
            };
          })
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
          typeof item === 'object' && 
          item !== null &&
          typeof item.qty === 'number' && 
          typeof item.unit === 'string' && 
          (typeof item.item === 'string' || item.item !== null)
        );

        if (!validIngredients) {
          console.error("Invalid ingredient format detected");
          throw new Error("Invalid ingredient format in suggested changes");
        }

        // Check for duplicates in add mode
        if (mode === 'add') {
          // Convert changed ingredients to Recipe.Ingredient type
          const typedIngredients: Ingredient[] = items.map(item => ({
            qty_metric: item.qty_metric || 0,
            unit_metric: item.unit_metric || '',
            qty_imperial: item.qty_imperial || 0,
            unit_imperial: item.unit_imperial || '',
            item: typeof item.item === 'string' ? item.item : String(item.item || ''),
            notes: item.notes,
            qty: item.qty,
            unit: item.unit
          }));
          
          const duplicates = findDuplicateIngredients(updatedRecipe.ingredients, typedIngredients);
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
        // We need to transform ingredients to match expected types
        const formattedItems = items.map(item => {
          return {
            qty_metric: item.qty_metric || 0,
            unit_metric: item.unit_metric || '',
            qty_imperial: item.qty_imperial || 0,
            unit_imperial: item.unit_imperial || '',
            item: typeof item.item === 'string' ? item.item : String(item.item || ''),
            notes: item.notes,
            qty: item.qty,
            unit: item.unit
          };
        });
        
        const quantityValidation = validateIngredientQuantities(
          recipe, 
          formattedItems as Ingredient[], 
          mode
        );
        
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
    
    // Save the recipe update and get the response
    const savedResponse = await saveRecipeUpdate(updatedRecipe);
    
    // Ensure that the saved response is properly converted to a Recipe object
    if (!savedResponse) {
      throw new Error("Failed to save recipe update");
    }
    
    // Return the properly formatted Recipe
    return {
      ...updatedRecipe,
      // Only update fields that might have changed during saving
      updated_at: savedResponse.updated_at || updatedRecipe.updated_at
    };
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
}
