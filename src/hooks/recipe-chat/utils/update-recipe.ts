
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

export async function updateRecipe(
  recipe: Recipe,
  chatMessage: ChatMessage
): Promise<Recipe> {
  // Make a deep copy of the recipe to avoid mutating the original
  const updatedRecipe = JSON.parse(JSON.stringify(recipe)) as Recipe;
  
  // If there are no changes suggested, return the original recipe
  if (!chatMessage.changes_suggested) {
    return updatedRecipe;
  }
  
  // Update recipe title if provided
  if (chatMessage.changes_suggested.title) {
    updatedRecipe.title = chatMessage.changes_suggested.title;
  }
  
  // Update ingredients if provided
  if (chatMessage.changes_suggested.ingredients) {
    const { mode, items } = chatMessage.changes_suggested.ingredients;
    
    if (items && Array.isArray(items)) {
      switch (mode) {
        case 'add':
          // Add new ingredients
          updatedRecipe.ingredients = [
            ...updatedRecipe.ingredients,
            ...items.map(item => ({
              qty_metric: item.qty || 0,
              unit_metric: item.unit || '',
              qty_imperial: item.qty || 0,
              unit_imperial: item.unit || '',
              item: typeof item.item === 'string' 
                ? item.item 
                : item.item?.name || 'Unknown ingredient',
              notes: item.notes
            }))
          ];
          break;
          
        case 'replace':
          // Replace all ingredients
          updatedRecipe.ingredients = items.map(item => ({
            qty_metric: item.qty || 0,
            unit_metric: item.unit || '',
            qty_imperial: item.qty || 0,
            unit_imperial: item.unit || '',
            item: typeof item.item === 'string' 
              ? item.item 
              : item.item?.name || 'Unknown ingredient',
            notes: item.notes
          }));
          break;
          
        default:
          // No changes to ingredients
          break;
      }
    }
  }
  
  // Update instructions if provided
  if (chatMessage.changes_suggested.instructions) {
    const instructions = chatMessage.changes_suggested.instructions;
    
    if (Array.isArray(instructions)) {
      // Direct replacement of all instructions
      updatedRecipe.instructions = [...instructions];
    } else if (Array.isArray(instructions)) {
      // Follow specific change instructions (advanced mode)
      // This is currently not implemented in the AI responses
    }
  }
  
  // Update nutrition if provided
  if (chatMessage.changes_suggested.nutrition) {
    updatedRecipe.nutrition = {
      ...updatedRecipe.nutrition,
      ...chatMessage.changes_suggested.nutrition
    };
  }
  
  // Update science notes if provided
  if (chatMessage.changes_suggested.science_notes) {
    updatedRecipe.science_notes = [...chatMessage.changes_suggested.science_notes];
  }
  
  // Update timestamp
  updatedRecipe.updated_at = new Date().toISOString();
  
  // Return the updated recipe
  return updatedRecipe;
}
