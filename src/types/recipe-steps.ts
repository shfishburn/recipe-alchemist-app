
import { StepReaction } from '@/hooks/use-recipe-science';
import { StepCategory } from '@/components/recipe-detail/common/StepCategoryLabel';

/**
 * Shared interface for recipe step data across the application
 */
export interface RecipeStep {
  text: string;
  index: number;
  isCompleted: boolean;
  reaction?: StepReaction | null;
  category?: StepCategory | string;
}

/**
 * Common interface for step toggle handlers
 */
export interface StepToggleHandler {
  (index: number): void;
}
