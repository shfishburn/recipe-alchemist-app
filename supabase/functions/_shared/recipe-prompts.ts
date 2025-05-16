
/**
 * Shared module for recipe prompts used across multiple edge functions
 * This ensures consistent recipe generation and modification schemas
 */

/**
 * Builds a prompt for generating a recipe based on the provided parameters
 * Follows a standardized schema for consistent recipe generation
 * @param params Recipe generation parameters
 * @returns Formatted prompt string for OpenAI
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

/**
 * Builds a unified recipe prompt that includes the original recipe and user's modification request
 * Ensures consistent recipe schema between generation and modification
 * @param originalRecipe The recipe to be modified
 * @param userMessage User's request for modifications
 * @param versionNumber Version number to use for the modified recipe
 * @returns Formatted prompt string for OpenAI
 */
export function buildUnifiedRecipePrompt(
  originalRecipe: Record<string, any>,
  userMessage: string,
  versionNumber: number
): string {
  // Clean up recipe for the prompt context
  const cleanRecipe = {
    id: originalRecipe.id,
    title: originalRecipe.title,
    instructions: originalRecipe.instructions,
    ingredients: originalRecipe.ingredients,
    science_notes: originalRecipe.science_notes || [],
    servings: originalRecipe.servings,
    prep_time_min: originalRecipe.prep_time_min,
    cook_time_min: originalRecipe.cook_time_min,
    cuisine: originalRecipe.cuisine,
    cuisine_category: originalRecipe.cuisine_category,
    description: originalRecipe.description,
    nutrition: originalRecipe.nutrition
  };
  
  // Format for the prompt 
  return `
You are a culinary scientist and expert chef in the López-Alt tradition, analyzing and modifying recipes through the lens of food chemistry and precision cooking techniques.

CURRENT RECIPE (JSON):
${JSON.stringify(cleanRecipe, null, 2)}

USER REQUEST:
"${userMessage}"

IMPORTANT INSTRUCTIONS (MANDATORY):
1. Analyze the user's request carefully to determine if they want:
   a) A simple answer to a question (return as textResponse only)
   b) Modification to the recipe (return complete modified recipe)

2. When modifying a recipe, you MUST ALWAYS RETURN A COMPLETE RECIPE OBJECT strictly adhering to this JSON schema:
{
  "textResponse": "Detailed summary of recipe modifications", // mandatory
  "recipe": {
    "id": "${originalRecipe.id}", // mandatory - preserve original ID
    "title": "Recipe Title", // mandatory
    "description": "ONE clear sentence summarizing key science insight", // mandatory
    "ingredients": [{ // mandatory array - every ingredient MUST have all these fields
      "qty_imperial": number, // mandatory
      "unit_imperial": string, // mandatory
      "qty_metric": number, // mandatory
      "unit_metric": string, // mandatory
      "shop_size_qty": number, // mandatory
      "shop_size_unit": string, // mandatory
      "item": string, // mandatory - ingredient name
      "notes": string // optional, defaults to empty string
    }],
    "instructions": ["Detailed step-by-step instructions with scientific explanations"], // mandatory
    "prep_time_min": number, // mandatory in minutes
    "cook_time_min": number, // mandatory in minutes
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
    },
    "version_info": { // mandatory
      "version_number": ${versionNumber}, // mandatory - incremented explicitly
      "parent_version_id": "${originalRecipe.version_id || null}", // mandatory
      "modification_reason": "Brief summary of the reason for changes" // mandatory
    }
  },
  "followUpQuestions": ["Suggested follow-up question 1", "Suggested follow-up question 2"] // optional
}

MANDATORY RULES:
- NEVER return partial changes.
- ALWAYS provide ALL mandatory fields.
- Keep the correct version_number (${versionNumber}) in the response.
- Retain original recipe ID (${originalRecipe.id}) and parent_version_id fields properly.
- If unsure about optional nutritional fields, default to zero or minimal value for robustness.
- Wrap ingredient names in instructions with **double-asterisks**.
- Include specific temperatures (°F AND °C) in cooking steps.
- Maintain López-Alt style scientific explanations in instructions.

3. For recipe formatting:
   - Format each ingredient consistently with all required measurement fields
   - Include both imperial and metric measurements for all ingredients
   - Ensure all ingredients have the required fields: qty_imperial, unit_imperial, qty_metric, unit_metric, item
   - Wrap ingredient names in recipe steps with **double asterisks**
   - Include specific temperatures (°F AND °C) in cooking steps

4. If the user is just asking a question and not requesting changes, only include the textResponse field and followUpQuestions in your JSON response.
`;
}
