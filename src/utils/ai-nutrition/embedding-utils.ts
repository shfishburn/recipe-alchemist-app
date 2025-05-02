
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
        context
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
        query_embedding: embedding,
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
  confidenceScore: number = 0.8
): Promise<boolean> {
  if (!isValidEmbedding(embedding)) {
    console.error('Invalid embedding for caching');
    return false;
  }

  try {
    // For PostgreSQL vector columns, we need to pass the array directly
    // The pg-vector extension handles the conversion on the database side
    const { error } = await supabase
      .from('ingredient_embeddings')
      .insert({
        ingredient_text: ingredientText,
        normalized_text: normalizedText,
        embedding: embedding, // Pass the array directly
        confidence_score: confidenceScore
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
