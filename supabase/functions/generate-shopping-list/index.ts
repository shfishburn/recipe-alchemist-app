
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

    const prompt = `As a professional chef and grocery shopping expert, organize these ingredients from the recipe "${title}" into an optimized shopping list. 

Input ingredients:
${ingredientsText}

Requirements:
1. Group similar items by store department (Produce, Meat, Dairy, etc.)
2. Combine identical ingredients and adjust quantities
3. Convert units for consistency when possible (e.g., combine tablespoons into cups)
4. Add commonly paired items that aren't listed but are often needed
5. Suggest alternative ingredients for hard-to-find items
6. Note items that might already be in a typical pantry

Return ONLY valid JSON matching this schema:
{
  "departments": [{
    "name": string,
    "items": [{
      "name": string,
      "quantity": number,
      "unit": string,
      "notes": string,
      "alternatives": string[],
      "pantry_staple": boolean
    }]
  }],
  "tips": string[]
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
