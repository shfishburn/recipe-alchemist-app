
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';

// Define standardized interfaces for science data
export interface StepReaction {
  step_index: number;
  step_text: string;
  reactions: string[];
  reaction_details: string[];
  confidence: number;
  cooking_method?: string; // Added cooking_method property
}

export interface RecipeScienceData {
  stepReactions: StepReaction[];
  hasAnalysisData: boolean;
  scienceNotes: string[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Centralized hook to access all scientific data for a recipe
 */
export function useRecipeScience(recipe: Recipe): RecipeScienceData {
  // Fetch reaction data for this recipe
  const {
    data: stepReactions,
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
        
        return (data || []) as StepReaction[];
      } catch (err) {
        console.error('Error in reaction query execution:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  // Check URL hash to see if we're on the science tab
  const isOnScienceTab = () => {
    return window.location.hash === '#science';
  };
  
  // Determine if we have any science data
  const hasAnalysisData = 
    (stepReactions && stepReactions.length > 0) || 
    (recipe?.science_notes && Array.isArray(recipe.science_notes) && recipe.science_notes.length > 0);
  
  // Extract science notes from recipe
  const scienceNotes = recipe?.science_notes && Array.isArray(recipe.science_notes) 
    ? recipe.science_notes 
    : [];

  return {
    stepReactions: stepReactions || [],
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
