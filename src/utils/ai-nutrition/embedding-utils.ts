/**
 * Utilities for embedding-based ingredient matching
 */

import { supabase } from '@/integrations/supabase/client';
import { normalizeIngredientText } from '../../../supabase/functions/nutrisynth-analysis/ingredient-helpers';

// Types for embedding operations
export interface EmbeddingMatch {
  food_code: string;
  food_name: string;
  similarity_score: number;
  match_method: string;
}

/**
 * Generate a text embedding for ingredient matching using context
 * 
 * @param ingredientText The ingredient text to embed
 * @param recipeContext Optional context about the recipe (title, cuisine)
 * @returns Promise resolving to the generated embedding
 */
export async function generateIngredientEmbedding(
  ingredientText: string, 
  recipeContext?: { 
    title?: string;
    cuisine?: string;
    cookingMethod?: string;
  }
): Promise<number[]> {
  try {
    // Normalize the ingredient text first
    const normalizedText = normalizeIngredientText(ingredientText);
    
    // Create a context-enhanced prompt for the embedding
    let enhancedText = normalizedText;
    
    if (recipeContext) {
      if (recipeContext.title) {
        enhancedText = `${recipeContext.title}: ${enhancedText}`;
      }
      
      if (recipeContext.cuisine) {
        enhancedText += ` (${recipeContext.cuisine} cuisine)`;
      }
      
      if (recipeContext.cookingMethod) {
        enhancedText += ` for ${recipeContext.cookingMethod}`;
      }
    }
    
    // Use Edge Function to generate embedding (to keep API keys secure)
    const { data, error } = await supabase.functions.invoke('generate-embedding', {
      body: { text: enhancedText }
    });

    if (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Embedding generation failed: ${error.message}`);
    }
    
    return data.embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    
    // Return empty embedding as fallback
    // This allows the system to fall back to traditional matching methods
    return [];
  }
}

/**
 * Find matching ingredients using vector similarity search
 * 
 * @param embedding The ingredient embedding to match
 * @param threshold Minimum similarity threshold (0-1)
 * @param maxMatches Maximum number of matches to return
 * @returns Promise resolving to matching ingredients
 */
export async function findSimilarIngredients(
  embedding: number[],
  threshold: number = 0.78,
  maxMatches: number = 5
): Promise<EmbeddingMatch[]> {
  if (!embedding || embedding.length === 0) {
    console.warn('No embedding provided for similarity search');
    return [];
  }
  
  try {
    const { data, error } = await supabase.rpc('match_ingredient_embeddings', {
      query_embedding: embedding,
      similarity_threshold: threshold,
      match_count: maxMatches
    });
    
    if (error) {
      console.error('Error in similarity search:', error);
      return [];
    }
    
    return data.map((match: any) => ({
      food_code: match.food_code,
      food_name: match.food_name || match.description,
      similarity_score: match.similarity,
      match_method: 'vector_similarity'
    }));
  } catch (error) {
    console.error('Failed to perform similarity search:', error);
    return [];
  }
}

/**
 * Enhanced ingredient matching using embeddings with fallback to traditional methods
 * 
 * @param ingredientText The ingredient text to match
 * @param recipeContext Optional context about the recipe
 * @returns Promise resolving to best matching ingredient
 */
export async function findIngredientMatchEnhanced(
  ingredientText: string,
  recipeContext?: {
    title?: string;
    cuisine?: string;
    cookingMethod?: string;
  }
): Promise<EmbeddingMatch | null> {
  try {
    // Step 1: Generate embedding for the ingredient with context
    const embedding = await generateIngredientEmbedding(ingredientText, recipeContext);
    
    // Step 2: If we have a valid embedding, perform similarity search
    if (embedding && embedding.length > 0) {
      const matches = await findSimilarIngredients(embedding);
      
      // If we found matches, return the best one
      if (matches && matches.length > 0) {
        return matches[0];
      }
    }
    
    // Step 3: Fall back to traditional search via the nutrisynth-analysis function
    const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke(
      'nutrisynth-analysis', {
        body: { 
          ingredients: [{ item: ingredientText, qty: 1, unit: 'g' }],
          servings: 1
        }
      }
    );
    
    if (fallbackError) {
      console.error('Fallback search error:', fallbackError);
      return null;
    }
    
    // Extract match from fallback data
    if (fallbackData?.per_ingredient?.[ingredientText]) {
      const fallbackMatch = fallbackData.per_ingredient[ingredientText];
      
      return {
        food_code: fallbackMatch.food_code || '',
        food_name: fallbackMatch.matched_food || ingredientText,
        similarity_score: fallbackMatch.confidence_score || 0.5,
        match_method: fallbackMatch.match_method || 'fallback'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Enhanced ingredient matching failed:', error);
    return null;
  }
}
