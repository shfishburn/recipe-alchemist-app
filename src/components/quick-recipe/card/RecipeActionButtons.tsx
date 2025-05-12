
import React, { memo, useCallback } from 'react';
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
  
  /**
   * The slug or ID to navigate to after successful save
   * This is not used for navigation directly in this component anymore
   * since navigation is handled by the parent component
   */
  savedSlug?: string;
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
  // Access the toast functionality
  const { toast } = useToast();
  
  /**
   * Handles the save button click
   * If saveSuccess is true and onResetSaveSuccess is provided, resets the success state before saving
   */
  const handleSave = async () => {
    // Validate recipe data before attempting to save
    if (!recipe || !recipe.title || !recipe.ingredients || recipe.ingredients.length === 0) {
      toast({
        title: "Validation Error",
        description: "Recipe is missing required information (title or ingredients)",
        variant: "destructive"
      });
      return;
    }
    
    // Reset save success state if we're trying to save again
    if (saveSuccess && onResetSaveSuccess) {
      onResetSaveSuccess();
    }
    
    if (!onSave) {
      // Default implementation for when no onSave callback is provided
      console.log("Default save action for recipe:", recipe?.title);
      
      toast({
        title: "Save info",
        description: "This is just a preview. Full save functionality will be available in the complete version.",
        variant: "default"
      });
      
      return;
    }
    
    try {
      // Call the onSave function provided by parent
      const result = onSave();
      
      // If onSave returns a Promise, wait for it to complete
      if (result instanceof Promise) {
        await result;
      }
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
    }
  };
  
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
