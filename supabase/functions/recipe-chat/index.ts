
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

Current Nutrition (per serving):
${Object.entries(recipe.nutrition || {}).map(([key, value]) => `- ${key.replace(/_/g, ' ')}: ${value}`).join('\n')}

Ingredients:
${recipe.ingredients.map(i => `- ${i.qty} ${i.unit} ${i.item}`).join('\n')}

Instructions:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}

User request: ${userMessage}

Your response must include:
1. A clear, structured response with headings, bullet points, and formatted text
2. A detailed nutritional analysis of proposed changes
3. Culinary insights and techniques
4. Health benefits/considerations

Format your response for readability using:
• Clear section headings with colons (e.g., "Nutritional Impact:")
• Bullet points for lists (•)
• Organized structure with spacing between sections

Also include 3 engaging follow-up questions related to:
• Health/nutrition goals
• Culinary preferences
• Dietary restrictions

IMPORTANT: You must provide a valid JSON object structure with these fields:
{
  "textResponse": "Your formatted response text here",
  "changes": {
    "title": "Optional updated title",
    "ingredients": {
      "mode": "add" or "replace" or "none",
      "items": [] (array of updated ingredients objects)
    },
    "instructions": [] (array of updated instructions)
  },
  "nutrition": {
    "kcal": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number
  },
  "health_insights": ["insight1", "insight2"],
  "follow_up_questions": ["question1", "question2", "question3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    
    try {
      // Ensure we can parse the JSON response
      const parsedContent = JSON.parse(content);
      
      // Create a structured response object
      const suggestion = {
        response: parsedContent.textResponse || content,
        changes: {
          title: parsedContent.changes?.title || null,
          ingredients: parsedContent.changes?.ingredients || null,
          instructions: parsedContent.changes?.instructions || null,
          nutrition: parsedContent.nutrition || {},
          health_insights: parsedContent.health_insights || []
        },
        followUpQuestions: parsedContent.follow_up_questions || [
          "How would you like to adjust the nutritional profile of this recipe?",
          "Are there any specific health goals you're trying to achieve?",
          "Would you like to explore alternative ingredients for better nutrition?"
        ]
      };
      
      return new Response(JSON.stringify(suggestion), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (e) {
      console.error("Error parsing AI response:", e);
      // If JSON parsing fails, return a friendly error
      return new Response(JSON.stringify({ 
        error: "Failed to generate proper recipe suggestions. Please try again.",
        details: e.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Recipe chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
