
import { callSupabaseFunction } from '@/api/supabaseFunctionClient';
import { RecipeModifications } from './types';
import { recipeModificationsSchema } from './validation';
import { QuickRecipe } from '@/types/quick-recipe';

export async function requestRecipeModifications(
  recipe: QuickRecipe,
  userRequest: string,
  modificationHistory: any[],
  token: string,
  abortController: AbortController
): Promise<RecipeModifications> {
  console.log('Requesting recipe modifications:', userRequest);
  
  try {
    // Create a promise that rejects when aborted
    const abortPromise = new Promise<never>((_, reject) => {
      abortController.signal.addEventListener('abort', () => {
        reject(new DOMException('Request aborted', 'AbortError'));
      });
    });
    
    // Create the actual function call
    const functionPromise = callSupabaseFunction<
      { recipe: QuickRecipe; userRequest: string; modificationHistory: any[] },
      RecipeModifications
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
    
    // Race the two promises - either we get a response or the request is aborted
    const response = await Promise.race([functionPromise, abortPromise]);

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
    
    // Use Zod to validate the response data
    return recipeModificationsSchema.parse(response.data);
  } catch (err: any) {
    // Check if this is an AbortError from the AbortController
    if (err.name === 'AbortError') {
      console.log('Request was canceled');
      throw err;
    }
    
    console.error('Error modifying recipe:', err);
    throw err;
  }
}
