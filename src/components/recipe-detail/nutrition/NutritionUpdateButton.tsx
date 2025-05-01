
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { deepMergeNutrition, logNutritionChanges, validateNutritionDataQuality } from '@/utils/nutrition-utils';
import type { Recipe } from '@/types/recipe';
import { Progress } from '@/components/ui/progress';

interface NutritionUpdateButtonProps {
  recipe: Recipe;
  onUpdateComplete: (updatedNutrition: any) => void;
}

export function NutritionUpdateButton({ 
  recipe, 
  onUpdateComplete 
}: NutritionUpdateButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
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
    setUpdateProgress(10);
    
    // Simulate progress updates for better user feedback
    const progressInterval = setInterval(() => {
      setUpdateProgress(prev => Math.min(prev + 15, 90));
    }, 600);
    
    try {
      console.log("Sending ingredients to analyze:", recipe.ingredients);
      
      const response = await supabase.functions.invoke('nutrisynth-analysis', {
        body: { 
          ingredients: recipe.ingredients,
          servings: recipe.servings || 1
        }
      });

      if (response.error) {
        console.error("Nutrition analysis error:", response.error);
        throw new Error(response.error.message || 'Failed to update nutrition data');
      }

      if (!response.data) {
        console.error("No data returned from nutrition analysis");
        throw new Error('No nutrition data was returned from analysis');
      }

      console.log('New nutrition data received:', response.data);
      
      // Validate received nutrition data
      const validationIssues = validateNutritionDataQuality(response.data);
      if (validationIssues.length > 0) {
        console.warn('Nutrition data validation issues:', validationIssues);
      }
      
      // Use our deep merge utility to properly combine nutrition data
      const existingNutrition = recipe.nutrition || {};
      const updatedNutrition = deepMergeNutrition(existingNutrition, response.data);
      
      // Complete progress indication
      clearInterval(progressInterval);
      setUpdateProgress(100);
      
      // Log the differences for debugging
      logNutritionChanges(existingNutrition, updatedNutrition);

      // Update the recipe with the merged nutrition data
      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          nutrition: updatedNutrition,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipe.id);

      if (updateError) {
        console.error("DB update error:", updateError);
        throw new Error(updateError.message || 'Failed to save updated nutrition data');
      }

      // Show different toast based on validation results
      if (validationIssues.length > 0) {
        toast({
          title: "Nutrition updated",
          description: "Some nutrition values may be estimates due to limited ingredient data",
          // Using a valid variant for the toast
          variant: "default"
        });
      } else {
        toast({
          title: "Nutrition updated",
          description: "Recipe nutrition data has been enhanced with detailed analysis",
        });
      }
      
      // Pass the updated data to the parent component
      onUpdateComplete(updatedNutrition);
    } catch (error) {
      console.error('Error updating nutrition data:', error);
      
      // Clear progress indication
      clearInterval(progressInterval);
      setUpdateProgress(0);
      
      // Provide more specific error messages based on error type
      let errorMessage = error instanceof Error ? error.message : "Failed to update nutrition data";
      
      // Check for common error cases
      if (typeof errorMessage === 'string') {
        if (errorMessage.toLowerCase().includes('network')) {
          errorMessage = "Network error - Please check your connection";
        } else if (errorMessage.toLowerCase().includes('rate limit')) {
          errorMessage = "API rate limit exceeded - Please try again later";
        } else if (errorMessage.toLowerCase().includes('timeout')) {
          errorMessage = "Request timed out - The nutrition service may be busy";
        }
      }
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      // Give some time for the user to see the 100% progress if successful
      setTimeout(() => {
        setIsUpdating(false);
        setUpdateProgress(0);
      }, 500);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleUpdateNutrition}
        disabled={isUpdating}
        className="flex items-center gap-1 text-xs md:text-sm h-9 md:h-9 px-2 md:px-3 min-w-[140px] touch-target"
      >
        {isUpdating ? (
          <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin mr-1" />
        ) : (
          <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1" />
        )}
        {isUpdating ? "Updating..." : "Update Nutrition"}
      </Button>
      
      {isUpdating && (
        <div className="absolute -bottom-1 left-0 right-0 h-1">
          <Progress value={updateProgress} className="h-1 w-full" />
        </div>
      )}
    </div>
  );
}
