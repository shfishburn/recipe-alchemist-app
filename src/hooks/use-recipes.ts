
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export const useRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const query = useQuery<Recipe[]>({
    queryKey: ['recipes', searchTerm],
    queryFn: async () => {
      console.log('Fetching recipes with search term:', searchTerm);
      
      try {
        let supabaseQuery = supabase
          .from('recipes')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (searchTerm && searchTerm.trim() !== '') {
          const trimmedTerm = searchTerm.trim();
          supabaseQuery = supabaseQuery.or([
            `title.ilike.%${trimmedTerm}%`,
            `tagline.ilike.%${trimmedTerm}%`,
            `cuisine.ilike.%${trimmedTerm}%`,
            `dietary.ilike.%${trimmedTerm}%`
          ].join(','));
        }

        const { data, error } = await supabaseQuery;

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }
        
        console.log('Recipes fetched successfully:', data?.length || 0, 'recipes');
        return data || [];
      } catch (error) {
        console.error('Unexpected error fetching recipes:', error);
        toast.error('Failed to fetch recipes. Please try again.');
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
  });

  return {
    ...query,
    searchTerm,
    setSearchTerm,
  };
};
