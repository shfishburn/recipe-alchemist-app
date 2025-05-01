
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { Recipe } from '@/types/recipe';

interface NutritionUpdateButtonProps {
  recipe: Recipe;
  onUpdateComplete: (updatedNutrition: any) => void;
}

export function NutritionUpdateButton({ 
  recipe, 
  onUpdateComplete 
}: NutritionUpdateButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const handleUpdateNutrition = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to update nutrition data",
        variant: "destructive"
      });
      return;
    }

    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "This recipe has no ingredients to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await supabase.functions.invoke('nutrisynth-analysis', {
        body: { 
          ingredients: recipe.ingredients,
          servings: recipe.servings || 1
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to update nutrition data');
      }

      console.log('Nutrition data updated:', response.data);

      // Update the recipe with the new nutrition data
      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          nutrition: response.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipe.id);

      if (updateError) {
        throw new Error(updateError.message || 'Failed to save updated nutrition data');
      }

      toast({
        title: "Nutrition updated",
        description: "Recipe nutrition data has been updated with enhanced analysis",
      });
      
      // Pass the updated data to the parent component
      onUpdateComplete(response.data);
    } catch (error) {
      console.error('Error updating nutrition data:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update nutrition data",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUpdateNutrition}
      disabled={isUpdating}
      className="flex items-center gap-1 text-xs"
    >
      {isUpdating ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : (
        <RefreshCw className="h-3 w-3 mr-1" />
      )}
      {isUpdating ? "Updating..." : "Update Nutrition"}
    </Button>
  );
}
