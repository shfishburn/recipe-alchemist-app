
import React, { memo, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Check } from 'lucide-react';
import { Recipe } from '@/types/quick-recipe';
import { useToast } from '@/hooks/use-toast';

/**
 * Props interface for the RecipeActionButtons component
 */
interface RecipeActionButtonsProps {
  /** 
   * Callback triggered when user wants to save a recipe.
   * Used to persist recipe data to user's saved collection.
   */
  onSave?: () => void | Promise<void>;          
  
  /** 
   * Indicates an in-progress save operation to prevent duplicate submissions
   * and provide visual feedback to the user.
   */
  isSaving?: boolean;           
  
  /** 
   * Tracks whether a save operation completed successfully to
   * show appropriate success UI and prevent duplicate saves.
   */
  saveSuccess?: boolean;        
  
  /** 
   * The recipe data being saved, useful for logging or 
   * implementing default save behavior when no onSave is provided.
   */
  recipe?: Recipe;              
  
  /** 
   * Callback to reset the saveSuccess state after a delay or user action.
   * Critical for allowing users to save again after a successful operation.
   */
  onResetSaveSuccess?: () => void; 
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
  
  // Access the toast functionality
  const { toast } = useToast();

  /**
   * Handles the save button click
   * If saveSuccess is true and onResetSaveSuccess is provided, resets the success state before saving
   */
  const handleSave = async () => {
    // Reset save success state if we're trying to save again
    if (saveSuccess && onResetSaveSuccess && !resetCalled) {
      onResetSaveSuccess();
      setResetCalled(true); // Mark reset as called to prevent multiple invocations
    }
    
    if (onSave) {
      try {
        // Call the onSave function provided by parent
        // Handle both synchronous and asynchronous onSave functions
        const result = onSave();
        
        // If onSave returns a Promise, wait for it to complete
        if (result instanceof Promise) {
          await result;
        }
        
        // Reset the resetCalled state ONLY after the save operation completes successfully
        // Use a slight delay to ensure state changes don't collide
        setTimeout(() => {
          if (resetCalled) {
            setResetCalled(false);
          }
        }, 100);
      } catch (error) {
        // Provide user feedback when save operation fails
        console.error("Error saving recipe:", error);
        
        // Safely extract error message with proper type checking
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Failed to save recipe";
          
        toast({
          title: "Save failed",
          description: errorMessage,
          variant: "destructive"
        });
        
        // Reset the resetCalled state immediately on error to allow retry
        setResetCalled(false);
      }
    } else {
      // Default implementation for when no onSave callback is provided
      // Provide user feedback about the missing save functionality
      console.log("Default save action for recipe:", recipe?.title);
      
      toast({
        title: "Save info",
        description: "This is just a preview. Full save functionality will be available in the complete version.",
        variant: "default"
      });
      
      // Reset the resetCalled state for the default implementation as well
      // Use a short timeout to ensure state updates don't conflict
      setTimeout(() => {
        if (resetCalled) {
          setResetCalled(false);
        }
      }, 100);
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
