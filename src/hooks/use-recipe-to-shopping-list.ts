import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ShoppingListService } from '@/services/ShoppingListService';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';

export function useRecipeToShoppingList() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const addRecipeToNewList = async (title: string, recipe: Recipe) => {
    try {
      setIsLoading(true);

      // Get user info
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      // Convert recipe ingredients to shopping list items using our unified service
      const items = await ShoppingListService.ingredientsToShoppingItems(recipe.ingredients, recipe.id);

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
      console.error('Error in addRecipeToNewList:', error);
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

  // Add recipe ingredients to an existing shopping list
  const addRecipeToExistingList = async (listId: string, recipe: Recipe) => {
    try {
      setIsLoading(true);

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
      const newItems = await ShoppingListService.ingredientsToShoppingItems(recipe.ingredients, recipe.id);

      // Combine with existing items, avoiding duplicates
      const existingItems = listData.items as any[];
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
      console.error("Error in addRecipeToExistingList:", error);
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

  return { addRecipeToNewList, addRecipeToExistingList, isLoading };
}

// Helper function to combine shopping items, avoiding duplicates
function combineShoppingItems(
  existingItems: any[],
  newItems: any[]
): any[] {
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
