
# Recipe Chat Prompts

The recipe chat system allows users to ask questions about recipes and receive intelligent responses with potential recipe modifications.

## Prompt Structure

The recipe chat system uses two main system prompts defined in `supabase/functions/_shared/recipe-prompts.ts`:

### Recipe Analysis Prompt
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
```

### Chat System Prompt
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
```

## Response Format

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

## OpenAI Model and Parameters

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

## Data Flow

1. User sends chat message via chat interface
2. Message is processed and sent to Supabase Edge Function (`recipe-chat`)
3. Edge Function formats request with appropriate system prompt
4. Request is sent to OpenAI API
5. Response is processed and validated
6. Chat response is returned to client and stored in database
7. Response is displayed to user with potential recipe modifications

## Error Handling

The recipe chat system includes:

1. **Response validation** to handle inconsistent AI responses
2. **Fallback mechanisms** for malformed JSON
3. **Circuit breaker pattern** to prevent cascading failures
4. **Adaptive timeouts** based on retry attempts
5. **Science note extraction** fallback for incomplete responses

## Related Files

- `supabase/functions/_shared/recipe-prompts.ts` - Defines system prompts
- `supabase/functions/recipe-chat/index.ts` - Edge function implementation
- `src/components/recipe-chat/RecipeChat.tsx` - Frontend chat interface
- `src/hooks/use-recipe-chat.ts` - Chat functionality hook
