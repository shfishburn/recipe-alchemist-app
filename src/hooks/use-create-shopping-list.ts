
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { recipeIngredientsToShoppingItems } from '@/utils/ingredient-shopping-converter';
import { useShoppingListSettings } from './use-shopping-list-settings';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';

export function useCreateShoppingList() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { usePackageSizes } = useShoppingListSettings();

  const createNewList = async (listName: string, recipe: Recipe) => {
    try {
      setIsLoading(true);
      
      // Check authentication
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create a shopping list",
          variant: "destructive",
        });
        return { success: false, error: 'Not authenticated' };
      }
      
      console.log("Creating new list with recipe:", recipe.title);
      console.log("Package size optimization:", usePackageSizes ? "enabled" : "disabled");
      
      // Convert recipe ingredients to shopping list items
      const items = await recipeIngredientsToShoppingItems(recipe.ingredients, recipe.id, usePackageSizes);
      
      console.log("Converted ingredients to shopping items:", items.length);
      
      // Create shopping list
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          title: listName,
          items: items as Json,
          user_id: userData.user.id,
          tips: ['Check your pantry for items you may already have', 'Look for sales on seasonal produce']
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating shopping list:", error);
        toast({
          title: "Error",
          description: "Failed to create shopping list",
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      console.log("Created new shopping list:", data);
      
      toast({
        title: "Success",
        description: `Created new shopping list: ${listName}`
      });
      
      return { 
        success: true, 
        listId: data.id 
      };
    } catch (error) {
      console.error("Error in createNewList:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { createNewList, isLoading };
}
