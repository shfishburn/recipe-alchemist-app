
import { ShoppingListItem } from '@/types/shopping-list';
import { Json } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { ToastProps } from '@/hooks/use-toast';

// Helper function to get the index of an item in the list
export function getItemIndex(items: ShoppingListItem[], item: ShoppingListItem): number {
  return items.findIndex(
    i => i.name === item.name && i.unit === item.unit && i.department === item.department
  );
}

type ToastHandler = {
  toast: (props: ToastProps) => string | number;
};

// Helper function to toggle an item's checked state
export async function toggleItemChecked(
  listId: string, 
  items: ShoppingListItem[], 
  index: number,
  { toast }: ToastHandler
): Promise<ShoppingListItem[] | null> {
  try {
    // Optimistically update the local state first for immediate feedback
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked
    };
    
    // Then send the update to the server
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', listId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      });
      return null;
    }

    return updatedItems;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update item',
      variant: 'destructive'
    });
    return null;
  }
}

// Helper function to delete an item from the list
export async function deleteItem(
  listId: string, 
  items: ShoppingListItem[], 
  index: number,
  { toast }: ToastHandler
): Promise<ShoppingListItem[] | null> {
  try {
    // Optimistically update the UI
    const updatedItems = items.filter((_, i) => i !== index);

    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', listId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      });
      return null;
    }

    toast({
      title: 'Success',
      description: 'Item removed from list'
    });
    
    return updatedItems;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to delete item',
      variant: 'destructive'
    });
    return null;
  }
}

// Helper function to add an item to the list
export async function addItem(
  listId: string, 
  items: ShoppingListItem[], 
  newItem: Omit<ShoppingListItem, 'checked'>,
  { toast }: ToastHandler
): Promise<ShoppingListItem[] | null> {
  try {
    // Convert to shoppable format if possible
    const item: ShoppingListItem = {
      ...newItem,
      checked: false,
      // If user provided shop size quantities, use them
      shop_size_qty: newItem.shop_size_qty || newItem.quantity,
      shop_size_unit: newItem.shop_size_unit || newItem.unit
    };
    
    const updatedItems = [...items, item];
    
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', listId);
      
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive'
      });
      return null;
    }
    
    return updatedItems;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to add item',
      variant: 'destructive'
    });
    return null;
  }
}

// Helper function to toggle all items in a department
export async function toggleDepartmentItems(
  listId: string, 
  items: ShoppingListItem[], 
  department: string, 
  checked: boolean,
  { toast }: ToastHandler
): Promise<ShoppingListItem[] | null> {
  try {
    // Optimistically update local state
    const updatedItems = items.map(item => 
      item.department === department ? {...item, checked} : item
    );
    
    const { error } = await supabase
      .from('shopping_lists')
      .update({ items: updatedItems as unknown as Json })
      .eq('id', listId);
      
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update items',
        variant: 'destructive'
      });
      return null;
    }
    
    return updatedItems;
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update items',
      variant: 'destructive'
    });
    return null;
  }
}
