
import { supabase } from '@/integrations/supabase/client';
import { getShoppingQuantity } from '@/utils/unit-conversion';
import { Ingredient } from '@/types/recipe';
import { ShoppingListItem } from '@/types/shopping-list';
import { PackageSizeService } from '@/services/package-size-service';

export interface RecipeIngredient {
  qty?: number;
  unit?: string;
  item: string | { item: string };
  notes?: string;
  qty_imperial?: number;
  unit_imperial?: string;
  qty_metric?: number;
  unit_metric?: string;
}

export interface ShoppableItem {
  qty_imperial: number;
  unit_imperial: string;
  qty_metric: number;
  unit_metric: string;
  shop_size_qty: number;
  shop_size_unit: string;
  item: string;
  notes?: string;
}

export class AIShoppingConverter {
  /**
   * Convert recipe ingredients to shoppable format
   */
  static async convertIngredientsToShoppingItems(
    ingredients: Ingredient[]
  ): Promise<ShoppingListItem[]> {
    console.log("Converting ingredients to shopping items with AI converter");
    
    // First, normalize the ingredients
    const normalizedIngredients = ingredients.map(ingredient => {
      if (typeof ingredient === 'string') {
        return {
          item: ingredient,
          qty: 1,
          unit: '',
          notes: ''
        };
      }
      
      // Extract ingredient name
      const itemName = typeof ingredient.item === 'string' 
        ? ingredient.item 
        : (ingredient.item as any)?.item || '';
      
      return {
        item: itemName,
        qty: ingredient.qty || 0,
        unit: ingredient.unit || '',
        notes: ingredient.notes || '',
        qty_imperial: ingredient.qty_imperial,
        unit_imperial: ingredient.unit_imperial,
        qty_metric: ingredient.qty_metric,
        unit_metric: ingredient.unit_metric
      };
    });
    
    // Convert each ingredient to a shoppable item
    const shoppableItems = await Promise.all(
      normalizedIngredients.map(async ingredient => {
        try {
          // Find the best match in our database
          const match = await PackageSizeService.findBestMatch(ingredient.item);
          let shopItem: ShoppingListItem;
          
          if (match) {
            const confidence = 0.8;
            
            // Calculate purchase quantity based on package sizes
            const purchaseInfo = PackageSizeService.calculateOptimalPurchase(
              ingredient.qty,
              ingredient.unit,
              match
            );
            
            shopItem = {
              name: ingredient.item,
              quantity: purchaseInfo.quantity,
              unit: purchaseInfo.unit,
              checked: false,
              notes: ingredient.notes,
              department: match.category,
              shop_size_qty: purchaseInfo.quantity,
              shop_size_unit: purchaseInfo.unit,
              confidence: confidence,
              package_notes: match.notes
            };
          } else {
            // No match found, use original values
            shopItem = {
              name: ingredient.item,
              quantity: ingredient.qty || 1,
              unit: ingredient.unit || '',
              checked: false,
              notes: ingredient.notes,
              department: AIShoppingConverter.guessDepartment(ingredient.item),
              confidence: 0.5
            };
          }
          
          return shopItem;
        } catch (error) {
          console.error(`Error converting ingredient ${ingredient.item}:`, error);
          // Fallback to basic format
          return {
            name: ingredient.item,
            quantity: ingredient.qty || 1,
            unit: ingredient.unit || '',
            checked: false,
            notes: ingredient.notes,
            department: 'Other'
          };
        }
      })
    );
    
    return shoppableItems;
  }
  
  /**
   * Guess the department based on ingredient name
   */
  static guessDepartment(ingredient: string): string {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Structured mapping of ingredient keywords to departments
    const departmentMappings: Record<string, string[]> = {
      'Dairy & Eggs': [
        'milk', 'cream', 'cheese', 'yogurt', 'butter', 'dairy', 'egg', 'margarine',
        'sour cream', 'cottage cheese', 'cream cheese', 'half and half'
      ],
      'Meat & Seafood': [
        'beef', 'chicken', 'turkey', 'lamb', 'meat', 'steak', 'ground', 'pork',
        'fish', 'salmon', 'tuna', 'shrimp', 'seafood', 'cod', 'bacon', 'sausage'
      ],
      'Produce': [
        'apple', 'banana', 'potato', 'onion', 'carrot', 'lettuce', 'produce',
        'vegetable', 'fruit', 'tomato', 'broccoli', 'fresh', 'greens', 'pepper',
        'cucumber', 'lemon', 'lime', 'orange', 'garlic', 'celery'
      ],
      'Pantry': [
        'flour', 'sugar', 'rice', 'pasta', 'oil', 'vinegar', 'baking', 'pantry',
        'spice', 'seasoning', 'herb', 'dry', 'dried', 'canned', 'salt', 'pepper',
        'cereal', 'bean', 'grain', 'bread', 'cracker'
      ],
      'Canned Goods': [
        'can', 'soup', 'beans', 'tomato sauce', 'canned', 'broth', 'stock'
      ],
      'Frozen': [
        'frozen', 'ice cream', 'ice', 'popsicle', 'freezer'
      ],
      'Beverages': [
        'water', 'juice', 'soda', 'pop', 'coffee', 'tea', 'drink', 'beverage', 
        'wine', 'beer', 'alcohol', 'liquor'
      ]
    };
    
    // Check each department for matching keywords
    for (const [department, keywords] of Object.entries(departmentMappings)) {
      for (const keyword of keywords) {
        if (lowerIngredient.includes(keyword)) {
          return department;
        }
      }
    }
    
    // Default department
    return 'Other';
  }
}

/**
 * Convert recipe ingredients to shopping list items using the AI converter
 */
export async function convertIngredientsWithAI(
  ingredients: Ingredient[]
): Promise<ShoppingListItem[]> {
  try {
    return await AIShoppingConverter.convertIngredientsToShoppingItems(ingredients);
  } catch (error) {
    console.error("Error in AI conversion:", error);
    
    // Fallback to basic conversion without AI
    return ingredients.map(ingredient => {
      if (typeof ingredient === 'string') {
        return {
          name: ingredient,
          quantity: 1,
          unit: '',
          checked: false,
          department: 'Other'
        };
      }
      
      const itemName = typeof ingredient.item === 'string' 
        ? ingredient.item 
        : (ingredient.item as any)?.item || '';
      
      return {
        name: itemName,
        quantity: ingredient.qty || 1,
        unit: ingredient.unit || '',
        checked: false,
        notes: ingredient.notes,
        department: AIShoppingConverter.guessDepartment(itemName)
      };
    });
  }
}
