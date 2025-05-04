
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, Share2, MessageCircle, FileText } from 'lucide-react';
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
      <div className={`flex flex-wrap gap-2 ${sticky ? "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 border-t z-50 shadow-md" : ""}`}>
        {/* Primary action - Ask AI Chef */}
        <div className="flex-1">
          {onOpenChat && (
            <Button 
              className="w-full bg-recipe-blue hover:bg-recipe-blue/90 text-white"
              size="lg"
              onClick={onOpenChat}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>Ask AI Chef</span>
            </Button>
          )}
        </div>
        
        {/* Secondary actions row */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowShoppingListDialog(true)}
            className="flex items-center gap-1"
            size="sm"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </Button>
          
          <Button 
            variant={isFavorite ? "secondary" : "outline"}
            onClick={toggleFavorite}
            className="flex items-center gap-1"
            size="sm"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">{isFavorite ? "Saved" : "Save"}</span>
          </Button>
          
          {onToggleAnalysis && (
            <Button
              variant={isAnalysisOpen ? "secondary" : "outline"}
              onClick={onToggleAnalysis}
              className="flex items-center gap-1"
              size="sm"
              disabled={isAnalyzing}
            >
              <FileText className={`h-4 w-4 ${isAnalysisOpen ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">Science</span>
              {hasAnalysisData && !isAnalysisOpen && (
                <span className="ml-1 bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full">
                  {hasAnalysisData ? "New" : ""}
                </span>
              )}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => setShowShareDialog(true)}
            className="flex items-center gap-1"
            size="sm"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
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
