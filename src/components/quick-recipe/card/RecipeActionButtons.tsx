import React, { useState } from 'react';
import { MoreHorizontal, Printer, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { QuickRecipe } from '@/types/quick-recipe';
import { QuickRecipePrint, QuickRecipePrintProps } from '../QuickRecipePrint';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface RecipeActionButtonsProps {
  recipe: QuickRecipe;
  onPrint?: () => void;
  hasReportButton?: boolean;
  hasShareButton?: boolean;
  hasDeleteButton?: boolean;
  onDelete?: () => void;
  variant?: 'default' | 'minimal';
}

interface MinimalRecipeActionButtonsProps {
  recipe: QuickRecipe;
  onPrint?: () => void;
}

export function RecipeActionButtons({ 
  recipe, 
  onPrint, 
  hasReportButton, 
  hasShareButton = true,
  hasDeleteButton = false,
  onDelete,
  variant = 'default',
}: RecipeActionButtonsProps) {
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSaveClick = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You must be logged in to save recipes.",
      });
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      // Simulate saving to a database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSaved(true);
      toast({
        title: "Recipe Saved!",
        description: "This recipe has been saved to your profile.",
      });
    } catch (error) {
      toast({
        title: "Error Saving Recipe",
        description: "There was an error saving the recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleShareClick = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        });
        toast({
          title: "Recipe Shared!",
          description: "The recipe has been shared successfully.",
        });
      } else {
        toast({
          title: "Sharing Not Supported",
          description: "Sharing is not supported on this browser.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Sharing Recipe",
        description: "There was an error sharing the recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleSaveClick} disabled={isSaving || isSaved}>
          {isSaving ? (
            <>
              <Heart className="mr-2 h-4 w-4 animate-pulse" />
              Saving...
            </>
          ) : isSaved ? (
            <Heart className="text-red-500 h-4 w-4" fill="red" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={handlePrintClick}>
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Handle the print dialog
  const handlePrintClick = () => {
    if (onPrint) {
      onPrint();
    } else {
      setIsPrintOpen(true);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={handleSaveClick} disabled={isSaving || isSaved}>
        {isSaving ? (
          <>
            <Heart className="mr-2 h-4 w-4 animate-pulse" />
            Saving...
          </>
        ) : isSaved ? (
          <Heart className="text-red-500 h-4 w-4" fill="red" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
      </Button>

      {hasShareButton && (
        <Button variant="ghost" size="icon" onClick={handleShareClick} disabled={isSharing}>
          {isSharing ? (
            <>
              <Share2 className="mr-2 h-4 w-4 animate-pulse" />
              Sharing...
            </>
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePrintClick}>
            Print
          </DropdownMenuItem>
          {hasReportButton && (
            <DropdownMenuItem>
              Report
            </DropdownMenuItem>
          )}
          {hasDeleteButton && (
            <DropdownMenuItem onClick={onDelete}>
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Print Dialog */}
      <QuickRecipePrint 
        recipe={recipe}
        open={isPrintOpen}
        onOpenChange={setIsPrintOpen}
      />
    </div>
  );
}
