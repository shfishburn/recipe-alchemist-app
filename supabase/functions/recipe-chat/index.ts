
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Add quantity validation ranges by ingredient type
const QUANTITY_RANGES = {
  spices: { min: 0.25, max: 4, unit: 'tablespoons' },
  herbs: { min: 0.25, max: 4, unit: 'tablespoons' },
  proteins: { min: 4, max: 16, unit: 'ounces' },
  vegetables: { min: 0.5, max: 6, unit: 'cups' },
  liquids: { min: 0.25, max: 8, unit: 'cups' },
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
      .join('\n');

    // Enhanced system prompt with stricter guidelines
    const systemPrompt = `As a culinary scientist and registered dietitian, analyze this recipe and suggest improvements.
    
    IMPORTANT GUIDELINES FOR RECIPE MODIFICATIONS:
    1. EXISTING INGREDIENTS:
       Current recipe ingredients:
       ${existingIngredientsText}
       
       STRICT RULES:
       - NEVER suggest ingredients that already exist (check thoroughly for variations/synonyms)
       - When suggesting new ingredients, explain WHY they enhance the recipe
       - Use "add" mode ONLY for genuinely new ingredients
       - Use "replace" mode ONLY for complete recipe revisions
       - Use "none" mode when no changes are needed
       
    2. QUANTITY GUIDELINES:
       Serving size: ${recipe.servings}
       - Quantities MUST be proportional to serving size
       - Follow these ranges per serving (adjust for total servings):
         - Proteins: 4-8 oz per serving
         - Vegetables: 0.5-2 cups per serving
         - Spices/Herbs: 0.25-1 tsp per serving
         - Liquids: 0.25-2 cups per serving
       - Flag any quantities outside these ranges
       - Preserve core ingredient ratios unless specifically improving them
       
    3. NAMING CONVENTIONS:
       - Use standard ingredient names (e.g., "onion" not "onions")
       - Be specific with varieties (e.g., "yellow onion" vs just "onion")
       - Include preparation state if relevant (e.g., "diced yellow onion")

    Format response as JSON:
    {
      "textResponse": "Detailed analysis with scientific reasoning",
      "changes": {
        "title": "optional new title",
        "ingredients": {
          "mode": "add" or "replace" or "none",
          "items": [
            {
              "qty": number,
              "unit": "string",
              "item": "string",
              "notes": "string explaining WHY this change enhances the recipe"
            }
          ]
        },
        "instructions": ["string array of steps"],
        "nutrition": {},
        "science_notes": ["array of scientific insights"]
      },
      "followUpQuestions": ["array of relevant follow-up questions"]
    }`;

    console.log("Sending request to OpenAI with enhanced prompts");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    console.log("Received response from OpenAI:", content.substring(0, 200));
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
      
      // Validate ingredient quantities against serving size
      if (parsedContent.changes?.ingredients?.items) {
        parsedContent.changes.ingredients.items = parsedContent.changes.ingredients.items
          .map(ingredient => {
            const qtyPerServing = ingredient.qty / recipe.servings;
            let warning = null;
            
            // Check quantities against ranges
            for (const [type, range] of Object.entries(QUANTITY_RANGES)) {
              if (ingredient.item.toLowerCase().includes(type) && 
                  ingredient.unit.toLowerCase().includes(range.unit) &&
                  (qtyPerServing < range.min || qtyPerServing > range.max)) {
                warning = `Warning: ${ingredient.qty} ${ingredient.unit} of ${ingredient.item} ` +
                         `may be outside normal range for ${recipe.servings} servings`;
                break;
              }
            }
            
            return {
              ...ingredient,
              notes: warning ? `${ingredient.notes || ''}\n${warning}` : ingredient.notes
            };
          });
      }
      
      console.log("Validated recipe chat response:", {
        hasIngredients: !!parsedContent.changes?.ingredients,
        ingredientMode: parsedContent.changes?.ingredients?.mode,
        ingredientCount: parsedContent.changes?.ingredients?.items?.length
      });
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Invalid response format from AI');
    }

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
