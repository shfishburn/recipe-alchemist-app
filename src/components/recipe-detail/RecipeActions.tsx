
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, Share2, MessageCircle } from 'lucide-react';
import { useFavoriteRecipe } from '@/hooks/use-favorite-recipe';
import { AddToShoppingListDialog } from './shopping-list/AddToShoppingListDialog';
import { ShareRecipeDialog } from './ShareRecipeDialog';
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
  onOpenChat,
  onToggleAnalysis,
  isAnalysisOpen,
  isAnalyzing,
  hasAnalysisData 
}: RecipeActionsProps) {
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoriteRecipe(recipe.id);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={() => setShowShoppingListDialog(true)}
          className="flex items-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Shopping List</span>
        </Button>
        
        <Button 
          variant={isFavorite ? "default" : "outline"}
          onClick={toggleFavorite}
          className="flex items-center gap-2"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          <span>{isFavorite ? "Saved" : "Save"}</span>
        </Button>
        
        {onOpenChat && (
          <Button 
            variant="outline" 
            onClick={onOpenChat}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Ask AI Chef</span>
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => setShowShareDialog(true)}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>
      
      <AddToShoppingListDialog 
        open={showShoppingListDialog} 
        onOpenChange={setShowShoppingListDialog}
        recipe={recipe}
      />
      
      <ShareRecipeDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog}
        recipe={recipe}
      />
    </>
  );
}
