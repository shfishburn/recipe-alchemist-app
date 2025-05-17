
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { updateRecipe } from './utils/update-recipe';
import { useMutation } from '@tanstack/react-query';
import { useRecipeChatStore } from '@/store/use-recipe-chat-store';
import { ChatMessage } from '@/types/chat';
import { Recipe } from '@/types/recipe';

type UpdateRecipeMutationVariables = {
  recipe: Recipe;
  chatMessage: ChatMessage;
};

export function useApplyChanges() {
  const [isApplying, setIsApplying] = useState(false);
  const { markMessageAsApplied } = useRecipeChatStore();
  
  const updateRecipeMutation = useMutation({
    mutationFn: ({ recipe, chatMessage }: UpdateRecipeMutationVariables) => {
      console.log("Starting to update recipe with changes", {
        recipeId: recipe.id,
        messageId: chatMessage.id,
        hasChangesSuggested: !!chatMessage.changes_suggested
      });
      return updateRecipe(recipe, chatMessage);
    },
    onSettled: (data, error, variables) => {
      setIsApplying(false);
      
      if (error) {
        console.error("Error applying changes:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to apply changes to recipe",
          variant: "destructive",
        });
        return;
      }
      
      // Mark the message as applied on success
      markMessageAsApplied(variables.chatMessage.id);
    }
  });
  
  const applyChanges = useCallback(
    async (recipe: Recipe, chatMessage: ChatMessage): Promise<boolean> => {
      // Early checks to ensure we have valid data
      if (!recipe || !recipe.id) {
        toast({ 
          title: "Invalid Recipe", 
          description: "Cannot apply changes to an invalid recipe",
          variant: "destructive"
        });
        return false;
      }
      
      if (!chatMessage || !chatMessage.id) {
        toast({ 
          title: "Invalid Chat Message", 
          description: "Cannot apply changes from an invalid message",
          variant: "destructive"
        });
        return false;
      }
      
      // Safe access to recipe property using the recipe object passed in
      const recipeId = recipe.id;
      const messageId = chatMessage.id;
      
      // Check if this message has already been applied
      if (chatMessage.applied) {
        toast({ 
          title: "Already Applied", 
          description: "These changes have already been applied to the recipe",
          variant: "default"  // Changed from 'secondary' to 'default'
        });
        return false;
      }
      
      // Check if there are actually any changes to apply
      if (!chatMessage.changes_suggested) {
        toast({ 
          title: "No Changes", 
          description: "No recipe changes were found to apply",
          variant: "default"  // Changed from 'secondary' to 'default'
        });
        return false;
      }
      
      try {
        setIsApplying(true);
        
        toast({
          title: "Applying changes",
          description: "Updating your recipe with the suggested changes",
        });
        
        // Execute the mutation
        await updateRecipeMutation.mutateAsync({ recipe, chatMessage });
        
        // Show success toast
        toast({
          title: "Changes Applied",
          description: "Your recipe has been updated successfully",
          variant: "default",  // Changed from 'success' to 'default'
        });
        
        return true;
      } catch (error) {
        // Error is handled in mutation's onError
        return false;
      }
    },
    [updateRecipeMutation, markMessageAsApplied]
  );
  
  return {
    applyChanges,
    isApplying,
  };
}
