
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { updateRecipe } from './utils/update-recipe';

export function useApplyChanges() {
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();
  
  async function applyChanges(recipe: Recipe, chatMessage: ChatMessage) {
    if (isApplying) {
      console.warn('Already applying changes, ignoring duplicate request');
      return;
    }
    
    console.log('Starting to apply changes from chat message:', chatMessage.id);
    
    // Check for required data
    if (!recipe || !recipe.id) {
      const errorMsg = 'Cannot apply changes: Recipe data is missing';
      console.error(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return;
    }
    
    if (!chatMessage || !chatMessage.recipe_id) {
      const errorMsg = 'Cannot apply changes: Chat message is missing recipe reference';
      console.error(errorMsg, chatMessage);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsApplying(true);
      
      // First, mark this chat as "applied" in the database
      const { error: updateError } = await supabase
        .from('recipe_chats')
        .update({ applied: true })
        .eq('id', chatMessage.id);
      
      if (updateError) {
        throw new Error(`Error marking chat as applied: ${updateError.message}`);
      }
      
      // Step 2: Update the recipe with the changes
      await updateRecipe(recipe, chatMessage)
        .then(() => {
          // Success - Show toast notification
          toast({
            title: 'Changes Applied',
            description: 'Recipe has been successfully updated.',
          });
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
      if (chatMessage.changes_suggested && 
          (chatMessage.changes_suggested.science_notes ||
           chatMessage.changes_suggested.instructions)) {
        
        // Skip reactions analysis if the instructions array is empty
        const instructionsArray = chatMessage.changes_suggested.instructions;
        if (Array.isArray(instructionsArray) && instructionsArray.length === 0) {
          console.log('Skipping reactions analysis: empty instructions array');
          return;
        }
        
        try {
          console.log('Starting scientific reaction analysis for recipe:', recipe.id);
          
          // Load updated recipe to get latest instructions
          const { data: updatedRecipe, error: loadError } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', recipe.id)
            .single();
            
          if (loadError) {
            console.error('Error loading updated recipe:', loadError);
            return; // Continue without scientific analysis
          }
          
          // Call the reactions analysis edge function
          const instructions = Array.isArray(updatedRecipe.instructions) ? 
            updatedRecipe.instructions : [];
            
          if (instructions && instructions.length > 0) {
            // Call the analyze-reactions edge function
            supabase.functions.invoke('analyze-reactions', {
              body: {
                recipe_id: recipe.id,
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
      
    } catch (error) {
      console.error('Error in apply changes flow:', error);
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
