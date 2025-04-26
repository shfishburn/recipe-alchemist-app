
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
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in Supabase secrets.');
    }
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const { 
      cuisine, 
      dietary, 
      flavorTags, 
      servings, 
      maxCalories, 
      maxMinutes 
    } = await req.json();

    const prompt = `Build a ${dietary} ${cuisine} recipe that:
    • Has ${servings} servings
    • Features flavor tags: ${flavorTags.join(', ')}
    • ≤ ${maxCalories} kcal per serving
    • Cookable in ≤ ${maxMinutes} minutes

    Respond only in strict JSON following the provided schema.`;

    console.log('Calling OpenAI with prompt:', prompt);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are CHEF-RD-PRO, a Michelin-level recipe developer and registered dietitian. 
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
              "fdc_ids": number[]
            }`
          },
          { role: "user", content: prompt }
        ]
      });

      if (!response.choices[0].message.content) {
        throw new Error('OpenAI returned an empty response');
      }

      const recipe = JSON.parse(response.choices[0].message.content);
      
      return new Response(JSON.stringify(recipe), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate recipe with AI', 
        details: openaiError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Recipe generation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
