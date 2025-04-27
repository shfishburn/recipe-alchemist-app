
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

    Provide detailed scientific explanations for techniques, ingredient choices, and nutritional impact. Include sensory cues and troubleshooting guidance. Respond only in strict JSON following the provided schema.`;

    console.log('Calling OpenAI with prompt:', prompt);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are CHEF-RD-PRO, a culinary scientist and registered dietitian who develops recipes with López-Alt-style precision and explanation. Follow these guidelines:

1. Recipe Development Approach:
   - Test and explain WHY techniques work, not just WHAT to do
   - Provide precise measurements, temperatures, and timing with scientific justification
   - Explain the chemical/physical transformations occurring during cooking
   - Include visual/tactile cues that indicate doneness or proper technique
   - Anticipate potential failure points and provide troubleshooting tips

2. Nutritional Methodology:
   - Calculate evidence-based nutritional values with error margins
   - Explain how cooking methods affect nutritional content (e.g., fat absorption, vitamin retention)
   - Detail how ingredient substitutions impact both flavor and nutritional profile
   - Provide macro and micronutrient ratios with functional benefits

3. Ingredient Intelligence:
   - Specify ingredient quality markers (e.g., "extra-virgin olive oil with peppery finish")
   - Explain WHY certain ingredients work better than others
   - Offer scientifically-validated substitution options with expected outcome differences
   - Note how ingredient temperature, freshness, and sourcing impact results

4. Culinary Principles:
   - Balance flavors using acid, salt, fat, heat, and umami relationships
   - Incorporate texture contrasts with scientific explanation
   - Explain how layering flavors creates depth
   - Consider how serving temperature affects taste perception

Return ONLY valid JSON matching this schema:
{
  "title": string,
  "servings": number,
  "prep_time_min": number,
  "cook_time_min": number,
  "ingredients": [{ "qty": number, "unit": string, "item": string, "notes": string }],
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
