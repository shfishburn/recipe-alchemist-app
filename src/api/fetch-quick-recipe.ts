
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

  // Parse string arrays if needed
  const parseStringArray = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [field];
      } catch (e) {
        return [field];
      }
    }
    return [];
  };
  
  // Parse nutrition data
  const parseNutrition = (nutritionData: any) => {
    if (!nutritionData) return undefined;
    
    // Handle string serialized nutrition
    if (typeof nutritionData === 'string') {
      try {
        return JSON.parse(nutritionData);
      } catch (e) {
        console.error('Failed to parse nutrition data:', e);
        return {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };
      }
    }
    
    // If it's already an object, return it
    return nutritionData;
  };

  // Ensure that we have a steps array, derived from instructions if needed
  const stepsArray = parseStringArray(data.instructions || data.steps || []);
  
  // Ensure we have a highlights array
  const highlightsArray = parseStringArray(data.highlights || []);

  // Transform to ensure compatibility
  const recipe: QuickRecipe = {
    title: data.title,
    tagline: data.tagline,
    // Handle potential JSON string conversion
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : 
                (typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : []),
    instructions: parseStringArray(data.instructions),
    steps: stepsArray, // Set steps properly
    servings: data.servings,
    prep_time_min: data.prep_time_min,
    cook_time_min: data.cook_time_min,
    prepTime: data.prep_time_min,
    cookTime: data.cook_time_min,
    nutrition: parseNutrition(data.nutrition),
    science_notes: parseStringArray(data.science_notes),
    cuisine: data.cuisine,
    dietary: parseStringArray(data.dietary),
    flavor_tags: parseStringArray(data.flavor_tags),
    highlights: highlightsArray, // Set highlights properly
    id: data.id,
    user_id: data.user_id // Include the user_id
  };

  return recipe;
};
