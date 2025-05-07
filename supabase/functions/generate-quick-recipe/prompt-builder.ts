
// Build a simpler prompt for OpenAI with just the essential instructions
export function buildOpenAIPrompt(params: {
  safeCuisine: string, 
  safeMain: string, 
  safeDiet: string, 
  safeServings: number,
  safeTags: string,
  maxCalories?: number,
  uniqueId: string
}): string {
  const {safeCuisine, safeMain, safeDiet, safeServings, safeTags, maxCalories, uniqueId} = params;
  
  // Simplified prompt for faster, more reliable responses
  return `Create a detailed recipe with:
Main Ingredient: ${safeMain}
Cuisine: ${safeCuisine}
Diet: ${safeDiet}
Servings: ${safeServings}
${maxCalories ? `Max Calories: ${maxCalories}` : ''}
ID: ${uniqueId}

Return ONLY a JSON object with this structure:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "ingredients": [
    {
      "qty_imperial": 1,
      "unit_imperial": "cup",
      "qty_metric": 240,
      "unit_metric": "ml",
      "item": "ingredient name",
      "notes": "optional notes"
    }
  ],
  "steps": [
    "Step 1 instructions",
    "Step 2 instructions"
  ],
  "prepTime": 10,
  "cookTime": 20,
  "servings": ${safeServings},
  "cuisine": "cuisine name"
}`;
}
