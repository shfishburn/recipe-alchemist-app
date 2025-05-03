
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { recipeIngredientsToShoppingItems } from '@/utils/ingredient-shopping-converter';
import { mergeShoppingItems } from '@/utils/shopping-list-merge';
import type { Recipe } from '@/types/recipe';

export function useRecipeToShoppingList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Creates a new shopping list from a recipe
   * Improved data flow pattern:
   * 1. Create the list with basic metadata
   * 2. Convert recipe ingredients to shopping items
   * 3. Store the items in the list
   * 4. Navigate to the new list
   */
  const addRecipeToNewList = async (listName: string, recipe: Recipe) => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in to create a shopping list",
        variant: "destructive",
      });
      return { success: false, listId: null };
    }
    
    if (!recipe) {
      toast({
        title: "Recipe required",
        description: "No recipe provided to create shopping list",
        variant: "destructive",
      });
      return { success: false, listId: null };
    }

    setIsLoading(true);
    
    try {
      console.log("Creating shopping list for recipe:", recipe.title);
      
      // Step 1: Create a new shopping list with basic info
      const { data: newList, error: listError } = await supabase
        .from('shopping_lists')
        .insert({
          title: listName,
          user_id: user.id,
          items: [], // Start with empty array, we'll populate it next
        })
        .select();
        
      if (listError) throw listError;
      
      const listId = newList?.[0]?.id;
      
      if (!listId) {
        throw new Error("Failed to create shopping list");
      }

      // Step 2: Convert recipe ingredients to shopping items
      const shoppingItems = recipeIngredientsToShoppingItems(
        recipe.ingredients, 
        recipe.id
      );
      
      console.log("Generated shopping items:", shoppingItems);
      
      // Step 3: Update the list with the converted items
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ items: shoppingItems })
        .eq('id', listId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Shopping list created",
        description: `${shoppingItems.length} items added to your new shopping list`,
      });
      
      // Step 4: Navigate to the new list
      setTimeout(() => {
        navigate(`/shopping-lists/${listId}`);
      }, 300);
      
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
  
  /**
   * Adds recipe ingredients to an existing shopping list
   */
  const addRecipeToExistingList = async (listId: string, recipe: Recipe) => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in to update shopping lists",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);
    
    try {
      // Step 1: Get the existing list
      const { data: existingList, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('items')
        .eq('id', listId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Step 2: Convert recipe ingredients to shopping items
      const newItems = recipeIngredientsToShoppingItems(
        recipe.ingredients, 
        recipe.id
      );
      
      // Step 3: Merge with existing items - ensure we're dealing with arrays
      const existingItems = Array.isArray(existingList.items) ? existingList.items : [];
      
      // Log type information for debugging
      console.log("Existing items type:", typeof existingItems, Array.isArray(existingItems));
      console.log("Existing items:", existingItems);
      
      const mergedItems = mergeShoppingItems(existingItems, newItems);
      
      // Step 4: Update the list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ items: mergedItems })
        .eq('id', listId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Shopping list updated",
        description: `${newItems.length} items added to your shopping list`,
      });
      
      // Step 5: Navigate to the updated list
      setTimeout(() => {
        navigate(`/shopping-lists/${listId}`);
      }, 300);
      
      return { success: true };
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

  return {
    addRecipeToNewList,
    addRecipeToExistingList,
    isLoading
  };
}
