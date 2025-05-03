
import { groceryPackageSizes, type GroceryPackageSize } from '@/data/groceryPackageSizes';
import { getShoppingQuantity } from '@/utils/unit-conversion';
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
          // Find the best match in our database with enhanced matching
          const match = AIShoppingConverter.findBestMatch(ingredient);
          let shopItem: ShoppingListItem;
          
          if (match) {
            const confidence = match.confidence || 0.8;
            
            // Calculate purchase quantity based on package sizes
            const purchaseInfo = AIShoppingConverter.calculateOptimalPurchase(
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
   * Find the best match for an ingredient in the database
   * Enhanced with fuzzy matching and confidence scoring
   */
  static findBestMatch(ingredient: RecipeIngredient): (GroceryPackageSize & { confidence: number }) | null {
    const itemName = typeof ingredient.item === 'string' ? ingredient.item.toLowerCase() : '';
    
    // Empty string check
    if (!itemName) return null;
    
    // Direct match (exact ingredient name)
    const directMatch = AIShoppingConverter.database.find(
      item => item.ingredient.toLowerCase() === itemName
    );
    
    if (directMatch) {
      return { ...directMatch, confidence: 1.0 };  // 100% confidence for exact match
    }
    
    // Partial word matching using similarity scoring
    const matches = AIShoppingConverter.database.map(item => {
      const similarity = AIShoppingConverter.calculateSimilarity(
        itemName, 
        item.ingredient.toLowerCase()
      );
      return { item, similarity };
    });
    
    // Sort by similarity score (highest first)
    matches.sort((a, b) => b.similarity - a.similarity);
    
    // Get the best match if it passes our threshold
    if (matches.length > 0 && matches[0].similarity > 0.7) {
      return { ...matches[0].item, confidence: matches[0].similarity };
    }
    
    // Check for ingredient as a substring
    const containsMatch = AIShoppingConverter.database.find(item => 
      itemName.includes(item.ingredient.toLowerCase()) || 
      item.ingredient.toLowerCase().includes(itemName)
    );
    
    if (containsMatch) {
      // If it's a contains match, assign 80% confidence
      return { ...containsMatch, confidence: 0.8 };
    }
    
    // No match found above thresholds
    return null;
  }
  
  /**
   * Calculate similarity between two strings
   * Simple implementation of word similarity
   */
  static calculateSimilarity(str1: string, str2: string): number {
    // Basic normalization
    const a = str1.toLowerCase().trim();
    const b = str2.toLowerCase().trim();
    
    // Quick exact match check
    if (a === b) return 1.0;
    
    // Check for entirely contained strings
    if (a.includes(b)) return 0.9;
    if (b.includes(a)) return 0.9;
    
    // Simple word overlap similarity
    const wordsA = a.split(/\W+/).filter(word => word.length > 1);
    const wordsB = b.split(/\W+/).filter(word => word.length > 1);
    
    // Count matching words
    const matchingWords = wordsA.filter(word => wordsB.includes(word)).length;
    
    // Calculate Jaccard similarity
    const uniqueWords = new Set([...wordsA, ...wordsB]);
    return matchingWords / uniqueWords.size;
  }
  
  /**
   * Calculate optimal purchase size and quantities
   * Enhanced to handle unit conversion and multiple packages
   */
  static calculateOptimalPurchase(
    neededQty: number = 0,
    neededUnit: string = '',
    matchedItem: GroceryPackageSize
  ): { quantity: number; unit: string; packages: number; packageSize: number } {
    // Default values
    if (neededQty <= 0) {
      return {
        quantity: 1,
        unit: matchedItem.package_unit,
        packages: 1,
        packageSize: matchedItem.package_sizes[0] || 1
      };
    }
    
    // Convert units if needed
    let convertedQty = neededQty;
    let needsUnitConversion = neededUnit !== matchedItem.package_unit;
    
    if (needsUnitConversion) {
      // Try to perform unit conversion
      const conversion = AIShoppingConverter.convertUnits(
        neededQty, 
        neededUnit, 
        matchedItem.package_unit,
        matchedItem.ingredient
      );
      
      if (conversion) {
        convertedQty = conversion;
      } else {
        // If we can't convert, fall back to original quantity
        // but use package units
        console.log(`Could not convert ${neededQty} ${neededUnit} to ${matchedItem.package_unit} for ${matchedItem.ingredient}`);
      }
    }
    
    // Find optimal package combination
    const { packageSize, packages } = AIShoppingConverter.findOptimalPackageCombination(
      convertedQty,
      matchedItem.package_sizes
    );
    
    // Calculate total quantity to buy
    const totalQuantity = packageSize * packages;
    
    return {
      quantity: totalQuantity, 
      unit: matchedItem.package_unit,
      packages,
      packageSize
    };
  }
  
  /**
   * Find the optimal combination of packages to buy
   */
  static findOptimalPackageCombination(
    neededQuantity: number,
    availableSizes: number[]
  ): { packageSize: number; packages: number } {
    // No sizes available
    if (!availableSizes.length) {
      return { packageSize: neededQuantity, packages: 1 };
    }
    
    // Sort package sizes from smallest to largest
    const sortedSizes = [...availableSizes].sort((a, b) => a - b);
    
    // Check if we can get a single package that satisfies the need
    for (const size of sortedSizes) {
      if (size >= neededQuantity) {
        return { packageSize: size, packages: 1 };
      }
    }
    
    // Find best option with multiple packages
    const largestSize = sortedSizes[sortedSizes.length - 1];
    
    // Default to the largest package with enough packages to fulfill the need
    const packages = Math.ceil(neededQuantity / largestSize);
    
    // For very small quantities where multiple small packages might be better
    // than a single large one, we could implement logic here
    
    return { packageSize: largestSize, packages };
  }
  
  /**
   * Convert units between different measurement systems
   */
  static convertUnits(
    qty: number,
    fromUnit: string,
    toUnit: string,
    ingredientName: string
  ): number | null {
    // Normalize unit strings
    fromUnit = fromUnit.toLowerCase().trim();
    toUnit = toUnit.toLowerCase().trim();
    
    // No conversion needed for same units
    if (fromUnit === toUnit) return qty;
    
    // Common weight conversions
    const weightConversions: Record<string, Record<string, number>> = {
      'g': { 'oz': 0.035274, 'lb': 0.00220462, 'kg': 0.001 },
      'oz': { 'g': 28.3495, 'lb': 0.0625, 'kg': 0.0283495 },
      'lb': { 'g': 453.592, 'oz': 16, 'kg': 0.453592 },
      'kg': { 'g': 1000, 'oz': 35.274, 'lb': 2.20462 }
    };
    
    // Common volume conversions
    const volumeConversions: Record<string, Record<string, number>> = {
      'ml': { 'l': 0.001, 'fl oz': 0.033814, 'cup': 0.00422675, 'pint': 0.00211338, 'quart': 0.00105669, 'gallon': 0.000264172 },
      'l': { 'ml': 1000, 'fl oz': 33.814, 'cup': 4.22675, 'pint': 2.11338, 'quart': 1.05669, 'gallon': 0.264172 },
      'fl oz': { 'ml': 29.5735, 'l': 0.0295735, 'cup': 0.125, 'pint': 0.0625, 'quart': 0.03125, 'gallon': 0.0078125 },
      'cup': { 'ml': 236.588, 'l': 0.236588, 'fl oz': 8, 'pint': 0.5, 'quart': 0.25, 'gallon': 0.0625 },
      'pint': { 'ml': 473.176, 'l': 0.473176, 'fl oz': 16, 'cup': 2, 'quart': 0.5, 'gallon': 0.125 },
      'quart': { 'ml': 946.353, 'l': 0.946353, 'fl oz': 32, 'cup': 4, 'pint': 2, 'gallon': 0.25 },
      'gallon': { 'ml': 3785.41, 'l': 3.78541, 'fl oz': 128, 'cup': 16, 'pint': 8, 'quart': 4 }
    };
    
    // Handle weight conversions
    if (fromUnit in weightConversions && toUnit in weightConversions[fromUnit]) {
      return qty * weightConversions[fromUnit][toUnit];
    }
    
    // Handle volume conversions
    if (fromUnit in volumeConversions && toUnit in volumeConversions[fromUnit]) {
      return qty * volumeConversions[fromUnit][toUnit];
    }
    
    // Handle some common food-specific conversions
    const specificConversions: Record<string, Record<string, Record<string, number>>> = {
      'sugar': {
        'cup': { 'g': 200, 'oz': 7.05 },
        'tbsp': { 'g': 12.5, 'oz': 0.44 }
      },
      'flour': {
        'cup': { 'g': 125, 'oz': 4.41 },
        'tbsp': { 'g': 7.8, 'oz': 0.275 }
      },
      'rice': {
        'cup': { 'g': 180, 'oz': 6.35 }
      },
      'milk': {
        'cup': { 'ml': 240, 'l': 0.24 }
      }
    };
    
    // Look for ingredient-specific conversions
    for (const [ingredient, conversions] of Object.entries(specificConversions)) {
      if (ingredientName.toLowerCase().includes(ingredient)) {
        if (fromUnit in conversions && toUnit in conversions[fromUnit]) {
          return qty * conversions[fromUnit][toUnit];
        }
        
        // Try reverse lookup
        for (const [fu, tu] of Object.entries(conversions)) {
          if (toUnit in tu && fromUnit === Object.keys(tu)[0]) {
            return qty / tu[toUnit];
          }
        }
      }
    }
    
    // Could not determine conversion
    return null;
  }
  
  /**
   * Guess the department based on ingredient name
   * Enhanced with more categories and better matching
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
