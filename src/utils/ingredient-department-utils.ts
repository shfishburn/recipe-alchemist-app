
import { Ingredient } from '@/types/recipe';

// Categories for ingredients with matching patterns
const DEPARTMENT_PATTERNS = {
  'Produce': /lettuce|spinach|kale|arugula|cabbage|carrot|onion|garlic|potato|tomato|pepper|cucumber|zucchini|squash|apple|banana|orange|lemon|lime|berries|fruit|vegetable|produce|greens/i,
  'Meat & Seafood': /beef|steak|chicken|pork|turkey|lamb|fish|salmon|tuna|shrimp|seafood|meat|ground meat|bacon|sausage/i,
  'Dairy & Eggs': /milk|cheese|yogurt|butter|cream|sour cream|egg|dairy/i,
  'Bakery': /bread|bagel|bun|roll|tortilla|pita|muffin|cake|pastry|bakery/i,
  'Pantry': /flour|sugar|oil|vinegar|sauce|condiment|spice|herb|rice|pasta|bean|legume|canned|jar|shelf-stable|pantry/i,
  'Frozen': /frozen|ice cream|popsicle/i,
  'Beverages': /water|juice|soda|pop|coffee|tea|drink|beverage|wine|beer|alcohol/i
};

/**
 * Get department for a given ingredient item name
 * @param item The ingredient item name to categorize
 * @returns The department name
 */
export const getDepartmentForIngredient = (item: string): string => {
  if (!item || typeof item !== 'string') {
    return 'Other';
  }
  
  const itemName = item.toLowerCase();
  
  for (const [department, pattern] of Object.entries(DEPARTMENT_PATTERNS)) {
    if (pattern.test(itemName)) {
      return department;
    }
  }
  return 'Other';
};

/**
 * Group ingredients by department based on their name
 * @param ingredients Array of ingredient objects
 * @returns Object with departments as keys and arrays of ingredients as values
 */
export function groupIngredientsByDepartment(ingredients: Ingredient[]): Record<string, Ingredient[]> {
  // Filter out any non-valid ingredients
  const validIngredients = ingredients.filter(ing => ing && typeof ing !== 'string' && ing.item);
  
  // Initialize grouping
  const groupedIngredients: Record<string, Ingredient[]> = {};
  
  // Process each ingredient
  validIngredients.forEach(ingredient => {
    const itemName = typeof ingredient.item === 'string' ? ingredient.item : 'Unknown';
    const department = getDepartmentForIngredient(itemName);
    
    // Initialize the department array if it doesn't exist
    if (!groupedIngredients[department]) {
      groupedIngredients[department] = [];
    }
    
    // Add the ingredient to its department
    groupedIngredients[department].push(ingredient);
  });
  
  return groupedIngredients;
}

/**
 * Get the recommended order for displaying departments
 * @returns Array of department names in display order
 */
export const getDepartmentDisplayOrder = (): string[] => [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Bakery',
  'Pantry',
  'Frozen',
  'Beverages',
  'Other'
];
