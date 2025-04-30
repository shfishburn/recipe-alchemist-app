
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";
import { corsHeaders } from "../_shared/cors.ts";
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OpenAI API key is not configured");
    const openai = new OpenAI({ apiKey });
    const { cuisine = "Any", dietary = [], mainIngredient = "Chef's choice" } =
      await req.json();
    // Escape user inputs to prevent prompt-injection
    const safeCuisine = JSON.stringify(cuisine).slice(1, -1);
    const safeMain   = JSON.stringify(mainIngredient).slice(1, -1);
    const safeDiet   = dietary.length
      ? dietary.map((d: string) => JSON.stringify(d).slice(1, -1)).join(", ")
      : "None";
    const prompt = `
As a culinary scientist in the López-Alt tradition, create a comprehensive recipe:
• Cuisine – ${safeCuisine}  
• Dietary – ${safeDiet}  
• Main ingredient – ${safeMain}

──────── IMPORTANT STRUCTURE NOTES (mandatory) ────────
• Recipe MUST include AT LEAST 8-12 steps - DO NOT limit the number of steps or combine actions
• Each step must represent a single coherent action or technique
• Each step should be detailed and thorough in López-Alt style
• Separate different cooking procedures into individual steps (e.g., don't combine prep, cooking, and finishing)

──────── STEP SPECIFICITY (mandatory) ────────
• Each step should explain the WHY behind the technique
• Include precise sensory cues for doneness ("foam subsides and butter turns nutty brown with aroma of toasted hazelnuts")
• López-Alt style example step: "Heat butter in a 10-inch skillet over medium-high heat until melted. Continue cooking, swirling pan constantly until butter is dark golden brown and has nutty aroma, about 1 minute. Remove skillet from heat and stir in capers, lemon juice, and parsley. Swirl to combine, creating an emulsified sauce."

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
• DO NOT consolidate steps - use AT LEAST 8-12 separate steps for a complete recipe
• NO vague terms ("until hot" ✗) - always use precise descriptors

──────── EXAMPLE RECIPE STRUCTURE (for reference) ────────
Step 1: Prepare ingredients (detailed process)
Step 2: Initial cooking technique (detailed process)
Step 3: Add first set of ingredients (detailed)
Step 4: Intermediate technique application (detailed)
Step 5: Temperature adjustment with rationale (detailed)
Step 6: Add next ingredient group with timing (detailed)
Step 7: Monitor cooking with specific cues (detailed)
Step 8: Preparation of accompaniments (detailed)
Step 9: Final seasoning adjustments (detailed)
Step 10: Plating and presentation (detailed)

──────── SHOPPABLE INGREDIENTS ────────
Format each as object → { qty, unit, shop_size_qty, shop_size_unit, item, notes }  
\`shop_size_qty\` ≥ recipe qty (spices/herbs exempt).

──────── RETURN JSON (schema fixed) ────────
{
  "title": "string",
  "description": "ONE sentence of the key science insight",
  "ingredients": [ { qty, unit, shop_size_qty, shop_size_unit, item, notes } ],
  "steps": [ "DETAILED instruction strings with scientific explanations" ],
  "prepTime": number,
  "cookTime": number,
  "nutritionHighlight": "ONE evidence-based benefit",
  "cookingTip": "ONE science-backed technique note",
  "calorie_check_pass": boolean
}`;
    console.log("Starting quick recipe generation with inputs:", { cuisine, dietary, mainIngredient });
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Upgraded from gpt-4o-mini to the more capable model
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3000, // Increased from 1500 to allow for more comprehensive steps
      messages: [
        {
          role: "system",
          content:
            "You are a culinary scientist in the López-Alt tradition creating detailed, scientifically-grounded recipes. Your strength is writing THOROUGH, DETAILED recipe steps that explain the science behind each technique. DO NOT limit the number of steps - include AT LEAST 8-12 necessary instructions with scientific explanations. NEVER combine multiple actions into a single step. Follow all DATA PIPELINE, TONE & STEP, and SHOPPABLE rules exactly. Output RAW JSON only—no markdown, comments, or extra keys.",
        },
        { role: "user", content: prompt },
      ],
    });
    const json = response.choices[0]?.message.content;
    if (!json) throw new Error("OpenAI returned an empty response");
    console.log("OpenAI raw response length:", json.length);
    const recipe = JSON.parse(json);
    console.log("Recipe generated with", recipe.steps.length, "steps");
    return new Response(JSON.stringify(recipe), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Quick recipe generation error:", err);
    return new Response(
      JSON.stringify({
        error: err.message ?? "Unexpected error",
        details: err.stack,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
