
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
    const { ingredients, title } = await req.json();

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({ apiKey });

    let ingredientsText = Array.isArray(ingredients) 
      ? ingredients.map(ing => `${ing.qty} ${ing.unit} ${ing.item}`).join('\n')
      : "No ingredients provided";

    const prompt = `As a professional chef specializing in culinary science and practical shopping, organize these ingredients from the recipe "${title}" into an optimized shopping list with expert insights.

Input ingredients:
${ingredientsText}

ORGANIZATION PRINCIPLES:
1. Group ingredients by store department (Produce, Meat, Dairy, Pantry, Specialty, etc.)
2. Combine identical ingredients with mathematical precision and adjust quantities
3. Standardize measurement units for consistency (metric or imperial based on recipe style)
4. Prioritize ingredients by cooking sequence and perishability
5. Flag items needing advance preparation or special handling

PRACTICAL ENHANCEMENTS:
1. Identify quality indicators for key ingredients (e.g., "ripe but firm avocados")
2. Note seasonal availability and suggest peak-season alternatives
3. Include substitutions for dietary restrictions (gluten-free, dairy-free, etc.)
4. Add commonly needed companion ingredients missing from the recipe
5. Suggest precise quantity purchasing to minimize waste (e.g., "buy 1 bunch for 2 tbsp needed")

SHOPPING EFFICIENCY:
1. Mark ingredients that could already exist in a well-stocked pantry
2. Indicate ingredients that can be bought in bulk vs. fresh
3. Note ingredients with significant price variations between brands/sources
4. Suggest preservation methods for unused portions
5. Flag ingredients that require special storage after purchase

Return ONLY valid JSON matching this schema:
{
  "departments": [{
    "name": string,
    "items": [{
      "name": string,
      "quantity": number,
      "unit": string,
      "notes": string,
      "quality_indicators": string,
      "alternatives": string[],
      "pantry_staple": boolean,
      "storage_tips": string
    }]
  }],
  "efficiency_tips": string[],
  "preparation_notes": string[]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional chef helping organize shopping lists." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const shoppingList = JSON.parse(response.choices[0].message.content);
    return new Response(JSON.stringify(shoppingList), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating shopping list:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
