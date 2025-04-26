
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
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({ apiKey });
    const { recipe, userMessage } = await req.json();

    const prompt = `As a Michelin-starred chef and registered dietitian, review this recipe and suggest improvements based on the user's request. Current recipe:

Title: ${recipe.title}
Servings: ${recipe.servings}
Ingredients:
${recipe.ingredients.map(i => `- ${i.qty} ${i.unit} ${i.item}`).join('\n')}

Instructions:
${recipe.instructions.join('\n')}

User request: ${userMessage}

Provide specific, actionable changes to improve this recipe while maintaining its core characteristics. Return ONLY valid JSON matching this schema:
{
  "response": string (conversational response to user),
  "changes": {
    "title": string | null,
    "ingredients": [{ "qty": number, "unit": string, "item": string }] | null,
    "instructions": string[] | null,
    "nutrition": {
      "kcal": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "fiber_g": number,
      "sugar_g": number,
      "sodium_mg": number
    } | null
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt }
      ]
    });

    const suggestion = JSON.parse(response.choices[0].message.content);
    
    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Recipe chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
