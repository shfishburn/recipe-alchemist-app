
// Build the prompt for OpenAI with all required instructions in a more efficient format
export function buildOpenAIPrompt(params: {
  safeCuisine: string, 
  safeMain: string, 
  safeDiet: string, 
  safeServings: number,
  safeTags: string,
  maxCalories?: number,
  uniqueId: string
}): string {
  const {safeCuisine,safeMain,safeDiet,safeServings,safeTags,maxCalories,uniqueId}=params;
  
  return `Create Kenji López-Alt scientific recipe:
Cuisine:${safeCuisine} Diet:${safeDiet} Main:${safeMain} Flavor:${safeTags} Servings:${safeServings}${maxCalories?` MaxCal:${maxCalories}`:''}
ID:${uniqueId}

CUISINE RULES:cuisine=one of[american,brazilian,caribbean,fusion,mexican,cajun-creole,midwest,new-england,pacific-northwest,southern,southwestern,tex-mex,british-irish,eastern-european,french,german,greek,italian,mediterranean,scandinavian-nordic,spanish,chinese,indian,japanese,korean,southeast-asian,thai,vietnamese,gluten-free,keto,low-fodmap,paleo,plant-based,vegetarian,whole30,middle-eastern,lebanese,turkish,persian,moroccan]
cuisine_category=one of[Global,Regional American,European,Asian,Dietary Styles,Middle Eastern]

CUISINE MAPPING:
Global:american,brazilian,caribbean,fusion
Regional American:mexican,cajun-creole,midwest,new-england,pacific-northwest,southern,southwestern,tex-mex
European:british-irish,eastern-european,french,german,greek,italian,mediterranean,scandinavian-nordic,spanish
Asian:chinese,indian,japanese,korean,southeast-asian,thai,vietnamese
Dietary Styles:gluten-free,keto,low-fodmap,paleo,plant-based,vegetarian,whole30
Middle Eastern:middle-eastern,lebanese,turkish,persian,moroccan

RECIPE FORMAT RULES:
1.EACH step MUST explain WHY this technique works with scientific reasoning
2.EVERY step MUST include precise temperatures(BOTH °F AND °C)
3.EVERY step MUST include exact timing(minutes/seconds)
4.ABSOLUTELY NO SIMPLIFIED STEPS-NO merging actions into single steps
5.Each step:3-5 sentences with scientific explanation
6.Include AT LEAST 10-15 detailed steps(separate distinct actions)
7.Wrap all ingredients in **double-asterisks**
8.Each step must explain the science behind the technique

MEASUREMENT RULES:ALWAYS provide BOTH imperial AND metric for all measurements
Format ingredients with both systems:qty_imperial,unit_imperial,qty_metric,unit_metric
Include shop_size_qty and shop_size_unit for purchasing needs

FAILURE EXAMPLES:
TOO BRIEF:"Sauté onions until translucent"✗
TOO VAGUE:"Cook until done"✗

CORRECT EXAMPLE:"Heat **butter** in a 10-inch skillet over medium-high heat(375°F/190°C)until melted and foaming subsides,about 2 minutes.This temperature initiates Maillard reactions without burning milk solids.Continue cooking,swirling pan constantly until butter turns dark golden brown with a nutty aroma,60-90 seconds longer.The color change indicates milk proteins have undergone ideal flavor-producing reactions."

DATA REQUIREMENTS:
Convert ingredients to g/ml with both imperial/metric
Include nutritional calculations
Verify total calorie count matches macronutrient sum

RETURN JSON:{
  "title":"string",
  "description":"ONE sentence of key science insight",
  "ingredients":[{
    qty_imperial:number,
    unit_imperial:string,
    qty_metric:number,
    unit_metric:string,
    shop_size_qty:number,
    shop_size_unit:string,
    item:string,
    notes:string
  }],
  "steps":["DETAILED scientific cooking instructions"],
  "prepTime":number,
  "cookTime":number,
  "prep_time_min":number,
  "cook_time_min":number,
  "servings":number,
  "cuisine":"string-exact value from list above",
  "cuisine_category":"string-exact category from list above",
  "nutritionHighlight":"ONE evidence-based benefit",
  "cookingTip":"ONE science-backed technique note",
  "nutrition":{
    "kcal":number,
    "protein_g":number,
    "carbs_g":number,
    "fat_g":number,
    "fiber_g":number,
    "sugar_g":number,
    "sodium_mg":number,
    "vitamin_a_iu":number,
    "vitamin_c_mg":number,
    "vitamin_d_iu":number,
    "calcium_mg":number,
    "iron_mg":number,
    "potassium_mg":number,
    "data_quality":"complete"|"partial",
    "calorie_check_pass":boolean
  }
}`
}
