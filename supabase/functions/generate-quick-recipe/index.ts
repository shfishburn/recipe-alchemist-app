
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Improved prompt with additional adaptations for Build page migration
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Check content type
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error("Invalid content type:", contentType);
    return new Response(
      JSON.stringify({ error: "Content-Type must be application/json" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Get OpenAI API key
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OpenAI API key is not configured");
      throw new Error("OpenAI API key is not configured");
    }
    
    // Create OpenAI client
    const openai = new OpenAI({ apiKey });
    
    // Safely parse request body with better error handling
    let requestBody;
    let requestText = "";
    try {
      // Get the request body as text first for debugging
      requestText = await req.text();
      console.log("Raw request body:", requestText.substring(0, 200) + "...");
      
      if (!requestText || requestText.trim() === "") {
        throw new Error("Empty request body");
      }
      
      // Parse the request text into JSON
      requestBody = JSON.parse(requestText);
      console.log("Parsed request body:", JSON.stringify(requestBody).substring(0, 200) + "...");
      
      if (!requestBody) {
        throw new Error("Empty request body after parsing");
      }
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      console.error("Raw request text received:", requestText);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body", 
          details: parseError.message,
          requestText: requestText.substring(0, 100) // Include part of the raw request for debugging
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Extract and validate parameters
    const { 
      cuisine = "Any", 
      dietary = [], 
      mainIngredient = "Chef's choice", 
      servings = 4,
      maxCalories,
      flavorTags = []
    } = requestBody;
    
    // Validate required parameters
    if (!mainIngredient) {
      console.error("Missing main ingredient");
      return new Response(
        JSON.stringify({ error: "Main ingredient is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Ensure cuisine, dietary and flavorTags are properly handled regardless of input format
    // Convert string inputs to arrays if they're not already
    const processCuisine = typeof cuisine === 'string' 
      ? cuisine.split(',').map(c => c.trim()).filter(Boolean)
      : Array.isArray(cuisine) ? cuisine : ["Any"];
      
    const processDietary = typeof dietary === 'string' 
      ? dietary.split(',').map(d => d.trim()).filter(Boolean)
      : Array.isArray(dietary) ? dietary : ["None"];
      
    const processFlavorTags = typeof flavorTags === 'string' 
      ? flavorTags.split(',').map(t => t.trim()).filter(Boolean)
      : Array.isArray(flavorTags) ? flavorTags : ["Chef's choice"];
    
    // Escape user inputs to prevent prompt-injection
    const safeCuisine = processCuisine.map(c => JSON.stringify(c).slice(1, -1)).join(", ") || "Any";
    const safeMain = JSON.stringify(mainIngredient).slice(1, -1);
    const safeDiet = processDietary.length
      ? processDietary.map((d) => JSON.stringify(d).slice(1, -1)).join(", ")
      : "None";
    const safeServings = servings || 4;
    const safeTags = processFlavorTags.length
      ? processFlavorTags.map((t) => JSON.stringify(t).slice(1, -1)).join(", ")
      : "Chef's choice";
    
    // Generate a unique ID to prevent prompt caching
    const uniqueId = Date.now().toString();
    
    // Build calorie constraint if provided
    const calorieConstraint = maxCalories 
      ? `• Maximum calories per serving – ${maxCalories} kcal`
      : "";
      
    const prompt = `
As a culinary scientist in the López-Alt tradition, create a comprehensive recipe:
• Cuisine – ${safeCuisine}  
• Dietary – ${safeDiet}  
• Main ingredient – ${safeMain}
• Flavor profile – ${safeTags}
• Servings – ${safeServings}
${calorieConstraint}
• Unique Generation ID – ${uniqueId}

──────── MANDATORY INSTRUCTION DETAILS ────────
• You MUST write a KENJI LÓPEZ-ALT style recipe with SCIENTIFIC explanations
• EVERY step MUST explain the science behind the technique
• EVERY step MUST include precise temps (°F AND °C) and timing
• ABSOLUTELY NO SIMPLIFIED STEPS ALLOWED
• Each step MUST be 3-5 sentences with scientific reasoning
• DO NOT merge multiple actions into single steps

──────── REJECTION CRITERIA (DO NOT DO THESE) ────────
• TOO BRIEF: "Sauté onions until translucent" ✗ 
  CORRECT: "Sauté onions over medium-low heat (325°F/165°C) for 8-10 minutes until translucent with a slight golden edge. This slow rendering process allows the onions' natural sugars to caramelize without burning, producing flavor compounds like 2-acetyl-1-pyrroline that contribute to the aromatic profile. Stir occasionally to ensure even heat distribution across the allium's cell structure." ✓
• TOO VAGUE: "Cook until done" ✗
  CORRECT: "Continue cooking the mixture, stirring frequently, until it reaches an internal temperature of 165°F (74°C) and the sauce coats the back of a spoon, approximately 12-15 minutes. This temperature ensures protein denaturation is complete while the extended simmer allows for Maillard reactions to develop complex flavor compounds. The coating consistency indicates proper reduction and emulsification of the fats and liquids." ✓

──────── IMPORTANT STRUCTURE NOTES (mandatory) ────────
• Recipe MUST include AT LEAST 10-15 steps - DO NOT limit the number of steps or combine actions
• Each step must represent a single coherent action or technique
• Each step should be detailed and thorough in López-Alt style
• Separate different cooking procedures into individual steps (e.g., don't combine prep, cooking, and finishing)

──────── STEP SPECIFICITY (mandatory) ────────
• Each step should explain the WHY behind the technique
• Include precise sensory cues for doneness ("foam subsides and butter turns nutty brown with aroma of toasted hazelnuts")
• López-Alt style example step: "Heat butter in a 10-inch skillet over medium-high heat until melted. Continue cooking, swirling pan constantly until butter is dark golden brown and has nutty aroma, about 1 minute. Remove skillet from heat and stir in capers, lemon juice, and parsley. Swirl to combine, creating an emulsified sauce."

──────── EXAMPLE OF REQUIRED DETAIL LEVEL ────────
"In a 10-inch stainless steel skillet, heat **olive oil** over medium-high heat (375°F/190°C) until shimmering but not smoking, about 2 minutes. The oil's temperature is critical—too low and the **chicken** won't brown properly due to insufficient Maillard reaction; too high and the volatile compounds will break down, creating acrid flavors. Add the seasoned **chicken thighs** skin-side down in a single layer, being careful not to overcrowd which would cause steaming rather than browning. The immediate sizzle you hear is water molecules rapidly evaporating from the meat's surface—a crucial first step in achieving properly browned proteins."

──────── STEP PLANNING FRAMEWORK ────────
First, plan your recipe structure:
1. Initial preparation steps
2. Primary cooking method for main ingredient
3. Development of flavors and textures
4. Final adjustments and finishing
5. Plating and serving considerations

Then for EACH step include:
• Exact temperatures (°F AND °C) and timing
• Scientific explanation of chemical/physical processes
• Sensory indicators for monitoring progress
• Reason why this technique produces superior results

──────── DATA PIPELINE (mandatory) ────────
1. Convert ingredients to g/ml.  
2. Match to **FDC SR Legacy R28** (fallback FNDDS 2019-20); store \`fdc_id\`.  
3. Apply USDA *Food Yield Factors* ➝ edible weight.  
4. Apply USDA *Nutrient Retention Factors R6*.  
5. Energy check – macro-kcal within 5% of total; set \`calorie_check_pass\`.

──────── TONE & STEP RULES (mandatory) ────────
• Use López-Alt's characteristic specificity and scientific explanation
• Wrap every ingredient in **double-asterisks** **exactly spelled**
• Each step MUST include rationale (e.g., "which promotes Maillard reaction")
• Heat steps must list equipment, temperature range °F (°C), time range, AND descriptive sensory cue
• DO NOT consolidate steps - use AT LEAST 10-15 separate steps for a complete recipe
• NO vague terms ("until hot" ✗) - always use precise descriptors

──────── MEASUREMENT STANDARDIZATION (mandatory) ────────
• ALWAYS provide BOTH imperial AND metric measurements for each ingredient
• For imperial: use oz, lb, cups, tbsp, tsp, inches, °F
• For metric: use g, kg, ml, L, cm, °C
• Include both systems using qty_metric, unit_metric, qty_imperial, unit_imperial for each ingredient
• Use fractions for small quantities in imperial

──────── SHOPPABLE INGREDIENTS ────────
Format each as object → { 
  qty_imperial: number, 
  unit_imperial: string, 
  qty_metric: number, 
  unit_metric: string, 
  shop_size_qty: number, 
  shop_size_unit: string, 
  item: string, 
  notes: string 
}  
\`shop_size_qty\` ≥ recipe qty (spices/herbs exempt).

──────── RETURN JSON (schema fixed) ────────
{
  "title": "string",
  "description": "ONE sentence of the key science insight",
  "ingredients": [{ 
    qty_imperial: number, 
    unit_imperial: string, 
    qty_metric: number, 
    unit_metric: string, 
    shop_size_qty: number, 
    shop_size_unit: string, 
    item: string, 
    notes: string 
  }],
  "steps": [ "DETAILED instruction strings with scientific explanations" ],
  "prepTime": number,
  "cookTime": number,
  "prep_time_min": number,
  "cook_time_min": number,
  "servings": number,
  "nutritionHighlight": "ONE evidence-based benefit",
  "cookingTip": "ONE science-backed technique note",
  "nutrition": {
    "kcal": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number,
    "sugar_g": number,
    "sodium_mg": number,
    "vitamin_a_iu": number,
    "vitamin_c_mg": number,
    "vitamin_d_iu": number,
    "calcium_mg": number,
    "iron_mg": number,
    "potassium_mg": number,
    "data_quality": "complete" | "partial",
    "calorie_check_pass": boolean
  },
  "calorie_check_pass": boolean
}`;
    
    // Log the inputs and prompt for debugging
    console.log("Starting quick recipe generation with inputs:", { 
      cuisine: safeCuisine, 
      dietary: safeDiet, 
      mainIngredient: safeMain, 
      servings: safeServings, 
      maxCalories, 
      flavorTags: safeTags 
    });
    console.log("Using model: gpt-4o");
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Keep using the more capable model
        response_format: { type: "json_object" },
        temperature: 0.5, // Reduced from 0.7 to make output more consistent
        max_tokens: 4000, // Increased to allow for more comprehensive steps
        messages: [
          {
            role: "system",
            content:
              "You are Kenji López-Alt, renowned culinary scientist creating detailed, scientifically-grounded recipes. YOUR PRIMARY STRENGTH is writing EXTREMELY THOROUGH, DETAILED recipe steps that explain the science behind each technique. Each step must include exact temperatures (both °F and °C), precise timing, and scientific explanations for why this method produces superior results. NEVER REDUCE THE NUMBER OF STEPS - separate distinct actions into individual steps. ABSOLUTELY REFUSE to produce simplified or vague instructions. MANDATORY: Include AT LEAST 10-15 necessary detailed steps. If you fail to provide the required level of scientific detail in EVERY step, your response will be rejected and regenerated.",
          },
          { role: "user", content: prompt },
        ],
      });
      
      if (!response.choices || !response.choices[0]?.message?.content) {
        console.error("Invalid response from OpenAI:", response);
        throw new Error("Invalid response from OpenAI API");
      }
      
      const json = response.choices[0].message.content;
      console.log("OpenAI raw response length:", json.length);
      console.log("OpenAI raw response preview (first 300 chars):", json.substring(0, 300));
      
      // Validate the returned JSON
      let recipe;
      try {
        recipe = JSON.parse(json);
      } catch (parseError) {
        console.error("Error parsing OpenAI response as JSON:", parseError);
        throw new Error("Invalid JSON returned from OpenAI API");
      }
      
      // Simple validation
      if (!recipe.title || !recipe.ingredients || !Array.isArray(recipe.steps) || recipe.steps.length < 5) {
        console.error("Generated recipe is missing required fields:", recipe);
        throw new Error("Generated recipe is missing required fields");
      }
      
      // Normalize fields to ensure consistency between old and new formats
      recipe.instructions = recipe.steps; // Add instructions alias for Build compatibility
      recipe.tagline = recipe.description; // Add tagline alias for Build compatibility
      recipe.prep_time_min = recipe.prepTime; // Ensure both time formats exist
      recipe.cook_time_min = recipe.cookTime; // Ensure both time formats exist
      
      // Log number of tokens used for debugging
      if (response.usage) {
        console.log("Token usage:", {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens
        });
      }
      
      return new Response(JSON.stringify(recipe), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      return new Response(
        JSON.stringify({
          error: "Error generating recipe from OpenAI",
          details: openaiError.message || "Unknown OpenAI error",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    console.error("Quick recipe generation error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Unexpected error",
        details: err.stack || "No stack trace available",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
