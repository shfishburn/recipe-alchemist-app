
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export function useFavoriteRecipe(recipeId: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if the recipe is favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !recipeId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('recipe_id', recipeId)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking favorite status:', error);
        }

        setIsFavorite(!!data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [recipeId, user]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save recipes",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Recipe removed from favorites",
          description: "The recipe has been removed from your saved recipes",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            recipe_id: recipeId,
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: "Recipe saved",
          description: "The recipe has been added to your favorites",
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your preference",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
}
