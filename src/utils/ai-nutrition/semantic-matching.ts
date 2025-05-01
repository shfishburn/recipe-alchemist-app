
import { generateIngredientEmbedding, findSimilarIngredients } from './embedding-utils';

interface SemanticMatchOptions {
  threshold?: number;
  withContext?: boolean;
  maxMatches?: number;
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
      maxMatches = 3
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
    
    // Enhanced logging for debugging
    if (matches.length > 0) {
      console.log(`Semantic match results for "${ingredientText}":`, 
        matches.map(m => `${m.food_name} (${m.similarity_score.toFixed(2)})`).join(', ')
      );
    } else {
      console.warn(`No semantic matches found for "${ingredientText}"`);
    }
    
    return {
      matches,
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
