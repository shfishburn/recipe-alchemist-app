
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { formatIngredient } from '@/utils/ingredient-format';
import { ShoppingItem, ShoppingItemsByDepartment } from './types';

// Transform recipe ingredients into shopping items
export const createShoppingItems = (recipe: QuickRecipe): ShoppingItem[] => {
  // Transform ingredients into shopping items with checked state
  const initialItems: ShoppingItem[] = recipe.ingredients.map(ingredient => ({
    text: formatIngredient(ingredient),
    checked: false,
    department: 'Recipe Ingredients',
    // Save the original ingredient data to maintain shop_size info
    ingredientData: ingredient
  }));
  
  // Add extra items for cooking oil, salt, and pepper if not already in the list
  const basicItems = [
    'Cooking oil',
    'Salt',
    'Black pepper'
  ];
  
  // Check if any basic items are missing from the ingredients
  basicItems.forEach(item => {
    const hasItem = initialItems.some(i => 
      i.text.toLowerCase().includes(item.toLowerCase())
    );
    
    if (!hasItem) {
      initialItems.push({
        text: item,
        checked: false,
        department: 'Pantry Staples',
        pantryStaple: true
      });
    }
  });
  
  return initialItems;
};

// Group items by department
export const groupItemsByDepartment = (items: ShoppingItem[]): ShoppingItemsByDepartment => {
  return items.reduce((acc, item) => {
    const dept = item.department || 'Recipe Ingredients';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(item);
    return acc;
  }, {} as ShoppingItemsByDepartment);
};

// Format shopping list as text for clipboard
export const formatShoppingListForClipboard = (itemsByDepartment: ShoppingItemsByDepartment): string => {
  return Object.entries(itemsByDepartment)
    .map(([department, deptItems]) => {
      const itemTexts = deptItems.map(item => 
        `${item.checked ? '[x]' : '[ ]'} ${item.text}`
      );
      return `## ${department}\n${itemTexts.join('\n')}`;
    }).join('\n\n');
};
