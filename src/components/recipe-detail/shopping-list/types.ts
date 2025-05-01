
// Define types for shopping list management
import { Ingredient } from '@/types/recipe';

export interface ShoppingItem {
  text: string;
  checked: boolean;
  department?: string;
  pantryStaple?: boolean;
  ingredientData?: any; // Original ingredient data
  originalIngredient?: any; // Keep this field to preserve original ingredient data
  // Structured data fields for better accessibility
  quantity?: number;
  unit?: string;
  item?: string;
  notes?: string;
}

export interface ShoppingItemsByDepartment {
  [department: string]: ShoppingItem[];
}

// Helper function to convert ShoppingItems to JSON-serializable format
export function itemsToJson(items: ShoppingItem[]): Record<string, any>[] {
  return items.map(item => ({
    text: item.text,
    checked: item.checked,
    department: item.department || 'Other',
    pantryStaple: !!item.pantryStaple,
    quantity: item.quantity,
    unit: item.unit || '',
    name: item.item || '', // Include the name field for compatibility
    notes: item.notes || ''
  }));
}
