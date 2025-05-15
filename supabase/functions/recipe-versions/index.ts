
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";

serve(async (req) => {
  const headers = getCorsHeadersWithOrigin(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const recipeId = pathParts[pathParts.length - 1];
    
    if (!recipeId) {
      return new Response(
        JSON.stringify({ error: "Recipe ID is required" }),
        { status: 400, headers }
      );
    }
    
    // Get authorization token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization is required" }),
        { status: 401, headers }
      );
    }
    
    // Parse token
    const token = authHeader.replace("Bearer ", "");
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers }
      );
    }
    
    // Create authenticated client with user's token
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    // Get user from token
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers }
      );
    }
    
    // Fetch recipe versions
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
    console.error("Error in recipe-versions function:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers }
    );
  }
});
