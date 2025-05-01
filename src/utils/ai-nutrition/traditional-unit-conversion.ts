
/**
 * Traditional unit conversion methods (fallback from ML-based approach)
 * Based on the existing unit-conversion logic but with some improvements
 */

// Import the existing conversion tables
import { WEIGHT_CONVERSIONS } from '../../../supabase/functions/nutrisynth-analysis/unit-conversion';

/**
 * Convert ingredient quantity to grams using traditional method
 * 
 * @param qty Quantity value
 * @param unit Unit of measurement
 * @param ingredientName Name of the ingredient
 * @returns The calculated weight in grams
 */
export function convertToGramsTraditional(
  qty: number,
  unit: string,
  ingredientName: string
): number {
  // Normalize inputs
  const normalizedUnit = unit.toLowerCase().trim();
  const normalizedName = ingredientName.toLowerCase().trim();
  
  // Determine the best conversion category based on the ingredient name
  const category = getConversionCategory(normalizedName);
  
  // Get conversion factors from the appropriate category
  const categoryFactors = WEIGHT_CONVERSIONS[category] || WEIGHT_CONVERSIONS.general;
  
  // Get the conversion factor for the unit
  const conversionFactor = categoryFactors[normalizedUnit] || 1;
  
  // Calculate grams and ensure positive value
  const grams = Math.max(0, qty * conversionFactor);
  
  console.log(`Traditional conversion: ${qty} ${normalizedUnit} of ${normalizedName} = ${grams}g (category: ${category})`);
  
  return grams;
}

/**
 * Determine the best conversion category based on ingredient name
 * Enhanced version of the getConversionCategory function in unit-conversion.ts
 * 
 * @param ingredientName Name of the ingredient
 * @returns The best matching conversion category
 */
function getConversionCategory(ingredientName: string): string {
  // Simplified check for common categories
  const lowerName = ingredientName.toLowerCase();
  
  // Spices and herbs
  if (lowerName.includes('spice') || lowerName.includes('powder') || 
      lowerName.includes('salt') || lowerName.includes('pepper')) {
    return 'spices';
  }
  
  // Fresh herbs
  if (lowerName.includes('basil') || lowerName.includes('parsley') || 
      lowerName.includes('mint') || lowerName.includes('cilantro') || 
      lowerName.includes('herb') && !lowerName.includes('dried')) {
    return 'herbs_fresh';
  }
  
  // Dried herbs
  if ((lowerName.includes('herb') && lowerName.includes('dried')) || 
      lowerName.includes('dried oregano') || lowerName.includes('dried basil')) {
    return 'herbs_dried';
  }
  
  // Oils
  if (lowerName.includes('oil')) {
    return 'oils';
  }
  
  // Flour
  if (lowerName.includes('flour')) {
    return 'flour';
  }
  
  // Sugar
  if (lowerName.includes('sugar') || lowerName.includes('sweetener')) {
    return 'sugar';
  }
  
  // Rice
  if (lowerName.includes('rice') && lowerName.includes('cooked')) {
    return 'rice_cooked';
  }
  
  if (lowerName.includes('rice')) {
    return 'rice_uncooked';
  }
  
  // Vegetables
  if (lowerName.includes('vegetable') || lowerName.includes('carrot') || 
      lowerName.includes('onion') || lowerName.includes('celery') || 
      lowerName.includes('pepper') || lowerName.includes('broccoli')) {
    return 'vegetables';
  }
  
  // Fruits
  if (lowerName.includes('fruit') || lowerName.includes('apple') || 
      lowerName.includes('banana') || lowerName.includes('orange') || 
      lowerName.includes('berry')) {
    return 'fruits';
  }
  
  // Cheese
  if (lowerName.includes('cheese') && 
      (lowerName.includes('shredded') || lowerName.includes('grated'))) {
    return 'cheese_shredded';
  }
  
  if (lowerName.includes('cheese')) {
    return 'cheese_cubed';
  }
  
  // Nuts
  if (lowerName.includes('nut') || lowerName.includes('almond') || 
      lowerName.includes('walnut') || lowerName.includes('pecan')) {
    return 'nuts';
  }
  
  // Meat
  if (lowerName.includes('meat') || lowerName.includes('beef') || 
      lowerName.includes('chicken') || lowerName.includes('pork') || 
      lowerName.includes('fish')) {
    return 'meat';
  }
  
  // Liquids
  if (lowerName.includes('milk') || lowerName.includes('cream') || 
      lowerName.includes('yogurt')) {
    return 'liquid_dairy';
  }
  
  // Sweeteners
  if (lowerName.includes('honey') || lowerName.includes('syrup') || 
      lowerName.includes('molasses')) {
    return 'sweeteners';
  }
  
  // Condiments
  if (lowerName.includes('sauce') || lowerName.includes('ketchup') || 
      lowerName.includes('mustard') || lowerName.includes('dressing')) {
    return 'condiments';
  }
  
  // Legumes
  if (lowerName.includes('bean') || lowerName.includes('lentil') || 
      lowerName.includes('chickpea')) {
    return 'legumes';
  }
  
  // Pasta
  if (lowerName.includes('pasta') && lowerName.includes('cooked')) {
    return 'pasta_cooked';
  }
  
  if (lowerName.includes('pasta')) {
    return 'pasta_dry';
  }
  
  // Bread
  if (lowerName.includes('bread') || lowerName.includes('toast') || 
      lowerName.includes('roll') || lowerName.includes('bun')) {
    return 'bread';
  }
  
  // Default to general if no specific category matches
  return 'general';
}
