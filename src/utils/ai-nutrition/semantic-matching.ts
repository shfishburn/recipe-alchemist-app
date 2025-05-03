
import { generateIngredientEmbedding, findSimilarIngredients, refineContext } from './embedding-utils';

interface SemanticMatchOptions {
  threshold?: number;
  withContext?: boolean;
  maxMatches?: number;
  validateResults?: boolean;
  embeddingModel?: string; // Option to specify embedding model
}

// Define confidence levels for match results
export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';

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
      validateResults = true,
      embeddingModel = 'text-embedding-ada-002' // Default to ada-002 model
    } = options;
    
    // Structured logging for debugging
    const requestId = `match-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(JSON.stringify({
      event: 'ingredient_match_request',
      request_id: requestId,
      ingredient: ingredientText,
      model: embeddingModel,
      with_context: withContext,
      timestamp: new Date().toISOString()
    }));
    
    // Refine the context for better results
    const optimizedContext = withContext ? refineContext(recipeContext) : undefined;
    
    // Start with the ingredient alone for better embedding
    const embedding = await generateIngredientEmbedding(
      ingredientText,
      optimizedContext,
      { model: embeddingModel }
    );
    
    if (!embedding || embedding.length === 0) {
      console.warn('Failed to generate embedding for:', ingredientText);
      return {
        matches: [],
        error: 'Failed to generate ingredient embedding',
        embeddingModel,
        requestId,
        confidenceLevel: 'Low' as ConfidenceLevel
      };
    }
    
    // Find similar ingredients using vector similarity search
    const matches = await findSimilarIngredients(embedding, threshold, maxMatches);
    
    // Validate and enhance matches if requested to ensure reasonable values
    const enhancedMatches = validateResults ? enhanceMatches(matches, ingredientText) : matches;
    
    // Calculate overall confidence level
    const confidenceLevel = calculateOverallConfidence(enhancedMatches);
    
    // Enhanced structured logging for results
    console.log(JSON.stringify({
      event: 'ingredient_match_results',
      request_id: requestId,
      ingredient: ingredientText,
      model: embeddingModel,
      match_count: enhancedMatches.length,
      confidence_level: confidenceLevel,
      top_match: enhancedMatches.length > 0 ? 
        {name: enhancedMatches[0].food_name, score: enhancedMatches[0].similarity_score} : null,
      timestamp: new Date().toISOString()
    }));
    
    return {
      matches: enhancedMatches,
      embedding,
      query: ingredientText,
      embeddingModel,
      requestId,
      confidenceLevel,
      context: optimizedContext
    };
  } catch (error) {
    console.error('Semantic ingredient matching error:', error);
    return {
      matches: [],
      error: String(error),
      embeddingModel: options.embeddingModel || 'text-embedding-ada-002',
      confidenceLevel: 'Low' as ConfidenceLevel
    };
  }
}

/**
 * Enhanced match validation with intelligent filtering and confidence scoring
 */
function enhanceMatches(matches: any[], ingredientText: string): any[] {
  if (!matches || matches.length === 0) return [];
  
  return matches.map(match => {
    // Calculate confidence score based on multiple factors
    const confidenceLevel = calculateMatchConfidence(match, ingredientText);
    
    // Add domain-specific validation
    const nutritionallyValid = validateNutritionalValues(match);
    const culinaryValid = validateCulinaryLogic(match, ingredientText);
    
    // Add these fields to the match object
    return {
      ...match,
      confidence_level: confidenceLevel,
      confidence_details: {
        nutritionally_valid: nutritionallyValid,
        culinarily_valid: culinaryValid
      }
    };
  }).filter(match => {
    // Filter out matches with unreasonably high calorie counts or negative values
    if (match.nutrition && match.nutrition.calories > 1000) {
      console.warn(`Filtered out match for "${ingredientText}" with unreasonable calories: ${match.food_name} (${match.nutrition.calories} kcal)`);
      return false;
    }
    
    // Filter out matches with very low similarity scores
    if (match.similarity_score < 0.6) {
      console.warn(`Filtered out low confidence match for "${ingredientText}": ${match.food_name} (score: ${match.similarity_score})`);
      return false;
    }
    
    // Remove matches that fail domain-specific validation
    if (!match.confidence_details.nutritionally_valid || 
        !match.confidence_details.culinarily_valid) {
      console.warn(`Filtered out invalid match for "${ingredientText}": ${match.food_name} (nutritionally_valid: ${match.confidence_details.nutritionally_valid}, culinarily_valid: ${match.confidence_details.culinarily_valid})`);
      return false;
    }
    
    return true;
  });
}

/**
 * Calculate confidence level for a specific match
 */
function calculateMatchConfidence(match: any, ingredientText: string): ConfidenceLevel {
  // Base confidence on similarity score
  if (match.similarity_score > 0.9) {
    return 'High';
  } else if (match.similarity_score > 0.75) {
    return 'Moderate';
  } else {
    return 'Low';
  }
}

/**
 * Validate nutritional values for a match
 */
function validateNutritionalValues(match: any): boolean {
  // Basic validation of nutritional values
  if (!match.nutrition) return true;
  
  const nutrition = match.nutrition;
  
  // Check for negative values
  if (nutrition.calories < 0 || 
      nutrition.protein_g < 0 || 
      nutrition.carbs_g < 0 || 
      nutrition.fat_g < 0) {
    return false;
  }
  
  // Check for unreasonable values
  if (nutrition.calories > 900 && // Very high calorie ingredients are rare
      (nutrition.protein_g + nutrition.carbs_g + nutrition.fat_g) < 50) { // Macronutrients should add up reasonably
    return false;
  }
  
  // Check for potential data entry errors
  if (nutrition.protein_g > 100 || nutrition.carbs_g > 100 || nutrition.fat_g > 100) {
    // Very few natural ingredients have more than 100g of a macronutrient per 100g
    return false;
  }
  
  return true;
}

/**
 * Apply culinary logic to validate a match
 */
function validateCulinaryLogic(match: any, ingredientText: string): boolean {
  // Convert to lowercase for consistent comparison
  const matchName = match.food_name.toLowerCase();
  const ingredient = ingredientText.toLowerCase();
  
  // Avoid crossing food categories
  const categories = {
    meat: ['beef', 'chicken', 'pork', 'lamb', 'steak', 'meat', 'poultry'],
    seafood: ['fish', 'salmon', 'tuna', 'shrimp', 'seafood', 'crab'],
    dairy: ['milk', 'cheese', 'yogurt', 'cream'],
    fruit: ['apple', 'banana', 'berry', 'berries', 'fruit'],
    vegetable: ['vegetable', 'carrot', 'broccoli', 'spinach'],
    grain: ['rice', 'pasta', 'bread', 'grain', 'flour']
  };
  
  // Detect category of ingredient text and match name
  let ingredientCategory = '';
  let matchCategory = '';
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => ingredient.includes(keyword))) {
      ingredientCategory = category;
    }
    if (keywords.some(keyword => matchName.includes(keyword))) {
      matchCategory = category;
    }
  }
  
  // If both have detected categories and they differ, this is likely a bad match
  if (ingredientCategory && matchCategory && ingredientCategory !== matchCategory) {
    return false;
  }
  
  return true;
}

/**
 * Calculate overall confidence level for a set of matches
 */
function calculateOverallConfidence(matches: any[]): ConfidenceLevel {
  if (matches.length === 0) return 'Low';
  
  // Count matches by confidence level
  const counts = {
    High: 0,
    Moderate: 0,
    Low: 0
  };
  
  matches.forEach(match => {
    counts[match.confidence_level as ConfidenceLevel]++;
  });
  
  // Determine overall confidence based on top match and distribution
  if (matches[0]?.confidence_level === 'High' && matches.length >= 2) {
    return 'High';
  } else if (matches[0]?.confidence_level === 'High' || counts.Moderate >= 2) {
    return 'Moderate';
  } else {
    return 'Low';
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
  },
  options: SemanticMatchOptions = {}
) {
  const results: Record<string, any> = {};
  
  // We'll process in batches of 3 to avoid rate limiting
  const batchSize = 3;
  
  for (let i = 0; i < ingredients.length; i += batchSize) {
    const batch = ingredients.slice(i, i + batchSize);
    
    // Process batch concurrently
    const batchResults = await Promise.all(
      batch.map(ingredient => 
        semanticIngredientMatch(ingredient, recipeContext, options)
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
