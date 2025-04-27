
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

    let prompt = `As a culinary scientist and registered dietitian in the López-Alt tradition, analyze and improve this recipe with precise, science-backed techniques. Your response should:

1. Examine Chemical Processes:
   - Explain Maillard reactions, caramelization, and enzymatic activities occurring
   - Detail how heat transfer methods affect flavor compound development
   - Describe protein denaturation and starch gelatinization specific to these ingredients
   - Identify key flavor molecules and their interactions during cooking

2. Enhance Techniques with Scientific Precision:
   - Specify exact temperatures, timing, and visual/tactile doneness cues
   - Explain how ingredient preparation affects texture and flavor (e.g., cutting techniques, resting times)
   - Provide equipment recommendations based on thermal properties
   - Include troubleshooting for common issues with scientific explanations

3. Optimize Nutritional Impact:
   - Detail nutrient changes during cooking (retention, loss, or enhancement)
   - Explain how cooking methods affect bioavailability of nutrients
   - Suggest evidence-based modifications for different health goals
   - Provide margin-of-error for nutritional calculations with explanation

4. Transform Ingredient Understanding:
   - Explain chemical composition of key ingredients and their functional roles
   - Detail how ingredient quality indicators affect results
   - Provide scientifically-validated substitutions with reasoning
   - Explain how ingredient temperature, pH, and freshness impact outcomes

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
          "notes": "scientific rationale for preparation or selection"
        }
      ]
    },
    "instructions": [
      "Precise, numbered steps with temperatures, times, and visual/sensory cues"
    ],
    "equipmentNeeded": [
      "Required tools and equipment with scientific justification"
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
    "Key scientific principles and reactions specific to this recipe",
    "Temperature-dependent changes with molecular explanations",
    "Chemical interactions between ingredients with compound names",
    "Optimization rationales based on food science research"
  ],
  "health_insights": [
    "Evidence-based nutritional benefits with citations where possible",
    "Functional properties of key ingredients",
    "Metabolic impacts and considerations",
    "Suggested modifications for specific dietary needs with scientific reasoning"
  ],
  "followUpQuestions": [
    "Specific questions about variable control in this recipe",
    "Inquiries about molecular gastronomy applications",
    "Questions about scaling or adapting techniques"
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
