
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe, Ingredient, Nutrition, NutriScore } from '@/types/recipe';
import { standardizeNutrition } from '@/utils/nutrition-utils';
import { isValidUUID } from '@/utils/slug-utils';
import { toast } from 'sonner';

export type { Recipe, Ingredient, Nutrition };

export const useRecipeDetail = (idOrSlug?: string) => {
  return useQuery({
    queryKey: ['recipe', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) {
        console.error('Recipe ID or slug is missing');
        throw new Error('Recipe ID or slug is required');
      }

      console.log(`Fetching recipe with identifier: ${idOrSlug}`);

      // Check if we're dealing with a UUID or a slug
      const isUuid = isValidUUID(idOrSlug);
      console.log(`Identifier is ${isUuid ? 'a UUID' : 'a slug'}`);
      
      try {
        let query = supabase
          .from('recipes')
          .select('*');
          
        // Use a single query branch with conditional WHERE clause
        query = isUuid
          ? query.eq('id', idOrSlug)
          : query.eq('slug', idOrSlug);
        
        const { data, error } = await query.maybeSingle();
  
        if (error) {
          console.error('Error fetching recipe:', error);
          throw error;
        }
        
        if (!data) {
          console.error('Recipe not found:', { idOrSlug });
          throw new Error('Recipe not found');
        }
        
        console.log('Recipe raw data fetched:', {
          id: data.id,
          slug: data.slug,
          title: data.title,
          scienceNotesType: typeof data.science_notes,
          hasIngredients: !!data.ingredients,
          hasNutrition: !!data.nutrition
        });
        
        // Transform data with better error handling
        try {
          // Process science_notes with more defensive programming
          let scienceNotes: string[] = [];
          
          if (data.science_notes) {
            if (Array.isArray(data.science_notes)) {
              // Already an array, make sure all elements are strings
              scienceNotes = data.science_notes.map(note => 
                typeof note === 'string' ? note : String(note)
              );
            } else if (typeof data.science_notes === 'string') {
              // Try to parse JSON string
              try {
                const parsed = JSON.parse(data.science_notes);
                if (Array.isArray(parsed)) {
                  scienceNotes = parsed.map(note => String(note));
                } else {
                  // Single string note
                  scienceNotes = [data.science_notes];
                }
              } catch (jsonError) {
                // If JSON parsing fails, treat as a single string note
                scienceNotes = [data.science_notes];
              }
            } else if (typeof data.science_notes === 'object') {
              // Object but not array, try to extract values
              scienceNotes = Object.values(data.science_notes)
                .map(note => String(note));
            }
          }
          
          // Ensure ingredients is properly processed
          const ingredients = typeof data.ingredients === 'string'
            ? JSON.parse(data.ingredients)
            : Array.isArray(data.ingredients)
              ? data.ingredients
              : typeof data.ingredients === 'object' && data.ingredients !== null
                ? Object.values(data.ingredients)
                : [];
          
          // Safe nutrition processing
          const nutrition = typeof data.nutrition === 'string'
            ? standardizeNutrition(JSON.parse(data.nutrition))
            : standardizeNutrition(data.nutrition || {});
          
          // Parse nutri_score to the proper type
          let nutriScore: NutriScore | undefined;
          try {
            if (data.nutri_score) {
              nutriScore = typeof data.nutri_score === 'string'
                ? JSON.parse(data.nutri_score)
                : data.nutri_score as unknown as NutriScore;
                
              // Validate required fields
              if (!nutriScore.grade || typeof nutriScore.score !== 'number') {
                console.warn('Invalid nutri_score structure, skipping:', nutriScore);
                nutriScore = undefined;
              }
            }
          } catch (parseError) {
            console.error('Error parsing nutri_score:', parseError);
            nutriScore = undefined;
          }
          
          // Build the full recipe object with default values for missing fields
          const recipe: Recipe = {
            id: data.id,
            title: data.title || 'Untitled Recipe',
            description: data.description || '', // Fix: Use optional chaining
            ingredients: ingredients as Ingredient[],
            instructions: Array.isArray(data.instructions) 
              ? data.instructions 
              : typeof data.instructions === 'string'
                ? JSON.parse(data.instructions)
                : [],
            prep_time_min: data.prep_time_min || 0,
            cook_time_min: data.cook_time_min || 0,
            servings: data.servings || 1,
            image_url: data.image_url || '',
            cuisine: data.cuisine || '',
            cuisine_category: data.cuisine_category || "Global",
            tags: data.tags || [], // Fix: Provide default empty array
            user_id: data.user_id,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString(),
            original_request: data.original_request || '', // Fix: Provide default empty string
            reasoning: data.reasoning || '',
            tagline: data.tagline || '',
            version_number: data.version_number || 1,
            previous_version_id: data.previous_version_id,
            deleted_at: data.deleted_at,
            dietary: data.dietary || '',
            flavor_tags: data.flavor_tags || [],
            nutrition: nutrition,
            science_notes: scienceNotes,
            chef_notes: data.chef_notes || '',
            cooking_tip: data.cooking_tip || '',
            slug: data.slug || '',
            nutri_score: nutriScore
          };
          
          console.log('Recipe transformed successfully:', {
            id: recipe.id,
            title: recipe.title,
            scienceNotesCount: recipe.science_notes.length
          });
          
          return recipe;
        } catch (parseError) {
          console.error('Error parsing recipe data:', parseError);
          toast.error('Error processing recipe data');
          throw new Error('Error processing recipe data');
        }
      } catch (e) {
        console.error('Error in recipe detail fetch:', e);
        throw e;
      }
    },
    enabled: !!idOrSlug,
    retry: 1,
    staleTime: 300000, // 5 minutes (increased from 30 seconds)
  });
};
