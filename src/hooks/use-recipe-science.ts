
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import { useMemoize } from '@/hooks/use-memoize';

// Define standardized interfaces for science data
export interface StepReaction {
  step_index: number;
  step_text: string;
  reactions: string[];
  reaction_details: string[];
  confidence: number;
  cooking_method?: string;
}

export interface RecipeScienceData {
  stepReactions: StepReaction[];
  hasAnalysisData: boolean;
  scienceNotes: string[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

/**
 * Centralized hook to access all scientific data for a recipe
 */
export function useRecipeScience(recipe: Recipe): RecipeScienceData {
  // Cache expensive operations
  const processReactions = useMemoize((data: any[]): StepReaction[] => {
    return (data || []) as StepReaction[];
  }, {
    ttl: 300000, // 5 minutes
    maxSize: 50
  });

  // Fetch reaction data for this recipe
  const {
    data: rawStepReactions,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['recipe-reactions', recipe.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('recipe_step_reactions')
          .select('*')
          .eq('recipe_id', recipe.id)
          .order('step_index', { ascending: true });
        
        if (error) {
          console.error('Error fetching recipe reactions:', error);
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.error('Error in reaction query execution:', err);
        return [];
      }
    },
    staleTime: 300000, // Cache for 5 minutes (increased from initial value)
  });
  
  // Process step reactions with memoization
  const stepReactions = useMemo(() => 
    processReactions(rawStepReactions || []),
    [processReactions, rawStepReactions]
  );
  
  // Extract science notes from recipe with proper type checking
  const scienceNotes = useMemo(() => {
    if (!recipe?.science_notes) return [];
    return Array.isArray(recipe.science_notes) ? recipe.science_notes : [];
  }, [recipe?.science_notes]);
  
  // Determine if we have any science data
  const hasAnalysisData = useMemo(() => 
    (stepReactions.length > 0) || (scienceNotes.length > 0),
    [stepReactions, scienceNotes]
  );

  return {
    stepReactions,
    hasAnalysisData,
    scienceNotes,
    isLoading,
    error: error as Error | null,
    refetch
  };
}

/**
 * Get reaction data for a specific step
 */
export function getStepReaction(stepReactions: StepReaction[] | undefined, index: number): StepReaction | null {
  if (!stepReactions || !Array.isArray(stepReactions)) return null;
  return stepReactions.find(reaction => reaction.step_index === index) || null;
}

/**
 * Format a reaction name for display
 */
export function formatReactionName(reaction: string): string {
  return reaction
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
