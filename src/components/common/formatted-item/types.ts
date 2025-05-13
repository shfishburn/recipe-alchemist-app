
import { Ingredient as RecipeIngredient } from '@/types/recipe';
import { Ingredient as QuickRecipeIngredient } from '@/types/quick-recipe';
import { ShoppingListItem } from '@/types/shopping-list';
import { ShoppingItem } from '@/components/quick-recipe/shopping-list/types';

// Union type for all possible item types
export type FormattableItem = 
  | RecipeIngredient 
  | QuickRecipeIngredient 
  | ShoppingListItem 
  | ShoppingItem
  | string;

// Formatting options for the FormattedItem component
export interface FormattingOptions {
  // What part of the item to highlight with bold
  highlight?: 'name' | 'quantity' | 'all' | 'none';
  // Whether to apply strikethrough style (for checked items)
  strikethrough?: boolean;
  // Which unit system to use for formatting
  unitSystem?: 'metric' | 'imperial';
  // Additional CSS classes to apply
  className?: string;
}

// Type guards to check what kind of item we're dealing with
export function isShoppingListItem(item: FormattableItem): item is ShoppingListItem {
  return typeof item === 'object' && 
         item !== null && 
         'name' in item && 
         'checked' in item;
}

export function isQuickShoppingItem(item: FormattableItem): item is ShoppingItem {
  return typeof item === 'object' && 
         item !== null && 
         'text' in item;
}

export function isRecipeIngredient(item: FormattableItem): item is RecipeIngredient | QuickRecipeIngredient {
  return typeof item === 'object' && 
         item !== null && 
         'item' in item;
}
