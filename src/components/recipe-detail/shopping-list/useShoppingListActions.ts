
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { formatIngredient } from '@/utils/ingredient-format';
import { getShoppingQuantity } from '@/utils/unit-conversion';
import { ShoppingItem } from '@/components/quick-recipe/shopping-list/types';
import { Ingredient } from '@/types/recipe';

export function useShoppingListActions(recipe: any = null) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create a new shopping list
  const createNewList = async (listName: string) => {
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
      
      // Transform ingredients to shopping items
      const shoppingItems = recipe.ingredients.map((ingredient: any): ShoppingItem => {
        // Skip string ingredients
        if (typeof ingredient === 'string') {
          return {
            text: ingredient,
            checked: false,
            originalIngredient: undefined,
            department: 'Other',
          };
        }
        
        // Handle structured ingredients
        const itemName = typeof ingredient.item === 'string' 
          ? ingredient.item 
          : ingredient.item?.item || 'Unknown item';
        
        // Convert recipe units to shopping units
        const shoppingQty = getShoppingQuantity(ingredient.qty || 0, ingredient.unit || '');
        
        // Format the ingredient text
        const text = formatIngredient({
          ...ingredient,
          qty: shoppingQty.qty,
          unit: shoppingQty.unit
        });
        
        // Determine department based on ingredient name
        const department = getDepartmentForIngredient(itemName);
        
        return {
          text,
          checked: false,
          originalIngredient: ingredient, // Store the original ingredient data
          department,
          quantity: shoppingQty.qty,
          unit: shoppingQty.unit,
          item: itemName,
          notes: ingredient.notes,
        };
      });
      
      // Create new shopping list
      const { data: newList, error: createError } = await supabase
        .from('shopping_lists')
        .insert([{
          title: listName,
          user_id: user.id,
          items: shoppingItems,
        }])
        .select();
        
      if (createError) {
        throw createError;
      }
      
      toast({
        title: "Created new shopping list",
        description: `Added ${shoppingItems.length} items to a new shopping list`,
      });
      
      return true;
    } catch (error) {
      console.error("Error creating shopping list:", error);
      toast({
        title: "Error",
        description: "Failed to create shopping list",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add to existing list
  const addToExistingList = async (listId: string) => {
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
      
      // Transform ingredients to shopping items
      const shoppingItems = recipe.ingredients.map((ingredient: any): ShoppingItem => {
        // Handle string ingredients
        if (typeof ingredient === 'string') {
          return {
            text: ingredient,
            checked: false,
            originalIngredient: undefined,
            department: 'Other',
          };
        }
        
        // Handle structured ingredients
        const itemName = typeof ingredient.item === 'string' 
          ? ingredient.item 
          : ingredient.item?.item || 'Unknown item';
        
        // Convert recipe units to shopping units
        const shoppingQty = getShoppingQuantity(ingredient.qty || 0, ingredient.unit || '');
        
        // Format the ingredient text
        const text = formatIngredient({
          ...ingredient,
          qty: shoppingQty.qty,
          unit: shoppingQty.unit
        });
        
        // Determine department based on ingredient name
        const department = getDepartmentForIngredient(itemName);
        
        return {
          text,
          checked: false,
          originalIngredient: ingredient,
          department,
          quantity: shoppingQty.qty,
          unit: shoppingQty.unit,
          item: itemName,
          notes: ingredient.notes,
        };
      });
      
      // Current items in the list
      const currentItems = currentList.items || [];
      
      // Check for duplicates and merge
      const newItems = [...currentItems];
      let addedCount = 0;
      
      for (const item of shoppingItems) {
        // Check if this item is already in the list
        const existingIndex = newItems.findIndex(
          (existing: any) => existing.text === item.text
        );
        
        if (existingIndex === -1) {
          // Not a duplicate, add it
          newItems.push(item);
          addedCount++;
        }
      }
      
      // Update the list with new items
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ items: newItems })
        .eq('id', listId);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Added to shopping list",
        description: `Added ${addedCount} items to your shopping list`,
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
      console.log("Adding ingredients to shopping list:", ingredients);
      
      // Check if we already have a shopping list
      const { data: existingLists, error: listError } = await supabase
        .from('shopping_lists')
        .select('id, items')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (listError) {
        throw listError;
      }
      
      // Transform ingredients to shopping items
      const shoppingItems = ingredients.map((ingredient): ShoppingItem => {
        // Skip string ingredients
        if (typeof ingredient === 'string') {
          return {
            text: ingredient,
            checked: false,
            originalIngredient: undefined,
            department: 'Other',
          };
        }
        
        // Handle structured ingredients
        const itemName = typeof ingredient.item === 'string' 
          ? ingredient.item 
          : ingredient.item || 'Unknown item';
        
        // Convert recipe units to shopping units
        const shoppingQty = getShoppingQuantity(ingredient.qty || 0, ingredient.unit || '');
        
        // Format the ingredient text
        const text = formatIngredient({
          ...ingredient,
          qty: shoppingQty.qty,
          unit: shoppingQty.unit
        });
        
        // Determine department based on ingredient name
        const department = getDepartmentForIngredient(itemName);
        
        return {
          text,
          checked: false,
          originalIngredient: ingredient, // Store the original ingredient data
          department,
          quantity: shoppingQty.qty,
          unit: shoppingQty.unit,
          item: itemName,
          notes: ingredient.notes,
        };
      });
      
      let listId;
      
      if (existingLists && existingLists.length > 0) {
        // Add to existing list
        const currentList = existingLists[0];
        listId = currentList.id;
        
        // Current items in the list
        const currentItems = currentList.items || [];
        
        // Check for duplicates and merge
        const newItems = [...currentItems];
        let addedCount = 0;
        
        for (const item of shoppingItems) {
          // Check if this item is already in the list
          const existingIndex = newItems.findIndex(
            (existing: any) => existing.text === item.text
          );
          
          if (existingIndex === -1) {
            // Not a duplicate, add it
            newItems.push(item);
            addedCount++;
          }
        }
        
        // Update the list with new items
        const { error: updateError } = await supabase
          .from('shopping_lists')
          .update({ items: newItems })
          .eq('id', listId);
          
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Added to shopping list",
          description: `Added ${addedCount} items from "${recipeTitle}" to your shopping list`,
        });
      } else {
        // Create new shopping list
        const { data: newList, error: createError } = await supabase
          .from('shopping_lists')
          .insert([{
            title: `Shopping List with ${recipeTitle}`,
            user_id: user.id,
            items: shoppingItems,
          }])
          .select();
          
        if (createError) {
          throw createError;
        }
        
        listId = newList?.[0]?.id;
        
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
      const updatedItems = list.items.map((item: ShoppingItem) => {
        if (item.text === itemText) {
          return {
            ...item,
            checked: !currentChecked,
          };
        }
        return item;
      });
      
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
    addIngredientsToShoppingList,
    toggleItemChecked,
    isAddingToList,
    createNewList,
    addToExistingList,
    isLoading,
  };
}

// Helper function to determine department based on ingredient
function getDepartmentForIngredient(ingredient: string): string {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Produce
  if (/lettuce|spinach|kale|arugula|cabbage|carrot|onion|garlic|potato|tomato|pepper|cucumber|zucchini|squash|apple|banana|orange|lemon|lime|berries|fruit|vegetable|produce|greens/i.test(lowerIngredient)) {
    return 'Produce';
  }
  
  // Meat & Seafood
  if (/beef|chicken|pork|turkey|lamb|fish|salmon|tuna|shrimp|seafood|meat|steak|ground meat|bacon|sausage/i.test(lowerIngredient)) {
    return 'Meat & Seafood';
  }
  
  // Dairy & Eggs
  if (/milk|cheese|yogurt|butter|cream|sour cream|egg|dairy/i.test(lowerIngredient)) {
    return 'Dairy & Eggs';
  }
  
  // Bakery
  if (/bread|bagel|bun|roll|tortilla|pita|muffin|cake|pastry|bakery/i.test(lowerIngredient)) {
    return 'Bakery';
  }
  
  // Pantry
  if (/flour|sugar|oil|vinegar|sauce|condiment|spice|herb|rice|pasta|bean|legume|canned|jar|shelf-stable|pantry/i.test(lowerIngredient)) {
    return 'Pantry';
  }
  
  // Frozen
  if (/frozen|ice cream|popsicle/i.test(lowerIngredient)) {
    return 'Frozen';
  }
  
  // Beverages
  if (/water|juice|soda|pop|coffee|tea|drink|beverage|wine|beer|alcohol/i.test(lowerIngredient)) {
    return 'Beverages';
  }
  
  // Default
  return 'Other';
}
