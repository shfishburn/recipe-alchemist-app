
// This file re-exports the refactored hook for backwards compatibility
import { useQuickRecipePage as useRefactoredQuickRecipePage } from './quick-recipe/use-quick-recipe-page';

// Re-export with the same name to maintain compatibility with existing code
export function useQuickRecipePage() {
  return useRefactoredQuickRecipePage();
}
