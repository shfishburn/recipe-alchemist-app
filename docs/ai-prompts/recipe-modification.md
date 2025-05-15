
# Recipe Modification Prompts

The recipe modification system allows users to request specific modifications to their recipes.

## Prompt Structure

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

## Response Format

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

## Data Flow

1. User requests recipe modification via the modifier interface
2. Request is processed and sent to Supabase Edge Function (`modify-quick-recipe`)
3. Edge Function formats request and processes with LangChain
4. Response is validated using Zod schema
5. Modification response is returned to client and stored in database
6. Modifications are displayed to user for approval

## Error Handling

The recipe modification system includes:

1. **Request retry logic** with exponential backoff
2. **Circuit breaker pattern** to prevent cascading failures
3. **Schema validation** to ensure consistent response format
4. **Fallback mechanisms** for service unavailability

## Modification Types

The system supports various types of recipe modifications:

1. **Dietary Modifications** - Converting recipes to vegetarian, vegan, gluten-free, etc.
2. **Ingredient Substitutions** - Replacing ingredients while maintaining flavor profiles
3. **Cooking Method Changes** - Adapting recipes for different cooking methods
4. **Scaling** - Adjusting recipes for different serving sizes with proper proportion changes
5. **Nutritional Adjustments** - Modifying recipes to meet specific nutritional requirements

## Related Files

- `supabase/functions/modify-quick-recipe/index.ts` - Main edge function handler
- `supabase/functions/modify-quick-recipe/schema.ts` - Zod validation schemas
- `src/components/quick-recipe/QuickRecipeModifier.tsx` - Frontend modification interface
- `src/hooks/recipe-modifications/use-recipe-modifications.ts` - Modification hook
