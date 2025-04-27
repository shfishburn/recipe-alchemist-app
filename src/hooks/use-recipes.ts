
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export const useRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const query = useQuery<Recipe[]>({
    queryKey: ['recipes', searchTerm],
    queryFn: async () => {
      let supabaseQuery = supabase
        .from('recipes')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        supabaseQuery = supabaseQuery
          .or(
            `title.ilike.%${searchTerm}%,` +
            `tagline.ilike.%${searchTerm}%,` +
            `cuisine.ilike.%${searchTerm}%,` +
            `dietary.ilike.%${searchTerm}%`
          );
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;
      return data || [];
    },
  });

  return {
    ...query,
    searchTerm,
    setSearchTerm,
  };
};
