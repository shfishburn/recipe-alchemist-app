
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  return {
    ...useMutation({
      mutationFn: async (recipeId: string) => {
        // Validate recipe ID
        if (!recipeId) {
          throw new Error("Recipe ID is undefined or empty");
        }
        
        setIsDeleting(true);
        const { error } = await supabase
          .from('recipes')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', recipeId);

        if (error) throw error;
        return recipeId;
      },
      onSuccess: (recipeId) => {
        // Immediately invalidate the recipes query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['recipes'] });
        
        // Also remove this specific recipe from the cache
        queryClient.removeQueries({ queryKey: ['recipe', recipeId] });
        
        toast({
          title: "Recipe deleted",
          description: "The recipe has been moved to trash"
        });
        
        setIsDeleting(false);
      },
      onError: (error) => {
        console.error('Error deleting recipe:', error);
        
        // Provide more detailed error feedback
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Failed to delete the recipe. Please try again.";
          
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsDeleting(false);
      }
    }),
    isDeleting
  };
};
