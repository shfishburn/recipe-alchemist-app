
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
  cooking_method?: string;
  temperature_celsius?: number;
  duration_minutes?: number;
  
  // Enhanced scientific data
  chemical_systems?: {
    primary_reactions?: string[];
    secondary_reactions?: string[];
    reaction_mechanisms?: string;
    critical_compounds?: string[];
    ph_effects?: { range?: string; impact?: string };
    water_activity?: { value?: number; significance?: string };
  };
  
  thermal_engineering?: {
    heat_transfer_mode?: string;
    thermal_gradient?: string;
    temperature_profile?: { surface?: number; core?: number; unit?: string };
    heat_capacity_considerations?: string;
  };
  
  process_parameters?: {
    critical_times?: { minimum?: number; optimal?: number; maximum?: number; unit?: string };
    tolerance_windows?: { temperature?: string; time?: string; humidity?: string };
  };
  
  troubleshooting_matrix?: Array<{
    problem?: string;
    diagnostic_tests?: string[];
    corrections?: string[];
    prevention?: string[];
  }>;
  
  safety_protocols?: {
    critical_limits?: string;
    haccp_points?: string;
    allergen_concerns?: string;
  };
  
  metadata?: Record<string, any>; // Backwards compatibility for additional structured data
}

export interface RecipeScienceData {
  stepReactions: StepReaction[];
  hasAnalysisData: boolean;
  scienceNotes: string[];
  globalAnalysis?: {
    cascade_effects?: string;
    energy_systems?: string;
    scaling_considerations?: string;
    process_flow_optimization?: string;
    equipment_integration?: string;
  };
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Helper to format reaction names for display
export const formatReactionName = (name: string): string => {
  if (!name) return '';
  // Convert camelCase or snake_case to Title Case with spaces
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
};

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
        console.log('Fetching recipe reactions for recipe ID:', recipe.id);
        
        const { data, error } = await supabase
          .from('recipe_step_reactions')
          .select('*')
          .eq('recipe_id', recipe.id)
          .order('step_index', { ascending: true });
        
        if (error) {
          console.error('Error fetching recipe reactions:', error);
          return [];
        }
        
        console.log('Recipe step reactions data received:', data);
        
        if (!data || data.length === 0) {
          console.log('No reaction data found for recipe ID:', recipe.id);
          
          // If no reactions found but we have science notes, create a fallback reaction
          if (recipe.science_notes && Array.isArray(recipe.science_notes) && recipe.science_notes.length > 0) {
            // Create a basic fallback reaction for each instruction step
            return recipe.instructions.map((step, index) => ({
              step_index: index,
              step_text: step,
              reactions: ['cooking'],
              reaction_details: [
                `Automatic fallback analysis: ${recipe.science_notes[index % recipe.science_notes.length]}`
              ],
              confidence: 0.5,
              cooking_method: 'Basic Cooking'
            } as StepReaction));
          }
        }
        
        return (data || []) as StepReaction[];
      } catch (err) {
        console.error('Error in reaction query execution:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  // Determine if we have any science data
  const hasAnalysisData = 
    (stepReactions && stepReactions.length > 0) || 
    (recipe?.science_notes && Array.isArray(recipe.science_notes) && recipe.science_notes.length > 0);
  
  // Extract science notes from recipe
  const scienceNotes = recipe?.science_notes && Array.isArray(recipe.science_notes) 
    ? recipe.science_notes 
    : [];
    
  // Extract global recipe analysis if available
  const globalAnalysis = {
    cascade_effects: "Understanding how each cooking step affects subsequent ones",
    energy_systems: "Heat transfer mechanisms throughout the cooking process",
    scaling_considerations: "How to adjust for different portion sizes"
  };

  return {
    stepReactions: stepReactions || [],
    hasAnalysisData,
    scienceNotes,
    globalAnalysis,
    isLoading,
    error: error as Error | null,
    refetch
  };
}
