
import { supabase } from '@/integrations/supabase/client';
import type { GroceryPackageSize } from '@/hooks/use-grocery-package-sizes';
import { Ingredient } from '@/types/recipe';

/**
 * Service for handling grocery package size optimizations
 */
export class PackageSizeService {
  /**
   * Finds the best matching package size for an ingredient
   */
  static async findBestMatch(ingredient: string): Promise<GroceryPackageSize | null> {
    try {
      // Normalize ingredient name for better matching
      const normalizedIngredient = ingredient.toLowerCase().trim();
      
      // First try direct match
      const { data: directMatches } = await supabase
        .from('grocery_package_sizes')
        .select('*')
        .ilike('ingredient', normalizedIngredient);
      
      if (directMatches && directMatches.length > 0) {
        // Ensure package_sizes is typed as number[]
        const match = directMatches[0];
        return {
          ...match,
          package_sizes: Array.isArray(match.package_sizes) ? match.package_sizes : []
        };
      }
      
      // Try partial match - ingredient contains the database entry
      const { data: partialMatches } = await supabase
        .from('grocery_package_sizes')
        .select('*')
        .filter('ingredient', 'in', `(${normalizedIngredient})`);
      
      if (partialMatches && partialMatches.length > 0) {
        const match = partialMatches[0];
        return {
          ...match,
          package_sizes: Array.isArray(match.package_sizes) ? match.package_sizes : []
        };
      }
      
      // Try searching for any part of the ingredient
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
            const match = wordMatches[0];
            return {
              ...match,
              package_sizes: Array.isArray(match.package_sizes) ? match.package_sizes : []
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error finding package size match:', error);
      return null;
    }
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
      // TODO: Implement unit conversions
      // For now, just use the package sizes as is
      console.log(`Unit conversion needed: ${neededQty} ${neededUnit} to ${packageSize.package_unit}`);
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
    const largestSize = sortedSizes[sortedSizes.length - 1];
    const packages = Math.ceil(convertedQty / largestSize);
    
    return { 
      quantity: largestSize * packages, 
      unit: packageSize.package_unit,
      packages,
      packageSize: largestSize
    };
  }
}
