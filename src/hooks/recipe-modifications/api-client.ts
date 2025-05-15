
import { QuickRecipe } from '@/types/quick-recipe';
import { RecipeModifications, ModificationHistoryEntry } from './types';

/**
 * Requests modifications to a recipe using the AI service
 */
export async function requestRecipeModifications(
  recipe: QuickRecipe,
  userRequest: string,
  modificationHistory: ModificationHistoryEntry[] = [],
  token: string,
  abortController?: AbortController
): Promise<RecipeModifications> {
  // Get supabase URL from environment
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  if (!SUPABASE_URL) {
    throw new Error('Supabase URL is not defined');
  }

  // Check for recipe object validity
  if (!recipe || typeof recipe !== 'object') {
    throw new Error('Invalid recipe object');
  }

  // Only send the necessary history to the API
  const apiRequestBody = {
    recipe,
    userRequest,
    modificationHistory: modificationHistory.map(({ request, response }) => ({
      request,
      response
    })),
    user_id: null // Let the server get this from auth
  };

  try {
    // Make request to the Supabase edge function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/modify-quick-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(apiRequestBody),
      signal: abortController?.signal,
    });

    // Handle HTTP errors
    if (!response.ok) {
      let errorMsg = `API error: ${response.status}`;
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        // Ignore parsing errors
      }
      throw new Error(errorMsg);
    }

    // Parse response
    const result = await response.json();
    
    // Validate response has expected structure
    if (!result || !result.textResponse || !result.recipe) {
      throw new Error('Invalid response format from modification service');
    }

    return result as RecipeModifications;
  } catch (err: unknown) {
    // Check for AbortError specifically
    if (err instanceof Error && err.name === 'AbortError') {
      throw err; // Rethrow AbortError for handling elsewhere
    }
    
    // Re-throw with more context
    throw new Error(
      err instanceof Error 
        ? `Recipe modification failed: ${err.message}` 
        : 'Unknown error during recipe modification'
    );
  }
}
