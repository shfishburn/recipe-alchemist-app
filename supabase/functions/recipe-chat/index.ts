
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

    let prompt = `As an expert culinary scientist and chef specializing in science-based cooking techniques, provide detailed analysis and improvements for recipes using evidence-based methods and molecular gastronomy principles. 

Your expertise combines:
- Advanced understanding of chemical reactions in cooking
- Precise temperature control and timing
- Ingredient interactions and flavor compound development
- Texture optimization through protein and starch manipulation
- Scientific measurement and repeatability in recipes

Format your response as JSON with this exact structure:

{
  "textResponse": "Your detailed, scientific analysis explaining the improvements and techniques",
  "changes": {
    "title": "Updated recipe title if relevant",
    "ingredients": {
      "mode": "replace" | "add",
      "items": [
        {
          "qty": number,
          "unit": "g" | "ml" | "tbsp" | "tsp" | "cup" | "piece",
          "item": "ingredient name",
          "notes": "optional preparation notes"
        }
      ]
    },
    "instructions": [
      "Precise, numbered steps with temperatures, times, and visual/sensory cues"
    ],
    "equipmentNeeded": [
      "Required tools and equipment"
    ]
  },
  "nutrition": {
    "kcal": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number,
    "sugar_g": number,
    "sodium_mg": number
  },
  "science_notes": [
    "Key scientific principles and reactions",
    "Temperature-dependent changes",
    "Chemical interactions between ingredients",
    "Optimization rationales"
  ],
  "health_insights": [
    "Nutritional benefits",
    "Dietary considerations",
    "Potential modifications for different needs"
  ],
  "followUpQuestions": [
    "What happens if we adjust X temperature?",
    "How does Y ingredient affect texture?",
    "Can we optimize Z process further?"
  ]
}`;

    prompt += `\n\nCurrent recipe:
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
      
      // Create a structured response object - include followUpQuestions in the main response
      const responseWithFollowUp = {
        textResponse: parsedContent.textResponse || content,
        changes: parsedContent.changes || null,
        nutrition: parsedContent.nutrition || {},
        health_insights: parsedContent.health_insights || [],
        equipmentNeeded: parsedContent.changes?.equipmentNeeded || [],
        science_notes: parsedContent.science_notes || [],
        followUpQuestions: parsedContent.followUpQuestions || [
          "How would the science behind this recipe change if we altered the cooking temperature?",
          "What specific chemical reactions occur when cooking this dish?",
          "How could we modify this recipe for different dietary restrictions while maintaining the same flavor profile?"
        ]
      };
      
      // Convert the entire response to a string for storage
      const suggestion = {
        response: JSON.stringify(responseWithFollowUp),
        changes: {
          title: parsedContent.changes?.title || null,
          ingredients: parsedContent.changes?.ingredients || null,
          instructions: parsedContent.changes?.instructions || null,
          nutrition: parsedContent.nutrition || {},
          health_insights: parsedContent.health_insights || [],
          equipmentNeeded: parsedContent.changes?.equipmentNeeded || [],
          science_notes: parsedContent.science_notes || []
        }
      };
      
      console.log("Returning structured response to client");
      return new Response(JSON.stringify(suggestion), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (e) {
      console.error("Error parsing AI response:", e);
      console.error("Raw response content:", content);
      
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
