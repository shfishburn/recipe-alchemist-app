
import { supabase } from '@/integrations/supabase/client';
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
  // Get Supabase URL from client
  const SUPABASE_URL = supabase.supabaseUrl;
  
  if (!SUPABASE_URL) {
    throw new Error('Supabase URL configuration missing');
  }

  console.log('Requesting recipe modifications:', userRequest);
  
  // Use direct fetch with proper URL construction
  const functionUrl = `${SUPABASE_URL}/functions/v1/modify-quick-recipe`;
  
  console.log('Calling edge function at URL:', functionUrl);
  
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      recipe,
      userRequest,
      modificationHistory
    }),
    signal: abortController.signal
  });

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Authentication required to modify recipes');
    } else if (response.status === 404) {
      throw new Error('Modification service not deployed');
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
  }
  
  const data = await response.json();
  
  if (!data) {
    throw new Error('No data returned');
  }
  
  return recipeModificationsSchema.parse(data);
}
