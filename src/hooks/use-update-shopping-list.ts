
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { ShoppingListService } from '@/services/ShoppingListService';
import { useShoppingListSettingsStore } from '@/stores/shoppingListSettings';
import type { Recipe } from '@/types/recipe';
import type { ShoppingListItem } from '@/types/shopping-list';
import type { Json } from '@/integrations/supabase/types';

export function useUpdateShoppingList() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { usePackageSizes } = useShoppingListSettingsStore();

  // Add recipe ingredients to an existing shopping list
  const addToExistingList = async (
    listId: string, 
    recipe: Recipe, 
    usePackageSizesOverride?: boolean
  ) => {
    try {
      setIsLoading(true);
      
      // Use the override value if provided, otherwise use the setting from store
      const shouldUsePackageSizes = usePackageSizesOverride !== undefined 
        ? usePackageSizesOverride 
        : usePackageSizes;

      // First, get the current shopping list
      const { data: listData, error: listError } = await supabase
        .from('shopping_lists')
        .select('items')
        .eq('id', listId)
        .single();

      if (listError) {
        console.error("Error fetching shopping list:", listError);
        throw listError;
      }

      // Convert recipe ingredients to shopping list items
      console.log(`Adding recipe ingredients to list with package sizes: ${shouldUsePackageSizes ? "enabled" : "disabled"}`);
      const newItems = await ShoppingListService.ingredientsToShoppingItems(
        recipe.ingredients, 
        recipe.id, 
        shouldUsePackageSizes
      );

      // Combine with existing items, avoiding duplicates
      const existingItems = listData.items as ShoppingListItem[];
      const combinedItems = combineShoppingItems(existingItems, newItems);

      // Update the shopping list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({
          items: combinedItems as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId);

      if (updateError) {
        console.error("Error updating shopping list:", updateError);
        throw updateError;
      }

      toast({
        title: "Success",
        description: `Added ${recipe.title} to shopping list`
      });

      return { success: true };
    } catch (error) {
      console.error("Error in addToExistingList:", error);
      toast({
        title: "Error",
        description: "Failed to update shopping list",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle an item's checked status
  const toggleItemChecked = async (
    listId: string,
    itemIndex: number,
    currentState: boolean
  ) => {
    try {
      // First, get the current shopping list
      const { data: listData, error: listError } = await supabase
        .from('shopping_lists')
        .select('items')
        .eq('id', listId)
        .single();

      if (listError) {
        throw listError;
      }

      // Update the specific item's checked status
      const updatedItems = [...(listData.items as ShoppingListItem[])];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        checked: !currentState
      };

      // Update the shopping list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({
          items: updatedItems as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId);

      if (updateError) {
        throw updateError;
      }

      return { success: true };
    } catch (error) {
      console.error("Error toggling item:", error);
      return { success: false, error };
    }
  };

  return { addToExistingList, toggleItemChecked, isLoading };
}

// Helper function to combine shopping items, avoiding duplicates
function combineShoppingItems(
  existingItems: ShoppingListItem[],
  newItems: ShoppingListItem[]
): ShoppingListItem[] {
  const combinedItems = [...existingItems];
  
  newItems.forEach(newItem => {
    // Check if a similar item already exists
    const existingItemIndex = existingItems.findIndex(
      item => 
        item.name.toLowerCase() === newItem.name.toLowerCase() &&
        item.unit === newItem.unit
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const existingItem = existingItems[existingItemIndex];
      combinedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + newItem.quantity,
        // Preserve package size info if available
        shop_size_qty: newItem.shop_size_qty || existingItem.shop_size_qty,
        shop_size_unit: newItem.shop_size_unit || existingItem.shop_size_unit,
        package_notes: newItem.package_notes || existingItem.package_notes,
      };
    } else {
      // Add new item if it doesn't exist
      combinedItems.push(newItem);
    }
  });
  
  return combinedItems;
}
