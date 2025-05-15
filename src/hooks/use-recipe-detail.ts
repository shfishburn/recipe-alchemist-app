
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useToast } from './use-toast';
import { transformRecipeData } from '@/utils/recipe-transformers';
import type { Recipe } from '@/types/recipe';

export const useRecipeDetail = (idOrSlug?: string) => {
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  return useQuery({
    queryKey: ['recipe', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) {
        throw new Error('Recipe ID or slug is required');
      }

      try {
        console.log(`Fetching recipe with identifier: ${idOrSlug}`);
        
        // Determine if we're looking up by ID or slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
        
        let query = supabase
          .from('recipes')
          .select('*')
          .is('deleted_at', null);
          
        // Either query by ID (preferred) or by slug
        if (isUUID) {
          query = query.eq('id', idOrSlug);
        } else {
          query = query.eq('slug', idOrSlug);
        }
        
        const { data, error } = await query.single();
        
        if (error) {
          console.error('Error fetching recipe:', error);
          
          if (error.code === 'PGRST116') {
            // No rows returned - recipe not found
            throw new Error('Recipe not found');
          }
          
          throw error;
        }
        
        if (!data) {
          throw new Error('Recipe not found');
        }
        
        console.log('Recipe fetched successfully:', data.id);
        
        // Transform database response to Recipe type
        return transformRecipeData(data);
      } catch (error) {
        // Enhanced error handling with retry information
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error fetching recipe (attempt ${retryCount + 1}):`, errorMessage);
        
        // Show toast only on initial error
        if (retryCount === 0) {
          toast({
            title: 'Error',
            description: `Failed to load recipe: ${errorMessage}`,
            variant: 'destructive',
          });
        }
        
        // Increment retry counter for tracking
        setRetryCount(prev => prev + 1);
        throw error;
      }
    },
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};
