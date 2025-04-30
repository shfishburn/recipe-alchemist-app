
import { Ingredient } from '@/hooks/use-quick-recipe';

export interface ShoppingItem {
  text: string;
  checked: boolean;
  department?: string;
  pantryStaple?: boolean;
  ingredientData?: Ingredient;
  originalIngredient?: Ingredient; // Add this field to store the original ingredient data
  // Add structured data fields for better accessibility
  quantity?: number;
  unit?: string;
  item?: string;
  notes?: string;
}

export interface ShoppingItemsByDepartment {
  [department: string]: ShoppingItem[];
}
