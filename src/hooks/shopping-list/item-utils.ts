
import { ShoppingListItem } from '@/types/shopping-list';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface UtilsOptions {
  toast: any;
}

// Get the index of an item in the items array
export function getItemIndex(
  items: ShoppingListItem[],
  item: ShoppingListItem
): number {
  return items.findIndex(
    i => i.name === item.name && i.unit === item.unit && i.department === item.department
  );
}

// Toggle an item's checked state
export async function toggleItemChecked(
  listId: string, 
  items: ShoppingListItem[], 
  index: number,
  options: UtilsOptions
): Promise<ShoppingListItem[] | null> {
  try {
    // Optimistically update the local state
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked
    };
    
    // Update in database
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', listId);

    if (error) {
      throw error;
    }

    return updatedItems;
  } catch (error) {
    console.error("Error toggling item:", error);
    options.toast({
      title: 'Error',
      description: 'Failed to update item',
      variant: 'destructive'
    });
    return null;
  }
}

// Delete an item from the shopping list
export async function deleteItem(
  listId: string,
  items: ShoppingListItem[], 
  index: number,
  options: UtilsOptions
): Promise<ShoppingListItem[] | null> {
  try {
    // Create updated items array without the deleted item
    const updatedItems = items.filter((_, i) => i !== index);
    
    // Update in database
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', listId);

    if (error) {
      throw error;
    }

    options.toast({
      title: 'Success',
      description: 'Item removed from list'
    });

    return updatedItems;
  } catch (error) {
    console.error("Error deleting item:", error);
    options.toast({
      title: 'Error',
      description: 'Failed to delete item',
      variant: 'destructive'
    });
    return null;
  }
}

// Add a new item to the shopping list
export async function addItem(
  listId: string,
  items: ShoppingListItem[], 
  newItem: Omit<ShoppingListItem, 'checked'>,
  options: UtilsOptions
): Promise<ShoppingListItem[] | null> {
  try {
    // Create full item with checked state
    const item: ShoppingListItem = {
      ...newItem,
      checked: false
    };
    
    // Add to items array
    const updatedItems = [...items, item];
    
    // Update in database
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', listId);
      
    if (error) {
      throw error;
    }

    return updatedItems;
  } catch (error) {
    console.error("Error adding item:", error);
    options.toast({
      title: 'Error',
      description: 'Failed to add item',
      variant: 'destructive'
    });
    return null;
  }
}

// Toggle all items in a department
export async function toggleDepartmentItems(
  listId: string,
  items: ShoppingListItem[], 
  department: string, 
  checked: boolean,
  options: UtilsOptions
): Promise<ShoppingListItem[] | null> {
  try {
    // Update all items in the department
    const updatedItems = items.map(item => 
      item.department === department ? {...item, checked} : item
    );
    
    // Update in database
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', listId);
      
    if (error) {
      throw error;
    }

    return updatedItems;
  } catch (error) {
    console.error("Error updating department items:", error);
    options.toast({
      title: 'Error',
      description: 'Failed to update items',
      variant: 'destructive'
    });
    return null;
  }
}
