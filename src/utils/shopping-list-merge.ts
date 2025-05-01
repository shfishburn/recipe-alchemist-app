
import { ShoppingListItem } from '@/types/shopping-list';

/**
 * Merge items from two shopping lists, combining duplicates and summing quantities
 */
export function mergeShoppingItems(existingItems: ShoppingListItem[], newItems: ShoppingListItem[]): ShoppingListItem[] {
  const result = [...existingItems];
  let addedCount = 0;
  
  for (const item of newItems) {
    // Check if this item is already in the list by name
    const existingIndex = result.findIndex(
      (existing) => existing.name === item.name && existing.unit === item.unit
    );
    
    if (existingIndex === -1) {
      // Not a duplicate, add it
      result.push(item);
      addedCount++;
    } else {
      // Update existing item quantity
      result[existingIndex].quantity += item.quantity;
      // Merge notes if they exist
      if (item.notes && !result[existingIndex].notes?.includes(item.notes)) {
        result[existingIndex].notes = result[existingIndex].notes 
          ? `${result[existingIndex].notes}, ${item.notes}`
          : item.notes;
      }
    }
  }
  
  return result;
}
