
import type { Json } from '@/integrations/supabase/types';

/**
 * Database recipe type for insert operations
 * Matches exactly what Supabase expects
 */
export interface DbRecipeInsert {
  id?: string;
  title: string;
  tagline?: string;
  ingredients: Json;
  instructions: Json;
  servings: number;
  user_id: string;
  prep_time_min?: number;
  cook_time_min?: number;
  cuisine?: string;
  cuisine_category?: string;
  dietary?: string | string[];
  flavor_tags?: string[];
  nutrition?: Json;
  science_notes?: Json;
  chef_notes?: string;
  cooking_tip?: string;
  slug?: string;
  nutri_score?: Json;
  created_at?: string;
  updated_at?: string;
  version_number?: number;
  previous_version_id?: string;
  deleted_at?: string;
}

/**
 * Type assertion helper for database operations
 * Ensures required fields exist and converts to proper DbRecipeInsert type
 */
export function asDbRecipeInsert(data: Record<string, any>): DbRecipeInsert {
  // Basic validation of required fields
  if (!data.title || !data.ingredients || !data.instructions || data.servings === undefined) {
    console.error("Missing required fields for database insert", data);
    throw new Error("Missing required fields for database recipe insert");
  }
  
  return data as unknown as DbRecipeInsert;
}
