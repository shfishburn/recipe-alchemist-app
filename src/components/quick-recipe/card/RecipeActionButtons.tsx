
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, ChefHat, Printer } from 'lucide-react';

interface RecipeActionButtonsProps {
  onSave: () => void;
  onCook?: () => void;
  onPrint?: () => void;
  isSaving?: boolean;
}

// Use memo to prevent unnecessary re-renders
export const RecipeActionButtons = memo(function RecipeActionButtons({
  onSave,
  onCook,
  onPrint,
  isSaving = false
}: RecipeActionButtonsProps) {
  return (
    <div className="pt-5 w-full flex flex-col gap-2">
      {onCook && (
        <Button 
          onClick={onCook} 
          className="w-full"
        >
          <ChefHat className="mr-2 h-5 w-5" />
          Cooking Mode
        </Button>
      )}
      
      <Button
        variant="outline"
        onClick={onSave}
        disabled={isSaving}
        className="w-full"
      >
        <Bookmark className="mr-2 h-5 w-5" />
        Save Recipe
      </Button>
      
      {onPrint && (
        <Button
          variant="ghost"
          onClick={onPrint}
          className="w-full"
        >
          <Printer className="mr-2 h-5 w-5" />
          Print Recipe
        </Button>
      )}
    </div>
  );
});
