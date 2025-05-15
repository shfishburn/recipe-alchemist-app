
# AI Prompts and Responses Documentation

This document provides a comprehensive overview of all AI prompt systems and response formats used throughout the Recipe Alchemy application. It covers the prompt engineering, response handling, and data flow for each AI-powered feature.

## Table of Contents
1. [Recipe Generation System](#recipe-generation-system)
2. [Recipe Chat System](#recipe-chat-system)
3. [Recipe Modification System](#recipe-modification-system) 
4. [Nutrition Analysis System](#nutrition-analysis-system)
5. [Nutri-Score Calculation](#nutri-score-calculation)
6. [Science Notes Generation](#science-notes-generation)

## Recipe Generation System

The recipe generation system uses a sophisticated prompt engineering approach to generate detailed, scientifically-accurate recipes in the style of J. Kenji López-Alt.

### Prompt Structure

The recipe generation prompt is built in `supabase/functions/generate-quick-recipe/prompt-builder.ts` and follows this structure:

```typescript
export function buildOpenAIPrompt(params: {
  safeCuisine: string, 
  safeMain: string, 
  safeDiet: string, 
  safeServings: number,
  safeTags: string,
  maxCalories?: number,
  uniqueId: string
}): string {
  // Constructs the prompt with user parameters
}
```

#### Key Components of the Recipe Generation Prompt

1. **User Parameters Section**:
   ```
   • Cuisine – ${safeCuisine}  
   • Dietary – ${safeDiet}  
   • Main ingredient – ${safeMain}
   • Flavor profile – ${safeTags}
   • Servings – ${safeServings}
   ${calorieConstraint}
   • Unique Generation ID – ${uniqueId}
   ```

2. **Cuisine Category Guidance**:
   - Enforces valid cuisine categories that align with database values
   - Provides explicit lists of valid cuisine values
   - Requires both cuisine and cuisine_category to be set in the response

3. **Instruction Details**:
   - Mandates López-Alt style with scientific explanations
   - Requires precise temperatures (both °F and °C) and timing
   - Prohibits simplified steps
   - Requires scientific reasoning in each step

4. **Step Planning Framework**:
   - Outlines recipe structure planning
   - Requires exact temperatures, scientific explanations, and sensory indicators for each step

5. **Data Pipeline Instructions**:
   - Instructions for nutrition calculation
   - Steps to match ingredients to USDA food databases
   - Energy validation check requirements

6. **Measurement Standardization**:
   - Requirements for both imperial and metric measurements
   - Formatting rules for quantities and units

### Response Format

The recipe generation system expects responses in a specific JSON format:

```json
{
  "title": "string",
  "description": "ONE sentence of the key science insight",
  "ingredients": [{ 
    "qty_imperial": number, 
    "unit_imperial": string, 
    "qty_metric": number, 
    "unit_metric": string, 
    "shop_size_qty": number, 
    "shop_size_unit": string, 
    "item": string, 
    "notes": string 
  }],
  "steps": [ "DETAILED instruction strings with scientific explanations" ],
  "prepTime": number,
  "cookTime": number,
  "prep_time_min": number,
  "cook_time_min": number,
  "servings": number,
  "cuisine": "string - MUST be one of the VALID CUISINE VALUES",
  "cuisine_category": "string - one of: Global, Regional American, European, Asian, Dietary Styles, or Middle Eastern",
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
}
```

### OpenAI Model and Parameters

The recipe generation uses the OpenAI API with the following parameters (from `supabase/functions/generate-quick-recipe/openai-client.ts`):

```typescript
{
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "You are a professional chef and recipe developer. Your task is to generate a complete recipe in JSON format following the user's instructions exactly."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  temperature: 0.7,
  max_tokens: 2000,
  response_format: { type: "json_object" }
}
```

### Data Flow

1. User submits recipe request via form (`QuickRecipeFormContainer.tsx`)
2. Form data is processed and validated (`use-quick-recipe-form.ts`)
3. Request is sent to Supabase Edge Function (`generate-quick-recipe`)
4. Edge Function formats request and sends to OpenAI API
5. OpenAI generates recipe response
6. Response is validated and normalized
7. Recipe is returned to client and stored in state
8. Recipe is displayed to user

### Error Handling

The recipe generation system includes robust error handling:

1. **Circuit breaker pattern** to prevent cascading failures
2. **Request parameter validation** to ensure valid inputs
3. **Response validation** to handle malformed AI responses
4. **Timeout handling** for long-running requests
5. **Fallback mechanisms** for temporary failures
6. **User-friendly error messages** with diagnostic information

## Recipe Chat System

The recipe chat system allows users to ask questions about recipes and receive intelligent responses with potential recipe modifications.

### Prompt Structure

The recipe chat system uses two main system prompts defined in `supabase/functions/recipe-chat/index.ts`:

#### Recipe Analysis Prompt
```
You are a culinary scientist and expert chef in the López-Alt tradition, analyzing recipes through the lens of food chemistry and precision cooking techniques.

Focus on:
1. COOKING CHEMISTRY:
   - Identify key chemical processes (e.g., Maillard reactions, protein denaturation, emulsification)
   - Explain temperature-dependent reactions and their impact on flavor/texture
   - Note critical control points where chemistry affects outcome
   - Consider various reactions relevant to the specific recipe context

2. TECHNIQUE OPTIMIZATION:
   - Provide appropriate temperature ranges (°F and °C) and approximate timing guidelines
   - Include multiple visual/tactile/aromatic doneness indicators when possible
   - Consider how ingredient preparation affects final results
   - Suggest equipment options and configuration alternatives
   - Balance precision with flexibility based on context

3. INGREDIENT SCIENCE:
   - Functional roles, temp-sensitive items, evidence-based substitutions
   - Recommend evidence-based technique modifications
   - Explain the chemistry behind each suggested change

Return response as JSON with this exact structure:
{
  "textResponse": "Detailed conversational analysis of the recipe chemistry",
  "science_notes": ["Array of scientific explanations"],
  "techniques": ["Array of technique details"],
  "troubleshooting": ["Array of science-based solutions"],
  "changes": {
    "title": "string or null",
    "ingredients": {
      "mode": "add" | "replace" | "none",
      "items": []
    },
    "instructions": []
  },
  "followUpQuestions": ["Array of suggested follow-up questions"] 
}
```

#### Chat System Prompt
```
You are a culinary scientist specializing in food chemistry and cooking techniques. When suggesting changes to recipes:

1. Always format responses as JSON with changes
2. For cooking instructions:
   - Include specific temperatures (F° and C°)
   - Specify cooking durations
   - Add equipment setup details
   - Include doneness indicators
   - Add resting times when needed
3. Format ingredients with exact measurements and shopability:
   - US-imperial first, metric in ( )
   - Each item gets a typical US grocery package size
   - Include `shop_size_qty` and `shop_size_unit`
4. Validate all titles are descriptive and clear

Example format:
{
  "textResponse": "Detailed explanation of changes...",
  "changes": {
    "title": "string or null",
    "ingredients": {
      "mode": "add" | "replace" | "none",
      "items": [{
        "qty": number,
        "unit": string,
        "shop_size_qty": number,
        "shop_size_unit": string,
        "item": string,
        "notes": string
      }]
    },
    "instructions": ["Array of steps"],
    "cookingDetails": {
      "temperature": {
        "fahrenheit": number,
        "celsius": number
      },
      "duration": {
        "prep": number,
        "cook": number,
        "rest": number
      }
    }
  },
  "followUpQuestions": ["Array of suggested follow-up questions"]
}
```

### Response Format

The chat system expects responses to follow this JSON structure:

```json
{
  "textResponse": "string - The conversational response text",
  "changes": {
    "title": "string or null - Optional new recipe title",
    "ingredients": {
      "mode": "add | replace | none - How to apply ingredient changes",
      "items": [
        {
          "qty": "number - Quantity",
          "unit": "string - Unit of measurement",
          "shop_size_qty": "number - Shopping size quantity",
          "shop_size_unit": "string - Shopping size unit",
          "item": "string - Ingredient name",
          "notes": "string - Optional notes"
        }
      ]
    },
    "instructions": ["string - Array of instruction steps"]
  },
  "science_notes": ["string - Array of scientific explanations"],
  "followUpQuestions": ["string - Array of suggested follow-up questions"]
}
```

### OpenAI Model and Parameters

The recipe chat system uses the following OpenAI API configuration:

```typescript
{
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: systemPrompt + "\nIMPORTANT: Provide responses in a conversational tone. For analysis requests, make sure to include explicit sections for science notes, techniques, and troubleshooting. Always include follow-up questions.",
    },
    {
      role: 'user',
      content: prompt,
    },
  ],
  temperature: 0.7,
  response_format: { type: "json_object" },
  max_tokens: 3500,
}
```

### Data Flow

1. User sends chat message via chat interface
2. Message is processed and sent to Supabase Edge Function (`recipe-chat`)
3. Edge Function formats request with appropriate system prompt
4. Request is sent to OpenAI API
5. Response is processed and validated
6. Chat response is returned to client and stored in database
7. Response is displayed to user with potential recipe modifications

### Error Handling

The recipe chat system includes:

1. **Response validation** to handle inconsistent AI responses
2. **Fallback mechanisms** for malformed JSON
3. **Circuit breaker pattern** to prevent cascading failures
4. **Adaptive timeouts** based on retry attempts
5. **Science note extraction** fallback for incomplete responses

## Recipe Modification System

The recipe modification system allows users to request specific modifications to their recipes.

### Prompt Structure

The recipe modification system uses a LangChain-based approach defined in `supabase/functions/modify-quick-recipe/index.ts`:

```typescript
const prompt = ChatPromptTemplate.fromMessages([
  ["system", `
You are a culinary nutrition expert. When modifying recipes:
1) Keep flavors balanced and logical.
2) Honor cooking chemistry in substitutions.
3) Correctly recalc nutrition.
4) Return a strict JSON matching the Zod schema, nothing else.
`],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);
```

### Response Format

The recipe modification system uses a Zod schema to validate responses:

```typescript
const recipeModificationsSchema = z.object({
  textResponse: z.string(),
  reasoning: z.string(),
  modifications: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      original: z.string().optional(),
      modified: z.string(),
      reason: z.string().optional()
    })).optional(),
    steps: z.array(z.object({
      original: z.string().optional(),
      modified: z.string(),
      reason: z.string().optional()
    })).optional(),
    cookingTip: z.string().optional(),
  }),
  nutritionImpact: nutritionImpactSchema.optional()
});
```

### Data Flow

1. User requests recipe modification via the modifier interface
2. Request is processed and sent to Supabase Edge Function (`modify-quick-recipe`)
3. Edge Function formats request and processes with LangChain
4. Response is validated using Zod schema
5. Modification response is returned to client and stored in database
6. Modifications are displayed to user for approval

### Error Handling

The recipe modification system includes:

1. **Request retry logic** with exponential backoff
2. **Circuit breaker pattern** to prevent cascading failures
3. **Schema validation** to ensure consistent response format
4. **Fallback mechanisms** for service unavailability

## Nutrition Analysis System

The application uses multiple approaches for nutrition analysis:

1. **Generated nutrition data** from the recipe generation system
2. **USDA food database lookups** for ingredient matching
3. **Nutrient retention factors** applied to cooking methods

### Nutrition Response Format

The nutrition data follows this structure:

```typescript
export interface Nutrition {
  // Basic nutrition (with both naming conventions)
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  
  // Aliases for backwards compatibility
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  
  // Micronutrients
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  cholesterol?: number;
  
  // Alternative naming for micronutrients (aliases)
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  
  // Enhanced nutrition data properties
  data_quality?: {
    overall_confidence: 'high' | 'medium' | 'low';
    overall_confidence_score: number;
    penalties?: Record<string, any>;
    unmatched_or_low_confidence_ingredients?: string[];
    limitations?: string[];
  };
  per_ingredient?: Record<string, any>;
  audit_log?: Record<string, any>;
  
  // Added for compatibility with standardized nutrition
  carbohydrates?: number;
}
```

### Data Flow

1. Recipe is generated with nutrition data
2. Nutrition data is normalized
3. Nutrition data is used in Nutri-Score calculation
4. Nutrition information is displayed to user

## Nutri-Score Calculation

The Nutri-Score system calculates a health score for recipes based on their nutritional content.

### Calculation Logic

The Nutri-Score is calculated using a database function:

```typescript
// From src/hooks/use-nutri-score.ts
const calculateNutriScore = async (): Promise<NutriScore | null> => {
  try {
    if (!recipe.nutrition) {
      throw new Error("No nutrition data available to calculate Nutri-Score");
    }
    
    // Call the Supabase database function to calculate the score
    const { data, error } = await supabase.rpc(
      'calculate_nutri_score',
      { 
        nutrition: recipe.nutrition as any,
        category: recipe.cuisine_category?.toLowerCase() || 'food',
        fruit_veg_nuts_percent: 0 // Default value, could be made dynamic
      }
    );
    
    if (error) throw error;
    
    return data as unknown as NutriScore;
  } catch (error) {
    console.error("Failed to calculate Nutri-Score:", error);
    return null;
  }
};
```

### Nutri-Score Response Format

```typescript
export interface NutriScore {
  score: number;
  grade: "A" | "B" | "C" | "D" | "E";
  negative_points: {
    energy: number;
    saturated_fat: number;
    sugars: number;
    sodium: number;
    total: number;
  };
  positive_points: {
    fiber: number;
    protein: number;
    fruit_veg_nuts: number;
    total: number;
  };
  category?: string;
  calculation_version?: string;
  calculated_at?: string;
}
```

### Data Flow

1. Recipe with nutrition data is available
2. Nutri-Score calculation is triggered
3. Database function calculates score and grade
4. Nutri-Score is stored with recipe and displayed to user

## Science Notes Generation

Science notes are generated in several places:

1. **Recipe generation** - Includes scientific explanations in steps
2. **Recipe analysis** - Extracts science notes from recipe steps
3. **Recipe chat** - Provides scientific insights based on user questions
4. **Recipe modification** - Explains the scientific reasoning behind modifications

### Science Notes Format

Science notes are stored as string arrays:

```typescript
science_notes: string[] // Array of scientific explanations
```

### Examples of Science Notes

Science notes focus on:

1. **Chemical reactions** (Maillard reaction, caramelization, etc.)
2. **Protein denaturation** processes
3. **Starch gelatinization** explanations
4. **Temperature effects** on ingredients
5. **pH impacts** on cooking processes
6. **Texture development** mechanisms
7. **Flavor compound** development

### López-Alt Style Scientific Explanations

The López-Alt style is characterized by:

1. **Precise temperature specifications** (both °F and °C)
2. **Exact timing guidelines** with explanations
3. **Scientific terminology** with accessible explanations
4. **Sensory indicators** for doneness
5. **Explanations of why techniques work** at molecular level
6. **References to chemical reactions** and physical transformations

## Integration Between AI Systems

The AI systems are interconnected in several ways:

1. Recipe generation creates the initial recipe with scientific steps
2. Recipe chat can analyze and suggest modifications to the recipe
3. Recipe modification can implement user-requested changes
4. Nutrition system provides data used by the Nutri-Score calculation
5. Science notes are extracted and enhanced across multiple systems

This integrated approach ensures consistency in the scientific explanations and culinary guidance throughout the application.

## Conclusion

The Recipe Alchemy application uses a sophisticated network of AI prompts and responses to create a scientifically-grounded culinary experience. By leveraging specialized prompts in the style of J. Kenji López-Alt, the application provides users with detailed, accurate, and educational recipe content across multiple features.

The consistent use of JSON response formats, robust error handling, and integration between AI systems creates a seamless user experience while maintaining the scientific rigor that characterizes the application's approach to recipe development.
