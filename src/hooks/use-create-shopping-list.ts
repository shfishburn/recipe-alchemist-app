
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { ingredientsToShoppingItems } from '@/utils/shopping-list-utils';
import type { Recipe } from '@/types/recipe';

export function useCreateShoppingList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Create a new shopping list
  const createNewList = async (listName: string, recipe: Recipe | null) => {
    try {
      if (!user) {
        toast({
          title: "Not signed in",
          description: "Please sign in to add items to your shopping list",
          variant: "destructive",
        });
        return { success: false, listId: null };
      }

      if (!recipe) {
        toast({
          title: "Recipe required",
          description: "No recipe provided to add to shopping list",
          variant: "destructive",
        });
        return { success: false, listId: null };
      }
      
      setIsLoading(true);
      
      // Use the shared utility function to convert ingredients to shopping items
      const shoppingItems = ingredientsToShoppingItems(recipe.ingredients);
      
      // Create new shopping list
      const { data: newList, error: createError } = await supabase
        .from('shopping_lists')
        .insert({
          title: listName,
          user_id: user.id,
          items: shoppingItems,
        })
        .select();
        
      if (createError) {
        throw createError;
      }
      
      toast({
        title: "Created new shopping list",
        description: `Added ${shoppingItems.length} items to a new shopping list`,
      });
      
      // Return both success status and the new list ID
      const listId = newList?.[0]?.id || null;
      return { success: true, listId };
    } catch (error) {
      console.error("Error creating shopping list:", error);
      toast({
        title: "Error",
        description: "Failed to create shopping list",
        variant: "destructive",
      });
      return { success: false, listId: null };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createNewList,
    isLoading,
  };
}
