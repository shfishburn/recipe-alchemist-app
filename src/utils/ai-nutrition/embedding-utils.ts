import { supabase } from '@/integrations/supabase/client';

interface EmbeddingOptions {
  withContext?: boolean;
  maxTokens?: number;
  model?: string;
  temperature?: number;
}

/**
 * Generate embeddings for ingredient text
 */
export async function generateIngredientEmbedding(
  ingredientText: string,
  context?: any,
  options: EmbeddingOptions = {}
): Promise<number[]> {
  if (!ingredientText || typeof ingredientText !== 'string') {
    console.error('Invalid ingredient text:', ingredientText);
    return [];
  }

  try {
    // Clean up the input text
    const cleanedText = ingredientText.trim();

    // Make an API call to generate embedding
    const response = await supabase.functions.invoke('generate-embedding', {
      body: { 
        text: cleanedText,
        context,
        model: options.model || 'text-embedding-ada-002'  // Allow model override
      }
    });

    if (response.error) {
      throw new Error(`Embedding API error: ${response.error.message || 'Unknown error'}`);
    }

    // Return the generated embedding
    return response.data?.embedding || [];
  } catch (error) {
    console.error('Error generating ingredient embedding:', error);
    return [];
  }
}

/**
 * Find similar ingredients using vector similarity search
 */
export async function findSimilarIngredients(
  embedding: number[],
  threshold: number = 0.78,
  maxMatches: number = 5
): Promise<any[]> {
  if (!embedding || embedding.length === 0) {
    console.error('Invalid embedding for similarity search');
    return [];
  }

  try {
    // We need to use an RPC call here as it handles the vector type conversion properly
    const { data: matches, error } = await supabase.rpc(
      'match_ingredient_embeddings',
      {
        query_embedding: JSON.stringify(embedding), // Convert number[] to string to match expected type
        similarity_threshold: threshold,
        match_count: maxMatches
      }
    );

    if (error) {
      console.error('Vector search error:', error);
      throw error;
    }

    return matches || [];
  } catch (error) {
    console.error('Error finding similar ingredients:', error);
    return [];
  }
}

/**
 * Check if an embedding is valid
 */
export function isValidEmbedding(embedding: any): boolean {
  return Array.isArray(embedding) && 
         embedding.length > 0 && 
         embedding.every(val => typeof val === 'number');
}

/**
 * Cache an ingredient embedding in the database
 */
export async function cacheIngredientEmbedding(
  ingredientText: string,
  normalizedText: string,
  embedding: number[],
  confidenceScore: number = 0.8,
  model: string = 'text-embedding-ada-002'
): Promise<boolean> {
  if (!isValidEmbedding(embedding)) {
    console.error('Invalid embedding for caching');
    return false;
  }

  try {
    // Convert embedding to string since the database schema expects a string
    const embeddingString = JSON.stringify(embedding);
    
    // Insert with proper type conversion
    const { error } = await supabase
      .from('ingredient_embeddings')
      .insert({
        ingredient_text: ingredientText,
        normalized_text: normalizedText,
        embedding: embeddingString, // Store as string to match the expected type
        confidence_score: confidenceScore,
        embedding_model: model // Track which model generated this embedding
      });

    if (error) {
      console.error('Error caching ingredient embedding:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error caching ingredient embedding:', error);
    return false;
  }
}

/**
 * Dynamically refine context for better embedding results
 */
export function refineContext(context?: Record<string, any>): Record<string, any> | undefined {
  if (!context) return undefined;
  
  // Extract the most relevant context elements
  const refinedContext: Record<string, any> = {};
  
  // Always prioritize cuisine as it provides strong category signals
  if (context.cuisine) {
    refinedContext.cuisine = context.cuisine;
  }
  
  // Include title only if it seems informative (not too generic)
  if (context.title && context.title.length > 3 && 
      !['recipe', 'dish', 'meal', 'food'].includes(context.title.toLowerCase())) {
    refinedContext.title = context.title;
  }
  
  // Filter and limit other ingredients to the most relevant ones
  if (context.otherIngredients && Array.isArray(context.otherIngredients)) {
    // Keep only the most specific ingredients (avoid generic terms)
    const significantIngredients = context.otherIngredients.filter((ing: string) => 
      typeof ing === 'string' && 
      ing.length > 2 &&
      !['salt', 'pepper', 'water', 'oil'].includes(ing.toLowerCase())
    );
    
    // Limit to 5 most relevant ingredients to avoid noise
    if (significantIngredients.length > 0) {
      refinedContext.otherIngredients = significantIngredients.slice(0, 5);
    }
  }
  
  // Include cooking method if available as it can provide important context
  if (context.cookingMethod && typeof context.cookingMethod === 'string') {
    refinedContext.cookingMethod = context.cookingMethod;
  }
  
  return Object.keys(refinedContext).length > 0 ? refinedContext : undefined;
}
