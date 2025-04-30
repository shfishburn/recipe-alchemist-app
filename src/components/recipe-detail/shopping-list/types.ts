
import { ShoppingListItem } from '@/types/shopping-list';
import { Ingredient } from '@/types/recipe';

export interface ShoppingItem {
  text: string;
  checked: boolean;
  department?: string;
  pantryStaple?: boolean;
  ingredientData?: Ingredient;
  originalIngredient?: Ingredient;
  // Structured data fields for better accessibility
  quantity?: number;
  unit?: string;
  item?: string;
  notes?: string;
}

export interface ShoppingItemsByDepartment {
  [department: string]: ShoppingItem[];
}

// Convert ShoppingItem to a format that can be serialized to JSON
// for storing in the Supabase database
export const itemToJson = (item: ShoppingItem): Record<string, any> => {
  return {
    text: item.text,
    checked: item.checked,
    department: item.department || 'Other',
    pantryStaple: !!item.pantryStaple,
    quantity: item.quantity,
    unit: item.unit || '',
    item: item.item || '',
    notes: item.notes || '',
    // Convert complex objects to JSON-serializable format
    ingredientData: item.ingredientData ? JSON.parse(JSON.stringify(item.ingredientData)) : null,
    originalIngredient: item.originalIngredient ? JSON.parse(JSON.stringify(item.originalIngredient)) : null
  };
};

// Convert array of ShoppingItems to JSON-compatible format
export const itemsToJson = (items: ShoppingItem[]): Record<string, any>[] => {
  return items.map(itemToJson);
};
