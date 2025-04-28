
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import type { Json } from '@/integrations/supabase/types';
import { standardizeNutrition } from '@/types/nutrition-utils';

// Enhanced ingredient name normalization for comparison
function normalizeIngredient(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/s$/, '') // Remove trailing 's' for plurals
    .replace(/^(fresh |dried |ground |powdered |minced |chopped |diced |sliced )/, ''); // Remove common preparation prefixes
}

// Improved similarity check for ingredients
function areSimilarIngredients(ing1: string, ing2: string): boolean {
  const norm1 = normalizeIngredient(ing1);
  const norm2 = normalizeIngredient(ing2);
  
  // Direct match
  if (norm1 === norm2) return true;
  
  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  
  // Check word overlap
  const words1 = norm1.split(' ');
  const words2 = norm2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  
  // If there's significant word overlap
  if (commonWords.length > 0 && 
      commonWords.length / Math.max(words1.length, words2.length) > 0.5) {
    return true;
  }
  
  return false;
}

// More sophisticated ingredient quantity validation
function validateIngredientQuantities(
  originalRecipe: Recipe,
  newIngredients: any[],
  mode: 'add' | 'replace' | 'none'
): { valid: boolean; message?: string } {
  if (mode === 'none' || newIngredients.length === 0) {
    return { valid: true };
  }

  // Calculate ingredients to check based on mode
  const ingredientsToCheck = mode === 'replace' ? newIngredients : [...originalRecipe.ingredients, ...newIngredients];
  
  // Check for reasonable quantities relative to serving size
  const servingSize = originalRecipe.servings || 1;
  
  for (const ing of newIngredients) {
    // Skip ingredients without proper quantity data
    if (typeof ing.qty !== 'number' || typeof ing.unit !== 'string') {
      continue;
    }
    
    const qtyPerServing = ing.qty / servingSize;
    const unit = ing.unit.toLowerCase();
    
    // Detect extreme values based on common unit types
    if ((unit.includes('cup') || unit.includes('cups')) && qtyPerServing > 3) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high per serving`
      };
    }
    
    if ((unit.includes('pound') || unit.includes('lb')) && qtyPerServing > 1) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high per serving`
      };
    }
    
    if ((unit.includes('tablespoon') || unit.includes('tbsp')) && qtyPerServing > 4) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high per serving`
      };
    }
    
    if (qtyPerServing <= 0) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} has an invalid quantity`
      };
    }
  }

  return { valid: true };
}

// Enhanced duplicate ingredient detection
function findDuplicateIngredients(existingIngredients: Recipe['ingredients'], newIngredients: Recipe['ingredients']) {
  const duplicates = [];
  
  for (const newIng of newIngredients) {
    for (const existingIng of existingIngredients) {
      if (areSimilarIngredients(existingIng.item, newIng.item)) {
        duplicates.push({
          new: newIng.item,
          existing: existingIng.item
        });
        break;
      }
    }
  }
  
  return duplicates;
}

export async function updateRecipe(
  recipe: Recipe,
  chatMessage: ChatMessage,
  user_id: string,
  imageUrl: string | null
) {
  if (!chatMessage.changes_suggested) return null;
  
  console.log("Starting recipe update with changes:", {
    hasTitle: !!chatMessage.changes_suggested.title,
    hasIngredients: !!chatMessage.changes_suggested.ingredients,
    ingredientMode: chatMessage.changes_suggested.ingredients?.mode,
    ingredientCount: chatMessage.changes_suggested.ingredients?.items?.length,
    hasInstructions: !!chatMessage.changes_suggested.instructions,
    hasNutrition: !!chatMessage.changes_suggested.nutrition
  });

  // Process and validate nutrition data
  const processedNutrition = chatMessage.changes_suggested.nutrition 
    ? standardizeNutrition(chatMessage.changes_suggested.nutrition) 
    : recipe.nutrition;

  const updatedRecipe: Partial<Recipe> & { id: string } = {
    ...recipe,
    title: chatMessage.changes_suggested.title || recipe.title,
    nutrition: processedNutrition,
    image_url: imageUrl ?? recipe.image_url,
    science_notes: chatMessage.changes_suggested.science_notes || recipe.science_notes || [],
    updated_at: new Date().toISOString()
  };

  // Process ingredients with enhanced validation
  if (chatMessage.changes_suggested.ingredients?.items) {
    const { mode = 'none', items = [] } = chatMessage.changes_suggested.ingredients;
    console.log("Processing ingredients:", { mode, itemCount: items.length });
    
    // Skip processing if mode is none or items is empty
    if (mode === 'none' || items.length === 0) {
      console.log("No ingredient changes to apply");
    } else {
      // Validate ingredients format
      const validIngredients = items.every(item => 
        typeof item.qty === 'number' && 
        typeof item.unit === 'string' && 
        typeof item.item === 'string'
      );

      if (!validIngredients) {
        console.error("Invalid ingredient format detected");
        throw new Error("Invalid ingredient format in suggested changes");
      }

      // Enhanced duplicate checking in add mode
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

      // Validate quantities against serving size with improved logic
      const quantityValidation = validateIngredientQuantities(recipe, items, mode);
      if (!quantityValidation.valid) {
        console.error("Ingredient quantity validation failed:", quantityValidation.message);
        throw new Error(quantityValidation.message || "Invalid ingredient quantities");
      }

      if (mode === 'add') {
        console.log("Adding new ingredients to existing recipe");
        updatedRecipe.ingredients = [...recipe.ingredients, ...items];
      } else if (mode === 'replace') {
        console.log("Replacing all ingredients");
        updatedRecipe.ingredients = items;
      }
    }
  }

  // Process instructions with better formatting and validation
  if (chatMessage.changes_suggested.instructions && 
      Array.isArray(chatMessage.changes_suggested.instructions)) {
    console.log("Updating instructions");
    
    // Make sure all instructions are properly formatted
    const formattedInstructions = chatMessage.changes_suggested.instructions.map(
      instruction => {
        if (typeof instruction === 'string') {
          return instruction;
        }
        if (typeof instruction === 'object' && instruction.action) {
          return instruction.action;
        }
        console.warn("Skipping invalid instruction format:", instruction);
        return null;
      }
    ).filter(Boolean);
    
    if (formattedInstructions.length > 0) {
      updatedRecipe.instructions = formattedInstructions as string[];
    } else {
      console.warn("No valid instructions found in changes");
    }
  }

  console.log("Final recipe update:", {
    title: updatedRecipe.title,
    ingredientsCount: updatedRecipe.ingredients?.length,
    instructionsCount: updatedRecipe.instructions?.length,
    hasNutrition: !!updatedRecipe.nutrition
  });

  try {
    // Properly transform the recipe for Supabase storage
    const dbRecipe = {
      ...updatedRecipe,
      ingredients: updatedRecipe.ingredients as unknown as Json,
      nutrition: updatedRecipe.nutrition as unknown as Json,
      science_notes: updatedRecipe.science_notes as unknown as Json
    };

    const { data, error } = await supabase
      .from('recipes')
      .update(dbRecipe)
      .eq('id', recipe.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
    
    console.log("Recipe successfully updated");
    return data;
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
}
