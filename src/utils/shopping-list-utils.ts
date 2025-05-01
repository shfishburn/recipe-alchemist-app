import { Ingredient } from '@/types/recipe';
import { ShoppingListItem } from '@/types/shopping-list';
import { getShoppingQuantity } from '@/utils/unit-conversion';
import { formatIngredient } from '@/utils/ingredient-format';

/**
 * Converts recipe ingredients to shopping list items
 */
export function ingredientsToShoppingItems(ingredients: Ingredient[]): ShoppingListItem[] {
  return ingredients.map((ingredient): ShoppingListItem => {
    // Handle string ingredients
    if (typeof ingredient === 'string') {
      return {
        name: ingredient,
        quantity: 1,
        unit: '',
        checked: false,
        department: 'Other'
      };
    }
    
    // Extract ingredient details
    const itemName = typeof ingredient.item === 'string' 
      ? ingredient.item 
      : (ingredient.item as any)?.item || 'Unknown item';
    
    // Convert recipe units to shopping units
    const shoppingQty = getShoppingQuantity(ingredient.qty || 0, ingredient.unit || '');
    
    // Determine department
    const department = getDepartmentForIngredient(itemName);
    
    return {
      name: itemName, // Include the actual item name
      quantity: shoppingQty.qty,
      unit: shoppingQty.unit,
      checked: false,
      notes: ingredient.notes,
      department: department,
      recipeId: undefined // Will be set by the calling function if needed
    };
  });
}

/**
 * Determine the store department for an ingredient based on its name
 */
export function getDepartmentForIngredient(ingredient: string): string {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Produce
  if (/lettuce|spinach|kale|arugula|cabbage|carrot|onion|garlic|potato|tomato|pepper|cucumber|zucchini|squash|apple|banana|orange|lemon|lime|berries|fruit|vegetable|produce|greens/i.test(lowerIngredient)) {
    return 'Produce';
  }
  
  // Meat & Seafood
  if (/beef|chicken|pork|turkey|lamb|fish|salmon|tuna|shrimp|seafood|meat|steak|ground meat|bacon|sausage/i.test(lowerIngredient)) {
    return 'Meat & Seafood';
  }
  
  // Dairy & Eggs
  if (/milk|cheese|yogurt|butter|cream|sour cream|egg|dairy/i.test(lowerIngredient)) {
    return 'Dairy & Eggs';
  }
  
  // Bakery
  if (/bread|bagel|bun|roll|tortilla|pita|muffin|cake|pastry|bakery/i.test(lowerIngredient)) {
    return 'Bakery';
  }
  
  // Pantry
  if (/flour|sugar|oil|vinegar|sauce|condiment|spice|herb|rice|pasta|bean|legume|canned|jar|shelf-stable|pantry/i.test(lowerIngredient)) {
    return 'Pantry';
  }
  
  // Frozen
  if (/frozen|ice cream|popsicle/i.test(lowerIngredient)) {
    return 'Frozen';
  }
  
  // Beverages
  if (/water|juice|soda|pop|coffee|tea|drink|beverage|wine|beer|alcohol/i.test(lowerIngredient)) {
    return 'Beverages';
  }
  
  // Default
  return 'Other';
}

/**
 * Check for duplicate ingredients between existing and new items
 */
export function findDuplicateIngredients(
  existingItems: ShoppingListItem[],
  newItems: ShoppingListItem[]
): ShoppingListItem[] {
  return newItems.filter(newItem => 
    existingItems.some(existingItem => 
      normalizeItemName(existingItem.name) === normalizeItemName(newItem.name)
    )
  );
}

/**
 * Normalize item names for comparison (remove punctuation, convert to lowercase)
 */
function normalizeItemName(name: string): string {
  return name.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Merge shopping lists, combining duplicate items and summing quantities
 */
export function mergeShoppingLists(
  existingItems: ShoppingListItem[],
  newItems: ShoppingListItem[]
): ShoppingListItem[] {
  const result = [...existingItems];
  
  for (const newItem of newItems) {
    const existingIndex = result.findIndex(item => 
      normalizeItemName(item.name) === normalizeItemName(newItem.name) && 
      item.unit === newItem.unit
    );
    
    if (existingIndex >= 0) {
      // Item exists, update quantity
      result[existingIndex].quantity += newItem.quantity;
      // Merge notes if they exist
      if (newItem.notes && !result[existingIndex].notes?.includes(newItem.notes)) {
        result[existingIndex].notes = result[existingIndex].notes 
          ? `${result[existingIndex].notes}, ${newItem.notes}`
          : newItem.notes;
      }
    } else {
      // New item, add it
      result.push({...newItem});
    }
  }
  
  return result;
}
