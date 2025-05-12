
import React, { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Share } from 'lucide-react';
import { Recipe } from '@/types/quick-recipe';

interface RecipeActionButtonsProps {
  onSave?: () => void;
  isSaving?: boolean;
  recipe?: Recipe; // Add recipe prop
}

// Use memo to prevent unnecessary re-renders
export const RecipeActionButtons = memo(function RecipeActionButtons({
  onSave,
  isSaving = false,
  recipe
}: RecipeActionButtonsProps) {
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      // Default implementation
      console.log("Saving recipe:", recipe?.title);
      setSaved(true);
    }
  };
  
  return (
    <div className="pt-5 w-full flex flex-col gap-2">
      <Button
        variant="outline"
        onClick={handleSave}
        disabled={isSaving || saved}
        className="w-full"
      >
        <Bookmark className="mr-2 h-5 w-5" />
        {saved ? "Saved!" : isSaving ? 'Saving...' : 'Save Recipe'}
      </Button>
    </div>
  );
});
