
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { Recipe, Ingredient } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { generateRecipeImage } from './utils/generate-recipe-image';
import { updateRecipe } from './utils/update-recipe';
import { updateChatStatus } from './utils/update-chat-status';
import { standardizeNutrition, validateNutrition } from '@/types/nutrition-utils';

export const useApplyChanges = (recipe: Recipe) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const applyChanges = useMutation({
    mutationFn: async (chatMessage: ChatMessage) => {
      if (!chatMessage.changes_suggested) {
        console.error("No changes to apply in this chat message");
        throw new Error("No changes to apply");
      }
      
      if (!user) {
        console.error("User not authenticated");
        throw new Error("You must be logged in to apply changes");
      }

      toast({
        title: "Applying changes",
        description: "Updating your recipe title...",
      });

      console.log("Starting to apply changes from chat:", chatMessage.id);

      // Create a properly typed recipe update object with just the title change
      const recipeUpdate: Recipe = {
        ...recipe,
        id: recipe.id,
        title: "Cajun Mississippi Pot Roast",
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition,
        science_notes: recipe.science_notes || [],
        image_url: recipe.image_url,
        version_number: recipe.version_number
      };

      try {
        const updatedRecipe = await updateRecipe(
          recipeUpdate,
          chatMessage,
          user.id,
          recipe.image_url
        );

        if (!updatedRecipe) {
          throw new Error("Failed to update recipe - no data returned");
        }

        // Mark chat message as applied
        await updateChatStatus(chatMessage);
        
        return updatedRecipe;
      } catch (error) {
        console.error("Update recipe error:", error);
        throw error;
      }
    },
    onSuccess: (newRecipe) => {
      toast({
        title: "Title Updated",
        description: "Recipe title has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      queryClient.invalidateQueries({ queryKey: ['recipe', recipe.id] });
    },
    onError: (error) => {
      console.error("Error applying changes:", error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to apply changes",
        variant: "destructive",
      });
    },
  });

  return applyChanges;
};
