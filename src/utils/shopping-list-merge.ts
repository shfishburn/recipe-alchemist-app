
import { ShoppingListItem } from '@/types/shopping-list';

/**
 * Merge items from two shopping lists, combining duplicates and summing quantities
 */
export function mergeShoppingItems(existingItems: ShoppingListItem[], newItems: ShoppingListItem[]): ShoppingListItem[] {
  console.log("Merging shopping items - Starting merge operation");
  console.log("Existing items:", existingItems);
  console.log("New items:", newItems);
  
  // Ensure existingItems is always an array
  const safeExistingItems = Array.isArray(existingItems) ? existingItems : [];
  if (!Array.isArray(existingItems)) {
    console.warn("Expected existingItems to be an array, but received:", typeof existingItems, existingItems);
  }
  
  const result = [...safeExistingItems];
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
  
  console.log(`Merge completed: ${addedCount} new items added, ${newItems.length - addedCount} merged with existing items`);
  return result;
}

/**
 * Helper function to normalize item names for comparison
 */
export function normalizeItemName(name: string): string {
  return name.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
