
// Build the prompt for OpenAI with all required instructions
export function buildOpenAIPrompt(params: {
  safeCuisine: string, 
  safeMain: string, 
  safeDiet: string, 
  safeServings: number,
  safeTags: string,
  maxCalories?: number,
  uniqueId: string
}): string {
  const { 
    safeCuisine,
    safeMain,
    safeDiet, 
    safeServings,
    safeTags,
    maxCalories, 
    uniqueId 
  } = params;

  // Build calorie constraint if provided
  const calorieConstraint = maxCalories 
    ? `• Maximum calories per serving – ${maxCalories} kcal`
    : "";

  // Enhanced cuisine category guidance to ensure valid database values
  const cuisineCategoryGuidance = `
IMPORTANT: All cuisines must align with one of these cuisine_category values:
• Global - For general cuisines like american, brazilian, caribbean, fusion
• Regional American - For mexican, cajun-creole, midwest, southern, southwestern, tex-mex, etc.
• European - For french, italian, greek, mediterranean, eastern-european, etc.
• Asian - For chinese, indian, japanese, korean, thai, vietnamese, etc.
• Dietary Styles - For dietary-focused cuisines (keto, gluten-free, vegan, etc.)
• Middle Eastern - For middle-eastern, lebanese, turkish, persian, moroccan cuisines`;

  // Simplified prompt to reduce processing time while maintaining quality
  return `
Create a detailed recipe based on these requirements:
• Cuisine – ${safeCuisine}  
• Dietary – ${safeDiet}  
• Main ingredient – ${safeMain}
• Flavor profile – ${safeTags}
• Servings – ${safeServings}
${calorieConstraint}
• Unique Generation ID – ${uniqueId}

${cuisineCategoryGuidance}

REQUIREMENTS:
• Write detailed recipe steps with temperatures (°F and °C) and timing
• Provide scientific explanations for key techniques
• Include at least 8-10 steps with clear instructions
• Format ingredients with both imperial and metric units
• Always specify cooking temperatures and times precisely

MEASUREMENT FORMAT:
• Imperial: oz, lb, cups, tbsp, tsp, inches, °F
• Metric: g, kg, ml, L, cm, °C
• Include both measurement systems for each ingredient

RETURN JSON WITH THIS STRUCTURE:
{
  "title": "string",
  "description": "ONE sentence description",
  "ingredients": [{ 
    qty_imperial: number, 
    unit_imperial: string, 
    qty_metric: number, 
    unit_metric: string, 
    shop_size_qty: number, 
    shop_size_unit: string, 
    item: string, 
    notes: string 
  }],
  "steps": ["Detailed step-by-step instructions"],
  "prepTime": number,
  "cookTime": number,
  "prep_time_min": number,
  "cook_time_min": number,
  "servings": number,
  "cuisine": "string - MUST be from valid list",
  "cuisine_category": "string - Global/Regional American/European/Asian/Dietary Styles/Middle Eastern",
  "nutritionHighlight": "ONE evidence-based benefit",
  "cookingTip": "ONE science-backed technique note",
  "nutrition": {
    "kcal": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number,
    "sugar_g": number,
    "sodium_mg": number
  }
}`;
}
