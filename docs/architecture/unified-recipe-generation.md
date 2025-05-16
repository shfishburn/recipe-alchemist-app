# Unified Recipe Generation Architecture

## Overview

This document outlines the architecture for implementing a unified approach to recipe generation and modification in Recipe Alchemy. The core insight is that by reusing the recipe generation prompt infrastructure for recipe modifications, we can eliminate type mismatches and ensure consistent recipe formatting throughout the application.

## Current Challenges

1. **Type Inconsistency**: There are mismatches between types in different parts of the system:
   - `ChatMessage` type in chat components expects certain fields
   - `quick-recipe.ts` and `recipe.ts` have different Ingredient type definitions 
   - Ingredient fields like `qty_metric` are optional in one type but required in another

2. **Partial Updates**: The current system attempts to merge partial recipe changes into existing recipes, leading to:
   - Incomplete data
   - Potential data loss
   - Complex merging logic

3. **Format Inconsistency**: Different recipe parts may have different formats, especially with ingredients:
   - Inconsistent unit formats
   - Incomplete measurement conversions
   - Missing properties in some ingredient objects

4. **Complex Merging Logic**: The current approach requires complex logic to merge changes into existing recipes:
   - Error-prone reconciliation of partial updates
   - Difficult validation of changes
   - Inconsistent format of changes

## Unified Approach Architecture

### Core Principle

Instead of treating recipe chat as a separate system that generates partial changes to be merged, we'll reuse the recipe generation infrastructure. When a user asks a question about a recipe in chat, we'll pass the complete recipe and the user's question to the recipe generation prompt, which will return a complete, well-formatted recipe.

### Data Flow

1. **User Sends Question** → Frontend sends existing recipe + user question to `recipe-chat` endpoint
2. **Edge Function Processing**:
   - `recipe-chat/index.ts` imports `buildOpenAIPrompt` from `generate-quick-recipe/prompt-builder.ts`
   - Uses the recipe generation prompt format but includes existing recipe context
   - Sends prompt to OpenAI API using same format as recipe generation
3. **AI Response Processing**:
   - AI returns complete recipe JSON object (not just changes)
   - Validation ensures correct structure using existing validators
4. **Version Creation**:
   - New recipe version stored with complete recipe data
   - Chat response stored in database with link to version

### Technical Components

#### Modified Edge Functions

1. **recipe-chat/index.ts** (Primary Modification Point):
   - Import `buildOpenAIPrompt` from `../generate-quick-recipe/prompt-builder.ts`
   - Build a modified prompt that includes current recipe details and user question
   - Format AI response using same structure as recipe generation
   
2. **_shared/recipe-versions.ts** (Unmodified):
   - Continue to use existing versioning system
   - Store complete recipe objects rather than partial changes

#### Frontend Components

1. **ChatHistory.tsx** & **ChatMessage.tsx** (Minor Modifications):
   - Update type handling to work with both ChatMessage and OptimisticMessage types
   - Display complete recipe from AI response
   - Highlight changes between versions

2. **ApplyChanges Component** (Simplified):
   - Simply replaces current recipe with complete new recipe version
   - No complex merging logic needed

### Modified Types

To resolve the current type inconsistencies:

```typescript
// Update ChatMessage type to make ai_response optional for OptimisticMessage
export interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;  // Required for regular ChatMessage
  // Other fields...
}

// Modify OptimisticMessage to be compatible with ChatMessage but with optional fields
export type OptimisticMessage = Omit<ChatMessage, 'ai_response'> & {
  ai_response?: string;  // Optional for OptimisticMessage
  user_message: string;
  id: string;
  meta?: ChatMeta;
  pending?: boolean;
};

// Update Ingredient types to be compatible
export interface UnifiedIngredient {
  // Required fields in both types
  qty_metric: number;
  unit_metric: string;
  qty_imperial: number;
  unit_imperial: string;
  item: string;
  
  // Optional fields
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
  qty?: number;
  unit?: string;
}
```

### Benefits

1. **Type Consistency**: Complete recipes always follow the same schema
2. **Format Consistency**: All ingredient measurements include both imperial and metric units
3. **No Merging Logic**: Eliminates complex logic for merging partial changes
4. **Better UX**: Fewer errors, more consistent output
5. **Scientific Detail**: Maintains López-Alt style scientific detail in changes

## Implementation Strategy

1. Update `recipe-chat/index.ts` to use `buildOpenAIPrompt` function
2. Modify the prompt construction to include:
   - Current recipe information (ingredients, steps, etc.)
   - User's question/modification request
3. Ensure recipe ID and structure are preserved in response
4. Update frontend components to handle complete recipe responses
5. Test with various modification requests to ensure consistency

## Performance Considerations

1. **Response Time**: Complete recipe generation may take longer than partial changes
2. **Token Usage**: Increased token count for prompts that include full recipe context
3. **Caching**: Consider caching recent recipe versions to improve performance

## Security Considerations

1. **Prompt Injection**: Enhanced sanitization for user inputs included in prompts
2. **Rate Limiting**: Monitor and limit API usage to prevent abuse
3. **Data Validation**: Strict validation of AI responses before saving to database

## Migration Plan

1. Fix type errors in `ChatHistory.tsx` and `ChatMessage.tsx` to handle both message types
2. Implement changes in `recipe-chat/index.ts` to use unified recipe generation approach
3. Update `update-recipe.ts` to handle complete recipe updates instead of merging
4. Gradually update frontend components to handle new response format
5. Retain backward compatibility for existing chat history
6. Monitor performance and error rates during rollout

## Code Examples

### Unified Recipe Generation Prompt

```typescript
export function buildUnifiedRecipePrompt(params: {
  originalRecipe: Recipe;
  userMessage: string;
  versionNumber: number;
}): string {
  const { originalRecipe, userMessage, versionNumber } = params;
  
  // Convert original recipe to a string to include in the prompt
  const originalRecipeJSON = JSON.stringify(originalRecipe);
  
  return `
You are an AI recipe assistant focused ONLY on helping users modify an existing recipe.

USER REQUEST:
"${userMessage}"

ORIGINAL RECIPE (JSON):
${originalRecipeJSON}

──────── RESPONSE GUIDELINES ────────
First, determine if the user message is appropriate for recipe modification...

[Rest of prompt as shown in the example]
`;
}
```

### Response Processing

```typescript
// In recipe-chat/index.ts
const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [
    { role: "system", content: buildUnifiedRecipePrompt({
      originalRecipe: recipe,
      userMessage: userRequest,
      versionNumber: currentVersion + 1
    })},
  ],
});

// Process the response
const result = JSON.parse(response.choices[0].message.content);

if (result.type === "text") {
  // Just return text response for chat
  return {
    id: generateId(),
    user_message: userRequest,
    ai_response: result.content,
    timestamp: new Date().toISOString(),
  };
} else if (result.type === "recipe_modification") {
  // Store new recipe version and return both chat and recipe
  const versionData = await storeRecipeVersion({
    recipeId: recipe.id,
    parentVersionId: recipe.version_id || null,
    versionNumber: currentVersion + 1,
    userId: user_id,
    modificationRequest: userRequest,
    recipeData: result.recipe
  });
  
  return {
    id: generateId(),
    user_message: userRequest,
    ai_response: result.recipe.modification_summary,
    changes_suggested: null, // No longer needed with complete recipe approach
    recipe: result.recipe, // Include complete recipe in response
    version_id: versionData.version_id,
    timestamp: new Date().toISOString(),
  };
}
```

## Conclusion

The unified recipe generation architecture provides a more robust, consistent way to handle recipe modifications. By eliminating partial updates and complex merging logic, we reduce errors and improve the user experience. This approach ensures that all recipes in the system maintain the same format and level of detail, regardless of how they were created or modified.
