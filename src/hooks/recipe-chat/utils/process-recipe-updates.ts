import type { Recipe } from '@/types/recipe';
import type { ChatMessage, InstructionChange } from '@/types/chat';
import { Ingredient } from '@/types/quick-recipe'; // Import the Ingredient type

/**
 * Normalizes an ingredient to ensure it has all required fields
 */
export function normalizeIngredient(ingredient: any): any {
  if (typeof ingredient !== 'object' || ingredient === null) {
    console.warn("Invalid ingredient object received:", ingredient);
    return {
      qty_metric: 0,
      unit_metric: '',
      qty_imperial: 0,
      unit_imperial: '',
      item: '',
    };
  }
  
  return {
    // Required fields with fallbacks
    qty_metric: typeof ingredient.qty_metric === 'number' ? ingredient.qty_metric : 0,
    unit_metric: typeof ingredient.unit_metric === 'string' ? ingredient.unit_metric : '',
    qty_imperial: typeof ingredient.qty_imperial === 'number' ? ingredient.qty_imperial : 0,
    unit_imperial: typeof ingredient.unit_imperial === 'string' ? ingredient.unit_imperial : '',
    item: typeof ingredient.item === 'string' ? ingredient.item : 
          typeof ingredient.item === 'object' && ingredient.item !== null ? String(ingredient.item) : '',
    
    // Optional fields
    notes: typeof ingredient.notes === 'string' ? ingredient.notes : undefined,
    shop_size_qty: typeof ingredient.shop_size_qty === 'number' ? ingredient.shop_size_qty : undefined,
    shop_size_unit: typeof ingredient.shop_size_unit === 'string' ? ingredient.shop_size_unit : undefined,
    qty: typeof ingredient.qty === 'number' ? ingredient.qty : undefined,
    unit: typeof ingredient.unit === 'string' ? ingredient.unit : undefined
  };
}

/**
 * Validates if instructions are complete and not just placeholders
 */
function validateInstructions(instructions: any[]): boolean {
  if (!Array.isArray(instructions) || instructions.length === 0) return false;
  
  // Placeholder patterns that indicate incomplete instructions
  const placeholderPatterns = [
    /add (\w+) cooking steps/i,
    /add steps/i,
    /add instructions/i,
    /placeholder/i,
    /cooking steps/i
  ];
  
  // Check if any instruction is too short or matches a placeholder pattern
  return !instructions.some(instruction => {
    const instructionText = typeof instruction === 'string' 
      ? instruction 
      : (instruction && typeof instruction === 'object' && 'action' in instruction) 
        ? instruction.action 
        : '';
        
    // Check if text is too short
    if (instructionText.length < 15) return true;
    
    // Check if text matches any placeholder patterns
    return placeholderPatterns.some(pattern => pattern.test(instructionText));
  });
}

export function processRecipeUpdates(recipe: Recipe, chatMessage: ChatMessage): Partial<Recipe> & { id: string } {
  console.log("Processing recipe updates with changes:", {
    hasTitle: !!chatMessage.changes_suggested?.title,
    hasIngredients: !!chatMessage.changes_suggested?.ingredients?.items?.length,
    ingredientMode: chatMessage.changes_suggested?.ingredients?.mode,
    hasInstructions: !!chatMessage.changes_suggested?.instructions?.length,
    hasNutrition: !!chatMessage.changes_suggested?.nutrition,
    hasScienceNotes: !!chatMessage.changes_suggested?.science_notes?.length,
    // Check for complete recipe object coming from the updated API
    hasCompleteRecipe: !!(chatMessage as any).recipe 
  });

  // Start with a complete copy of the original recipe to prevent data loss
  let updatedRecipe: Recipe = {
    ...recipe,
    updated_at: new Date().toISOString()
  };

  // If we have a complete recipe object in the chat message, use it
  // Note: We're using type assertion since the ChatMessage type might not be updated yet
  if ((chatMessage as any).recipe) {
    console.log("Using complete recipe object from chat message");
    
    // Get the complete recipe from the chat message
    const completeRecipe = (chatMessage as any).recipe;
    
    // Ensure the ingredients are properly normalized
    const normalizedIngredients = Array.isArray(completeRecipe.ingredients)
      ? completeRecipe.ingredients.map(ing => normalizeIngredient(ing))
      : recipe.ingredients;
      
    // Validate instructions to ensure they're complete
    const instructions = Array.isArray(completeRecipe.instructions)
      ? completeRecipe.instructions
      : recipe.instructions;
    
    const areInstructionsValid = validateInstructions(instructions);
    if (!areInstructionsValid) {
      console.warn("Received instructions appear to be incomplete or contain placeholders");
    }
    
    updatedRecipe = {
      ...updatedRecipe,
      ...completeRecipe,
      id: recipe.id, // Always preserve the original recipe ID
      ingredients: normalizedIngredients,
      instructions: areInstructionsValid ? instructions : recipe.instructions,
      updated_at: new Date().toISOString() // Update the timestamp
    };
    
    // If version info is present, add it to the recipe
    if (completeRecipe.version_info) {
      updatedRecipe.version_info = completeRecipe.version_info;
    }
    
    // Return the updated recipe
    return updatedRecipe;
  }

  // Fall back to processing individual changes if no complete recipe is provided
  
  // Only override specific fields if they're provided in the changes
  if (chatMessage.changes_suggested?.title) {
    updatedRecipe.title = chatMessage.changes_suggested.title;
  }

  if (chatMessage.changes_suggested?.nutrition) {
    updatedRecipe.nutrition = chatMessage.changes_suggested.nutrition;
  }

  // Safely update science notes - never replace with an empty array
  if (chatMessage.changes_suggested?.science_notes && 
      Array.isArray(chatMessage.changes_suggested.science_notes) &&
      chatMessage.changes_suggested.science_notes.length > 0) {
    console.log("Updating science notes with", chatMessage.changes_suggested.science_notes.length, "items");
    updatedRecipe.science_notes = chatMessage.changes_suggested.science_notes;
  }

  // Process instructions if they exist and are not just placeholders
  if (chatMessage.changes_suggested?.instructions && 
      Array.isArray(chatMessage.changes_suggested.instructions) &&
      chatMessage.changes_suggested.instructions.length > 0) {
    console.log("Updating instructions with", chatMessage.changes_suggested.instructions.length, "items");
    
    // Process instructions to ensure they're all strings
    const formattedInstructions = chatMessage.changes_suggested.instructions
      .map(instruction => {
        if (typeof instruction === 'string') {
          return instruction;
        }
        if (typeof instruction === 'object' && instruction && 'action' in instruction) {
          return (instruction as InstructionChange).action;
        }
        console.warn("Skipping invalid instruction format:", instruction);
        return null;
      })
      .filter(Boolean) as string[];
    
    // Validate that instructions are not just placeholders
    const areInstructionsValid = validateInstructions(formattedInstructions);
    
    if (areInstructionsValid) {
      console.log("Valid instruction updates found");
      updatedRecipe.instructions = formattedInstructions;
    } else {
      console.warn("Only placeholder instructions detected - keeping original instructions");
      // Keep original instructions
    }
  }

  // Process ingredients if they exist using the provided mode
  if (chatMessage.changes_suggested?.ingredients?.items) {
    const { mode = 'none', items = [] } = chatMessage.changes_suggested.ingredients;
    console.log("Processing ingredients:", { mode, itemCount: items.length });
    
    if (mode !== 'none' && items.length > 0) {
      // Update ingredients based on mode
      if (mode === 'add') {
        console.log("Adding new ingredients to existing recipe");
        // Normalize each ingredient before adding
        const normalizedIngredients = items.map(item => normalizeIngredient(item));
        updatedRecipe.ingredients = [...recipe.ingredients, ...normalizedIngredients];
      } else if (mode === 'replace') {
        console.log("Replacing all ingredients");
        // Normalize each ingredient before replacing
        updatedRecipe.ingredients = items.map(item => normalizeIngredient(item));
      }
      // For 'none' mode, keep existing ingredients
    }
  }

  // Data validation to ensure critical fields are always present
  if (!updatedRecipe.ingredients || !Array.isArray(updatedRecipe.ingredients) || updatedRecipe.ingredients.length === 0) {
    console.warn("No ingredients found in updated recipe, keeping original ingredients");
    updatedRecipe.ingredients = recipe.ingredients;
  }
  
  if (!updatedRecipe.instructions || !Array.isArray(updatedRecipe.instructions) || updatedRecipe.instructions.length === 0) {
    console.warn("No instructions found in updated recipe, keeping original instructions");
    updatedRecipe.instructions = recipe.instructions;
  }

  // Keep the image URL intact
  updatedRecipe.image_url = recipe.image_url;

  console.log("Final updated recipe status:", {
    hasIngredients: updatedRecipe.ingredients.length > 0,
    hasInstructions: updatedRecipe.instructions.length > 0,
    hasScienceNotes: updatedRecipe.science_notes && updatedRecipe.science_notes.length > 0,
  });

  return updatedRecipe;
}
