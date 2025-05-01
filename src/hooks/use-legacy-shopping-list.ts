
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { ingredientsToShoppingItems } from '@/utils/shopping-list-utils';
import { mergeShoppingItems } from '@/utils/shopping-list-merge'; 
import type { Ingredient } from '@/types/recipe';
import type { ShoppingListItem } from '@/types/shopping-list';

export function useLegacyShoppingList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingToList, setIsAddingToList] = useState(false);
  
  // Add recipe ingredients to shopping list (legacy method)
  const addIngredientsToShoppingList = async (
    recipeId: string,
    recipeTitle: string,
    ingredients: Ingredient[]
  ) => {
    try {
      if (!user) {
        toast({
          title: "Not signed in",
          description: "Please sign in to add items to your shopping list",
          variant: "destructive",
        });
        return false;
      }

      setIsAddingToList(true);
      
      // Use the shared utility function to convert ingredients to shopping items
      const shoppingItems = ingredientsToShoppingItems(ingredients);
      
      // Check if we already have a shopping list
      const { data: existingLists, error: listError } = await supabase
        .from('shopping_lists')
        .select('id, items')
        .eq('user_id', user.id)
        .is('deleted_at', null) // Filter out deleted lists
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (listError) {
        throw listError;
      }
      
      if (existingLists && existingLists.length > 0) {
        // Add to existing list
        const currentList = existingLists[0];
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
        
        // Merge items
        const mergedItems = mergeShoppingItems(currentItems, shoppingItems);
        
        // Update the list with new items
        const { error: updateError } = await supabase
          .from('shopping_lists')
          .update({ items: mergedItems })
          .eq('id', currentList.id);
          
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Added to shopping list",
          description: `Added items from "${recipeTitle}" to your shopping list`,
        });
      } else {
        // Create new shopping list
        const { data: newList, error: createError } = await supabase
          .from('shopping_lists')
          .insert({
            title: `Shopping List with ${recipeTitle}`,
            user_id: user.id,
            items: shoppingItems,
          })
          .select();
          
        if (createError) {
          throw createError;
        }
        
        toast({
          title: "Created new shopping list",
          description: `Added ${shoppingItems.length} items from "${recipeTitle}" to a new shopping list`,
        });
      }
      
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
      setIsAddingToList(false);
    }
  };

  return {
    addIngredientsToShoppingList,
    isAddingToList
  };
}
