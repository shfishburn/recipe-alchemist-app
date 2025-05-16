
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { cloneDeep } from 'lodash';

/**
 * Processes recipe updates from chat message changes
 * Returns a complete recipe with updates applied
 */
export function processRecipeUpdates(
  originalRecipe: Recipe,
  chatMessage: ChatMessage
): Recipe {
  console.log("Processing recipe updates for recipe:", originalRecipe.id);
  
  // If the chat message contains a complete recipe, return that instead
  if (chatMessage.recipe) {
    console.log("Using complete recipe from chat message");
    return {
      ...chatMessage.recipe as unknown as Recipe,
      id: originalRecipe.id, // Always preserve the original recipe ID
      updated_at: new Date().toISOString()
    };
  }
  
  // Start with a deep clone of the original recipe
  const updatedRecipe = cloneDeep(originalRecipe);
  
  // No changes suggested - return original
  if (!chatMessage.changes_suggested) {
    console.log("No changes to apply");
    return updatedRecipe;
  }
  
  // Apply title changes if provided
  if (chatMessage.changes_suggested.title) {
    console.log("Updating title to:", chatMessage.changes_suggested.title);
    updatedRecipe.title = chatMessage.changes_suggested.title;
  }
  
  // Apply ingredient changes if provided
  const ingredientUpdates = chatMessage.changes_suggested.ingredients;
  if (ingredientUpdates) {
    const { mode, items } = ingredientUpdates;
    
    // Only process if we have items and they're in an array
    if (items && Array.isArray(items) && items.length > 0) {
      console.log(`Updating ingredients with ${mode} mode - ${items.length} items`);
      
      if (mode === "replace") {
        // Replace all ingredients with new list
        updatedRecipe.ingredients = items.map(item => ({
          qty_metric: item.qty_metric || 0,
          unit_metric: item.unit_metric || '',
          qty_imperial: item.qty_imperial || 0,
          unit_imperial: item.unit_imperial || '',
          item: typeof item.item === 'string' ? item.item : String(item.item || ''),
          notes: item.notes,
          qty: item.qty,
          unit: item.unit
        }));
      } else if (mode === "add") {
        // Add new ingredients to existing list
        const newIngredients = items.map(item => ({
          qty_metric: item.qty_metric || 0,
          unit_metric: item.unit_metric || '',
          qty_imperial: item.qty_imperial || 0,
          unit_imperial: item.unit_imperial || '',
          item: typeof item.item === 'string' ? item.item : String(item.item || ''),
          notes: item.notes,
          qty: item.qty,
          unit: item.unit
        }));
        
        updatedRecipe.ingredients = [
          ...updatedRecipe.ingredients,
          ...newIngredients
        ];
      }
      // "none" mode means no changes to ingredients
    }
  }
  
  // Apply instruction changes if provided
  if (chatMessage.changes_suggested.instructions &&
      Array.isArray(chatMessage.changes_suggested.instructions) &&
      chatMessage.changes_suggested.instructions.length > 0) {
    
    console.log(
      "Updating instructions with",
      chatMessage.changes_suggested.instructions.length,
      "instructions"
    );
    
    // Replace instructions with the new list
    updatedRecipe.instructions = chatMessage.changes_suggested.instructions.map(
      instruction => typeof instruction === 'string' ? instruction : String(instruction)
    );
  }
  
  // Apply science notes changes if provided
  if (chatMessage.changes_suggested.science_notes &&
      Array.isArray(chatMessage.changes_suggested.science_notes) &&
      chatMessage.changes_suggested.science_notes.length > 0) {
    
    console.log(
      "Updating science notes with",
      chatMessage.changes_suggested.science_notes.length,
      "notes"
    );
    
    // Replace science notes with the new list
    updatedRecipe.science_notes = chatMessage.changes_suggested.science_notes.map(
      note => typeof note === 'string' ? note : String(note)
    );
  }
  
  // Apply nutrition changes if provided
  if (chatMessage.changes_suggested.nutrition) {
    console.log("Updating nutrition data");
    updatedRecipe.nutrition = {
      ...updatedRecipe.nutrition || {},
      ...chatMessage.changes_suggested.nutrition
    };
  }
  
  // Update timestamp
  updatedRecipe.updated_at = new Date().toISOString();
  
  return updatedRecipe;
}
