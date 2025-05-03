
import { Ingredient } from '@/types/recipe';
import { ShoppingListItem } from '@/types/shopping-list';
import { getShoppingQuantity } from '@/utils/unit-conversion';
import { useUnitSystemStore } from '@/stores/unitSystem';

/**
 * Converts recipe ingredients to shopping list items
 */
export function recipeIngredientsToShoppingItems(
  ingredients: Ingredient[], 
  recipeId?: string
): ShoppingListItem[] {
  console.log("Converting recipe ingredients to shopping items:", ingredients);
  
  // Get the current unit system preference from store
  const unitSystem = useUnitSystemStore.getState().unitSystem;
  console.log(`Using ${unitSystem} unit system for conversion`);
  
  return ingredients.map((ingredient): ShoppingListItem => {
    // Handle string ingredients
    if (typeof ingredient === 'string') {
      console.log(`String ingredient found: ${ingredient}`);
      return {
        name: ingredient,
        quantity: 1,
        unit: '',
        checked: false,
        department: getDepartmentForIngredient(ingredient),
        recipeId: recipeId
      };
    }
    
    // Extract ingredient details with robust error handling
    const itemName = typeof ingredient.item === 'string' 
      ? ingredient.item 
      : (ingredient.item as any)?.item || 'Unknown item';
    
    // Select quantity based on unit system preference
    let quantity = 0;
    let unit = '';
    
    if (unitSystem === 'metric') {
      quantity = typeof ingredient.qty_metric !== 'undefined' ? ingredient.qty_metric : 
                (typeof ingredient.qty !== 'undefined' ? ingredient.qty : 0);
      unit = ingredient.unit_metric || ingredient.unit || '';
    } else {
      quantity = typeof ingredient.qty_imperial !== 'undefined' ? ingredient.qty_imperial : 
                (typeof ingredient.qty !== 'undefined' ? ingredient.qty : 0);
      unit = ingredient.unit_imperial || ingredient.unit || '';
    }
    
    console.log(`Ingredient: ${itemName}, Qty: ${quantity}, Unit: ${unit}, System: ${unitSystem}`);
    
    // Convert recipe units to shopping units
    const shoppingQty = getShoppingQuantity(quantity, unit);
    console.log(`Converted to shopping qty: ${shoppingQty.qty} ${shoppingQty.unit}`);
    
    // Determine department
    const department = getDepartmentForIngredient(itemName);
    
    return {
      name: itemName,
      quantity: shoppingQty.qty,
      unit: shoppingQty.unit,
      checked: false,
      notes: ingredient.notes,
      department: department,
      recipeId: recipeId
    };
  });
}

/**
 * Helper function to determine department based on ingredient name
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
