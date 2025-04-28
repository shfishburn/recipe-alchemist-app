
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Recipe, Ingredient, Nutrition } from '@/types/recipe';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface CookingDetails {
  temperature?: {
    fahrenheit: number;
    celsius: number;
  };
  duration?: {
    prep: number;
    cook: number;
    rest?: number;
  };
  equipment?: {
    type: string;
    settings?: string;
  }[];
}

export function useRecipeUpdates(recipeId: string) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateRecipe = useMutation({
    mutationFn: async (updates: Partial<Recipe> & { cookingDetails?: CookingDetails }) => {
      setIsUpdating(true);
      try {
        console.log("Updating recipe with:", updates);
        
        // Transform complex objects to JSON format for Supabase
        const transformedUpdates = {
          ...updates,
          // Only include properties if they exist in updates
          ingredients: updates.ingredients ? updates.ingredients as unknown as Json : undefined,
          // Properly transform science_notes to ensure it's stored as JSON but is a string array
          science_notes: updates.science_notes 
            ? (Array.isArray(updates.science_notes) 
                ? updates.science_notes.map(note => 
                    typeof note === 'string' ? note : String(note)
                  ) 
                : []
              ) as unknown as Json
            : undefined,
          nutrition: updates.nutrition ? updates.nutrition as unknown as Json : undefined,
          updated_at: new Date().toISOString(),
        };
        
        console.log("Transformed updates for Supabase:", transformedUpdates);

        const { data, error } = await supabase
          .from('recipes')
          .update(transformedUpdates)
          .eq('id', recipeId)
          .select()
          .single();

        if (error) throw error;
        
        // Transform the returned data back to the expected Recipe format
        const processedData: Recipe = {
          ...data,
          ingredients: data.ingredients as unknown as Ingredient[],
          // Ensure science_notes is always a string array
          science_notes: Array.isArray(data.science_notes) 
            ? data.science_notes.map(note => typeof note === 'string' ? note : String(note))
            : [],
          // Transform nutrition back to the correct type
          nutrition: data.nutrition as unknown as Nutrition
        };
        
        return processedData;
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
      console.log("Recipe updated successfully");
      toast.success('Recipe updated successfully');
    },
    onError: (error) => {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
    },
  });

  return {
    updateRecipe,
    isUpdating,
  };
}
