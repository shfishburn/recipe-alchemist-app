import { ShoppingListItem } from '@/types/shopping-list';

/**
 * Merge two shopping lists, combining duplicate items
 * Enhanced to handle package sizes
 */
export function mergeShoppingItems(
  existingItems: ShoppingListItem[],
  newItems: ShoppingListItem[]
): ShoppingListItem[] {
  const result: ShoppingListItem[] = [...existingItems];
  
  for (const newItem of newItems) {
    // Check if the item already exists
    const existingIndex = result.findIndex(item => 
      normalizeItemName(item.name) === normalizeItemName(newItem.name) && 
      normalizeUnit(item.unit) === normalizeUnit(newItem.unit)
    );
    
    if (existingIndex >= 0) {
      // Item exists, update quantity and merge notes
      const existingItem = result[existingIndex];
      
      // Preserve confidence score from either item (prefer higher)
      const confidence = Math.max(
        existingItem.confidence || 0.5,
        newItem.confidence || 0.5
      );
      
      // Prepare to merge the items
      result[existingIndex] = {
        ...existingItem,
        // Add quantities only if units match
        quantity: existingItem.quantity + newItem.quantity,
        // Merge notes intelligently
        notes: mergeNotes(existingItem.notes, newItem.notes),
        // Keep track of recipe IDs if they exist
        recipeId: mergeRecipeIds(existingItem.recipeId, newItem.recipeId),
        // Use the most detailed package info available
        shop_size_qty: existingItem.shop_size_qty || newItem.shop_size_qty,
        shop_size_unit: existingItem.shop_size_unit || newItem.shop_size_unit,
        package_notes: existingItem.package_notes || newItem.package_notes,
        // Save the confidence score
        confidence
      };
    } else {
      // New item, add it to the result
      result.push({...newItem});
    }
  }
  
  // Sort merged list by department for better organization
  return sortShoppingItems(result);
}

/**
 * Normalize item names for comparison
 */
function normalizeItemName(name: string): string {
  if (!name) return '';
  
  return name.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalize units for comparison
 */
function normalizeUnit(unit: string): string {
  if (!unit) return '';
  
  const unitMap: Record<string, string> = {
    'g': 'g',
    'gram': 'g',
    'grams': 'g',
    'kilogram': 'kg',
    'kilograms': 'kg',
    'kg': 'kg',
    'lbs': 'lb',
    'lb': 'lb',
    'pound': 'lb',
    'pounds': 'lb',
    'oz': 'oz',
    'ounce': 'oz',
    'ounces': 'oz',
    'ml': 'ml',
    'milliliter': 'ml',
    'milliliters': 'ml',
    'l': 'l',
    'liter': 'l',
    'liters': 'l',
    'tsp': 'tsp',
    'teaspoon': 'tsp',
    'teaspoons': 'tsp',
    'tbsp': 'tbsp',
    'tablespoon': 'tbsp',
    'tablespoons': 'tbsp',
    'cup': 'cup',
    'cups': 'cup',
  };
  
  const normalizedUnit = unit.toLowerCase().trim();
  return unitMap[normalizedUnit] || normalizedUnit;
}

/**
 * Combine notes intelligently
 */
function mergeNotes(existingNotes?: string, newNotes?: string): string | undefined {
  if (!existingNotes && !newNotes) return undefined;
  if (!existingNotes) return newNotes;
  if (!newNotes) return existingNotes;
  
  // Return combined if different
  if (existingNotes !== newNotes) {
    return `${existingNotes}; ${newNotes}`;
  }
  
  // Return single if identical
  return existingNotes;
}

/**
 * Track recipe sources
 */
function mergeRecipeIds(existingId?: string, newId?: string): string | undefined {
  if (!existingId && !newId) return undefined;
  if (!existingId) return newId;
  if (!newId) return existingId;
  
  // If they're different, concat with comma
  if (existingId !== newId) {
    return `${existingId},${newId}`;
  }
  
  // If same, just return one
  return existingId;
}

/**
 * Sort shopping items by department for better organization
 */
function sortShoppingItems(items: ShoppingListItem[]): ShoppingListItem[] {
  // Define department order for sorting
  const departmentOrder: Record<string, number> = {
    'Produce': 1,
    'Meat & Seafood': 2,
    'Dairy & Eggs': 3,
    'Frozen': 4,
    'Pantry': 5,
    'Bakery': 6,
    'Canned Goods': 7, 
    'Beverages': 8,
    'Spices': 9,
    'Other': 10
  };
  
  return [...items].sort((a, b) => {
    // First sort by department
    const deptA = a.department || 'Other';
    const deptB = b.department || 'Other';
    
    const deptOrderA = departmentOrder[deptA] || 99;
    const deptOrderB = departmentOrder[deptB] || 99;
    
    if (deptOrderA !== deptOrderB) {
      return deptOrderA - deptOrderB;
    }
    
    // Then sort by name within departments
    return (a.name || '').localeCompare(b.name || '');
  });
}
