
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

  return `
As a culinary scientist in the López-Alt tradition, create a comprehensive recipe:
• Cuisine – ${safeCuisine}  
• Dietary – ${safeDiet}  
• Main ingredient – ${safeMain}
• Flavor profile – ${safeTags}
• Servings – ${safeServings}
${calorieConstraint}
• Unique Generation ID – ${uniqueId}

──────── MANDATORY INSTRUCTION DETAILS ────────
• You MUST write a KENJI LÓPEZ-ALT style recipe with SCIENTIFIC explanations
• EVERY step MUST explain the science behind the technique
• EVERY step MUST include precise temps (°F AND °C) and timing
• ABSOLUTELY NO SIMPLIFIED STEPS ALLOWED
• Each step MUST be 3-5 sentences with scientific reasoning
• DO NOT merge multiple actions into single steps

──────── REJECTION CRITERIA (DO NOT DO THESE) ────────
• TOO BRIEF: "Sauté onions until translucent" ✗ 
  CORRECT: "Sauté onions over medium-low heat (325°F/165°C) for 8-10 minutes until translucent with a slight golden edge. This slow rendering process allows the onions' natural sugars to caramelize without burning, producing flavor compounds like 2-acetyl-1-pyrroline that contribute to the aromatic profile. Stir occasionally to ensure even heat distribution across the allium's cell structure." ✓
• TOO VAGUE: "Cook until done" ✗
  CORRECT: "Continue cooking the mixture, stirring frequently, until it reaches an internal temperature of 165°F (74°C) and the sauce coats the back of a spoon, approximately 12-15 minutes. This temperature ensures protein denaturation is complete while the extended simmer allows for Maillard reactions to develop complex flavor compounds. The coating consistency indicates proper reduction and emulsification of the fats and liquids." ✓

──────── IMPORTANT STRUCTURE NOTES (mandatory) ────────
• Recipe MUST include AT LEAST 10-15 steps - DO NOT limit the number of steps or combine actions
• Each step must represent a single coherent action or technique
• Each step should be detailed and thorough in López-Alt style
• Separate different cooking procedures into individual steps (e.g., don't combine prep, cooking, and finishing)

──────── STEP SPECIFICITY (mandatory) ────────
• Each step should explain the WHY behind the technique
• Include precise sensory cues for doneness ("foam subsides and butter turns nutty brown with aroma of toasted hazelnuts")
• López-Alt style example step: "Heat butter in a 10-inch skillet over medium-high heat until melted. Continue cooking, swirling pan constantly until butter is dark golden brown and has nutty aroma, about 1 minute. Remove skillet from heat and stir in capers, lemon juice, and parsley. Swirl to combine, creating an emulsified sauce."

──────── EXAMPLE OF REQUIRED DETAIL LEVEL ────────
"In a 10-inch stainless steel skillet, heat **olive oil** over medium-high heat (375°F/190°C) until shimmering but not smoking, about 2 minutes. The oil's temperature is critical—too low and the **chicken** won't brown properly due to insufficient Maillard reaction; too high and the volatile compounds will break down, creating acrid flavors. Add the seasoned **chicken thighs** skin-side down in a single layer, being careful not to overcrowd which would cause steaming rather than browning. The immediate sizzle you hear is water molecules rapidly evaporating from the meat's surface—a crucial first step in achieving properly browned proteins."

──────── STEP PLANNING FRAMEWORK ────────
First, plan your recipe structure:
1. Initial preparation steps
2. Primary cooking method for main ingredient
3. Development of flavors and textures
4. Final adjustments and finishing
5. Plating and serving considerations

Then for EACH step include:
• Exact temperatures (°F AND °C) and timing
• Scientific explanation of chemical/physical processes
• Sensory indicators for monitoring progress
• Reason why this technique produces superior results

──────── DATA PIPELINE (mandatory) ────────
1. Convert ingredients to g/ml.  
2. Match to **FDC SR Legacy R28** (fallback FNDDS 2019-20); store \`fdc_id\`.  
3. Apply USDA *Food Yield Factors* ➝ edible weight.  
4. Apply USDA *Nutrient Retention Factors R6*.  
5. Energy check – macro-kcal within 5% of total; set \`calorie_check_pass\`.

──────── TONE & STEP RULES (mandatory) ────────
• Use López-Alt's characteristic specificity and scientific explanation
• Wrap every ingredient in **double-asterisks** **exactly spelled**
• Each step MUST include rationale (e.g., "which promotes Maillard reaction")
• Heat steps must list equipment, temperature range °F (°C), time range, AND descriptive sensory cue
• DO NOT consolidate steps - use AT LEAST 10-15 separate steps for a complete recipe
• NO vague terms ("until hot" ✗) - always use precise descriptors

──────── MEASUREMENT STANDARDIZATION (mandatory) ────────
• ALWAYS provide BOTH imperial AND metric measurements for each ingredient
• For imperial: use oz, lb, cups, tbsp, tsp, inches, °F
• For metric: use g, kg, ml, L, cm, °C
• Include both systems using qty_metric, unit_metric, qty_imperial, unit_imperial for each ingredient
• Use fractions for small quantities in imperial

──────── SHOPPABLE INGREDIENTS ────────
Format each as object → { 
  qty_imperial: number, 
  unit_imperial: string, 
  qty_metric: number, 
  unit_metric: string, 
  shop_size_qty: number, 
  shop_size_unit: string, 
  item: string, 
  notes: string 
}  
\`shop_size_qty\` ≥ recipe qty (spices/herbs exempt).

──────── RETURN JSON (schema fixed) ────────
{
  "title": "string",
  "description": "ONE sentence of the key science insight",
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
  "steps": [ "DETAILED instruction strings with scientific explanations" ],
  "prepTime": number,
  "cookTime": number,
  "prep_time_min": number,
  "cook_time_min": number,
  "servings": number,
  "nutritionHighlight": "ONE evidence-based benefit",
  "cookingTip": "ONE science-backed technique note",
  "nutrition": {
    "kcal": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number,
    "sugar_g": number,
    "sodium_mg": number,
    "vitamin_a_iu": number,
    "vitamin_c_mg": number,
    "vitamin_d_iu": number,
    "calcium_mg": number,
    "iron_mg": number,
    "potassium_mg": number,
    "data_quality": "complete" | "partial",
    "calorie_check_pass": boolean
  },
  "calorie_check_pass": boolean
}`;
}
