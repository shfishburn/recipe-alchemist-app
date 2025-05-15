
import type { Recipe } from '@/types/recipe';
import type { ChatMessage, ChangesResponse } from '@/types/chat';

/**
 * Process recipe updates based on chat message suggested changes
 * @param recipe Original recipe to update
 * @param chatMessage Chat message containing suggested changes
 * @returns Updated recipe object
 */
export function processRecipeUpdates(recipe: Recipe, chatMessage: ChatMessage): Recipe {
  // Create a clone of the recipe to avoid mutation issues
  const updatedRecipe = structuredClone(recipe);
  const { changes_suggested } = chatMessage;
  
  // Early return if no changes suggested
  if (!changes_suggested) {
    return updatedRecipe;
  }

  console.log("Processing recipe updates with changes:", {
    hasTitle: !!changes_suggested.title,
    hasTagline: !!changes_suggested.tagline,
    hasDescription: !!changes_suggested.description,
    hasIngredients: !!changes_suggested.ingredients,
    ingredientMode: changes_suggested.ingredients?.mode,
    hasInstructions: !!changes_suggested.instructions,
    hasNutrition: !!changes_suggested.nutrition
  });

  // Update title if provided
  if (changes_suggested.title) {
    updatedRecipe.title = changes_suggested.title;
  }
  
  // Handle description/tagline field update - prioritize tagline over description
  if (changes_suggested.tagline) {
    updatedRecipe.tagline = changes_suggested.tagline;
  } else if (changes_suggested.description) {
    // Fallback to description if tagline isn't provided
    updatedRecipe.tagline = changes_suggested.description;
  }
  
  // Process ingredients updates if provided
  if (changes_suggested.ingredients?.items?.length > 0) {
    const { mode, items } = changes_suggested.ingredients;
    
    switch (mode) {
      case 'replace':
        // Replace all ingredients with new ones
        updatedRecipe.ingredients = items;
        break;
      
      case 'add':
        // Add new ingredients to existing ones
        updatedRecipe.ingredients = [
          ...(updatedRecipe.ingredients || []),
          ...items
        ];
        break;
      
      case 'none':
      default:
        // No changes to ingredients
        break;
    }
  }
  
  // Update instructions if provided
  if (Array.isArray(changes_suggested.instructions) && changes_suggested.instructions.length > 0) {
    // Convert complex instruction objects to simple strings
    const processedInstructions = changes_suggested.instructions.map(instruction => 
      typeof instruction === 'string' ? instruction : String(instruction)
    );
    updatedRecipe.instructions = processedInstructions;
  }
  
  // Update nutrition data if provided
  if (changes_suggested.nutrition) {
    updatedRecipe.nutrition = {
      ...updatedRecipe.nutrition,
      ...changes_suggested.nutrition
    };
  }
  
  // Update science notes if provided
  if (Array.isArray(changes_suggested.science_notes) && changes_suggested.science_notes.length > 0) {
    // Convert any objects to strings to ensure compatibility
    const processedNotes = changes_suggested.science_notes.map(note => 
      typeof note === 'string' ? note : String(note)
    );
    
    // Assign processed notes to the recipe
    updatedRecipe.science_notes = processedNotes;
  }

  return updatedRecipe;
}
