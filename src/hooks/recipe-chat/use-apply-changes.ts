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
        description: "Updating your recipe with scientific improvements...",
      });

      console.log("Starting to apply changes from chat:", chatMessage.id);
      
      // Enhanced validation to ensure there are substantive changes to apply
      if (
        !chatMessage.changes_suggested.title && 
        !chatMessage.changes_suggested.instructions && 
        (!chatMessage.changes_suggested.ingredients || 
         !chatMessage.changes_suggested.ingredients.items || 
         chatMessage.changes_suggested.ingredients.items.length === 0 ||
         chatMessage.changes_suggested.ingredients.mode === 'none')
      ) {
        console.warn("No substantial changes found to apply");
        throw new Error("The AI didn't suggest any specific recipe changes that can be applied");
      }

      let imageUrl = recipe.image_url;
      let shouldGenerateNewImage = false;
      
      // Process nutrition data with proper typing
      let standardizedNutrition = recipe.nutrition;
      if (chatMessage.changes_suggested?.nutrition) {
        console.log("Processing nutrition data from chat suggestion");
        standardizedNutrition = standardizeNutrition(chatMessage.changes_suggested.nutrition);
        
        if (!validateNutrition(standardizedNutrition)) {
          console.warn("Nutrition data validation failed, using existing recipe nutrition");
          standardizedNutrition = recipe.nutrition;
        }
      }

      // Process ingredients with proper typing
      let updatedIngredients: Ingredient[] = recipe.ingredients;
      if (chatMessage.changes_suggested?.ingredients?.items) {
        updatedIngredients = chatMessage.changes_suggested.ingredients.items.map(item => ({
          qty: Number(item.qty),
          unit: String(item.unit),
          item: String(item.item),
          notes: item.notes ? String(item.notes) : undefined
        }));
      }
      
      // Create a properly typed recipe update object
      const recipeUpdate: Recipe = {
        ...recipe,
        id: recipe.id,
        title: chatMessage.changes_suggested?.title || recipe.title,
        ingredients: updatedIngredients,
        instructions: Array.isArray(chatMessage.changes_suggested?.instructions) 
          ? chatMessage.changes_suggested.instructions.map(instr => 
              typeof instr === 'string' ? instr : instr.action
            )
          : recipe.instructions,
        nutrition: standardizedNutrition,
        science_notes: chatMessage.changes_suggested?.science_notes || recipe.science_notes || [],
        image_url: imageUrl,
        version_number: recipe.version_number
      };

      // Determine if we need a new image based on the types of changes
      if (
        // Only generate new image for substantive changes
        chatMessage.changes_suggested.title || 
        (chatMessage.changes_suggested.ingredients && 
         chatMessage.changes_suggested.ingredients.mode === 'replace')
      ) {
        shouldGenerateNewImage = true;
      }

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
        
        if (shouldGenerateNewImage) {
          try {
            console.log("Generating new image for updated recipe");
            
            const newImageUrl = await generateRecipeImage(
              recipeUpdate.title,
              recipeUpdate.ingredients,
              recipeUpdate.instructions,
              recipe.id
            );
            
            if (newImageUrl) {
              const updatedRecipeWithImage: Recipe = {
                ...recipeUpdate,
                image_url: newImageUrl
              };
              
              await updateRecipe(
                updatedRecipeWithImage,
                chatMessage, 
                user.id,
                newImageUrl
              );
            }
          } catch (imageError) {
            console.error('Error generating image:', imageError);
          }
        }

        return updatedRecipe;
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
          : "Failed to apply changes",
        variant: "destructive",
      });
    },
  });

  return applyChanges;
};
