
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { formatIngredient } from '@/utils/ingredient-format';
import { ShoppingItem, ShoppingItemsByDepartment } from './types';

// Transform recipe ingredients into shopping items
export const createShoppingItems = (recipe: QuickRecipe): ShoppingItem[] => {
  // Transform ingredients into shopping items with checked state
  const initialItems: ShoppingItem[] = recipe.ingredients.map(ingredient => {
    // Create properly structured shopping item that preserves all ingredient data
    return {
      text: formatIngredient(ingredient),
      checked: false,
      department: 'Recipe Ingredients',
      // Save the complete original ingredient data to maintain structured information
      ingredientData: ingredient,
      // Extract specific shopping fields for easier access
      quantity: ingredient.shop_size_qty !== undefined ? ingredient.shop_size_qty : ingredient.qty,
      unit: ingredient.shop_size_unit || ingredient.unit,
      item: typeof ingredient.item === 'string' ? ingredient.item : 
            (ingredient.item && typeof ingredient.item === 'object' ? JSON.stringify(ingredient.item) : ''),
      notes: ingredient.notes || ''
    };
  });
  
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
        pantryStaple: true,
        quantity: 1,
        unit: '',
        item: item,
        notes: ''
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
      const itemTexts = deptItems.map(item => {
        // Use structured data for more accurate clipboard text format
        const quantityText = item.quantity ? `${item.quantity} ` : '';
        const unitText = item.unit ? `${item.unit} ` : '';
        const itemName = item.item || '';
        const notesText = item.notes ? ` (${item.notes})` : '';
        const formattedText = `${quantityText}${unitText}${itemName}${notesText}`;
        
        return `${item.checked ? '[x]' : '[ ]'} ${formattedText}`;
      });
      return `## ${department}\n${itemTexts.join('\n')}`;
    }).join('\n\n');
};
