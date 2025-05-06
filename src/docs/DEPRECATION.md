
# Recipe Chat Deprecation Notice

As of May 6, 2025, we have deprecated the Recipe Chat feature for standard recipes and are focusing exclusively on the Quick Recipe chat functionality.

## What This Means

- The Recipe Chat feature for saved recipes is no longer being maintained and will be removed in a future update
- All chat functionality is now concentrated on the Quick Recipe feature
- Several components, hooks, and utilities related to the Recipe Chat have been marked as deprecated

## Deprecated Components & Hooks

The following components and hooks have been marked as deprecated:

- `ImprovedRecipeChat.tsx` - Use Quick Recipe chat instead
- `RecipeChat.tsx` - Use Quick Recipe chat instead
- `useRecipeChat` hook - Use `useUnifiedRecipeChat` with a QuickRecipe instead
- `useImprovedChat` hook - Use `useUnifiedRecipeChat` with a QuickRecipe instead
- `useChatStore` and related functions - These are only used by deprecated chat features

## Migration Path

If you were using the Recipe Chat functionality:

1. Use the Quick Recipe generator instead of creating custom recipes
2. For existing recipes, consider migrating them to the Quick Recipe format
3. All chat-related functionality is available through the Quick Recipe interface

## Contact

If you have any questions about this deprecation or need help migrating your workflow, please contact the development team.
