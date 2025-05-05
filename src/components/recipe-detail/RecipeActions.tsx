import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import { useFavoriteRecipe } from '@/hooks/use-favorite-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Recipe } from '@/types/recipe';

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
  // We're keeping these hooks to avoid breaking changes in case we need to restore functionality later
  const { isFavorite, toggleFavorite } = useFavoriteRecipe(recipe.id);
  const isMobile = useIsMobile();
  
  // Since we're removing all action buttons, we'll return null
  // This effectively removes the entire component from the UI
  return null;
}
