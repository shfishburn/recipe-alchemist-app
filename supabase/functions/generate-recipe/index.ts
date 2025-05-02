
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Inline the recipe generation prompt that was previously imported
const recipeGenerationPrompt = `As a culinary scientist and registered dietitian in the López-Alt tradition, create a recipe that:
• Follows the specified dietary requirements
• Matches the desired cuisine type
• Uses the requested flavor profiles
• Stays within calorie limits
• Serves the specified number of people

Create a recipe with evidence-based techniques that maximize flavor through understanding of food chemistry:

1. PRECISION AND TECHNIQUE:
   - Specify exact temperatures (°F with °C) and timing with scientific rationale
   - Include visual/tactile/aromatic indicators for doneness
   - Identify critical control points where technique impacts outcome
   - Explain how ingredient preparation affects flavor development
   - Choose appropriate cooking methods
   - Use authentic cooking methods for traditional dishes

2. INGREDIENT SCIENCE:
   - Select ingredients with specific qualities
   - Note when ingredient temperature matters
   - Explain functional properties
   - Include scientific substitutions with expected outcomes

3. COOKING CHEMISTRY:
   - Leverage specific reactions (e.g., Maillard, caramelization, gelatinization)
   - Balance flavor molecules with precision
   - Control moisture and heat transfer
   - Sequence steps to build flavor compounds

4. NUTRITIONAL OPTIMIZATION:
   - Calculate accurate nutritional values using USDA data sources
   - Preserve heat-sensitive nutrients
   - Balance macronutrients
   - Maximize nutrient bioavailability

5. MEASUREMENT STANDARDIZATION:
   - ALWAYS provide BOTH imperial AND metric measurements for each ingredient
   - For imperial: use oz, lb, cups, tbsp, tsp, inches, °F
   - For metric: use g, kg, ml, L, cm, °C
   - Include both systems using qty_metric, unit_metric, qty_imperial, unit_imperial for each ingredient
   - Use fractions for small quantities in imperial

6. SHOPPABLE INGREDIENTS:
   - Each item gets a typical US grocery package size
   - \`shop_size_qty\` ≥ \`qty\` (spices/herbs exempt)
   - Choose the nearest standard package (e.g., 14.5-oz can, 2-lb bag)

7. TONE & STYLE:
   - Generally use active voice, aim for clarity in step descriptions
   - Include diverse sensory cues (visual, tactile, aromatic, auditory)
   - Ingredient tags: wrap each referenced ingredient in \`**double-asterisks**\`
   - Balance precision with approachable language
   - Consider both novice and experienced cooks' perspectives

Return ONLY valid JSON matching this schema:
{
  "title": string,
  "tagline": string,
  "servings": number,
  "prep_time_min": number,
  "cook_time_min": number,
  "ingredients": [{ 
    "qty_metric": number, 
    "unit_metric": string, 
    "qty_imperial": number,
    "unit_imperial": string,
    "shop_size_qty": number,
    "shop_size_unit": string,
    "item": string, 
    "notes": string 
  }],
  "instructions": string[],
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
  "science_notes": string[],
  "reasoning": string
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Starting recipe generation process');
    
    if (!apiKey) {
      console.error('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }
    
    const openai = new OpenAI({ apiKey });
    const requestData = await req.json();
    
    const { 
      cuisine, 
      dietary, 
      flavorTags, 
      servings, 
      maxCalories,
      recipeRequest 
    } = requestData;

    const prompt = `${recipeGenerationPrompt}

Current request:
• Cuisine: ${cuisine}
• Dietary: ${dietary}
• Flavor Tags: ${flavorTags.join(', ')}
• Servings: ${servings}
• Max Calories: ${maxCalories}
• Specific Request: ${recipeRequest || 'None provided'}`;

    console.log('Calling OpenAI with prompt');

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      console.log('Received OpenAI response:', JSON.stringify(response.choices[0].message.content));

      if (!response.choices[0].message.content) {
        throw new Error('OpenAI returned an empty response');
      }

      const recipe = JSON.parse(response.choices[0].message.content);
      console.log('Successfully parsed recipe JSON');
      
      return new Response(JSON.stringify(recipe), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      throw new Error(`OpenAI API Error: ${openaiError.message}`);
    }
  } catch (error) {
    console.error('Recipe generation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
