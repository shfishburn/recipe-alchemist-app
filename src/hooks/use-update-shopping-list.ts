
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { mergeShoppingItems } from '@/utils/shopping-list-merge';
import { ingredientsToShoppingItems } from '@/utils/shopping-list-utils';
import type { Recipe } from '@/types/recipe';
import type { ShoppingListItem } from '@/types/shopping-list';

export function useUpdateShoppingList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Add to existing list
  const addToExistingList = async (listId: string, recipe: Recipe | null) => {
    try {
      if (!user) {
        toast({
          title: "Not signed in",
          description: "Please sign in to add items to your shopping list",
          variant: "destructive",
        });
        return false;
      }

      if (!recipe) {
        toast({
          title: "Recipe required",
          description: "No recipe provided to add to shopping list",
          variant: "destructive",
        });
        return false;
      }
      
      setIsLoading(true);
      
      // Get the current list
      const { data: currentList, error: listError } = await supabase
        .from('shopping_lists')
        .select('id, items')
        .eq('id', listId)
        .single();
        
      if (listError) {
        throw listError;
      }
      
      // Use the shared utility function to convert ingredients to shopping items
      const shoppingItems = ingredientsToShoppingItems(recipe.ingredients);
      
      // Ensure currentItems is always an array of ShoppingListItem objects
      const currentItems: ShoppingListItem[] = Array.isArray(currentList.items) 
        ? currentList.items.map((item: any) => {
            if (typeof item === 'string') {
              return {
                name: item,
                quantity: 1,
                unit: '',
                checked: false
              };
            }
            return item as ShoppingListItem;
          })
        : [];
      
      // Merge items using the utility function to handle duplicates
      const mergedItems = mergeShoppingItems(currentItems, shoppingItems);
      
      // Update the list with new items
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ items: mergedItems })
        .eq('id', listId);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Added to shopping list",
        description: `Updated your shopping list with items from the recipe`,
      });
      
      return true;
    } catch (error) {
      console.error("Error adding to shopping list:", error);
      toast({
        title: "Error",
        description: "Failed to add ingredients to shopping list",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update the checked status of an item in a list
  const toggleItemChecked = async (
    listId: string,
    itemText: string,
    currentChecked: boolean
  ) => {
    try {
      // Get the current list
      const { data: list, error } = await supabase
        .from('shopping_lists')
        .select('items')
        .eq('id', listId)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Find and update the item
      const updatedItems = Array.isArray(list.items) ? list.items.map((item: any) => {
        if (item.text === itemText) {
          return {
            ...item,
            checked: !currentChecked,
          };
        }
        return item;
      }) : [];
      
      // Save the updated list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems })
        .eq('id', listId);
        
      if (updateError) {
        throw updateError;
      }
      
      return true;
    } catch (error) {
      console.error("Error toggling item:", error);
      toast({
        title: "Error",
        description: "Failed to update shopping list item",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    addToExistingList,
    toggleItemChecked,
    isLoading
  };
}
