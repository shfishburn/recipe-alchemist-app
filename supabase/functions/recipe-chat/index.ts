
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

// Helper functions for improved ingredient comparisons
function normalizeString(str) {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

function basicStringSimilarity(str1, str2) {
  const norm1 = normalizeString(str1);
  const norm2 = normalizeString(str2);
  
  // Direct match
  if (norm1 === norm2) return 1.0;
  
  // Check if one is a subset of the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return Math.min(norm1.length, norm2.length) / Math.max(norm1.length, norm2.length);
  }
  
  // Calculate simple word overlap
  const words1 = norm1.split(' ');
  const words2 = norm2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

function validateAIResponse(response) {
  // Check if response has required fields
  if (!response.textResponse) {
    console.error("Missing textResponse in AI response");
    return false;
  }
  
  // Ensure changes field exists with expected structure
  if (!response.changes) {
    console.error("Missing changes field in AI response");
    return false;
  }
  
  // Check follow-up questions
  if (!Array.isArray(response.followUpQuestions)) {
    console.warn("Missing or invalid followUpQuestions array");
    // Not critical, so don't fail validation
    response.followUpQuestions = [];
  }
  
  return true;
}

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
    const systemPrompt = `As a culinary scientist and registered dietitian, analyze this recipe and suggest specific improvements.
    
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
       
    4. RESPONSE FORMAT:
       - Use a conversational tone appropriate for a professional chef
       - ALWAYS highlight specific recommended changes in your response
       - ALWAYS provide scientific reasoning behind each recommendation
       - ALWAYS include specific measurement changes where applicable

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
      temperature: 0.5, // Reduced for more consistent formatting
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    console.log("Received response from OpenAI:", content.substring(0, 200));
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
      
      // Perform deeper validation on the response
      if (!validateAIResponse(parsedContent)) {
        throw new Error('AI response failed validation checks');
      }
      
      // Enhanced ingredient validation and duplicate detection
      if (parsedContent.changes?.ingredients?.items) {
        const existingIngredientNames = recipe.ingredients.map(ing => ing.item.toLowerCase().trim());
        
        // Detect duplicates with improved similarity comparison
        const duplicates = [];
        parsedContent.changes.ingredients.items = parsedContent.changes.ingredients.items
          .filter(ingredient => {
            // Check against existing ingredients
            for (const existing of recipe.ingredients) {
              const similarity = basicStringSimilarity(existing.item, ingredient.item);
              if (similarity > 0.7) {  // If more than 70% similar, consider as duplicate
                duplicates.push({
                  suggested: ingredient.item,
                  existing: existing.item,
                  similarity: similarity
                });
                return false; // Filter out this ingredient
              }
            }
            return true; // Keep this ingredient
          })
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
        
        // If all suggested ingredients were filtered as duplicates in "add" mode,
        // change the mode to "none" to prevent empty array issues
        if (parsedContent.changes.ingredients.mode === 'add' && 
            parsedContent.changes.ingredients.items.length === 0) {
          console.log("All suggested ingredients were duplicates, changing mode to 'none'");
          parsedContent.changes.ingredients.mode = 'none';
        }
        
        if (duplicates.length > 0) {
          console.log("Filtered out duplicate ingredients:", duplicates);
        }
      }
      
      console.log("Validated recipe chat response:", {
        hasIngredients: !!parsedContent.changes?.ingredients,
        ingredientMode: parsedContent.changes?.ingredients?.mode,
        ingredientCount: parsedContent.changes?.ingredients?.items?.length
      });
    } catch (error) {
      console.error('Error parsing or validating OpenAI response:', error);
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
