
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavoriteRecipe } from '@/hooks/use-favorite-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Recipe } from '@/types/recipe';

interface RecipeActionsProps {
  recipe: Recipe;
  sticky?: boolean;
  onOpenChat?: () => void;
  onToggleAnalysis?: () => void;
  isAnalysisOpen?: boolean;
  isAnalyzing?: boolean;
  hasAnalysisData?: boolean;
}

export function RecipeActions({ 
  recipe, 
  sticky = false,
  onOpenChat
}: RecipeActionsProps) {
  const { isFavorite, toggleFavorite } = useFavoriteRecipe(recipe.id);
  const isMobile = useIsMobile();

  // Determine which tab is active to show contextual actions
  const currentTab = window.location.hash ? window.location.hash.slice(1) : 'recipe';

  // Go to the modify tab to open chat
  const handleOpenChatClick = () => {
    if (onOpenChat) {
      onOpenChat();
    }
    window.location.hash = 'modify';
  };

  return (
    <>
      <div className={`${sticky ? "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 border-t z-50 shadow-md" : ""}`}>
        <div className="container mx-auto max-w-3xl px-4">
          {/* Primary action row - Ask AI Chef button only visible when not on modify tab */}
          {onOpenChat && currentTab !== 'modify' && (
            <Button 
              className="w-full bg-recipe-blue hover:bg-recipe-blue/90 text-white mb-3 h-12 touch-feedback-strong"
              size="lg"
              onClick={handleOpenChatClick}
            >
              Ask AI Chef
            </Button>
          )}
          
          {/* Secondary actions - Only show Save/Favorite button */}
          <div className="flex justify-center">
            <Button 
              variant={isFavorite ? "secondary" : "outline"}
              onClick={toggleFavorite}
              className="flex flex-col h-auto py-2 px-6 items-center justify-center touch-target"
              size={isMobile ? "mobile" : "sm"}
            >
              <Heart className={`h-5 w-5 mb-1 ${isFavorite ? "fill-current" : ""}`} />
              <span className="text-xs">{isFavorite ? "Saved" : "Save"}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
