
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { generateRecipeImage } from './utils/generate-recipe-image';
import { updateRecipe } from './utils/update-recipe';
import { updateChatStatus } from './utils/update-chat-status';

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
        description: "Updating your recipe with scientific improvements...",
      });

      console.log("Starting to apply changes from chat:", chatMessage.id);
      
      // First validate that we have changes that can be applied
      if (
        !chatMessage.changes_suggested.title && 
        !chatMessage.changes_suggested.instructions && 
        (!chatMessage.changes_suggested.ingredients || 
         !chatMessage.changes_suggested.ingredients.items || 
         chatMessage.changes_suggested.ingredients.items.length === 0)
      ) {
        console.warn("No substantial changes found to apply");
        toast({
          title: "No changes to apply",
          description: "The AI didn't suggest any specific recipe changes",
          variant: "destructive",
        });
        throw new Error("No substantial changes to apply");
      }

      let imageUrl = recipe.image_url;
      
      // Try to generate a new image, but catch errors to prevent the entire process from failing
      if (
        chatMessage.changes_suggested.title || 
        (chatMessage.changes_suggested.ingredients && 
         chatMessage.changes_suggested.ingredients.mode === 'replace')
      ) {
        try {
          console.log("Calling generate-recipe-image function with:", {
            title: chatMessage.changes_suggested.title || recipe.title,
            ingredients: chatMessage.changes_suggested.ingredients?.items || recipe.ingredients,
            instructions: Array.isArray(chatMessage.changes_suggested.instructions) 
              ? chatMessage.changes_suggested.instructions.map(instr => 
                  typeof instr === 'string' ? instr : instr.action
                ) 
              : recipe.instructions,
            recipeId: recipe.id
          });
          
          const newImageUrl = await generateRecipeImage(
            chatMessage.changes_suggested.title || recipe.title,
            chatMessage.changes_suggested.ingredients?.items || recipe.ingredients,
            Array.isArray(chatMessage.changes_suggested.instructions) 
              ? chatMessage.changes_suggested.instructions.map(instr => 
                  typeof instr === 'string' ? instr : instr.action
                ) 
              : recipe.instructions,
            recipe.id
          );
          
          if (newImageUrl) {
            imageUrl = newImageUrl;
          } else {
            console.log("Image generation returned null or empty URL, keeping existing image");
          }
        } catch (error) {
          console.error('Error generating image:', error);
          // Continue with existing image if generation fails
        }
      }

      try {
        const newRecipe = await updateRecipe(recipe, chatMessage, user.id, imageUrl);
        
        if (!newRecipe) {
          throw new Error("Failed to update recipe - no data returned");
        }
        
        await updateChatStatus(chatMessage);
        return newRecipe;
      } catch (error) {
        console.error("Update recipe error:", error);
        throw error;
      }
    },
    onSuccess: (newRecipe) => {
      toast({
        title: "Changes applied",
        description: `Created version ${newRecipe?.version_number || 'new'} of the recipe with improvements`,
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
          : (error.message || 'Failed to apply changes'),
        variant: "destructive",
      });
    },
  });

  return applyChanges;
};
