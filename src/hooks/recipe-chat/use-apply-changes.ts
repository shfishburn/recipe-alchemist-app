
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { createRecipeVersion } from './utils/db/create-recipe-version';
import { processRecipeUpdates } from './utils/process-recipe-updates';
import { useNavigate } from 'react-router-dom';

export function useApplyChanges() {
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  async function applyChanges(chatMessage: ChatMessage): Promise<boolean> {
    if (isApplying) {
      console.warn('Already applying changes, ignoring duplicate request');
      return false;
    }
    
    if (!chatMessage || !chatMessage.recipe_id) {
      console.error('Cannot apply changes: Chat message or recipe ID is missing');
      toast({
        title: 'Error',
        description: 'Cannot apply changes: Recipe reference is missing',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsApplying(true);
    
    try {
      console.log('Starting to apply changes from chat message:', {
        chatId: chatMessage.id,
        recipeId: chatMessage.recipe_id,
        hasChanges: !!chatMessage.changes_suggested
      });
      
      // First, mark this chat as "applied" in the database
      const { error: updateError } = await supabase
        .from('recipe_chats')
        .update({ applied: true })
        .eq('id', chatMessage.id);
      
      if (updateError) {
        throw new Error(`Error marking chat as applied: ${updateError.message}`);
      }
      
      // Fetch the current recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', chatMessage.recipe_id)
        .single();
      
      if (recipeError || !recipeData) {
        throw new Error(`Error fetching recipe: ${recipeError?.message || 'Recipe not found'}`);
      }
      
      // Convert database record to Recipe type
      const originalRecipe = recipeData as unknown as Recipe;
      
      // Create a new recipe version with the changes
      const newRecipeData = await createRecipeVersion(originalRecipe, chatMessage);
      
      // Show success toast
      toast({
        title: 'New Recipe Version Created',
        description: `Version ${newRecipeData.version} has been successfully created.`,
      });
      
      // Navigate to the new recipe version
      if (newRecipeData.slug) {
        setTimeout(() => {
          navigate(`/recipe/${newRecipeData.slug}`);
        }, 500);
      }
      
      // If the changes include science-related updates, analyze with the reactions function
      if (chatMessage.changes_suggested && 
          (chatMessage.changes_suggested.science_notes ||
           chatMessage.changes_suggested.instructions)) {
        
        try {
          console.log('Starting scientific reaction analysis for recipe:', newRecipeData.id);
          
          // Call the reactions analysis edge function with the new recipe ID
          const instructions = chatMessage.changes_suggested.instructions;
          if (instructions && instructions.length > 0) {
            // Call the analyze-reactions edge function
            supabase.functions.invoke('analyze-reactions', {
              body: {
                recipe_id: newRecipeData.id,
                title: chatMessage.changes_suggested.title || originalRecipe.title,
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
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while applying changes',
        variant: 'destructive',
      });
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
