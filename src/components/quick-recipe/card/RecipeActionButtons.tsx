import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';

interface RecipeActionButtonsProps {
  onSave: () => void;
  isSaving?: boolean;
}

// Use memo to prevent unnecessary re-renders
export const RecipeActionButtons = memo(function RecipeActionButtons({
  onSave,
  isSaving = false
}: RecipeActionButtonsProps) {
  return (
    <div className="pt-5 w-full">
      <Button
        variant="outline"
        onClick={onSave}
        disabled={isSaving}
        className="w-full"
      >
        <Bookmark className="mr-2 h-5 w-5" />
        Save Recipe
      </Button>
    </div>
  );
});
