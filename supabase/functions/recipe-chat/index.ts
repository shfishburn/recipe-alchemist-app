
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

    const prompt = `As a Michelin-starred chef and registered dietitian, review this recipe and suggest improvements based on the user's request. 

Current recipe:
- Title: ${recipe.title}
- Servings: ${recipe.servings}

Ingredients:
${recipe.ingredients.map(i => `- ${i.qty} ${i.unit} ${i.item}`).join('\n')}

Instructions:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}

User request: ${userMessage}

Provide your response in two parts:
1. A detailed, professionally formatted response with:
   - Clear bullet points
   - Professional culinary insights
   - Explanation of suggested changes
2. A precise JSON object with potential recipe modifications

Include 2-3 engaging follow-up questions to continue the culinary discussion.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    let responseText = '';
    let changes = null;
    
    try {
      const parsedContent = JSON.parse(content);
      responseText = parsedContent.textResponse || content;
      changes = parsedContent.changes;
    } catch (e) {
      console.error("Error parsing AI response:", e);
      responseText = content;
    }
    
    const suggestion = {
      response: responseText,
      changes: changes || null,
      followUpQuestions: [
        "Would you like to explore alternative ingredient substitutions?",
        "Are you interested in learning more about the culinary techniques involved?",
        "Do you have any specific dietary restrictions I should consider?"
      ]
    };
    
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
