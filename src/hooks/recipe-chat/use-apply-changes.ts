
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import type { Json } from '@/integrations/supabase/types';

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
          const response = await supabase.functions.invoke('generate-recipe-image', {
            body: {
              title: chatMessage.changes_suggested.title || recipe.title,
              ingredients: chatMessage.changes_suggested.ingredients?.items || recipe.ingredients,
              instructions: Array.isArray(chatMessage.changes_suggested.instructions) 
                ? chatMessage.changes_suggested.instructions.map(instr => 
                    typeof instr === 'string' ? instr : instr.action
                  ) 
                : recipe.instructions,
            },
          });

          if (response.error) throw response.error;
          imageUrl = response.data.imageUrl;
        } catch (error) {
          console.error('Error generating image:', error);
        }
      }

      const newRecipeData = {
        ...recipe,
        id: undefined,
        previous_version_id: recipe.id,
        version_number: recipe.version_number + 1,
        title: chatMessage.changes_suggested.title || recipe.title,
        nutrition: chatMessage.changes_suggested.nutrition || recipe.nutrition,
        image_url: imageUrl,
        user_id: recipe.user_id || user.id,
        servings: recipe.servings || 4,
      };

      if (chatMessage.changes_suggested.instructions) {
        if (typeof chatMessage.changes_suggested.instructions[0] === 'string') {
          newRecipeData.instructions = chatMessage.changes_suggested.instructions as string[];
        } else {
          newRecipeData.instructions = (chatMessage.changes_suggested.instructions as Array<{
            stepNumber?: number;
            action: string;
            explanation?: string;
            whyItWorks?: string;
            troubleshooting?: string;
            indicator?: string;
          }>).map(instr => instr.action);
        }
      }

      if (chatMessage.changes_suggested.ingredients) {
        const { mode, items } = chatMessage.changes_suggested.ingredients;
        
        if (mode === 'add' && items) {
          newRecipeData.ingredients = [...recipe.ingredients, ...items];
        } else if (mode === 'replace' && items) {
          newRecipeData.ingredients = items;
        }
      }

      const { data: newRecipe, error } = await supabase
        .from('recipes')
        .insert({
          ...newRecipeData,
          ingredients: newRecipeData.ingredients as unknown as Json,
          nutrition: newRecipeData.nutrition as unknown as Json
        })
        .select()
        .single();

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('recipe_chats')
        .update({ applied: true })
        .eq('id', chatMessage.id);

      if (updateError) throw updateError;

      return newRecipe;
    },
    onSuccess: (newRecipe) => {
      toast({
        title: "Changes applied",
        description: `Created version ${newRecipe.version_number} of the recipe with scientific improvements`,
      });
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      window.location.href = `/recipes/${newRecipe.id}`;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return applyChanges;
};
