
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, ChefHat } from 'lucide-react';
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
  
  // Function to trigger cooking mode
  const triggerCookingMode = () => {
    const cookingModeTrigger = document.getElementById('cooking-mode-trigger');
    if (cookingModeTrigger) {
      cookingModeTrigger.click();
    }
  };
  
  return (
    <div className={`${sticky ? "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 border-t z-50 shadow-md" : ""}`}>
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex flex-col gap-3">
          {/* Primary action - Ask AI Chef button */}
          {showChatButton && (
            <Button 
              className="w-full bg-recipe-blue hover:bg-recipe-blue/90 text-white h-12 touch-feedback-strong"
              size="lg"
              onClick={onOpenChat}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Ask AI Chef
            </Button>
          )}
          
          {/* Add cooking mode button */}
          {currentTab === 'recipe' && !isMobile && (
            <Button 
              className="w-full bg-recipe-green hover:bg-recipe-green/90 text-white h-12 touch-feedback-strong"
              size="lg"
              onClick={triggerCookingMode}
            >
              <ChefHat className="mr-2 h-5 w-5" />
              Start Cooking Mode
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
