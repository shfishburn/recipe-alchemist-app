
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { formatIngredient } from '@/utils/ingredient-format';
import { ShoppingItem, ShoppingItemsByDepartment } from './types';
import { supabase } from '@/integrations/supabase/client';

// Transform recipe ingredients into shopping items
export const createShoppingItems = async (recipe: QuickRecipe): Promise<ShoppingItem[]> => {
  try {
    console.log("Starting shopping list generation for recipe:", recipe.title);
    
    // First try to get AI-enhanced shopping data
    const enhancedItems = await generateAIShoppingList(recipe);
    if (enhancedItems && enhancedItems.length > 0) {
      console.log("AI-enhanced shopping list generated successfully with", enhancedItems.length, "items");
      return enhancedItems;
    }
    
    console.log("Falling back to basic shopping items");
    // Fallback to manually creating shopping items from ingredients
    return createBasicShoppingItems(recipe);
  } catch (error) {
    console.error("Error generating shopping list:", error);
    // Fallback to basic creation in case of errors
    return createBasicShoppingItems(recipe);
  }
};

// Transform recipe ingredients into basic shopping items (fallback method)
export const createBasicShoppingItems = (recipe: QuickRecipe): ShoppingItem[] => {
  // Transform ingredients into shopping items with checked state
  const initialItems: ShoppingItem[] = recipe.ingredients.map(ingredient => {
    // Extract the item name for better visibility
    const itemName = typeof ingredient.item === 'string' 
      ? ingredient.item 
      : (typeof ingredient.item === 'object' && ingredient.item !== null)
        ? (ingredient.item.item || JSON.stringify(ingredient.item))
        : 'Unknown item';
        
    // Create properly structured shopping item that preserves all ingredient data
    return {
      // Format the text to clearly include the item name
      text: `${ingredient.qty || ''} ${ingredient.unit || ''} ${itemName}`.trim() + 
            (ingredient.notes ? ` (${ingredient.notes})` : ''),
      checked: false,
      department: getDepartmentForIngredient(itemName),
      // Save the complete original ingredient data to maintain structured information
      ingredientData: ingredient,
      // Extract specific shopping fields for easier access
      quantity: ingredient.shop_size_qty !== undefined ? ingredient.shop_size_qty : ingredient.qty,
      unit: ingredient.shop_size_unit || ingredient.unit,
      item: itemName,
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

// Generate AI-enhanced shopping list using the edge function
export const generateAIShoppingList = async (recipe: QuickRecipe): Promise<ShoppingItem[]> => {
  try {
    console.log("Calling generate-shopping-list edge function");
    
    // Call the edge function to get AI-enhanced shopping list
    const { data, error } = await supabase.functions.invoke('generate-shopping-list', {
      body: {
        ingredients: recipe.ingredients,
        title: recipe.title
      }
    });
    
    if (error) {
      console.error("Error invoking generate-shopping-list function:", error);
      return [];
    }
    
    if (!data || !data.departments) {
      console.warn("No shopping data received from AI generator");
      return [];
    }
    
    console.log("AI generated shopping data:", data);
    
    // Transform the AI-generated data into ShoppingItem format
    const shoppingItems: ShoppingItem[] = [];
    
    data.departments.forEach(dept => {
      dept.items.forEach(item => {
        shoppingItems.push({
          text: `${item.quantity} ${item.unit} ${item.name}`.trim(),
          checked: false,
          department: dept.name,
          pantryStaple: item.pantry_staple || false,
          quantity: item.quantity,
          unit: item.unit,
          item: item.name,
          notes: item.notes || '',
          quality_indicators: item.quality_indicators,
          storage_tips: item.storage_tips,
          alternatives: item.alternatives,
          originalIngredient: item // Store the full AI-generated item data
        });
      });
    });
    
    return shoppingItems;
  } catch (error) {
    console.error("Error generating AI shopping list:", error);
    return [];
  }
};

// Helper function to determine department based on ingredient name
export const getDepartmentForIngredient = (ingredient: string): string => {
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
