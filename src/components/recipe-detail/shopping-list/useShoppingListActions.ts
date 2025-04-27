
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/hooks/use-recipe-detail';
import type { Json } from '@/integrations/supabase/types';

export function useShoppingListActions(recipe: Recipe) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createNewList = async (newListName: string) => {
    try {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      const ingredientItems = recipe.ingredients.map(ing => ({
        name: ing.item,
        quantity: ing.qty,
        unit: ing.unit,
        checked: false,
        recipeId: recipe.id
      }));
      
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          title: newListName,
          user_id: userData.user.id,
          items: ingredientItems as unknown as Json
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Created shopping list "${newListName}" with recipe ingredients.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error creating shopping list:', error);
      toast({
        title: "Error",
        description: "Failed to create shopping list.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addToExistingList = async (selectedListId: string) => {
    try {
      setIsLoading(true);
      
      // Get current list items
      const { data: currentList, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('items')
        .eq('id', selectedListId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Prepare new items for adding
      const newItems = recipe.ingredients.map(ing => ({
        name: ing.item,
        quantity: ing.qty,
        unit: ing.unit,
        checked: false,
        recipeId: recipe.id
      }));
      
      // Combine existing and new items
      const currentItems = currentList.items as any[] || [];
      const combinedItems = [...currentItems, ...newItems];
      
      // Update the shopping list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ items: combinedItems })
        .eq('id', selectedListId);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Success",
        description: `Added ingredients to shopping list.`,
      });
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      toast({
        title: "Error",
        description: "Failed to add ingredients to shopping list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createNewList,
    addToExistingList
  };
}
