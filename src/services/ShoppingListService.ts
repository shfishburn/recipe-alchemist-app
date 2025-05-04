import { supabase } from '@/integrations/supabase/client';
import { Ingredient } from '@/types/recipe';
import { ShoppingListItem } from '@/types/shopping-list';
import { getShoppingQuantity } from '@/utils/unit-conversion';
import { useUnitSystemStore } from '@/stores/unitSystem';

/**
 * GroceryPackageSize interface representing database structure
 */
export interface GroceryPackageSize {
  id: string;
  ingredient: string;
  category: string;
  package_sizes: number[];
  package_unit: string;
  standard_qty?: number;
  standard_unit?: string;
  metric_equiv?: string;
  notes?: string;
}

/**
 * Unified ShoppingListService that handles all shopping list related functionality
 * including package size optimization, ingredient processing, and department classification
 */
export class ShoppingListService {
  /**
   * Find the best matching package size for an ingredient
   */
  static async findBestPackageSize(ingredient: string): Promise<GroceryPackageSize | null> {
    try {
      console.log(`Finding best package size match for: ${ingredient}`);
      // Normalize ingredient name for better matching
      const normalizedIngredient = ingredient.toLowerCase().trim();
      
      // First try direct match
      const { data: directMatches } = await supabase
        .from('grocery_package_sizes')
        .select('*')
        .ilike('ingredient', normalizedIngredient);
      
      if (directMatches && directMatches.length > 0) {
        console.log(`Found direct match for ${ingredient}`);
        return this.normalizePackageSizeData(directMatches[0]);
      }
      
      // Try partial match - words contained in ingredient
      const words = normalizedIngredient.split(/\s+/);
      if (words.length > 1) {
        for (const word of words) {
          if (word.length < 3) continue; // Skip very short words
          
          const { data: wordMatches } = await supabase
            .from('grocery_package_sizes')
            .select('*')
            .ilike('ingredient', `%${word}%`)
            .limit(1);
          
          if (wordMatches && wordMatches.length > 0) {
            console.log(`Found word match for ${ingredient} using "${word}"`);
            return this.normalizePackageSizeData(wordMatches[0]);
          }
        }
      }
      
      console.log(`No package size match found for ${ingredient}`);
      return null;
    } catch (error) {
      console.error('Error finding package size match:', error);
      return null;
    }
  }

  /**
   * Ensure package_sizes is properly typed as number[]
   */
  private static normalizePackageSizeData(data: any): GroceryPackageSize {
    return {
      ...data,
      package_sizes: Array.isArray(data.package_sizes) ? data.package_sizes : []
    };
  }

  /**
   * Calculate optimal purchase quantity based on package sizes
   */
  static calculateOptimalPurchase(
    neededQty: number = 0,
    neededUnit: string = '',
    packageSize: GroceryPackageSize
  ): { quantity: number; unit: string; packages: number; packageSize: number } {
    // Default values
    if (neededQty <= 0) {
      return {
        quantity: packageSize.standard_qty || 1,
        unit: packageSize.package_unit,
        packages: 1,
        packageSize: packageSize.package_sizes[0] || 1
      };
    }
    
    // Handle unit conversion if needed
    let convertedQty = neededQty;
    let needsUnitConversion = neededUnit !== packageSize.package_unit;
    
    if (needsUnitConversion) {
      // Convert units using our unit conversion utility
      const conversion = this.convertUnits(neededQty, neededUnit, packageSize.package_unit);
      if (conversion) {
        convertedQty = conversion;
        console.log(`Converted ${neededQty} ${neededUnit} to ${convertedQty} ${packageSize.package_unit}`);
      } else {
        console.log(`Unit conversion needed but not implemented: ${neededUnit} to ${packageSize.package_unit}`);
      }
    }
    
    // Find optimal package size
    const packageSizes = packageSize.package_sizes;
    
    // Sort package sizes from smallest to largest
    const sortedSizes = [...packageSizes].sort((a, b) => a - b);
    
    // Find the smallest package that satisfies the need
    for (const size of sortedSizes) {
      if (size >= convertedQty) {
        return { 
          quantity: size, 
          unit: packageSize.package_unit,
          packages: 1,
          packageSize: size
        };
      }
    }
    
    // If we need more than the largest size, calculate how many packages
    const largestSize = sortedSizes[sortedSizes.length - 1] || 1;
    const packages = Math.ceil(convertedQty / largestSize);
    
    return { 
      quantity: largestSize * packages, 
      unit: packageSize.package_unit,
      packages,
      packageSize: largestSize
    };
  }

  /**
   * Basic unit conversion utility - to be enhanced in future phases
   */
  private static convertUnits(quantity: number, fromUnit: string, toUnit: string): number | null {
    // Same unit, no conversion needed
    if (fromUnit === toUnit) return quantity;

    // Common conversions
    const conversions: Record<string, Record<string, number>> = {
      'g': { 'kg': 0.001, 'oz': 0.035274, 'lb': 0.00220462 },
      'kg': { 'g': 1000, 'oz': 35.274, 'lb': 2.20462 },
      'oz': { 'g': 28.3495, 'lb': 0.0625, 'kg': 0.0283495 },
      'lb': { 'g': 453.592, 'oz': 16, 'kg': 0.453592 },
      'ml': { 'l': 0.001, 'cup': 0.00416667, 'tbsp': 0.067628, 'tsp': 0.202884, 'fl oz': 0.033814 },
      'l': { 'ml': 1000, 'cup': 4.16667, 'tbsp': 67.628, 'tsp': 202.884, 'fl oz': 33.814 },
      'cup': { 'ml': 240, 'l': 0.24, 'tbsp': 16, 'tsp': 48, 'fl oz': 8 },
      'tbsp': { 'ml': 14.7868, 'l': 0.0147868, 'cup': 0.0625, 'tsp': 3, 'fl oz': 0.5 },
      'tsp': { 'ml': 4.92892, 'l': 0.00492892, 'cup': 0.0208333, 'tbsp': 0.333333, 'fl oz': 0.166667 },
      'fl oz': { 'ml': 29.5735, 'l': 0.0295735, 'cup': 0.125, 'tbsp': 2, 'tsp': 6 }
    };

    // Normalize units for lookup
    const normalizedFromUnit = fromUnit.toLowerCase().replace(/[.s]$/g, '');
    const normalizedToUnit = toUnit.toLowerCase().replace(/[.s]$/g, '');
    
    // Direct conversion
    if (conversions[normalizedFromUnit]?.[normalizedToUnit]) {
      return quantity * conversions[normalizedFromUnit][normalizedToUnit];
    }
    
    // Try reverse lookup 
    if (conversions[normalizedToUnit]?.[normalizedFromUnit]) {
      return quantity / conversions[normalizedToUnit][normalizedFromUnit];
    }
    
    // Conversion not found
    return null;
  }
  
  /**
   * Determine department based on ingredient name
   */
  static getDepartmentForIngredient(ingredient: string): string {
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

  /**
   * Convert recipe ingredients to shopping list items
   * with optional package size optimization
   */
  static async ingredientsToShoppingItems(
    ingredients: Ingredient[], 
    recipeId?: string,
    usePackageSizes: boolean = true
  ): Promise<ShoppingListItem[]> {
    console.log(`Converting ${ingredients.length} ingredients to shopping items (usePackageSizes: ${usePackageSizes})`);
    
    // Get the current unit system preference from store
    const unitSystem = useUnitSystemStore.getState().unitSystem;
    
    // Process each ingredient to create a shopping list item
    const shoppingItems = await Promise.all(
      ingredients.map(async (ingredient) => {
        // Create the base shopping item
        const baseItem = this.createBaseShoppingItem(ingredient, unitSystem);
        
        // Apply package size optimization if enabled
        if (usePackageSizes) {
          try {
            const enhancedItem = await this.enhanceWithPackageSizes(baseItem);
            if (enhancedItem) {
              // Add recipe ID reference if provided
              if (recipeId) {
                enhancedItem.recipeId = recipeId;
              }
              return enhancedItem;
            }
          } catch (error) {
            console.error(`Error optimizing package sizes for ${baseItem.name}:`, error);
          }
        }
        
        // If package sizes not enabled or optimization failed, use base item
        if (recipeId) {
          baseItem.recipeId = recipeId;
        }
        return baseItem;
      })
    );
    
    return shoppingItems;
  }
  
  /**
   * Create a base shopping item from an ingredient
   */
  private static createBaseShoppingItem(
    ingredient: Ingredient, 
    unitSystem: 'metric' | 'imperial' = 'metric'
  ): ShoppingListItem {
    // Handle string ingredients
    if (typeof ingredient === 'string') {
      return {
        name: ingredient,
        quantity: 1,
        unit: '',
        checked: false,
        department: this.getDepartmentForIngredient(ingredient)
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
    
    // Convert recipe units to shopping units
    const shoppingQty = getShoppingQuantity(quantity, unit);
    
    // Create the base shopping item
    return {
      name: itemName,
      quantity: shoppingQty.qty,
      unit: shoppingQty.unit,
      checked: false,
      notes: ingredient.notes,
      department: this.getDepartmentForIngredient(itemName)
    };
  }
  
  /**
   * Enhance a shopping item with package size information
   */
  private static async enhanceWithPackageSizes(
    item: ShoppingListItem
  ): Promise<ShoppingListItem | null> {
    // Find best package size match
    const packageSizeMatch = await this.findBestPackageSize(item.name);
    
    if (packageSizeMatch) {
      // Calculate optimal purchase quantity
      const purchaseInfo = this.calculateOptimalPurchase(
        item.quantity,
        item.unit,
        packageSizeMatch
      );
      
      // Return enhanced shopping item with properly typed fields
      // Make sure we only include properties that exist in ShoppingListItem type
      return {
        ...item,
        quantity: purchaseInfo.quantity,
        unit: purchaseInfo.unit,
        shop_size_qty: purchaseInfo.quantity,
        shop_size_unit: purchaseInfo.unit,
        package_notes: packageSizeMatch.notes,
        confidence: 0.8, // Confidence score for the match
        department: packageSizeMatch.category || item.department // Use category as department if available
      };
    }
    
    return null;
  }
  
  /**
   * Format shopping list as text for clipboard
   */
  static formatShoppingListForClipboard(
    items: ShoppingListItem[], 
    unitSystem: 'metric' | 'imperial' = 'metric'
  ): string {
    // Group items by department
    const departments = this.groupItemsByDepartment(items);
    
    // Format each department
    return Object.entries(departments)
      .map(([department, deptItems]) => {
        const itemTexts = deptItems.map(item => {
          const quantityText = item.quantity ? `${item.quantity} ` : '';
          const unitText = item.unit ? `${item.unit} ` : '';
          const notesText = item.notes ? ` (${item.notes})` : '';
          
          return `${item.checked ? '[x]' : '[ ]'} ${quantityText}${unitText}${item.name}${notesText}`;
        });
        
        return `## ${department}\n${itemTexts.join('\n')}`;
      })
      .join('\n\n');
  }
  
  /**
   * Group shopping items by department
   */
  static groupItemsByDepartment(items: ShoppingListItem[]): Record<string, ShoppingListItem[]> {
    return items.reduce((acc, item) => {
      const dept = item.department || 'Other';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(item);
      return acc;
    }, {} as Record<string, ShoppingListItem[]>);
  }
}
