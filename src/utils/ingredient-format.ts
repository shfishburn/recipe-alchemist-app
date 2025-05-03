
import { Ingredient } from '@/hooks/use-quick-recipe';

// Helper function to format ingredient for shopping list
export const formatIngredient = (ingredient: any, unitSystemParam?: 'metric' | 'imperial'): string => {
  if (typeof ingredient === 'string') {
    return ingredient;
  }

  // Use passed unitSystem if provided, otherwise use Zustand store state
  // This approach allows the function to work both with direct calls and in React components
  let unitSystem = unitSystemParam;
  if (!unitSystem) {
    try {
      // Try to import dynamically - will only work in React components
      const { useUnitSystemStore } = require('@/stores/unitSystem');
      unitSystem = useUnitSystemStore.getState().unitSystem;
    } catch (error) {
      // Default to metric if store can't be accessed
      unitSystem = 'metric';
    }
  }
  
  // Extract fields based on unit system preference
  const qty = unitSystem === 'metric' 
    ? ingredient.qty_metric !== undefined ? ingredient.qty_metric : ingredient.qty
    : ingredient.qty_imperial !== undefined ? ingredient.qty_imperial : ingredient.qty;
    
  const unit = unitSystem === 'metric'
    ? ingredient.unit_metric || ingredient.unit
    : ingredient.unit_imperial || ingredient.unit;
  
  // Extract all other possible fields we might need
  const { item, notes } = ingredient;
  let formatted = '';
  
  // Format quantity
  if (qty !== undefined && qty !== null) {
    formatted += qty + ' ';
  }
  
  // Format unit
  if (unit) {
    formatted += unit + ' ';
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
