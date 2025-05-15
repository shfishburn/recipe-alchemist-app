
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import { useAuth } from '@/hooks/use-auth';
import { transformDbToRecipe } from '@/utils/db-transformers';

export const useRecipes = () => {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const query = useQuery({
    queryKey: ['recipes', searchTerm],
    queryFn: async () => {
      if (!session?.user) {
        console.log('User not authenticated, returning empty recipe list');
        return [];
      }

      try {
        let query = supabase
          .from('recipes')
          .select('*')
          .eq('user_id', session.user.id)
          .is('deleted_at', null);

        // Apply search filter if present
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%`);
        }

        // Order by most recently updated
        query = query.order('updated_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          return [];
        }

        // Transform database records to Recipe type
        return data.map(item => transformDbToRecipe(item));
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        throw error;
      }
    },
    enabled: !!session?.user,
    staleTime: 60000, // 1 minute
  });

  return {
    ...query,
    searchTerm,
    setSearchTerm,
  };
};
