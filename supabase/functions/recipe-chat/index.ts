
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

// Nutrition data validation function
function validateNutrition(nutrition) {
  if (!nutrition || typeof nutrition !== 'object') {
    console.warn("Invalid nutrition data format: not an object");
    return false;
  }
  
  // Check for basic required fields
  const hasCalories = nutrition.calories !== undefined || nutrition.kcal !== undefined;
  const hasProtein = nutrition.protein !== undefined || nutrition.protein_g !== undefined;
  const hasCarbs = nutrition.carbs !== undefined || nutrition.carbs_g !== undefined;
  const hasFat = nutrition.fat !== undefined || nutrition.fat_g !== undefined;
  
  // Must have calories plus at least one macronutrient
  if (!hasCalories) {
    console.warn("Missing calories in nutrition data");
    return false;
  }
  
  if (!hasProtein && !hasCarbs && !hasFat) {
    console.warn("Missing all macronutrients in nutrition data");
    return false;
  }
  
  // Check that values are numeric and reasonable
  const calories = Number(nutrition.calories || nutrition.kcal || 0);
  const protein = Number(nutrition.protein || nutrition.protein_g || 0);
  const carbs = Number(nutrition.carbs || nutrition.carbs_g || 0);
  const fat = Number(nutrition.fat || nutrition.fat_g || 0);
  
  if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
    console.warn("Non-numeric values in nutrition data");
    return false;
  }
  
  if (calories < 0 || calories > 10000 || 
      protein < 0 || protein > 500 || 
      carbs < 0 || carbs > 500 || 
      fat < 0 || fat > 500) {
    console.warn("Nutrition values out of reasonable range");
    return false;
  }
  
  return true;
}

// Standardize nutrition data to consistent format
function standardizeNutrition(nutrition) {
  if (!nutrition) return null;
  
  const standardized = {};
  
  // Map calories (we want both fields populated for compatibility)
  if (nutrition.calories !== undefined) {
    standardized.calories = Number(nutrition.calories);
    standardized.kcal = Number(nutrition.calories);
  } else if (nutrition.kcal !== undefined) {
    standardized.calories = Number(nutrition.kcal);
    standardized.kcal = Number(nutrition.kcal);
  }
  
  // Map protein fields
  if (nutrition.protein !== undefined) {
    standardized.protein = Number(nutrition.protein);
    standardized.protein_g = Number(nutrition.protein);
  } else if (nutrition.protein_g !== undefined) {
    standardized.protein = Number(nutrition.protein_g);
    standardized.protein_g = Number(nutrition.protein_g);
  }
  
  // Map carbs fields
  if (nutrition.carbs !== undefined) {
    standardized.carbs = Number(nutrition.carbs);
    standardized.carbs_g = Number(nutrition.carbs);
  } else if (nutrition.carbs_g !== undefined) {
    standardized.carbs = Number(nutrition.carbs_g);
    standardized.carbs_g = Number(nutrition.carbs_g);
  }
  
  // Map fat fields
  if (nutrition.fat !== undefined) {
    standardized.fat = Number(nutrition.fat);
    standardized.fat_g = Number(nutrition.fat);
  } else if (nutrition.fat_g !== undefined) {
    standardized.fat = Number(nutrition.fat_g);
    standardized.fat_g = Number(nutrition.fat_g);
  }
  
  // Other fields
  if (nutrition.fiber !== undefined) standardized.fiber = Number(nutrition.fiber);
  if (nutrition.fiber_g !== undefined) standardized.fiber_g = Number(nutrition.fiber_g);
  if (nutrition.sugar !== undefined) standardized.sugar = Number(nutrition.sugar);
  if (nutrition.sugar_g !== undefined) standardized.sugar_g = Number(nutrition.sugar_g);
  if (nutrition.sodium !== undefined) standardized.sodium = Number(nutrition.sodium);
  if (nutrition.sodium_mg !== undefined) standardized.sodium_mg = Number(nutrition.sodium_mg);
  
  return standardized;
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
  
  // If nutrition data is present, validate and standardize it
  if (response.changes.nutrition) {
    if (!validateNutrition(response.changes.nutrition)) {
      console.warn("Invalid nutrition data in AI response, removing");
      delete response.changes.nutrition;
    } else {
      // Standardize the nutrition data
      response.changes.nutrition = standardizeNutrition(response.changes.nutrition);
    }
  }

  // If science notes are present, validate they're an array
  if (response.changes.science_notes) {
    if (!Array.isArray(response.changes.science_notes)) {
      console.warn("Invalid science_notes format in AI response, should be an array");
      if (typeof response.changes.science_notes === 'string') {
        response.changes.science_notes = [response.changes.science_notes];
      } else {
        delete response.changes.science_notes;
      }
    }
  }

  // Ensure troubleshooting is an array if present
  if (response.troubleshooting && !Array.isArray(response.troubleshooting)) {
    console.warn("Invalid troubleshooting format in AI response, should be an array");
    if (typeof response.troubleshooting === 'string') {
      response.troubleshooting = [response.troubleshooting];
    } else {
      delete response.troubleshooting;
    }
  }

  // Ensure techniques is an array if present
  if (response.techniques && !Array.isArray(response.techniques)) {
    console.warn("Invalid techniques format in AI response, should be an array");
    if (typeof response.techniques === 'string') {
      response.techniques = [response.techniques];
    } else {
      delete response.techniques;
    }
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

    // Check if this is a science analysis request
    const isAnalysisRequest = sourceType === 'analysis';

    // Select appropriate prompt based on request type
    let systemPrompt;

    if (isAnalysisRequest) {
      systemPrompt = `You are a culinary scientist specializing in food chemistry and cooking techniques. Analyze this recipe through the lens of precision cooking and provide comprehensive insights.

Your analysis should include:

1. KEY CHEMISTRY INSIGHTS:
   - Detailed breakdown of key chemical processes (Maillard reactions, protein denaturation, etc.)
   - Scientific explanation of flavor development
   - Molecular interactions between ingredients

2. TECHNIQUE ANALYSIS:
   - Temperature-dependent explanations for each cooking step
   - Timing considerations with scientific rationale
   - Visual/tactile indicators of doneness with explanations
   - Equipment recommendations with scientific justification

3. TROUBLESHOOTING GUIDE:
   - Common issues with scientific explanations
   - Prevention and solutions based on food science principles
   - Ingredient substitution impacts and considerations

Format your response as JSON with these sections clearly separated:
{
  "textResponse": "Overall analysis summary formatted for readability",
  "science_notes": ["Array of detailed scientific notes about key chemistry processes"],
  "techniques": ["Array of detailed technique analyses with temperature explanations"],
  "troubleshooting": ["Array of common issues and science-based solutions"],
  "changes": {
    "science_notes": ["Array of scientific insights for storing with the recipe"]
  }
}

Be thorough, precise, and back everything with scientific principles. Include specific temperatures, timing considerations, and clear explanations of WHY each technique works as it does.`;
    } else {
      // Enhanced system prompt with stricter guidelines and nutrition guidance
      systemPrompt = `As a culinary scientist and registered dietitian, analyze this recipe and suggest specific improvements.
      
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
      
      4. NUTRITION DATA GUIDELINES:
         - ALWAYS provide nutrition data when ingredients change substantially
         - Format nutrition data consistently with BOTH forms of each field
           (calories/kcal, protein/protein_g, carbs/carbs_g, fat/fat_g)
         - Use only realistic macro values that align with ingredients
         - All nutrition values must be NUMBERS (not strings)
         - Include both calories AND macros (protein, carbs, fat) at minimum
         
      5. RESPONSE FORMAT:
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
          "nutrition": {
            "calories": number,
            "kcal": number,
            "protein": number,
            "protein_g": number,
            "carbs": number,
            "carbs_g": number,
            "fat": number,
            "fat_g": number
          },
          "science_notes": ["array of scientific insights"]
        },
        "followUpQuestions": ["array of relevant follow-up questions"]
      }`;
    }

    console.log(`Sending ${isAnalysisRequest ? 'analysis' : 'standard'} request to OpenAI`);
    
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
    console.log(`Received response from OpenAI (${content.length} chars)`);
    
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
      
      // Enhanced nutrition validation to ensure proper data structure
      if (parsedContent.changes.nutrition) {
        const standardizedNutrition = standardizeNutrition(parsedContent.changes.nutrition);
        
        if (validateNutrition(standardizedNutrition)) {
          parsedContent.changes.nutrition = standardizedNutrition;
          console.log("Standardized nutrition data:", {
            calories: standardizedNutrition.calories,
            protein: standardizedNutrition.protein,
            carbs: standardizedNutrition.carbs,
            fat: standardizedNutrition.fat
          });
        } else {
          console.warn("Removing invalid nutrition data from response");
          delete parsedContent.changes.nutrition;
        }
      }

      // For analysis requests, make sure we properly structure the science notes
      if (isAnalysisRequest) {
        // Ensure science_notes is set in the changes object for storage with the recipe
        if (!parsedContent.changes.science_notes && parsedContent.science_notes) {
          parsedContent.changes.science_notes = parsedContent.science_notes;
          console.log("Copied science_notes to changes.science_notes for recipe storage");
        }

        console.log("Validated recipe analysis response:", {
          hasTextResponse: !!parsedContent.textResponse,
          hasScienceNotes: Array.isArray(parsedContent.changes?.science_notes),
          scienceNoteCount: Array.isArray(parsedContent.changes?.science_notes) ? parsedContent.changes.science_notes.length : 0,
          hasTechniques: Array.isArray(parsedContent.techniques),
          hasTroubleshooting: Array.isArray(parsedContent.troubleshooting)
        });
      } else {
        console.log("Validated recipe chat response:", {
          hasIngredients: !!parsedContent.changes?.ingredients,
          ingredientMode: parsedContent.changes?.ingredients?.mode,
          ingredientCount: parsedContent.changes?.ingredients?.items?.length,
          hasNutrition: !!parsedContent.changes?.nutrition
        });
      }
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
