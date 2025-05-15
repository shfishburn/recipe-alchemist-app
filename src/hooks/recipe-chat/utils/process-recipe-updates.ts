
import type { Recipe } from '@/types/recipe';
import type { ChatMessage, ChangesResponse } from '@/types/chat';

/**
 * Processes recipe updates from an AI chat message's suggested changes
 * @param originalRecipe The recipe to update
 * @param chatMessage The chat message containing suggested changes
 * @returns The updated recipe with changes applied
 */
export function processRecipeUpdates(
  originalRecipe: Recipe,
  chatMessage: ChatMessage
): Recipe {
  const changes = chatMessage.changes_suggested;
  
  if (!changes) {
    return originalRecipe;
  }
  
  // Create a deep clone of the recipe to modify
  const updatedRecipe = structuredClone(originalRecipe);
  
  // Update title if provided
  if (changes.title) {
    updatedRecipe.title = changes.title;
  }
  
  // Update ingredients if provided
  if (changes.ingredients && changes.ingredients.mode !== 'none' && Array.isArray(changes.ingredients.items)) {
    if (changes.ingredients.mode === 'replace' && changes.ingredients.items.length > 0) {
      // Replace all ingredients
      updatedRecipe.ingredients = changes.ingredients.items;
    } else if (changes.ingredients.mode === 'add' && changes.ingredients.items.length > 0) {
      // Add new ingredients to the existing ones
      updatedRecipe.ingredients = [...updatedRecipe.ingredients, ...changes.ingredients.items];
    }
  }
  
  // Update instructions if provided
  if (changes.instructions) {
    if (Array.isArray(changes.instructions)) {
      if (typeof changes.instructions[0] === 'string') {
        // Simple string array format
        updatedRecipe.instructions = changes.instructions as string[];
      } else {
        // Complex object format - convert to string array
        updatedRecipe.instructions = (changes.instructions as unknown[]).map(instruction => 
          typeof instruction === 'string' ? instruction : instruction.action || instruction.stepNumber?.toString() || ''
        ).filter(step => step.trim() !== '');
      }
    }
  }
  
  // Update nutrition if provided
  if (changes.nutrition) {
    updatedRecipe.nutrition = {
      ...updatedRecipe.nutrition || {},
      ...changes.nutrition
    };
  }
  
  // Update science notes if provided
  if (changes.science_notes && Array.isArray(changes.science_notes)) {
    updatedRecipe.science_notes = changes.science_notes.filter(note => note && typeof note === 'string');
  }
  
  // Update health insights if provided
  if (changes.health_insights && Array.isArray(changes.health_insights)) {
    if (!updatedRecipe.chef_notes) {
      updatedRecipe.chef_notes = '';
    }
    
    const healthInsights = changes.health_insights.filter(insight => insight && typeof insight === 'string');
    if (healthInsights.length > 0) {
      updatedRecipe.chef_notes += '\n\nHealth Insights:\n' + healthInsights.join('\n');
    }
  }
  
  // Extract full recipe from changes if available
  // This handles the case where the AI returns a complete recipe structure
  if (chatMessage.meta?.full_recipe) {
    try {
      const fullRecipe = chatMessage.meta.full_recipe as Partial<Recipe>;
      
      // Merge the full recipe structure with the existing recipe
      // while preserving critical fields like ID
      Object.entries(fullRecipe).forEach(([key, value]) => {
        // Skip critical fields we don't want to override
        if (['id', 'user_id', 'created_at', 'updated_at', 'version_number', 'previous_version_id'].includes(key)) {
          return;
        }
        
        if (value !== undefined && value !== null) {
          updatedRecipe[key] = value;
        }
      });
    } catch (error) {
      console.error('Error processing full recipe from chat message:', error);
    }
  }
  
  return updatedRecipe;
}
