
import { supabase } from '@/integrations/supabase/client';
import type { ShoppingListItem } from '@/types/shopping-list';
import type { Json } from '@/integrations/supabase/types';
import { capitalizeName } from './item-organization';

interface UtilsOptions {
  toast: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
  }
}

/**
 * Get the index of an item in the items array
 */
export const getItemIndex = (items: ShoppingListItem[], item: ShoppingListItem): number => {
  return items.findIndex(
    i => i.name.toLowerCase() === item.name.toLowerCase() && 
         i.unit === item.unit && 
         i.department === item.department
  );
};

/**
 * Toggle an item's checked status
 */
export const toggleItemChecked = async (
  listId: string,
  items: ShoppingListItem[],
  index: number,
  options: UtilsOptions
): Promise<ShoppingListItem[] | null> => {
  // Create a copy of the items array
  const updatedItems = [...items];
  updatedItems[index] = {
    ...updatedItems[index]
  };
  
  // Update item name to be capitalized
  updatedItems[index].name = capitalizeName(updatedItems[index].name);
  
  // Update the database
  const { error } = await supabase
    .from('shopping_lists')
    .update({ 
      items: updatedItems as unknown as Json,
      updated_at: new Date().toISOString() 
    })
    .eq('id', listId);
    
  if (error) {
    console.error("Error updating shopping list item:", error);
    options.toast({
      title: 'Error',
      description: 'Failed to update item',
      variant: 'destructive'
    });
    return null;
  }
  
  return updatedItems;
};

/**
 * Delete an item from the shopping list
 */
export const deleteItem = async (
  listId: string,
  items: ShoppingListItem[],
  index: number,
  options: UtilsOptions
): Promise<ShoppingListItem[] | null> => {
  // Filter out the item to be deleted
  const updatedItems = items.filter((_, i) => i !== index);
  
  // Update the database
  const { error } = await supabase
    .from('shopping_lists')
    .update({ 
      items: updatedItems as unknown as Json,
      updated_at: new Date().toISOString() 
    })
    .eq('id', listId);
    
  if (error) {
    console.error("Error deleting shopping list item:", error);
    options.toast({
      title: 'Error',
      description: 'Failed to delete item',
      variant: 'destructive'
    });
    return null;
  }
  
  options.toast({
    title: 'Success',
    description: 'Item removed from list'
  });
  
  return updatedItems;
};

/**
 * Add a new item to the shopping list
 */
export const addItem = async (
  listId: string,
  items: ShoppingListItem[],
  newItem: Omit<ShoppingListItem, 'checked'>,
  options: UtilsOptions
): Promise<ShoppingListItem[] | null> => {
  // Skip water items
  if (newItem.name.toLowerCase().trim() === 'water') {
    options.toast({
      title: 'Info',
      description: 'Water items are filtered from the shopping list'
    });
    return items;
  }
  
  // Create the new item with capitalized name
  const item: ShoppingListItem = {
    ...newItem,
    name: capitalizeName(newItem.name),
    checked: false
  };
  
  // Add the item to the list
  const updatedItems = [...items, item];
  
  // Update the database
  const { error } = await supabase
    .from('shopping_lists')
    .update({ 
      items: updatedItems as unknown as Json,
      updated_at: new Date().toISOString() 
    })
    .eq('id', listId);
    
  if (error) {
    console.error("Error adding shopping list item:", error);
    options.toast({
      title: 'Error',
      description: 'Failed to add item',
      variant: 'destructive'
    });
    return null;
  }
  
  return updatedItems;
};

/**
 * Toggle checked state for all items in a department
 */
export const toggleDepartmentItems = async (
  listId: string,
  items: ShoppingListItem[],
  department: string,
  checked: boolean,
  options: UtilsOptions
): Promise<ShoppingListItem[] | null> => {
  // Create a copy of the items array and update the items in the specified department
  const updatedItems = items.map(item => 
    item.department === department
      ? { ...item, checked, name: capitalizeName(item.name) }
      : item
  );
  
  // Update the database
  const { error } = await supabase
    .from('shopping_lists')
    .update({ 
      items: updatedItems as unknown as Json,
      updated_at: new Date().toISOString() 
    })
    .eq('id', listId);
    
  if (error) {
    console.error("Error updating department items:", error);
    options.toast({
      title: 'Error',
      description: 'Failed to update items',
      variant: 'destructive'
    });
    return null;
  }
  
  return updatedItems;
};
