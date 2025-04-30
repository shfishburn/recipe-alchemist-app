
import { Ingredient } from '@/hooks/use-quick-recipe';

// Helper function to format ingredient for shopping list
export const formatIngredient = (ingredient: any): string => {
  if (typeof ingredient === 'string') {
    return ingredient;
  }
  
  const { qty, unit, shop_size_qty, shop_size_unit, item, notes } = ingredient;
  let formatted = '';
  
  // Use shop size if available, otherwise use regular quantity
  const displayQty = shop_size_qty !== undefined ? shop_size_qty : qty;
  const displayUnit = shop_size_unit || unit;
  
  if (displayQty) {
    formatted += displayQty + ' ';
  }
  
  if (displayUnit) {
    formatted += displayUnit + ' ';
  }
  
  if (typeof item === 'string') {
    formatted += item;
  } else if (item && typeof item === 'object') {
    formatted += item.toString();
  }
  
  if (notes) {
    formatted += ` (${notes})`;
  }
  
  return formatted.trim();
};
