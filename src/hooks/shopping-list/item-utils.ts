
import { toast } from 'sonner';
import type { ShoppingListItem } from '@/types/shopping-list';

// Toggle item checked state
export const toggleItem = async (
  index: number,
  items: ShoppingListItem[],
  saveList: (items: ShoppingListItem[]) => Promise<boolean>
): Promise<void> => {
  try {
    // Create a copy of the items array for immutability
    const updatedItems = [...items];
    
    // Toggle the checked state of the specified item
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked
    };
    
    // Save the updated list and show toast notification
    const success = await saveList(updatedItems);
    if (success) {
      const action = updatedItems[index].checked ? 'completed' : 'uncompleted';
      toast.success(`Item ${action}`);
    }
  } catch (error) {
    console.error('Error toggling item:', error);
    toast.error('Failed to update item');
  }
};

// Delete item from the list
export const deleteItem = async (
  index: number,
  items: ShoppingListItem[],
  saveList: (items: ShoppingListItem[]) => Promise<boolean>
): Promise<void> => {
  try {
    // Create a copy without the item to delete
    const updatedItems = items.filter((_, i) => i !== index);
    
    // Save the updated list and show toast notification
    const success = await saveList(updatedItems);
    if (success) {
      toast.success('Item removed');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    toast.error('Failed to remove item');
  }
};

// Add a new item to the list
export const addItem = async (
  newItem: Partial<ShoppingListItem>,
  items: ShoppingListItem[],
  saveList: (items: ShoppingListItem[]) => Promise<boolean>
): Promise<boolean> => {
  try {
    // Validate required fields
    if (!newItem.name || newItem.name.trim() === '') {
      toast.error('Item name is required');
      return false;
    }
    
    // Convert quantity to number if it's a string
    const quantity = typeof newItem.quantity === 'string' 
      ? parseFloat(newItem.quantity) 
      : (newItem.quantity || 1);
    
    // Create the complete item object
    const completeItem: ShoppingListItem = {
      name: newItem.name.trim(),
      quantity: quantity,
      unit: newItem.unit || '',
      checked: false,
      department: newItem.department || 'Other',
      notes: newItem.notes,
      alternatives: newItem.alternatives,
      pantry_staple: newItem.pantry_staple,
      storage_tips: newItem.storage_tips,
      quality_indicators: newItem.quality_indicators,
      shop_size_qty: newItem.shop_size_qty,
      shop_size_unit: newItem.shop_size_unit,
      package_notes: newItem.package_notes,
      confidence: newItem.confidence
    };
    
    // Add the new item to the list
    const updatedItems = [...items, completeItem];
    
    // Save the updated list and show toast notification
    const success = await saveList(updatedItems);
    if (success) {
      toast.success('Item added');
    }
    return success;
  } catch (error) {
    console.error('Error adding item:', error);
    toast.error('Failed to add item');
    return false;
  }
};
