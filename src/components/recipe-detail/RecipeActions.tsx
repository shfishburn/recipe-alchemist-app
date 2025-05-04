
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
  const { isFavorite, toggleFavorite } = useFavoriteRecipe(recipe.id);
  const isMobile = useIsMobile();
  
  // Only show chat button when not already on the modify tab
  const showChatButton = onOpenChat && currentTab !== 'modify';
  
  return (
    <div className={`${sticky ? "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 border-t z-50 shadow-md" : ""}`}>
      <div className="container mx-auto max-w-3xl px-4">
        {/* Primary action - Ask AI Chef button */}
        {showChatButton && (
          <Button 
            className="w-full bg-recipe-blue hover:bg-recipe-blue/90 text-white mb-3 h-12 touch-feedback-strong"
            size="lg"
            onClick={onOpenChat}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Ask AI Chef
          </Button>
        )}
      </div>
    </div>
  );
}
