
import React, { memo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Check } from 'lucide-react';
import { Recipe } from '@/types/quick-recipe';

interface RecipeActionButtonsProps {
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
  recipe?: Recipe;
  onResetSaveSuccess?: () => void; // New prop for resetting the success state
}

// Use memo to prevent unnecessary re-renders
export const RecipeActionButtons = memo(function RecipeActionButtons({
  onSave,
  isSaving = false,
  saveSuccess = false,
  recipe,
  onResetSaveSuccess
}: RecipeActionButtonsProps) {
  // Use useRef for timer to ensure proper cleanup
  const timerRef = useRef<number | undefined>();
  
  const handleSave = () => {
    if (onSave) {
      // Reset save success state if we're trying to save again
      if (saveSuccess && onResetSaveSuccess) {
        onResetSaveSuccess();
      }
      onSave();
    } else {
      // Default implementation
      console.log("Saving recipe:", recipe?.title);
    }
  };
  
  // If successful, set up a timer to reset the success state
  useEffect(() => {
    // Clear any existing timer first to prevent multiple timers
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    
    if (saveSuccess && typeof onResetSaveSuccess === 'function') {
      // Reset the success state after 5 seconds to allow saving again
      timerRef.current = window.setTimeout(() => {
        onResetSaveSuccess();
        timerRef.current = undefined; // Clear the ref after execution
      }, 5000); // 5 seconds
    }
    
    // Clean up timer on component unmount
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [saveSuccess, onResetSaveSuccess]);
  
  return (
    <div className="pt-5 w-full flex flex-col gap-2">
      <Button
        variant={saveSuccess ? "success" : "outline"}
        onClick={handleSave}
        disabled={isSaving}
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
