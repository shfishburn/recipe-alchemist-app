
# Recipe Generation Prompts

The recipe generation system uses a sophisticated prompt engineering approach to generate detailed, scientifically-accurate recipes in the style of J. Kenji López-Alt.

## Prompt Structure

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

### Key Components of the Recipe Generation Prompt

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

## Response Format

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

## OpenAI Model and Parameters

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

## Data Flow

1. User submits recipe request via form (`QuickRecipeFormContainer.tsx`)
2. Form data is processed and validated (`use-quick-recipe-form.ts`)
3. Request is sent to Supabase Edge Function (`generate-quick-recipe`)
4. Edge Function formats request and sends to OpenAI API
5. OpenAI generates recipe response
6. Response is validated and normalized
7. Recipe is returned to client and stored in state
8. Recipe is displayed to user

## Error Handling

The recipe generation system includes robust error handling:

1. **Circuit breaker pattern** to prevent cascading failures
2. **Request parameter validation** to ensure valid inputs
3. **Response validation** to handle malformed AI responses
4. **Timeout handling** for long-running requests
5. **Fallback mechanisms** for temporary failures
6. **User-friendly error messages** with diagnostic information

## Related Files

- `supabase/functions/generate-quick-recipe/prompt-builder.ts` - Builds the OpenAI prompt
- `supabase/functions/generate-quick-recipe/openai-client.ts` - Handles API communication
- `supabase/functions/generate-quick-recipe/request-handler.ts` - Processes incoming requests
- `supabase/functions/generate-quick-recipe/request-processor.ts` - Prepares parameters
- `src/components/quick-recipe/QuickRecipeGenerator.tsx` - Frontend component
