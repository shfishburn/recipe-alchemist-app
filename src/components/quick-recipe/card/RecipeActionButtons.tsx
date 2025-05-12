
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Check } from 'lucide-react';
import { Recipe } from '@/types/quick-recipe';

interface RecipeActionButtonsProps {
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
  recipe?: Recipe;
}

// Use memo to prevent unnecessary re-renders
export const RecipeActionButtons = memo(function RecipeActionButtons({
  onSave,
  isSaving = false,
  saveSuccess = false,
  recipe
}: RecipeActionButtonsProps) {
  
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      // Default implementation
      console.log("Saving recipe:", recipe?.title);
    }
  };
  
  return (
    <div className="pt-5 w-full flex flex-col gap-2">
      <Button
        variant={saveSuccess ? "success" : "outline"}
        onClick={handleSave}
        disabled={isSaving || saveSuccess}
        className="w-full"
      >
        {saveSuccess ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Saved
          </>
        ) : (
          <>
            <Bookmark className="mr-2 h-5 w-5" />
            {isSaving ? 'Saving...' : 'Save Recipe'}
          </>
        )}
      </Button>
    </div>
  );
});
