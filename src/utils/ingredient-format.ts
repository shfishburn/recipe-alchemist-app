
import { Ingredient } from '@/hooks/use-quick-recipe';

// Helper function to format ingredient for shopping list
export const formatIngredient = (ingredient: any): string => {
  if (typeof ingredient === 'string') {
    return ingredient;
  }
  
  // Extract all the possible fields we might need
  const { qty, unit, shop_size_qty, shop_size_unit, item, notes } = ingredient;
  let formatted = '';
  
  // Always prioritize shop_size fields if available
  const displayQty = shop_size_qty !== undefined ? shop_size_qty : qty;
  const displayUnit = shop_size_unit || unit;
  
  // Format quantity
  if (displayQty !== undefined && displayQty !== null) {
    formatted += displayQty + ' ';
  }
  
  // Format unit
  if (displayUnit) {
    formatted += displayUnit + ' ';
  }
  
  // Format item name
  if (typeof item === 'string') {
    formatted += item;
  } else if (item && typeof item === 'object') {
    // If item is an object, check if it has an 'item' property
    if (item.item && typeof item.item === 'string') {
      formatted += item.item;
    } else {
      // Fallback to string representation
      formatted += JSON.stringify(item);
    }
  }
  
  // Add notes in parentheses if available
  if (notes) {
    formatted += ` (${notes})`;
  }
  
  return formatted.trim();
};
