
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { updateRecipe } from './utils/update-recipe';

export function useApplyChanges() {
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();
  
  async function applyChanges(recipe: Recipe, chatMessage: ChatMessage): Promise<boolean> {
    if (isApplying) {
      console.warn('Already applying changes, ignoring duplicate request');
      return false;
    }
    
    console.log('Starting to apply changes from chat message:', {
      chatId: chatMessage.id,
      recipeId: chatMessage.recipe_id || recipe.id,
      hasChanges: !!chatMessage.changes_suggested
    });
    
    // Check for required data
    if (!recipe || !recipe.id) {
      const errorMsg = 'Cannot apply changes: Recipe data is missing';
      console.error(errorMsg, {recipe});
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return false;
    }
    
    // Ensure we have a valid recipe_id in the chat message
    const recipeId = chatMessage.recipe_id || recipe.id;
    if (!recipeId) {
      const errorMsg = 'Cannot apply changes: Recipe reference is missing';
      console.error(errorMsg, {chatMessage});
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return false;
    }
    
    // Create a chat message with guaranteed recipe_id
    const validatedChatMessage = {
      ...chatMessage,
      recipe_id: recipeId
    };
    
    try {
      setIsApplying(true);
      
      // First, mark this chat as "applied" in the database
      const { error: updateError } = await supabase
        .from('recipe_chats')
        .update({ applied: true })
        .eq('id', validatedChatMessage.id);
      
      if (updateError) {
        throw new Error(`Error marking chat as applied: ${updateError.message}`);
      }
      
      // Step 2: Update the recipe with the changes
      await updateRecipe(recipe, validatedChatMessage)
        .then(() => {
          // Success - Show toast notification
          toast({
            title: 'Changes Applied',
            description: 'Recipe has been successfully updated.',
          });
          return true;
        })
        .catch((error) => {
          console.error('Error applying changes:', error);
          // Show error toast
          toast({
            title: 'Error Applying Changes',
            description: error.message || 'An error occurred while updating the recipe.',
            variant: 'destructive',
          });
          throw error; // Re-throw to trigger catch block below
        });
        
      // If the changes include science-related updates, analyze with the reactions function
      if (validatedChatMessage.changes_suggested && 
          (validatedChatMessage.changes_suggested.science_notes ||
           validatedChatMessage.changes_suggested.instructions)) {
        
        // Skip reactions analysis if the instructions array is empty
        const instructionsArray = validatedChatMessage.changes_suggested.instructions;
        if (Array.isArray(instructionsArray) && instructionsArray.length === 0) {
          console.log('Skipping reactions analysis: empty instructions array');
          return true;
        }
        
        try {
          console.log('Starting scientific reaction analysis for recipe:', recipeId);
          
          // Load updated recipe to get latest instructions
          const { data: updatedRecipe, error: loadError } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', recipeId)
            .single();
            
          if (loadError) {
            console.error('Error loading updated recipe:', loadError);
            return true; // Continue without scientific analysis
          }
          
          // Call the reactions analysis edge function
          const instructions = Array.isArray(updatedRecipe.instructions) ? 
            updatedRecipe.instructions : [];
            
          if (instructions && instructions.length > 0) {
            // Call the analyze-reactions edge function
            supabase.functions.invoke('analyze-reactions', {
              body: {
                recipe_id: recipeId,
                title: updatedRecipe.title || recipe.title,
                instructions: instructions
              }
            }).then((response) => {
              if (response.error) {
                console.error('Error in scientific analysis:', response.error);
              } else {
                console.log('Scientific analysis completed:', response.data);
              }
            }).catch((error) => {
              console.error('Failed to invoke scientific analysis:', error);
            });
          }
        } catch (analysisError) {
          console.error('Error during scientific analysis:', analysisError);
          // Don't block the main flow for scientific analysis errors
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in apply changes flow:', error);
      return false;
      // Error already handled in updateRecipe catch
    } finally {
      setIsApplying(false);
    }
  }
  
  return {
    applyChanges,
    isApplying,
  };
}
