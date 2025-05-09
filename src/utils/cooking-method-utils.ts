
import { supabase } from "@/integrations/supabase/client";

// Cooking method types
export const COOKING_METHODS = [
  'bake', 
  'boil', 
  'braise', 
  'fry', 
  'grill', 
  'roast', 
  'sauté', 
  'steam', 
  'slow cook', 
  'raw'
] as const;

export type CookingMethod = typeof COOKING_METHODS[number];

// Basic classification function to normalize cooking methods
export function classifyCookingMethod(instruction: string): CookingMethod {
  const methodLower = instruction.toLowerCase();
  
  if (methodLower.includes('bake') || methodLower.includes('oven')) return 'bake';
  if (methodLower.includes('boil')) return 'boil';
  if (methodLower.includes('braise')) return 'braise';
  if (methodLower.includes('fry') || methodLower.includes('sauté') || methodLower.includes('saute')) return 'fry';
  if (methodLower.includes('grill')) return 'grill';
  if (methodLower.includes('roast')) return 'roast';
  if (methodLower.includes('steam')) return 'steam';
  if (methodLower.includes('slow cook') || methodLower.includes('slow-cook') || methodLower.includes('crock pot')) return 'slow cook';
  if (methodLower.includes('raw') || methodLower.includes('uncooked')) return 'raw';
  
  // Default to the most common method if no match
  return 'bake';
}

// Save cooking method classification to database
export async function saveCookingMethodClassification(
  instruction: string,
  method: CookingMethod,
  confidence: number = 0.8
) {
  const { error } = await supabase
    .from('cooking_method_classifications')
    .insert({
      instruction_text: instruction,
      normalized_method: method,
      confidence_score: confidence,
      classified_by: 'client'
    });
    
  if (error) {
    console.error('Failed to save cooking method:', error);
    return false;
  }
  
  return true;
}

// Look up cooking method from database first, then fallback to classification
export async function getCookingMethod(instruction: string): Promise<CookingMethod> {
  try {
    // First check if we already have this instruction in the database
    const { data, error } = await supabase
      .from('cooking_method_classifications')
      .select('normalized_method')
      .ilike('instruction_text', instruction)
      .order('confidence_score', { ascending: false })
      .maybeSingle();
      
    if (error) throw error;
    
    if (data?.normalized_method) {
      return data.normalized_method as CookingMethod;
    }
    
    // If not found, use our basic classifier
    return classifyCookingMethod(instruction);
  } catch (error) {
    console.error('Error getting cooking method:', error);
    return classifyCookingMethod(instruction);
  }
}
