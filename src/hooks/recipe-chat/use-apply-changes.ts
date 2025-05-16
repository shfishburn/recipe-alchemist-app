
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
      return false;
    }
    
    if (!chatMessage) {
      const errorMsg = 'Cannot apply changes: Chat message is missing';
      console.error(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return false;
    }
    
    // Get recipe ID from chat message or recipe
    const recipeId = chatMessage.recipe_id || (chatMessage.meta?.recipe_id as string) || recipe.id;
    
    if (!recipeId) {
      const errorMsg = 'Cannot apply changes: Recipe ID is missing';
      console.error(errorMsg, { chatMessage, recipe });
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return false;
    }
    
    // Add recipe_id to chat message if missing
    const enhancedChatMessage = {
      ...chatMessage,
      recipe_id: recipeId
    };
    
    try {
      setIsApplying(true);
      
      // First, mark this chat as "applied" in the database
      const { error: updateError } = await supabase
        .from('recipe_chats')
        .update({ applied: true })
        .eq('id', enhancedChatMessage.id);
      
      if (updateError) {
        throw new Error(`Error marking chat as applied: ${updateError.message}`);
      }
      
      // Step 2: Update the recipe with the changes
      try {
        const updatedRecipe = await updateRecipe(recipe, enhancedChatMessage);
        
        // Success - Show toast notification
        toast({
          title: 'Changes Applied',
          description: 'Recipe has been successfully updated.',
        });
        
        // If the changes include science-related updates, analyze with the reactions function
        if (enhancedChatMessage.changes_suggested && 
            (enhancedChatMessage.changes_suggested.science_notes ||
            enhancedChatMessage.changes_suggested.instructions)) {
          
          // Skip reactions analysis if the instructions array is empty
          const instructionsArray = enhancedChatMessage.changes_suggested.instructions;
          if (Array.isArray(instructionsArray) && instructionsArray.length === 0) {
            console.log('Skipping reactions analysis: empty instructions array');
            return true;
          }
          
          try {
            console.log('Starting scientific reaction analysis for recipe:', recipeId);
            
            // Load updated recipe to get latest instructions
            const { data: updatedRecipeData, error: loadError } = await supabase
              .from('recipes')
              .select('*')
              .eq('id', recipeId)
              .single();
              
            if (loadError) {
              console.error('Error loading updated recipe:', loadError);
              return true; // Continue without scientific analysis
            }
            
            // Call the reactions analysis edge function
            const instructions = Array.isArray(updatedRecipeData.instructions) ? 
              updatedRecipeData.instructions : [];
              
            if (instructions && instructions.length > 0) {
              // Call the analyze-reactions edge function
              supabase.functions.invoke('analyze-reactions', {
                body: {
                  recipe_id: recipeId,
                  title: updatedRecipeData.title || recipe.title,
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
      } catch (error: any) {
        console.error('Error applying changes:', error);
        
        // Show error toast
        toast({
          title: 'Error Applying Changes',
          description: error.message || 'An error occurred while updating the recipe.',
          variant: 'destructive',
        });
        
        throw error; // Re-throw to trigger catch block below
      }
    } catch (error) {
      console.error('Error in apply changes flow:', error);
      return false;
    } finally {
      setIsApplying(false);
    }
  }
  
  return {
    applyChanges,
    isApplying,
  };
}
