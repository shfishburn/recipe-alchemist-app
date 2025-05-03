
import { groceryPackageSizes, type GroceryPackageSize } from '@/data/groceryPackageSizes';
import { convertUnits } from '@/utils/unit-conversion';
import { Ingredient } from '@/types/recipe';
import { ShoppingListItem } from '@/types/shopping-list';

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
  static database: GroceryPackageSize[] = groceryPackageSizes;
  
  /**
   * Initialize the grocery database
   */
  static initializeDatabase(db: GroceryPackageSize[]) {
    AIShoppingConverter.database = db;
  }
  
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
        : ingredient.item?.item || '';
      
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
          const match = AIShoppingConverter.findBestMatch(ingredient);
          let shopItem: ShoppingListItem;
          
          if (match) {
            // Calculate purchase quantity based on package sizes
            const purchaseQty = AIShoppingConverter.calculatePurchaseSize(
              ingredient.qty,
              ingredient.unit,
              match.package_sizes
            );
            
            shopItem = {
              name: ingredient.item,
              quantity: purchaseQty,
              unit: match.package_unit,
              checked: false,
              notes: ingredient.notes,
              department: match.category,
              shop_size_qty: purchaseQty,
              shop_size_unit: match.package_unit
            };
          } else {
            // No match found, use original values
            shopItem = {
              name: ingredient.item,
              quantity: ingredient.qty || 1,
              unit: ingredient.unit || '',
              checked: false,
              notes: ingredient.notes,
              department: AIShoppingConverter.guessDepartment(ingredient.item)
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
   * Find the best match for an ingredient in the database
   */
  static findBestMatch(ingredient: RecipeIngredient): GroceryPackageSize | null {
    const itemName = typeof ingredient.item === 'string' ? ingredient.item.toLowerCase() : '';
    
    // Direct match
    const directMatch = AIShoppingConverter.database.find(
      item => item.ingredient.toLowerCase() === itemName
    );
    
    if (directMatch) {
      return directMatch;
    }
    
    // Partial match (ingredient name contains the database item name or vice versa)
    const partialMatch = AIShoppingConverter.database.find(item => 
      itemName.includes(item.ingredient.toLowerCase()) || 
      item.ingredient.toLowerCase().includes(itemName)
    );
    
    if (partialMatch) {
      return partialMatch;
    }
    
    // No match found
    return null;
  }
  
  /**
   * Calculate the purchase size based on package sizes
   */
  static calculatePurchaseSize(
    neededQty: number = 0,
    neededUnit: string = '',
    packageSizes: number[] = []
  ): number {
    if (packageSizes.length === 0 || neededQty <= 0) {
      return neededQty || 1; // Default to needed quantity or 1
    }
    
    // Find the smallest package size that meets or exceeds the needed quantity
    const sortedSizes = [...packageSizes].sort((a, b) => a - b);
    
    for (const size of sortedSizes) {
      if (size >= neededQty) {
        return size;
      }
    }
    
    // If needed quantity exceeds all available package sizes, calculate how many packages needed
    const largestSize = sortedSizes[sortedSizes.length - 1];
    const numPackages = Math.ceil(neededQty / largestSize);
    return largestSize * numPackages;
  }
  
  /**
   * Guess the department based on ingredient name
   */
  static guessDepartment(ingredient: string): string {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Simple matching logic for common ingredients
    if (/milk|cream|cheese|yogurt|butter|dairy/.test(lowerIngredient)) {
      return 'Dairy';
    } else if (/beef|chicken|turkey|lamb|meat|steak|ground/.test(lowerIngredient)) {
      return 'Meat';
    } else if (/flour|sugar|rice|pasta|oil|vinegar|baking|pantry/.test(lowerIngredient)) {
      return 'Pantry';
    } else if (/tomatoes|beans|soup|canned/.test(lowerIngredient)) {
      return 'Canned Goods';
    } else if (/salt|pepper|spice|seasoning|herb/.test(lowerIngredient)) {
      return 'Spices';
    } else if (/apple|banana|potato|onion|carrot|lettuce|produce/.test(lowerIngredient)) {
      return 'Produce';
    }
    
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
