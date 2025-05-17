
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipe } from '@/types/quick-recipe';

export const fetchRecipe = async (id: string): Promise<QuickRecipe> => {
  if (!id) {
    throw new Error('Recipe ID is required');
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }

  // Transform to ensure compatibility
  const recipe: QuickRecipe = {
    title: data.title,
    tagline: data.tagline,
    // Handle potential JSON string conversion
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : 
                (typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : []),
    instructions: Array.isArray(data.instructions) ? data.instructions :
                (typeof data.instructions === 'string' ? JSON.parse(data.instructions) : []),
    steps: Array.isArray(data.instructions) ? data.instructions : 
           (typeof data.instructions === 'string' ? JSON.parse(data.instructions) : []), // Ensure both properties are set for compatibility
    servings: data.servings,
    prep_time_min: data.prep_time_min,
    cook_time_min: data.cook_time_min,
    nutrition: data.nutrition,
    science_notes: Array.isArray(data.science_notes) ? data.science_notes :
                  (typeof data.science_notes === 'string' ? JSON.parse(data.science_notes) : []),
    cuisine: data.cuisine,
    dietary: data.dietary,
    flavor_tags: data.flavor_tags,
    user_id: data.user_id,
    id: data.id
  };

  return recipe;
};
