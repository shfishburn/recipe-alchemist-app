
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
      <div className={`${sticky ? "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 border-t z-50 shadow-md" : ""}`}>
        <div className="container mx-auto max-w-3xl px-4">
          {/* Primary action row */}
          {onOpenChat && (
            <Button 
              className="w-full bg-recipe-blue hover:bg-recipe-blue/90 text-white mb-3 h-12"
              size="lg"
              onClick={onOpenChat}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Ask AI Chef</span>
            </Button>
          )}
          
          {/* Secondary actions row */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowShoppingListDialog(true)}
              className="flex flex-col h-auto py-2 items-center justify-center"
              size="sm"
            >
              <ShoppingBag className="h-5 w-5 mb-1" />
              <span className="text-xs">Shopping List</span>
            </Button>
            
            <Button 
              variant={isFavorite ? "secondary" : "outline"}
              onClick={toggleFavorite}
              className="flex flex-col h-auto py-2 items-center justify-center"
              size="sm"
            >
              <Heart className={`h-5 w-5 mb-1 ${isFavorite ? "fill-current" : ""}`} />
              <span className="text-xs">{isFavorite ? "Saved" : "Save"}</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowShareDialog(true)}
              className="flex flex-col h-auto py-2 items-center justify-center"
              size="sm"
            >
              <Share2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
          
          {onToggleAnalysis && (
            <div className="mt-3">
              <Button
                variant={isAnalysisOpen ? "secondary" : "outline"}
                onClick={onToggleAnalysis}
                className="flex items-center justify-center w-full"
                size="sm"
                disabled={isAnalyzing}
              >
                <FileText className={`h-4 w-4 mr-2 ${isAnalysisOpen ? "fill-current" : ""}`} />
                <span>Science Notes</span>
                {hasAnalysisData && !isAnalysisOpen && (
                  <span className="ml-1 bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </Button>
            </div>
          )}
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
