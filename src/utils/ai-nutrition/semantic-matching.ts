
import { generateIngredientEmbedding, findSimilarIngredients } from './embedding-utils';

interface SemanticMatchOptions {
  threshold?: number;
  withContext?: boolean;
  maxMatches?: number;
  validateResults?: boolean;  // Add validation option
}

/**
 * Enhanced semantic ingredient matching with flexible context integration
 * 
 * @param ingredientText The ingredient text to analyze
 * @param recipeContext Optional context about the recipe
 * @param options Configuration options
 * @returns Promise resolving to matched ingredient data
 */
export async function semanticIngredientMatch(
  ingredientText: string,
  recipeContext?: {
    title?: string;
    cuisine?: string;
    cookingMethod?: string;
    otherIngredients?: string[]; // Other ingredients for context
  },
  options: SemanticMatchOptions = {}
) {
  try {
    // Default options
    const {
      threshold = 0.78,
      withContext = true,
      maxMatches = 3,
      validateResults = true
    } = options;
    
    // Start with the ingredient alone for better embedding
    const embedding = await generateIngredientEmbedding(
      ingredientText,
      withContext ? recipeContext : undefined
    );
    
    if (!embedding || embedding.length === 0) {
      console.warn('Failed to generate embedding for:', ingredientText);
      return {
        matches: [],
        error: 'Failed to generate ingredient embedding'
      };
    }
    
    // Find similar ingredients using vector similarity search
    const matches = await findSimilarIngredients(embedding, threshold, maxMatches);
    
    // Validate matches if requested to ensure reasonable values
    const validatedMatches = validateResults ? validateMatches(matches, ingredientText) : matches;
    
    // Enhanced logging for debugging
    if (validatedMatches.length > 0) {
      console.log(`Semantic match results for "${ingredientText}":`, 
        validatedMatches.map(m => `${m.food_name} (${m.similarity_score.toFixed(2)})`).join(', ')
      );
    } else {
      console.warn(`No semantic matches found for "${ingredientText}"`);
    }
    
    return {
      matches: validatedMatches,
      embedding,
      query: ingredientText
    };
  } catch (error) {
    console.error('Semantic ingredient matching error:', error);
    return {
      matches: [],
      error: String(error)
    };
  }
}

/**
 * Validate matches to ensure they make nutritional sense
 */
function validateMatches(matches: any[], ingredientText: string): any[] {
  if (!matches || matches.length === 0) return [];
  
  return matches.filter(match => {
    // Skip matches with unreasonably high calorie counts or negative values
    if (match.nutrition && match.nutrition.calories > 1000) {
      console.warn(`Filtered out match for "${ingredientText}" with unreasonable calories: ${match.food_name} (${match.nutrition.calories} kcal)`);
      return false;
    }
    
    // Filter out matches with very low similarity scores
    if (match.similarity_score < 0.6) {
      console.warn(`Filtered out low confidence match for "${ingredientText}": ${match.food_name} (score: ${match.similarity_score})`);
      return false;
    }
    
    return true;
  });
}

/**
 * Batch process multiple ingredients for semantic matching
 * 
 * @param ingredients List of ingredients to match
 * @param recipeContext Optional context about the recipe
 * @returns Promise resolving to matched ingredients
 */
export async function batchSemanticMatch(
  ingredients: string[],
  recipeContext?: {
    title?: string;
    cuisine?: string;
    cookingMethod?: string;
  }
) {
  const results: Record<string, any> = {};
  
  // We'll process in batches of 3 to avoid rate limiting
  const batchSize = 3;
  
  for (let i = 0; i < ingredients.length; i += batchSize) {
    const batch = ingredients.slice(i, i + batchSize);
    
    // Process batch concurrently
    const batchResults = await Promise.all(
      batch.map(ingredient => 
        semanticIngredientMatch(ingredient, recipeContext)
          .then(result => ({ ingredient, result }))
      )
    );
    
    // Add batch results to overall results
    batchResults.forEach(({ ingredient, result }) => {
      results[ingredient] = result;
    });
    
    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < ingredients.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}
