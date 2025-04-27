
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

    const prompt = `As a culinary scientist and expert chef in the style of Cook's Illustrated, analyze this recipe and respond to the user's request with detailed, science-based improvements.

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

Your response MUST follow this structure:

1. Overview: A concise summary of your recommended changes and why they'll improve the recipe

2. Scientific Analysis: Explain the food science behind your recommendations, including chemical reactions, texture changes, or flavor development techniques

3. Technique Improvements: Describe precise cooking methods with specific temperatures, times, and visual/tactile indicators

4. Ingredient Modifications: Specify exact measurements for any ingredient changes with scientific justification

5. Nutritional Impact: Detail how your changes affect the nutritional profile with precise values

6. Testing Notes: Briefly describe how these recommendations have been tested and verified

Format your response for readability using:
• Clear section headings with colons
• Bullet points for lists (•)
• Precise measurements and temperatures
• Visual and sensory indicators for doneness
• Scientific terminology with plain English explanations

Also include 3 follow-up questions related to:
• Advanced techniques the user might want to learn
• Science behind a specific aspect of the recipe
• Variations to accommodate different dietary needs or equipment

IMPORTANT: Your response must be valid JSON following this schema:
{
  "textResponse": "Your formatted response with all sections above",
  "changes": {
    "title": "Optional updated title",
    "ingredients": {
      "mode": "add" or "replace" or "none",
      "items": [] (array of ingredients with qty, unit, item, and notes properties)
    },
    "instructions": [] (array of updated instructions with stepNumber, action, explanation, whyItWorks, troubleshooting, and indicator properties),
    "equipmentNeeded": [] (array of necessary equipment)
  },
  "nutrition": {
    "kcal": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number
  },
  "health_insights": ["insight1", "insight2"],
  "follow_up_questions": ["question1", "question2", "question3"],
  "scientific_principles": ["principle1", "principle2"]
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
          health_insights: parsedContent.health_insights || [],
          equipmentNeeded: parsedContent.changes?.equipmentNeeded || [],
          scientific_principles: parsedContent.scientific_principles || []
        },
        followUpQuestions: parsedContent.follow_up_questions || [
          "How would the science behind this recipe change if we altered the cooking temperature?",
          "What specific chemical reactions occur when cooking this dish?",
          "How could we modify this recipe for different dietary restrictions while maintaining the same flavor profile?"
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
