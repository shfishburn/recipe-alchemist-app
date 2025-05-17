
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Printer,
  Share2,
  MoreHorizontal,
  Copy,
  Download,
  Check,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QuickRecipePrint } from '../QuickRecipePrint';
import type { QuickRecipe } from '@/types/quick-recipe';

export interface RecipeActionButtonsProps {
  recipe: QuickRecipe;
  onSave?: (recipe: QuickRecipe) => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
  onResetSaveSuccess?: () => void;
}

export function RecipeActionButtons({
  recipe,
  onSave,
  isSaving = false,
  saveSuccess = false,
  onResetSaveSuccess
}: RecipeActionButtonsProps) {
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Handle favorite toggle
  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: !isFavorited ? "Added to favorites" : "Removed from favorites",
      description: !isFavorited 
        ? "This recipe has been added to your favorites." 
        : "This recipe has been removed from your favorites.",
    });
  };
  
  // Handle share action
  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: recipe.description || `Check out this recipe for ${recipe.title}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste the link to share this recipe.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  // Handle copy to clipboard
  const handleCopyClick = async () => {
    try {
      // Create recipe text
      const recipeText = `
        ${recipe.title}
        
        ${recipe.description || ''}
        
        Ingredients:
        ${recipe.ingredients.map(ing => 
          `- ${ing.qty || ing.qty_metric || ''} ${ing.unit || ing.unit_metric || ''} ${
            typeof ing.item === 'string' 
              ? ing.item 
              : ing.item.name
          }${ing.notes ? ` (${ing.notes})` : ''}`
        ).join('\n')}
        
        Instructions:
        ${(recipe.instructions || recipe.steps || [])
          .map((step, i) => `${i + 1}. ${step}`).join('\n')}
      `;
      
      await navigator.clipboard.writeText(recipeText.trim());
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      toast({
        title: "Recipe copied to clipboard",
        description: "You can now paste the recipe text anywhere.",
      });
    } catch (error) {
      console.error("Error copying recipe:", error);
      toast({
        title: "Failed to copy recipe",
        description: "An error occurred while trying to copy the recipe.",
        variant: "destructive"
      });
    }
  };
  
  // Define print handler before it's used
  const handlePrintClick = () => {
    setIsPrintDialogOpen(true);
  };
  
  // Handle save recipe
  const handleSaveClick = () => {
    if (onSave) {
      onSave(recipe);
    }
  };
  
  // Reset save success state after showing confirmation
  React.useEffect(() => {
    if (saveSuccess && onResetSaveSuccess) {
      const timeout = setTimeout(() => {
        onResetSaveSuccess();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [saveSuccess, onResetSaveSuccess]);

  return (
    <div className="flex items-center gap-2">
      {/* Save/Favorite button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onSave ? handleSaveClick : handleFavoriteClick}
        disabled={isSaving}
        className={isFavorited && !onSave ? "text-red-500" : ""}
      >
        {onSave ? (
          saveSuccess ? (
            <Check className="h-5 w-5" />
          ) : (
            <Download className={`h-5 w-5 ${isSaving ? 'animate-pulse' : ''}`} />
          )
        ) : (
          <Heart
            className={`h-5 w-5 ${isFavorited ? 'fill-red-500' : ''}`}
          />
        )}
      </Button>
      
      {/* Print button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrintClick}
        title="Print recipe"
      >
        <Printer className="h-5 w-5" />
      </Button>
      
      {/* Share button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleShareClick}
        title="Share recipe"
      >
        <Share2 className="h-5 w-5" />
      </Button>
      
      {/* More options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" title="More options">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyClick}>
            {isCopied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            Copy recipe text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Print dialog */}
      <QuickRecipePrint
        recipe={recipe}
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
      />
    </div>
  );
}
