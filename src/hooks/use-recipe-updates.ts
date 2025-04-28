
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Recipe, Ingredient } from '@/types/recipe';
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
        // Transform complex objects to JSON format for Supabase
        const transformedUpdates = {
          ...updates,
          // Convert arrays to JSON compatible format
          ingredients: updates.ingredients as unknown as Json,
          science_notes: updates.science_notes as unknown as Json,
          nutrition: updates.nutrition as unknown as Json,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('recipes')
          .update(transformedUpdates)
          .eq('id', recipeId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
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
