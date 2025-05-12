
import React, { memo, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Check } from 'lucide-react';
import { Recipe } from '@/types/quick-recipe';

/**
 * Props interface for the RecipeActionButtons component
 * Provides proper TypeScript validation for all props
 */
interface RecipeActionButtonsProps {
  onSave?: () => void;          // Optional callback for save action
  isSaving?: boolean;           // Flag indicating if save is in progress
  saveSuccess?: boolean;        // Flag indicating if save was successful
  recipe?: Recipe;              // The recipe data
  onResetSaveSuccess?: () => void; // Optional callback to reset the success state
}

/**
 * Recipe action buttons component for handling save operations
 * Uses memo to prevent unnecessary re-renders
 */
export const RecipeActionButtons = memo(function RecipeActionButtons({
  onSave,
  isSaving = false,
  saveSuccess = false,
  recipe,
  onResetSaveSuccess
}: RecipeActionButtonsProps) {
  // Reference to store the timer ID for proper cleanup
  const timerRef = useRef<number | undefined>();
  
  // Track whether the reset function has been called to prevent multiple invocations
  const [resetCalled, setResetCalled] = useState<boolean>(false);
  
  /**
   * Handles the save button click
   * If saveSuccess is true and onResetSaveSuccess is provided, resets the success state before saving
   */
  const handleSave = () => {
    if (onSave) {
      // Reset save success state if we're trying to save again
      if (saveSuccess && onResetSaveSuccess && !resetCalled) {
        onResetSaveSuccess();
        setResetCalled(true); // Mark reset as called to prevent multiple invocations
      }
      onSave();
    } else {
      // Default implementation for when no onSave callback is provided
      console.log("Saving recipe:", recipe?.title);
    }
  };
  
  /**
   * Effect hook to manage the timer for automatically resetting the success state
   * Sets up a timer when saveSuccess becomes true and cleans it up appropriately
   */
  useEffect(() => {
    // Reset the resetCalled state when saveSuccess changes
    if (!saveSuccess) {
      setResetCalled(false);
    }
    
    // Clear any existing timer first to prevent multiple timers
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    
    // Only set up a timer if save was successful and we have a reset function
    if (saveSuccess && typeof onResetSaveSuccess === 'function' && !resetCalled) {
      // Reset the success state after 5 seconds to allow saving again
      timerRef.current = window.setTimeout(() => {
        onResetSaveSuccess();
        timerRef.current = undefined; // Clear the ref after execution
        setResetCalled(true); // Mark reset as called to prevent multiple invocations
      }, 5000); // 5 seconds
    }
    
    // Clean up timer on component unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [saveSuccess, onResetSaveSuccess, resetCalled]);
  
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
