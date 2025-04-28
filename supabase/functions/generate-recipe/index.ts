
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const prompt = `As a culinary scientist and registered dietitian in the López-Alt tradition, create a ${dietary} ${cuisine} recipe that:
    • Was requested as: "${recipeRequest || 'no specific request'}"
    • Has ${servings} servings
    • Features flavor tags: ${flavorTags.join(', ')}
    • ≤ ${maxCalories} kcal per serving
    
    Create a recipe with evidence-based techniques that maximize flavor through understanding of food chemistry:
    
    1. PRECISION AND TECHNIQUE:
       - Specify exact temperatures (°F with °C in parentheses) and timing with scientific rationale
       - Include visual/tactile/aromatic indicators for doneness (e.g., "golden-brown with crisp edges")
       - Identify critical control points where technique impacts outcome
       - Explain how ingredient preparation (cutting style, resting times) affects flavor development
       - Choose appropriate cooking methods for the dish (slow-cooking, pressure cooking, etc.)
       - For traditional dishes, use authentic cooking methods that may require extended cooking times

    2. COOKING METHOD AUTHENTICITY:
       - For classic dishes with established methods (like slow-cooked pot roast, braised short ribs, etc.), 
         use the authentic cooking method even if it requires hours of cooking
       - Do NOT sacrifice authenticity for speed - use the correct cooking method for the dish
       - Be precise about active cooking time (preparation, active attention) vs. passive cooking time (simmering, braising, etc.)
       - Identify specialized equipment needed (slow-cooker, pressure cooker, etc.)
    
    3. INGREDIENT SCIENCE:
       - Select ingredients with specific qualities (e.g., "80/20 ground beef for optimal fat rendering")
       - Note when ingredient temperature matters (e.g., "room-temperature eggs for proper emulsification")
       - Explain functional properties (e.g., "high-protein flour for gluten development")
       - Include scientific substitutions with expected outcome differences
    
    4. COOKING CHEMISTRY:
       - Leverage specific reactions (Maillard browning, caramelization, protein denaturation)
       - Balance flavor molecules (acids, salts, fats, aromatics) with precision
       - Control moisture and heat transfer for optimal texture development
       - Sequence cooking steps to build flavor compounds systematically
    
    5. NUTRITIONAL OPTIMIZATION:
       - Calculate accurate nutritional values with evidence-based methods
       - Preserve heat-sensitive nutrients through appropriate cooking techniques
       - Balance macronutrient ratios for specific dietary goals
       - Maximize nutrient bioavailability through ingredient pairing
    
    6. MEASUREMENT STANDARDIZATION:
       - All measurements MUST be in imperial units (oz, lb, cups, tbsp, tsp, inches, °F)
       - Convert any metric values to their imperial equivalents
       - For small quantities where precision matters, use fractions (1/4 tsp, etc.)
       - Provide temperatures in °F with °C in parentheses where relevant

    7. INLINE INGREDIENTS FORMAT:
       - Include ingredient references within instructions using **bold** text
       - Each instruction must reference specific ingredients with exact quantities
       - Example: "Heat a large skillet and add **2 tablespoons olive oil**. Once hot, sear **1 pound beef chuck, cubed** until browned"
       - Maintain complete measurements in the separate ingredients list with quality specs
       - Ensure every ingredient mentioned is properly formatted in bold

    8. RECIPE VALIDATION:
       - For traditional dishes (like Mississippi Pot Roast), verify your cooking method and times against established standards
       - For slow-cooked dishes, include appropriate cooking times (several hours if necessary)
       - Do NOT modify traditional cooking methods to fit arbitrary time constraints
       - Indicate if special equipment is needed (slow cooker, pressure cooker, dutch oven, etc.)
    
    Return ONLY valid JSON matching this schema:
    {
      "title": string,
      "servings": number,
      "prep_time_min": number,
      "cook_time_min": number,
      "total_time_min": number,
      "cooking_method": string,
      "ingredients": [{ 
        "qty": number, 
        "unit": string, 
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
        "sodium_mg": number
      },
      "science_notes": string[],
      "tagline": string,
      "image_prompt": string,
      "reasoning": string,
      "equipmentNeeded": string[],
      "original_request": string
    }`;

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
