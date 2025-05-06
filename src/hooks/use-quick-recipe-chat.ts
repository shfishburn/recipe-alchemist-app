
import { useUnifiedRecipeChat } from '@/hooks/use-unified-recipe-chat';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';

/**
 * @deprecated Use useUnifiedRecipeChat instead
 * This is kept for backward compatibility - redirects to the new unified implementation
 */
export const useQuickRecipeChat = (recipe: QuickRecipe) => {
  // Simply redirect to the unified implementation
  return useUnifiedRecipeChat(recipe);
};
