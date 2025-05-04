
import { Ingredient } from '@/types/recipe';

/**
 * Department definitions with matching patterns
 */
export const DEPARTMENT_DEFINITIONS = {
  'Produce': {
    pattern: /lettuce|spinach|kale|arugula|cabbage|carrot|onion|garlic|potato|tomato|pepper|cucumber|zucchini|squash|apple|banana|orange|lemon|lime|berries|fruit|vegetable|produce|greens/i,
    order: 1
  },
  'Meat & Seafood': {
    pattern: /beef|steak|chicken|pork|turkey|lamb|fish|salmon|tuna|shrimp|seafood|meat|ground meat|bacon|sausage/i,
    order: 2
  },
  'Dairy & Eggs': {
    pattern: /milk|cheese|yogurt|butter|cream|sour cream|egg|dairy/i,
    order: 3
  },
  'Bakery': {
    pattern: /bread|bagel|bun|roll|tortilla|pita|muffin|cake|pastry|bakery/i,
    order: 4
  },
  'Pantry': {
    pattern: /flour|sugar|oil|vinegar|sauce|condiment|spice|herb|rice|pasta|bean|legume|canned|jar|shelf-stable|pantry/i,
    order: 5
  },
  'Frozen': {
    pattern: /frozen|ice cream|popsicle/i,
    order: 6
  },
  'Beverages': {
    pattern: /water|juice|soda|pop|coffee|tea|drink|beverage|wine|beer|alcohol/i,
    order: 7
  },
  'Other': {
    pattern: /.*/i, // Match anything as fallback
    order: 8
  }
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
  
  for (const [department, { pattern }] of Object.entries(DEPARTMENT_DEFINITIONS)) {
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
export const getDepartmentDisplayOrder = (): string[] => {
  // Sort departments by their defined order
  return Object.entries(DEPARTMENT_DEFINITIONS)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([dept]) => dept);
};
