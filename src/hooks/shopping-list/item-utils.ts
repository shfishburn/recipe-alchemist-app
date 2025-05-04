
import { toast } from 'sonner';
import type { ShoppingListItem } from '@/types/shopping-list';

// Format and check quantity
export const formatAndCheckQuantity = (
  itemName: string,
  quantity: string | number
): { valid: boolean; value?: number; message?: string } => {
  // Allow empty quantity
  if (!quantity && quantity !== 0) {
    return { valid: true };
  }
  
  // Convert to number
  const numValue = typeof quantity === 'number' ? quantity : Number(quantity.replace(',', '.'));
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return {
      valid: false,
      message: `Invalid quantity for ${itemName}, must be a number`
    };
  }
  
  // Check if it's negative
  if (numValue < 0) {
    return {
      valid: false,
      message: `Quantity for ${itemName} cannot be negative`
    };
  }
  
  return {
    valid: true,
    value: numValue
  };
};

// Validate new items before adding
export const validateNewItem = (
  newItem: Partial<ShoppingListItem>,
  existingItems: ShoppingListItem[]
): { valid: boolean; message?: string } => {
  // Check if item name is provided
  if (!newItem.name || newItem.name.trim() === '') {
    return {
      valid: false,
      message: 'Item name is required'
    };
  }
  
  // Check if quantity is valid
  if (newItem.quantity !== undefined && newItem.quantity !== null && newItem.quantity !== '') {
    const quantityCheck = formatAndCheckQuantity(newItem.name, newItem.quantity);
    if (!quantityCheck.valid) {
      return quantityCheck;
    }
  }
  
  // Check for duplicates in the list
  const normalizedNewName = newItem.name.trim().toLowerCase();
  const isDuplicate = existingItems.some(item => 
    item.name.trim().toLowerCase() === normalizedNewName
  );
  
  if (isDuplicate) {
    return {
      valid: false,
      message: `"${newItem.name}" is already in your list`
    };
  }
  
  // Valid if all checks pass
  return { valid: true };
};

// Add a new item to the list
export const addItem = async (
  newItem: Partial<ShoppingListItem>,
  existingItems: ShoppingListItem[],
  saveHandler: (items: ShoppingListItem[]) => Promise<boolean>
): Promise<boolean> => {
  // Validate the new item
  const validation = validateNewItem(newItem, existingItems);
  
  if (!validation.valid) {
    toast.error(validation.message || 'Invalid item');
    return false;
  }
  
  try {
    // Format the item
    const formattedItem: ShoppingListItem = {
      name: newItem.name!.trim(),
      quantity: newItem.quantity,
      unit: newItem.unit,
      department: newItem.department || 'Other',
      checked: false,
      notes: newItem.notes,
      pantry_staple: newItem.pantry_staple || false
    };
    
    // Add to list and save
    const updatedItems = [...existingItems, formattedItem];
    const success = await saveHandler(updatedItems);
    
    if (success) {
      toast.success(`Added ${formattedItem.name} to your list`);
      return true;
    } else {
      toast.error('Failed to save item');
      return false;
    }
  } catch (error) {
    console.error('Error adding item:', error);
    toast.error('Error adding item to list');
    return false;
  }
};

// Toggle item checked state
export const toggleItem = async (
  index: number,
  items: ShoppingListItem[],
  saveHandler: (items: ShoppingListItem[]) => Promise<boolean>
): Promise<boolean> => {
  try {
    // Check if index is valid
    if (index < 0 || index >= items.length) {
      toast.error('Invalid item');
      return false;
    }
    
    // Create a deep copy of items
    const updatedItems = [...items];
    
    // Toggle the checked state
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked
    };
    
    // Save the updated list
    const success = await saveHandler(updatedItems);
    
    // Only show success message if the operation succeeded
    if (!success) {
      toast.error('Failed to update item');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error toggling item:', error);
    toast.error('Error updating item');
    return false;
  }
};

// Delete item from the list
export const deleteItem = async (
  index: number,
  items: ShoppingListItem[],
  saveHandler: (items: ShoppingListItem[]) => Promise<boolean>
): Promise<boolean> => {
  try {
    // Check if index is valid
    if (index < 0 || index >= items.length) {
      toast.error('Invalid item');
      return false;
    }
    
    // Get the item name for the success message
    const itemName = items[index].name;
    
    // Remove the item from the list
    const updatedItems = items.filter((_, i) => i !== index);
    
    // Save the updated list
    const success = await saveHandler(updatedItems);
    
    if (success) {
      toast.success(`Removed ${itemName} from your list`);
      return true;
    } else {
      toast.error('Failed to remove item');
      return false;
    }
  } catch (error) {
    console.error('Error removing item:', error);
    toast.error('Error removing item from list');
    return false;
  }
};
