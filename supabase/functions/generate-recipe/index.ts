
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Starting recipe generation process');
    
    if (!apiKey) {
      console.error('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in Supabase secrets.');
    }
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const requestData = await req.json();
    console.log('Received request data:', JSON.stringify(requestData));

    const { 
      cuisine, 
      dietary, 
      flavorTags, 
      servings, 
      maxCalories, 
      maxMinutes,
      recipeRequest 
    } = requestData;

    const prompt = `Build a ${dietary} ${cuisine} recipe that:
    • Was requested as: "${recipeRequest || 'no specific request'}"
    • Has ${servings} servings
    • Features flavor tags: ${flavorTags.join(', ')}
    • ≤ ${maxCalories} kcal per serving
    • Cookable in ≤ ${maxMinutes} minutes

    Provide explanation why this recipe matches the request. Respond only in strict JSON following the provided schema.`;

    console.log('Calling OpenAI with prompt:', prompt);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are CHEF-RD-PRO, a Michelin-level recipe developer and registered dietitian. Follow these guidelines:

1. Recipe Structure:
   - Write clear, step-by-step instructions
   - Each ingredient must have precise measurements
   - All cooking times and temperatures must be specific
   - Include both prep time and cook time

2. Nutritional Accuracy:
   - Calculate realistic nutritional values
   - Ensure macronutrient ratios are balanced
   - Account for cooking methods in calorie calculations
   - Consider portion sizes when calculating per-serving values

3. Dietary Considerations:
   - Strictly adhere to dietary restrictions (vegan, gluten-free, etc.)
   - Suggest appropriate substitutions when relevant
   - Ensure ingredients align with cuisine type
   - Verify all ingredients are commonly available

4. Quality Standards:
   - Create recipes that are both healthy and flavorful
   - Focus on fresh, whole ingredients when possible
   - Balance textures and flavors
   - Consider seasonal availability of ingredients

Return ONLY valid JSON matching this schema:
{
  "title": string,
  "servings": number,
  "prep_time_min": number,
  "cook_time_min": number,
  "ingredients": [{ "qty": number, "unit": string, "item": string }],
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
  "tagline": string,
  "image_prompt": string,
  "reasoning": string,
  "original_request": string,
  "fdc_ids": number[]
}`
          },
          { role: "user", content: prompt }
        ]
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
