
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { recipeIngredientsToShoppingItems } from '@/utils/ingredient-shopping-converter';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';

export function useCreateShoppingList() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createNewList = async (
    title: string, 
    recipe: Recipe, 
    usePackageSizes: boolean = true
  ) => {
    try {
      setIsLoading(true);

      // Get user info
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      // Convert recipe ingredients to shopping list items
      console.log(`Creating list with package sizes: ${usePackageSizes ? "enabled" : "disabled"}`);
      const items = await recipeIngredientsToShoppingItems(recipe.ingredients, recipe.id, usePackageSizes);

      // Create shopping list
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          title,
          user_id: userData.user.id,
          items: items as Json
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating shopping list:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Created new shopping list "${title}"`
      });

      return { success: true, listId: data.id };
    } catch (error) {
      console.error('Error in createNewList:', error);
      toast({
        title: "Error",
        description: "Failed to create shopping list",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { createNewList, isLoading };
}
