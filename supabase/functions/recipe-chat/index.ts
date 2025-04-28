
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

    const existingIngredientsText = recipe.ingredients
      .map(ing => `${ing.qty} ${ing.unit} ${ing.item}`)
      .join(', ');

    const systemPrompt = `As a culinary scientist and registered dietitian, analyze this recipe and suggest improvements.
    
    IMPORTANT GUIDELINES FOR RECIPE MODIFICATIONS:
    1. EXISTING INGREDIENTS: The recipe currently contains: ${existingIngredientsText}
       - DO NOT suggest adding ingredients that already exist in the recipe
       - When suggesting new ingredients, ensure they complement existing ones
       - Only use "add" mode for genuinely new ingredients
       - Use "replace" mode ONLY for complete recipe revisions
       - Use "none" mode when no ingredient changes are needed
       
    2. QUANTITY GUIDELINES:
       - For a serving size of ${recipe.servings}, quantities must be proportional
       - Justify ANY significant quantity changes with culinary or scientific reasoning
       - Flag unreasonable quantities (e.g., 3 lbs meat for 2 servings)
       - Preserve the original recipe's core ratios unless specifically improving them
    
    Format your response as JSON with these fields:
    {
      "textResponse": "Your detailed analysis and recommendations",
      "changes": {
        "title": "optional new title",
        "ingredients": {
          "mode": "add" or "replace" or "none",
          "items": [
            {
              "qty": number,
              "unit": "string",
              "item": "string",
              "notes": "string explaining any significant changes"
            }
          ]
        },
        "instructions": ["string array of steps"],
        "nutrition": {},
        "science_notes": ["array of scientific insights"]
      },
      "followUpQuestions": ["array of follow-up questions"]
    }

    When suggesting ingredient changes:
    1. Default to "none" mode unless changes are needed
    2. Include detailed notes explaining quantity changes
    3. Format ingredient references with **bold** text
    4. Validate all quantities against serving size`;

    console.log("Sending request to OpenAI with enhanced prompts for proper scaling");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this ${recipe.cuisine || 'standard'} recipe for ${recipe.title} with ${recipe.servings} servings in JSON format.` }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    console.log("Received response from OpenAI:", content.substring(0, 100) + "...");
    
    const parsedContent = JSON.parse(content);
    console.log("Parsed recipe chat response:", {
      hasIngredients: !!parsedContent.changes?.ingredients,
      ingredientMode: parsedContent.changes?.ingredients?.mode,
      ingredientCount: parsedContent.changes?.ingredients?.items?.length
    });

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

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
