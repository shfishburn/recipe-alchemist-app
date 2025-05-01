
/**
 * ML-enhanced unit conversion for ingredients
 */

import { supabase } from '@/integrations/supabase/client';

// Interface for conversion results
interface ConversionResult {
  grams: number;
  confidence: number;
  method: string;
}

// Cache for storing commonly used conversions
const conversionCache = new Map<string, ConversionResult>();

/**
 * Convert an ingredient quantity to grams using ML-enhanced methods
 * 
 * @param qty Quantity value
 * @param unit Unit of measurement
 * @param ingredientName Name of the ingredient
 * @returns Promise resolving to conversion result with confidence score
 */
export async function convertToGramsEnhanced(
  qty: number,
  unit: string,
  ingredientName: string
): Promise<ConversionResult> {
  // Normalize inputs
  const normalizedUnit = unit.toLowerCase().trim();
  const normalizedName = ingredientName.toLowerCase().trim();
  
  // Check cache first
  const cacheKey = `${normalizedName}:${qty}:${normalizedUnit}`;
  if (conversionCache.has(cacheKey)) {
    return conversionCache.get(cacheKey)!;
  }
  
  try {
    // Use edge function for ML-based conversion
    const { data, error } = await supabase.functions.invoke('convert-units', {
      body: { 
        quantity: qty,
        unit: normalizedUnit,
        ingredient: normalizedName
      }
    });
    
    if (error) {
      throw new Error(`Unit conversion error: ${error.message}`);
    }
    
    // Store in cache
    conversionCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Enhanced unit conversion failed:', error);
    
    // Fall back to traditional conversion using the WEIGHT_CONVERSIONS
    // Import from separate file to avoid making this file too long
    const { convertToGramsTraditional } = await import('./traditional-unit-conversion');
    const fallbackResult = convertToGramsTraditional(qty, normalizedUnit, normalizedName);
    
    return {
      grams: fallbackResult,
      confidence: 0.7, // Lower confidence for traditional method
      method: 'traditional_fallback'
    };
  }
}

/**
 * Get ingredient density factor (g/ml) using ML prediction or lookup
 * 
 * @param ingredientName Name of the ingredient
 * @returns Promise resolving to density factor and confidence
 */
export async function getIngredientDensity(ingredientName: string): Promise<{
  densityFactor: number;
  confidence: number;
}> {
  try {
    // First try the database for known density values
    const { data: dbData, error: dbError } = await supabase
      .from('usda_unit_conversions')
      .select('conversion_factor, notes')
      .eq('food_category', ingredientName)
      .eq('from_unit', 'ml')
      .eq('to_unit', 'g')
      .maybeSingle();
    
    if (dbData) {
      return {
        densityFactor: dbData.conversion_factor,
        confidence: 0.95 // High confidence for database values
      };
    }
    
    // Fall back to ML prediction
    const { data, error } = await supabase.functions.invoke('predict-density', {
      body: { ingredient: ingredientName }
    });
    
    if (error) {
      throw new Error(`Density prediction error: ${error.message}`);
    }
    
    return {
      densityFactor: data.density,
      confidence: data.confidence
    };
  } catch (error) {
    console.error('Density prediction failed:', error);
    
    // Default fallback based on ingredient type
    const lowerName = ingredientName.toLowerCase();
    
    // Liquids are around 1g/ml (water density)
    if (lowerName.includes('oil') || lowerName.includes('milk') || 
        lowerName.includes('juice') || lowerName.includes('water')) {
      return { densityFactor: 1.0, confidence: 0.8 };
    }
    
    // Powders have variable density
    if (lowerName.includes('flour') || lowerName.includes('sugar') || 
        lowerName.includes('powder') || lowerName.includes('spice')) {
      return { densityFactor: 0.6, confidence: 0.5 };
    }
    
    // Default fallback
    return { densityFactor: 0.8, confidence: 0.3 };
  }
}
