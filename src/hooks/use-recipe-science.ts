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

// Helper to get step reaction for a specific step index
export const getStepReaction = (reactions: StepReaction[], stepIndex: number): StepReaction | null => {
  if (!reactions || !Array.isArray(reactions)) return null;
  return reactions.find(reaction => reaction.step_index === stepIndex) || null;
};

// Helper function to create fallback reactions from recipe instructions and science notes
// Updated to create more unique and useful fallbacks that don't appear duplicated
const createFallbackReactions = (recipe: Recipe): StepReaction[] => {
  if (!recipe.instructions || !Array.isArray(recipe.instructions)) {
    return [];
  }
  
  // Use science notes if available, otherwise create generic notes
  const scienceNotes = recipe.science_notes && Array.isArray(recipe.science_notes) && recipe.science_notes.length > 0
    ? recipe.science_notes
    : ["Scientific analysis is being processed.", "Check back later for detailed analysis."];

  // Include timestamp to make each fallback unique
  const timestamp = new Date().toISOString();
  const fallbackId = Math.random().toString(36).substring(2, 10);
  
  // Create a basic fallback reaction for each instruction step with more variety
  return recipe.instructions.map((step, index) => {
    // Use different science notes for variety
    const noteIndex = index % scienceNotes.length;
    const scienceNote = scienceNotes[noteIndex];
    
    // Extract potential cooking method from step
    const lowerStep = step.toLowerCase();
    let cookingMethod = "Basic Cooking";
    let reactions = ["cooking"];
    
    if (lowerStep.includes("bake") || lowerStep.includes("oven")) {
      cookingMethod = "Baking";
      reactions = ["thermal_processing", "maillard_reaction"];
    } else if (lowerStep.includes("boil") || lowerStep.includes("simmer")) {
      cookingMethod = "Boiling";
      reactions = ["hydration", "protein_denaturation"];
    } else if (lowerStep.includes("fry") || lowerStep.includes("sauté")) {
      cookingMethod = "Sautéing";
      reactions = ["maillard_reaction", "caramelization"];
    } else if (lowerStep.includes("grill") || lowerStep.includes("broil")) {
      cookingMethod = "Grilling";
      reactions = ["maillard_reaction", "fat_rendering"];
    } else if (lowerStep.includes("mix") || lowerStep.includes("stir")) {
      cookingMethod = "Mixing";
      reactions = ["hydration", "emulsification"];
    }
    
    // Create more helpful fallback messages that don't just appear as duplicates
    const stepNum = index + 1;
    
    return {
      step_index: index,
      step_text: step,
      reactions: reactions,
      reaction_details: [
        `Step ${stepNum}: ${scienceNote}`,
        `Waiting for complete scientific analysis of this step. This is temporary fallback data.`
      ],
      confidence: 0.4,
      cooking_method: cookingMethod,
      metadata: {
        isTempFallback: true,
        fallbackId: `${fallbackId}-${index}`,
        timestamp: timestamp,
        recipeId: recipe.id
      }
    };
  });
};

/**
 * Centralized hook to access all scientific data for a recipe
 */
export function useRecipeScience(recipe: Recipe): RecipeScienceData {
  // Fetch reaction data for this recipe with improved caching and stale-while-revalidate strategy
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
          // Return fallback data in case of error
          return createFallbackReactions(recipe);
        }
        
        console.log('Recipe step reactions data received:', data?.length || 0, 'reactions');
        
        // If no reactions found or empty data, create fallback reactions
        if (!data || data.length === 0) {
          console.log('No reaction data found for recipe ID, creating fallbacks:', recipe.id);
          return createFallbackReactions(recipe);
        }
        
        // Validate that each step has the required data
        // And make sure no duplicates exist (by step_index)
        const uniqueSteps = new Map();
        data.forEach(reaction => {
          if (!uniqueSteps.has(reaction.step_index)) {
            uniqueSteps.set(reaction.step_index, reaction);
          }
        });
        
        // Convert Map back to array
        const validatedReactions = Array.from(uniqueSteps.values());
        
        // If we have fewer reactions than instructions, create fallbacks for missing steps
        if (validatedReactions.length < recipe.instructions?.length) {
          console.log('Missing reactions for some steps, creating fallbacks for missing steps');
          const existingStepIndices = validatedReactions.map(r => r.step_index);
          const fallbackReactions = createFallbackReactions(recipe)
            .filter(r => !existingStepIndices.includes(r.step_index));
          
          return [...validatedReactions, ...fallbackReactions];
        }
        
        return validatedReactions as StepReaction[];
      } catch (err) {
        console.error('Error in reaction query execution:', err);
        // Return fallback data in case of error
        return createFallbackReactions(recipe);
      }
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce API calls
    refetchOnMount: false, // Don't refetch on mount to reduce API calls
  });
  
  // Improved logic to determine if we have real analysis data (not just fallbacks)
  const hasAnalysisData = (() => {
    // Check for science notes in recipe
    const hasRealScienceNotes = recipe?.science_notes && 
                                Array.isArray(recipe.science_notes) && 
                                recipe.science_notes.length > 0;
    
    // Check for real step reactions (not fallbacks)
    const hasRealStepReactions = stepReactions && 
                                Array.isArray(stepReactions) && 
                                stepReactions.length > 0 && 
                                !stepReactions.some(r => r.metadata?.isTempFallback);
    
    // Log what we found for debugging
    console.log('Analysis data check:', {
      recipeId: recipe.id,
      hasRealScienceNotes,
      hasRealStepReactions,
      scienceNotesCount: recipe?.science_notes?.length || 0,
      stepReactionsCount: stepReactions?.length || 0,
      hasFallbacks: stepReactions?.some(r => r.metadata?.isTempFallback) || false
    });
    
    return hasRealScienceNotes || hasRealStepReactions;
  })();
  
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
