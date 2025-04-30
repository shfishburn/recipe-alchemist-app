
import { Ingredient } from '@/hooks/use-quick-recipe';

export interface ShoppingItem {
  text: string;
  checked: boolean;
  department?: string;
  pantryStaple?: boolean;
  ingredientData?: Ingredient;
  originalIngredient?: Ingredient; // Keep this field to preserve original ingredient data
  // Structured data fields for better accessibility
  quantity?: number;
  unit?: string;
  item?: string;
  notes?: string;
}

export interface ShoppingItemsByDepartment {
  [department: string]: ShoppingItem[];
}
