
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
    const { recipe, userMessage, sourceType, sourceUrl, sourceImage } = await req.json();

    let prompt = `As a culinary scientist and expert chef in the style of Cook's Illustrated, analyze this recipe and respond to the user's request with detailed, science-based improvements. Format your response as JSON with the structure shown in the example below.

Example JSON format:
{
  "textResponse": "Your detailed analysis here",
  "changes": {
    "title": "Updated title if applicable",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["step 1", "step 2"],
    "equipmentNeeded": ["equipment 1", "equipment 2"]
  },
  "nutrition": {
    "kcal": 300,
    "protein_g": 20
  },
  "health_insights": ["insight 1", "insight 2"],
  "scientific_principles": ["principle 1", "principle 2"],
  "follow_up_questions": ["question 1?", "question 2?"]
}`;

    // Add source-specific context to the prompt
    if (sourceType === 'image') {
      prompt += `\n\nAnalyzing recipe from uploaded image. Please extract the recipe details and then provide improvements.`;
    } else if (sourceType === 'url') {
      prompt += `\n\nAnalyzing recipe from URL: ${sourceUrl}. Please extract the recipe details and then provide improvements.`;
    }

    prompt += `
Current recipe:
- Title: ${recipe.title}
- Servings: ${recipe.servings}

Current Nutrition (per serving):
${Object.entries(recipe.nutrition || {}).map(([key, value]) => `- ${key.replace(/_/g, ' ')}: ${value}`).join('\n')}

Ingredients:
${recipe.ingredients.map(i => `- ${i.qty} ${i.unit} ${i.item}`).join('\n')}

Instructions:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}

User request: ${userMessage}`;

    console.log("Sending request to OpenAI with prompt");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    console.log("Received response from OpenAI:", content.substring(0, 100) + "...");
    
    try {
      // Ensure we can parse the JSON response
      const parsedContent = JSON.parse(content);
      console.log("Successfully parsed JSON response");
      
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
      
      console.log("Returning structured response to client");
      return new Response(JSON.stringify(suggestion), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (e) {
      console.error("Error parsing AI response:", e);
      console.error("Raw response content:", content);
      
      // If JSON parsing fails, return a friendly error
      return new Response(JSON.stringify({ 
        error: "Failed to generate proper recipe suggestions. Please try again.",
        details: e.message,
        rawResponse: content
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Recipe chat error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
