
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define reaction item type
export interface StepReaction {
  step_index: number;
  step_text: string;
  reactions: string[];
  reaction_details: string[];
  confidence: number;
}

export function useStepReactions(recipeId: string) {
  // Fetch reaction data for this recipe
  return useQuery({
    queryKey: ['recipe-reactions', recipeId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('recipe_step_reactions')
          .select('*')
          .eq('recipe_id', recipeId)
          .order('step_index', { ascending: true });
        
        if (error) {
          console.error('Error fetching recipe reactions:', error);
          return [];
        }
        
        return data as StepReaction[];
      } catch (err) {
        console.error('Error in query execution:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function getStepReaction(stepReactions: StepReaction[] | undefined, index: number): StepReaction | null {
  if (!stepReactions || !Array.isArray(stepReactions)) return null;
  return stepReactions.find(reaction => reaction.step_index === index) || null;
}
