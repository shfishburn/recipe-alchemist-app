
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function getLatestVersionNumber(recipeId: string): Promise<number> {
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPA_URL || !SUPA_KEY) {
    console.error("Missing Supabase env vars");
    return 0;
  }
  
  try {
    const sb = createClient(SUPA_URL, SUPA_KEY, {
      global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
    });
    
    const { data, error } = await sb.from("recipe_versions")
      .select("version_number")
      .eq("recipe_id", recipeId)
      .order("version_number", { ascending: false })
      .limit(1);
    
    if (error) {
      console.error("Version query error:", error);
      return 0;
    }
    
    return data.length > 0 ? data[0].version_number : 0;
  } catch (dbErr) {
    console.error("DB query failed", dbErr);
    return 0;
  }
}

export interface VersionData {
  version_id: string;
  recipe_id: string;
  version_number: number;
  parent_version_id?: string;
  created_at: string;
  user_id?: string;
  modification_request: string;
  recipe_data: any;
}

export async function storeRecipeVersion({
  recipeId,
  parentVersionId,
  versionNumber,
  userId,
  modificationRequest,
  recipeData
}: {
  recipeId: string;
  parentVersionId: string | null;
  versionNumber: number;
  userId: string | null;
  modificationRequest: string;
  recipeData: any;
}): Promise<VersionData | null> {
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPA_URL || !SUPA_KEY) {
    console.error("Missing Supabase env vars");
    return null;
  }
  
  try {
    const sb = createClient(SUPA_URL, SUPA_KEY, {
      global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
    });
    
    const { data, error } = await sb.from("recipe_versions").insert({
      recipe_id: recipeId,
      parent_version_id: parentVersionId,
      version_number: versionNumber,
      user_id: userId,
      modification_request: modificationRequest,
      recipe_data: recipeData
    }).select();
    
    if (error) {
      console.error("Version storage error:", error);
      return null;
    }
    
    return data[0] as VersionData;
  } catch (dbErr) {
    console.error("DB insert failed", dbErr);
    return null;
  }
}
