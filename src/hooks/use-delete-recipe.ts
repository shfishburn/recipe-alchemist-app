
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (recipeId: string) => {
      const { error } = await supabase
        .from('recipes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', recipeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast({
        title: "Recipe deleted",
        description: "The recipe has been moved to trash"
      });
    },
    onError: (error) => {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to delete the recipe. Please try again.",
        variant: "destructive"
      });
    }
  });
};
