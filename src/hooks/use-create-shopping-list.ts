
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { ShoppingListService } from '@/services/ShoppingListService';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';
import { useShoppingListSettingsStore } from '@/stores/shoppingListSettings';

export function useCreateShoppingList() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { usePackageSizes } = useShoppingListSettingsStore();

  const createNewList = async (
    title: string, 
    recipe: Recipe, 
    usePackageSizesOverride?: boolean
  ) => {
    try {
      setIsLoading(true);

      // Get user info
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      // Use the override value if provided, otherwise use the setting from store
      const shouldUsePackageSizes = usePackageSizesOverride !== undefined 
        ? usePackageSizesOverride 
        : usePackageSizes;

      // Convert recipe ingredients to shopping list items using our unified service
      console.log(`Creating list with package sizes: ${shouldUsePackageSizes ? "enabled" : "disabled"}`);
      const items = await ShoppingListService.ingredientsToShoppingItems(
        recipe.ingredients, 
        recipe.id, 
        shouldUsePackageSizes
      );

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
