import React, { useState } from 'react';
import { RecipeBlock } from './blocks/RecipeBlock';
import { PersonalBlock } from './blocks/PersonalBlock';
import { EnhancedNutrition } from './useNutritionData';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NutritionBlockProps {
  recipeNutrition: EnhancedNutrition;
  recipeId?: string;
  viewMode: 'recipe' | 'personal';
  userPreferences?: {
    dailyCalories: number;
    macroSplit: {
      protein: number;
      carbs: number;
      fat: number;
    };
    unitSystem?: 'metric' | 'imperial';
  };
  onUpdate?: (nutrition: EnhancedNutrition) => void;
}

export function NutritionBlock({ 
  recipeNutrition, 
  recipeId,
  viewMode, 
  userPreferences,
  onUpdate 
}: NutritionBlockProps) {
  const unitSystem = userPreferences?.unitSystem || 'metric';
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Process nutrition data more efficiently without deep cloning
  const processedNutrition = React.useMemo(() => {
    if (!recipeNutrition) return null;
    
    // Only process fields that will be displayed
    const fieldsToProcess = [
      'calories', 'protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium',
      'vitaminA', 'vitaminC', 'vitaminD', 'calcium', 'iron', 'potassium',
      'saturated_fat', 'saturatedFat' // Make sure to include both forms of saturated fat
    ];
    
    // Create a new object with only the processed fields
    const processed: Record<string, any> = {};
    
    for (const field of fieldsToProcess) {
      const value = recipeNutrition[field as keyof EnhancedNutrition];
      
      // Only process numeric values and ensure they're rounded for display
      if (typeof value === 'number') {
        processed[field] = Math.round(value);
      } else if (value !== undefined && value !== null) {
        // Try to convert to number if possible
        const numValue = Number(value);
        processed[field] = !isNaN(numValue) ? Math.round(numValue) : 0;
      } else {
        processed[field] = 0;
      }
    }
    
    // Preserve data quality and metadata
    if (recipeNutrition.data_quality) {
      processed.data_quality = recipeNutrition.data_quality;
    }
    
    // Create a properly typed EnhancedNutrition object
    const result: EnhancedNutrition = {
      calories: processed.calories || 0,
      protein: processed.protein || 0,
      carbs: processed.carbs || 0,
      fat: processed.fat || 0,
      fiber: processed.fiber || 0,
      sugar: processed.sugar || 0,
      sodium: processed.sodium || 0,
      vitaminA: processed.vitaminA || 0,
      vitaminC: processed.vitaminC || 0,
      vitaminD: processed.vitaminD || 0,
      calcium: processed.calcium || 0,
      iron: processed.iron || 0,
      potassium: processed.potassium || 0,
      saturated_fat: processed.saturated_fat || processed.saturatedFat || 0, // Support both naming conventions
      data_quality: processed.data_quality
    };
    
    return result;
  }, [recipeNutrition]);

  // Function to refresh nutrition data
  const handleRefreshNutrition = async () => {
    if (!recipeId) {
      toast({
        title: "Cannot refresh",
        description: "Recipe ID is required to refresh nutrition data.",
        variant: "destructive"
      });
      return;
    }

    setIsRefreshing(true);
    toast({
      title: "Refreshing nutrition data",
      description: "This may take a moment...",
    });

    try {
      // Call the edge function to update nutrition data
      const { data, error } = await supabase.functions.invoke('fuse-nutrition', {
        body: { recipe_id: recipeId, force_refresh: true }
      });

      if (error) {
        throw new Error(error.message || 'Failed to refresh nutrition data');
      }

      toast({
        title: "Nutrition data updated",
        description: "Recipe nutrition information has been refreshed with improved accuracy."
      });

      if (data && onUpdate) {
        onUpdate(data);
      }
    } catch (err) {
      console.error('Error refreshing nutrition data:', err);
      toast({
        title: "Update failed",
        description: "Could not refresh nutrition data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle case when nutrition data is null or empty
  if (!recipeNutrition || !processedNutrition) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No nutrition information available</p>
        {recipeId && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleRefreshNutrition}
            disabled={isRefreshing}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Nutrition Data
          </Button>
        )}
      </div>
    );
  }

  // Check if confidence score is low and needs improvement
  const confidenceScore = processedNutrition.data_quality?.overall_confidence_score || 0;
  const needsImprovement = confidenceScore < 0.8;
  
  return (
    <div className="space-y-4 transition-all duration-200">
      {needsImprovement && recipeId && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
          <div className="flex items-center justify-between">
            <p className="text-amber-800">
              Nutrition data accuracy could be improved.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-amber-200 hover:bg-amber-300 border-amber-300 text-amber-900"
              onClick={handleRefreshNutrition}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      )}
      
      {viewMode === 'recipe' ? (
        <RecipeBlock 
          recipeNutrition={processedNutrition} 
          unitSystem={unitSystem}
        />
      ) : (
        <PersonalBlock
          recipeNutrition={processedNutrition}
          userPreferences={userPreferences!}
        />
      )}
    </div>
  );
}
