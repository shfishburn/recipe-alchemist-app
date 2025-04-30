
import { Ingredient } from '@/hooks/use-quick-recipe';

export interface ShoppingItem {
  text: string;
  checked: boolean;
  department?: string;
  pantryStaple?: boolean;
  ingredientData?: Ingredient;
}

export interface ShoppingItemsByDepartment {
  [department: string]: ShoppingItem[];
}
