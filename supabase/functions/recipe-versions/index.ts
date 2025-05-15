
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";

serve(async (req) => {
  const headers = getCorsHeadersWithOrigin(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  
  const url = new URL(req.url);
  const recipeId = url.pathname.split("/").pop();
  
  if (!recipeId) {
    return new Response(
      JSON.stringify({ error: "Recipe ID is required" }),
      { status: 400, headers }
    );
  }
  
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPA_URL || !SUPA_KEY) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers }
    );
  }
  
  try {
    const supabase = createClient(SUPA_URL, SUPA_KEY);
    
    // Get all versions for the recipe
    const { data, error } = await supabase
      .from("recipe_versions")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("version_number", { ascending: false });
    
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers }
      );
    }
    
    return new Response(
      JSON.stringify(data),
      { status: 200, headers }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers }
    );
  }
});
