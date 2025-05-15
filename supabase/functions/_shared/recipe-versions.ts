
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

/**
 * Stores a new recipe version in the database
 */
export async function storeRecipeVersion(params: {
  recipeId: string;
  parentVersionId?: string;
  versionNumber: number;
  userId?: string;
  modificationRequest: string;
  recipeData: Record<string, any>;
}) {
  const { recipeId, parentVersionId, versionNumber, userId, modificationRequest, recipeData } = params;
  
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPA_URL || !SUPA_KEY) {
    console.error("Missing Supabase environment variables");
    throw new Error("Database configuration error");
  }
  
  try {
    const supabase = createClient(SUPA_URL, SUPA_KEY, {
      global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
    });
    
    const { data, error } = await supabase.from("recipe_versions").insert({
      recipe_id: recipeId,
      parent_version_id: parentVersionId,
      version_number: versionNumber,
      user_id: userId,
      modification_request: modificationRequest,
      recipe_data: recipeData
    }).select();
    
    if (error) {
      console.error("Version storage error:", error);
      throw new Error(`Failed to store recipe version: ${error.message}`);
    }
    
    return data[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

/**
 * Gets the latest version number for a recipe
 */
export async function getLatestVersionNumber(recipeId: string): Promise<number> {
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPA_URL || !SUPA_KEY) {
    console.error("Missing Supabase environment variables");
    throw new Error("Database configuration error");
  }
  
  try {
    const supabase = createClient(SUPA_URL, SUPA_KEY, {
      global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
    });
    
    const { data, error } = await supabase.from("recipe_versions")
      .select("version_number")
      .eq("recipe_id", recipeId)
      .order("version_number", { ascending: false })
      .limit(1);
    
    if (error) {
      console.error("Version query error:", error);
      throw new Error(`Failed to get latest version number: ${error.message}`);
    }
    
    return data.length > 0 ? data[0].version_number : 0;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}
