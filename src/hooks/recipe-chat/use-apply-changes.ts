
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
      if (!chatMessage.changes_suggested || !user) return;

      toast({
        title: "Applying changes",
        description: "Updating your recipe with scientific improvements...",
      });

      let imageUrl = recipe.image_url;
      if (
        chatMessage.changes_suggested.title || 
        (chatMessage.changes_suggested.ingredients && 
         chatMessage.changes_suggested.ingredients.mode === 'replace')
      ) {
        try {
          imageUrl = await generateRecipeImage(
            chatMessage.changes_suggested.title || recipe.title,
            chatMessage.changes_suggested.ingredients?.items || recipe.ingredients,
            Array.isArray(chatMessage.changes_suggested.instructions) 
              ? chatMessage.changes_suggested.instructions.map(instr => 
                  typeof instr === 'string' ? instr : instr.action
                ) 
              : recipe.instructions,
            recipe.id
          );
        } catch (error) {
          console.error('Failed to generate new recipe image:', error);
          // Continue with existing image if generation fails
        }
      }

      const newRecipe = await updateRecipe(recipe, chatMessage, user.id, imageUrl);
      await updateChatStatus(chatMessage);

      return newRecipe;
    },
    onSuccess: (newRecipe) => {
      toast({
        title: "Changes applied",
        description: `Created version ${newRecipe?.version_number || 'new'} of the recipe with scientific improvements`,
      });
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      window.location.href = `/recipes/${recipe.id}`;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to apply changes',
        variant: "destructive",
      });
    },
  });

  return applyChanges;
};
