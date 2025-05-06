
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavoriteRecipe } from '@/hooks/use-favorite-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Recipe } from '@/types/recipe';

/**
 * @deprecated This component is being simplified as we're focusing only on Quick Recipe
 */
interface RecipeActionsProps {
  recipe: Recipe;
  sticky?: boolean;
  onOpenChat?: () => void;
  currentTab?: string;
}

export function RecipeActions({ 
  recipe, 
  sticky = false,
  onOpenChat,
  currentTab = 'recipe'
}: RecipeActionsProps) {
  // The entire component is no longer used
  // We're removing all action buttons as recipe chat is being deprecated
  return null;
}
