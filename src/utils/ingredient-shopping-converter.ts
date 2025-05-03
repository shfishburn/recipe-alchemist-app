
import { Ingredient } from '@/types/recipe';
import { ShoppingListItem } from '@/types/shopping-list';
import { getShoppingQuantity } from '@/utils/unit-conversion';
import { useUnitSystemStore } from '@/stores/unitSystem';
import { AIShoppingConverter, convertIngredientsWithAI } from '@/services/aiShoppingConverter';
import { PackageSizeService } from '@/services/package-size-service';

/**
 * Converts recipe ingredients to shopping list items
 * Now with database-driven package size optimization
 */
export async function recipeIngredientsToShoppingItems(
  ingredients: Ingredient[], 
  recipeId?: string,
  usePackageSizes: boolean = true
): Promise<ShoppingListItem[]> {
  console.log("Converting recipe ingredients to shopping items:", ingredients);
  
  try {
    // Use the AI converter for better shopping quantities if package sizes are enabled
    if (usePackageSizes) {
      const aiItems = await convertIngredientsWithAI(ingredients);
      console.log("AI converted shopping items:", aiItems);
      
      // Add recipe ID to each item
      const itemsWithRecipeId = aiItems.map(item => ({
        ...item,
        recipeId: recipeId
      }));
      
      return itemsWithRecipeId;
    } else {
      // If package sizes are disabled, use basic conversion
      return basicIngredientsToShoppingItems(ingredients, recipeId);
    }
  } catch (error) {
    console.warn("AI conversion failed, falling back to basic conversion:", error);
    return basicIngredientsToShoppingItems(ingredients, recipeId);
  }
}

/**
 * Basic conversion method as fallback
 */
function basicIngredientsToShoppingItems(
  ingredients: Ingredient[], 
  recipeId?: string
): ShoppingListItem[] {
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
      recipeId: recipeId,
      // Include shop size fields if we have them
      shop_size_qty: shoppingQty.qty,
      shop_size_unit: shoppingQty.unit
    };
  });
}

/**
 * Helper function to determine department based on ingredient name
 */
export function getDepartmentForIngredient(ingredient: string): string {
  return AIShoppingConverter.guessDepartment(ingredient);
}
