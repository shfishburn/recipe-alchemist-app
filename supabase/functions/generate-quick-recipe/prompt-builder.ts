
/**
 * Builds a prompt for generating a recipe based on the provided parameters
 * Follows a standardized schema for consistent recipe generation
 */
export function buildOpenAIPrompt(params: any): string {
  const {
    cuisines = [],
    ingredients = [],
    servings = 2,
    maxCalories,
    dietary
  } = params || {};

  // Get primary ingredient
  const primaryIngredient = ingredients && ingredients.length > 0 
    ? ingredients[0] 
    : "chef's choice";

  // Format dietary constraints
  const dietarySection = dietary 
    ? `\nDietary: ${dietary.charAt(0).toUpperCase() + dietary.slice(1)}` 
    : '';

  // Format cuisine constraints
  let cuisineSection = '';
  if (cuisines && cuisines.length > 0) {
    const cuisineList = Array.isArray(cuisines) ? cuisines.join(', ') : cuisines;
    cuisineSection = `\nCuisine: ${cuisineList}`;
  }

  // Format calorie constraint
  const caloriesSection = maxCalories ? `\nMax calories per serving: ${maxCalories}` : '';
  const ingredientsList = Array.isArray(ingredients) 
    ? ingredients.filter(Boolean).join(', ') 
    : primaryIngredient;

  return `
You are a culinary scientist and professional chef specializing in recipe development with scientific precision.

TASK:
Create a scientifically-informed recipe featuring ${ingredientsList}${cuisineSection}${dietarySection}.
Servings: ${servings}${caloriesSection}

INSTRUCTIONS:
- Create a complete recipe with scientific explanations and insights
- Use López-Alt style scientific cooking principles
- Provide dual measurements (imperial first, then metric)
- Include precise cooking temperatures (°F AND °C)
- Include precise cooking times
- For cooking steps, wrap ingredient names in **double-asterisks**
- Include concise science notes for key techniques

RETURN FORMAT (MANDATORY JSON SCHEMA):
Return your response as a JSON object strictly following this schema. Fields marked "mandatory" cannot be omitted.

{
  "title": "string", // mandatory
  "description": "ONE clear sentence summarizing key science insight", // mandatory
  "ingredients": [{ // mandatory array - each ingredient must include ALL these fields
    "qty_imperial": number, // mandatory
    "unit_imperial": "string", // mandatory
    "qty_metric": number, // mandatory
    "unit_metric": "string", // mandatory
    "shop_size_qty": number, // mandatory
    "shop_size_unit": "string", // mandatory
    "item": "string", // mandatory - ingredient name
    "notes": "string" // optional, defaults to empty string
  }],
  "instructions": ["Detailed step-by-step instructions with scientific explanations"], // mandatory
  "prep_time_min": number, // mandatory (minutes)
  "cook_time_min": number, // mandatory (minutes)
  "servings": number, // mandatory
  "cuisine": "EXACT cuisine value from predefined list", // mandatory
  "cuisine_category": "Global|Regional American|European|Asian|Dietary Styles|Middle Eastern", // mandatory
  "science_notes": ["Array of scientific explanations"], // mandatory
  "nutrition": { // mandatory object with all fields
    "calories": number, // mandatory (same as kcal)
    "kcal": number, // mandatory
    "protein_g": number, // mandatory
    "carbs_g": number, // mandatory
    "fat_g": number, // mandatory
    "fiber_g": number, // mandatory
    "sugar_g": number, // mandatory
    "sodium_mg": number, // mandatory
    "vitamin_a_iu": number, // optional, default 0 if unknown
    "vitamin_c_mg": number, // optional, default 0 if unknown
    "vitamin_d_iu": number, // optional, default 0 if unknown
    "calcium_mg": number, // optional, default 0 if unknown
    "iron_mg": number, // optional, default 0 if unknown
    "potassium_mg": number, // optional, default 0 if unknown
    "data_quality": "complete" | "partial", // mandatory
    "calorie_check_pass": boolean // mandatory
  }
}

CRITICAL RULES:
- Include ALL mandatory fields - omit NONE
- For optional fields you cannot populate accurately, default to zero or minimal sensible value
- Always double check the nutritional values for accuracy
- For measurements, provide BOTH imperial and metric
- Temperature instructions must include BOTH Fahrenheit AND Celsius
- Each step must be scientifically informative
`;
}
