
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { ingredientsToShoppingItems } from '@/utils/shopping-list-utils';
import type { Recipe } from '@/types/recipe';

export function useUpdateShoppingList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const addToExistingList = async (listId: string, recipe: Recipe | null) => {
    try {
      if (!user) {
        toast({
          title: "Not signed in",
          description: "Please sign in to update your shopping list",
          variant: "destructive",
        });
        return { success: false };
      }

      if (!recipe) {
        toast({
          title: "Recipe required",
          description: "No recipe provided to add to shopping list",
          variant: "destructive",
        });
        return { success: false };
      }
      
      setIsLoading(true);
      
      // First, fetch the current list
      const { data: currentList, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('items, title')
        .eq('id', listId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Convert ingredients to shopping items
      const newItems = ingredientsToShoppingItems(recipe.ingredients);
      
      // Combine with existing items
      const existingItems = Array.isArray(currentList.items) ? currentList.items : [];
      const combinedItems = [...existingItems, ...newItems];
      
      // Update the shopping list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ 
          items: combinedItems,
          updated_at: new Date().toISOString() 
        })
        .eq('id', listId);
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Updated shopping list",
        description: `Added ${newItems.length} items to "${currentList.title}"`,
      });
      
      return { success: true, listId };
    } catch (error) {
      console.error("Error updating shopping list:", error);
      toast({
        title: "Error",
        description: "Failed to update shopping list",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle checked state of an item
  const toggleItemChecked = async (listId: string, itemIndex: number) => {
    try {
      if (!user) {
        toast({
          title: "Not signed in",
          description: "Please sign in to update your shopping list",
          variant: "destructive",
        });
        return false;
      }
      
      setIsLoading(true);
      
      // First, fetch the current list
      const { data: currentList, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('items')
        .eq('id', listId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Make a copy of the items array
      const updatedItems = [...currentList.items];
      
      // Toggle the checked status of the specific item
      if (updatedItems[itemIndex]) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          checked: !updatedItems[itemIndex].checked
        };
      }
      
      // Update the shopping list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ 
          items: updatedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', listId);
      
      if (updateError) {
        throw updateError;
      }
      
      return true;
    } catch (error) {
      console.error("Error toggling item checked state:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    addToExistingList,
    toggleItemChecked,
    isLoading,
  };
}
