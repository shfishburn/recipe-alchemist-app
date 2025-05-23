
import { Ingredient } from '@/hooks/use-quick-recipe';

export interface ShoppingItem {
  text: string;
  checked: boolean;
  department?: string;
  pantryStaple?: boolean;
  ingredientData?: Ingredient;
  originalIngredient?: any; // Keep this field to preserve AI-generated data
  // Structured data fields for better accessibility
  quantity?: number;
  unit?: string;
  item?: string;
  notes?: string;
  quality_indicators?: string;
  alternatives?: string[];
  storage_tips?: string;
  // New fields for shop sizes
  shop_size_qty?: number;
  shop_size_unit?: string;
}

export interface ShoppingItemsByDepartment {
  [department: string]: ShoppingItem[];
}
