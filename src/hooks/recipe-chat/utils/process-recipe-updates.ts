
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

/**
 * Process updates from a chat message to modify a recipe
 */
export function processRecipeUpdates(recipe: Recipe, chatMessage: ChatMessage): Recipe {
  if (!recipe || !chatMessage) {
    console.error("Cannot process recipe updates: missing required data");
    return recipe;
  }
  
  const { changes_suggested } = chatMessage;
  
  if (!changes_suggested) {
    console.log("No changes to apply");
    return recipe;
  }
  
  console.log("Processing recipe updates with changes:", changes_suggested);
  
  // Create a deep copy of the recipe to avoid mutating the original
  const updatedRecipe = JSON.parse(JSON.stringify(recipe));
  
  try {
    // Update title if provided
    if (changes_suggested.title !== undefined && 
        changes_suggested.title !== null && 
        typeof changes_suggested.title === 'string') {
      updatedRecipe.title = changes_suggested.title;
    }
    
    // Update tagline/description if provided
    // Note: We handle both field names for backward compatibility
    if (changes_suggested.tagline) {
      updatedRecipe.tagline = changes_suggested.tagline;
    } else if (changes_suggested.description) {
      // Map description to tagline for the database
      updatedRecipe.tagline = changes_suggested.description;
    }
    
    // Update cuisine if provided
    if (changes_suggested.cuisine) {
      updatedRecipe.cuisine = changes_suggested.cuisine;
    }
    
    // Update cooking_tip if provided
    if (changes_suggested.cooking_tip) {
      updatedRecipe.cooking_tip = changes_suggested.cooking_tip;
    }
    
    // Update science notes if provided
    if (changes_suggested.science_notes && Array.isArray(changes_suggested.science_notes)) {
      // Combine existing science notes with new ones, ensuring no duplicates
      const existingNotes = Array.isArray(updatedRecipe.science_notes) ? updatedRecipe.science_notes : [];
      const newNotes = changes_suggested.science_notes;
      
      // Combine and remove duplicates
      const combinedNotes = [...existingNotes];
      
      for (const note of newNotes) {
        if (!combinedNotes.includes(note)) {
          combinedNotes.push(note);
        }
      }
      
      updatedRecipe.science_notes = combinedNotes;
    }
    
    // Update ingredients if provided
    if (changes_suggested.ingredients) {
      const { mode, items } = changes_suggested.ingredients;
      
      if (mode === 'replace' && Array.isArray(items)) {
        // Replace all ingredients
        updatedRecipe.ingredients = items;
      } else if (mode === 'add' && Array.isArray(items)) {
        // Add new ingredients
        updatedRecipe.ingredients = [...updatedRecipe.ingredients, ...items];
      }
    }
    
    // Update instructions if provided
    if (changes_suggested.instructions && Array.isArray(changes_suggested.instructions)) {
      updatedRecipe.instructions = changes_suggested.instructions;
    }
    
    // Update nutrition data if provided
    if (changes_suggested.nutrition) {
      updatedRecipe.nutrition = {
        ...updatedRecipe.nutrition,
        ...changes_suggested.nutrition
      };
    }
    
    console.log("Recipe updated with changes");
    return updatedRecipe;
    
  } catch (error) {
    console.error("Error processing recipe updates:", error);
    // Return the original recipe if there was an error
    return recipe;
  }
}
