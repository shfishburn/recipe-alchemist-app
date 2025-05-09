
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Recipe, NutriScore } from '@/types/recipe';
import { toast } from 'sonner';

export function useNutriScore(recipe: Recipe) {
  const queryClient = useQueryClient();
  
  // Query to get the current NutriScore from the recipe
  const { data: nutriScore, isLoading } = useQuery({
    queryKey: ['nutriScore', recipe.id],
    queryFn: async () => {
      return recipe.nutri_score as NutriScore | null | undefined;
    },
    staleTime: 600000, // 10 minutes
  });
  
  // Function to calculate NutriScore using Supabase's database function
  const calculateNutriScore = async (): Promise<NutriScore | null> => {
    try {
      if (!recipe.nutrition) {
        throw new Error("No nutrition data available to calculate Nutri-Score");
      }
      
      // Call the Supabase database function to calculate the score
      const { data, error } = await supabase.rpc(
        'calculate_nutri_score',
        { 
          nutrition: recipe.nutrition,
          category: recipe.cuisine_category?.toLowerCase() || 'food',
          fruit_veg_nuts_percent: 0 // Default value, could be made dynamic
        }
      );
      
      if (error) throw error;
      
      return data as NutriScore;
    } catch (error) {
      console.error("Failed to calculate Nutri-Score:", error);
      return null;
    }
  };
  
  // Mutation to update the recipe with the new NutriScore
  const updateNutriScore = useMutation({
    mutationFn: async () => {
      try {
        // First calculate the score
        const newNutriScore = await calculateNutriScore();
        
        if (!newNutriScore) {
          throw new Error("Failed to calculate Nutri-Score");
        }
        
        // Then update the recipe
        const { data, error } = await supabase
          .from('recipes')
          .update({ nutri_score: newNutriScore as any }) // Type assertion to bypass the JSON constraint
          .eq('id', recipe.id)
          .select('nutri_score')
          .single();
          
        if (error) throw error;
        
        return data.nutri_score as NutriScore;
      } catch (error) {
        console.error("Error updating Nutri-Score:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['recipe', recipe.id] });
      queryClient.invalidateQueries({ queryKey: ['nutriScore', recipe.id] });
      
      toast.success("Nutri-Score updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update Nutri-Score:", error);
      toast.error("Failed to update Nutri-Score. Please try again.");
    },
  });
  
  const shouldCalculate = !nutriScore?.grade && recipe.nutrition && 
    Object.keys(recipe.nutrition).length > 0;
    
  return {
    nutriScore,
    isLoading,
    calculateNutriScore: updateNutriScore.mutate,
    isCalculating: updateNutriScore.isPending,
    shouldCalculate
  };
}
