
import { callSupabaseFunction } from '@/api/supabaseFunctionClient';
import { RecipeModifications } from './types';
import { recipeModificationsSchema } from './validation';
import { QuickRecipe } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';

export async function requestRecipeModifications(
  recipe: QuickRecipe,
  userRequest: string,
  modificationHistory: any[],
  token: string,
  abortController: AbortController
): Promise<RecipeModifications> {
  console.log('Requesting recipe modifications:', userRequest);
  
  try {
    // Register abort handler to throw an AbortError if the controller aborts
    const abortPromise = new Promise<never>((_, reject) => {
      abortController.signal.addEventListener('abort', () => {
        reject(new DOMException('Request aborted', 'AbortError'));
      });
    });
    
    // Race the function call against abort
    const responsePromise = callSupabaseFunction<
      { recipe: QuickRecipe; userRequest: string; modificationHistory: any[] },
      any
    >('modify-quick-recipe', {
      method: 'POST',
      payload: {
        recipe,
        userRequest,
        modificationHistory
      },
      token,
      debugTag: 'recipe-modification'
    });
    
    // This will either resolve with the function response or reject if aborted
    const response = await Promise.race([responsePromise, abortPromise]);

    // Check for errors in the response
    if (response.error) {
      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Authentication required to modify recipes');
      } else if (response.status === 404) {
        throw new Error('Modification service not deployed');
      } else {
        throw new Error(response.error || `HTTP error ${response.status}`);
      }
    }
    
    if (!response.data) {
      throw new Error('No data returned');
    }
    
    // Process the response - now comes with full recipe data
    const data = response.data;
    
    // First, normalize the recipe data using the same utility as quick recipes
    const modifiedRecipe = data.isModification ? normalizeRecipeResponse(data) : null;
    
    // Construct a response that matches our existing schema for backward compatibility
    const result: RecipeModifications = {
      textResponse: data.textResponse || `Modified recipe: ${data.title}`,
      reasoning: data.reasoning || data.description || "Recipe modified based on your instructions.",
      modifications: data.modifications || {
        title: data.title,
        description: data.description || data.tagline,
        ingredients: data.ingredients?.map((ing: any, i: number) => ({
          original: recipe.ingredients[i]?.item,
          modified: ing.item,
          reason: "Modified based on request"
        })),
        steps: data.steps?.map((step: string, i: number) => ({
          original: recipe.steps && i < recipe.steps.length ? recipe.steps[i] : undefined,
          modified: step,
          reason: "Modified based on request"
        })),
        cookingTip: data.cookingTip
      },
      nutritionImpact: {
        assessment: data.nutritionImpact?.assessment || "Recipe nutrition has been recalculated.",
        summary: data.nutritionImpact?.summary || "Nutrition values have been updated.",
        calories: data.nutritionImpact?.calories,
        protein: data.nutritionImpact?.protein,
        carbs: data.nutritionImpact?.carbs,
        fat: data.nutritionImpact?.fat,
        fiber: data.nutritionImpact?.fiber,
        sugar: data.nutritionImpact?.sugar,
        sodium: data.nutritionImpact?.sodium
      },
      // Add the normalized full recipe data
      modifiedRecipe
    };
    
    // Use zod to validate the response format for type safety
    return recipeModificationsSchema.parse(result);
  } catch (err) {
    // Check if this is an AbortError from the AbortController
    if (err.name === 'AbortError') {
      console.log('Request was canceled');
      throw err;
    }
    
    console.error('Error modifying recipe:', err);
    throw err;
  }
}
