
import _ from 'lodash';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

/**
 * Process recipe updates based on chat message changes
 * This function takes the original recipe and applies changes from the chat message
 * to create a new updated recipe
 */
export function processRecipeUpdates(
  originalRecipe: Recipe,
  chatMessage: ChatMessage
): Recipe {
  // Start with a deep clone of the original recipe to avoid mutation
  const updatedRecipe = _.cloneDeep(originalRecipe);
  
  // If the chat message contains a complete recipe, use it directly
  if (chatMessage.recipe) {
    console.log("Using complete recipe from chat message");
    
    // Preserve critical fields from the original recipe
    return {
      ...chatMessage.recipe as Recipe,
      id: originalRecipe.id, // Always preserve the original ID
      updated_at: new Date().toISOString()
    };
  }
  
  // Legacy support for partial changes (changes_suggested)
  if (chatMessage.changes_suggested) {
    console.log("Processing legacy changes_suggested format");
    const { changes_suggested } = chatMessage;
    
    // Update title if provided
    if (changes_suggested.title) {
      updatedRecipe.title = changes_suggested.title;
    }
    
    // Update ingredients if provided
    if (changes_suggested.ingredients) {
      const { mode, items = [] } = changes_suggested.ingredients;
      
      if (mode === 'replace' && Array.isArray(items)) {
        // Replace all ingredients
        updatedRecipe.ingredients = items.map(item => ({
          qty_metric: item.qty_metric || 0,
          unit_metric: item.unit_metric || '',
          qty_imperial: item.qty_imperial || 0,
          unit_imperial: item.unit_imperial || '',
          item: typeof item.item === 'string' ? item.item : String(item.item || ''),
          notes: item.notes,
          shop_size_qty: item.shop_size_qty,
          shop_size_unit: item.shop_size_unit
        }));
      } else if (mode === 'add' && Array.isArray(items)) {
        // Add new ingredients
        const newIngredients = items.map(item => ({
          qty_metric: item.qty_metric || 0,
          unit_metric: item.unit_metric || '',
          qty_imperial: item.qty_imperial || 0,
          unit_imperial: item.unit_imperial || '',
          item: typeof item.item === 'string' ? item.item : String(item.item || ''),
          notes: item.notes,
          shop_size_qty: item.shop_size_qty,
          shop_size_unit: item.shop_size_unit
        }));
        
        updatedRecipe.ingredients = [...updatedRecipe.ingredients, ...newIngredients];
      }
    }
    
    // Update instructions if provided
    if (Array.isArray(changes_suggested.instructions)) {
      updatedRecipe.instructions = changes_suggested.instructions;
    }
    
    // Update science notes if provided
    if (Array.isArray(changes_suggested.science_notes)) {
      updatedRecipe.science_notes = changes_suggested.science_notes;
    }
    
    // Update nutrition if provided
    if (changes_suggested.nutrition) {
      updatedRecipe.nutrition = {
        ...updatedRecipe.nutrition,
        ...changes_suggested.nutrition
      };
    }
  }
  
  // Ensure updated timestamp
  updatedRecipe.updated_at = new Date().toISOString();
  
  return updatedRecipe;
}
