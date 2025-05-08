
import React, { useState, useEffect } from 'react';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { RecipeHeader } from '@/components/recipe-detail/RecipeHeader';
import { RecipeImage } from '@/components/recipe-detail/RecipeImage';
import { TabsView } from '@/components/recipe-detail/navigation/TabsView';
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { ErrorDisplay } from '@/components/ui/error-display';
import type { Recipe } from '@/types/recipe';
import { isValidUUID } from '@/utils/slug-utils';

interface RecipeDetailContentProps {
  recipe: Recipe;
  id?: string;
  refetch: () => void;
}

export function RecipeDetailContent({ recipe, id, refetch }: RecipeDetailContentProps) {
  // Safety check - if recipe is invalid, show error
  if (!recipe || !recipe.id) {
    return (
      <ErrorDisplay
        error="Invalid recipe data"
        title="Could not load recipe"
        onRetry={refetch}
      />
    );
  }
  
  const [localRecipe, setLocalRecipe] = useState<Recipe>(recipe);
  const { updateRecipe } = useRecipeUpdates(id && isValidUUID(id.split('-').pop() || id) ? id : '');
  const { hasAnalysisData, scienceNotes, refetch: refetchScience } = useRecipeScience(recipe);

  // Add effect to sync recipe data
  useEffect(() => {
    setLocalRecipe(recipe);
  }, [recipe]);

  // Add effect to ensure science notes are persisted
  useEffect(() => {
    // Only update if we have analysis data and it's not already in the recipe
    const hasNewScienceNotes = hasAnalysisData && 
      scienceNotes.length > 0 && 
      (!recipe.science_notes || 
        JSON.stringify(recipe.science_notes) !== JSON.stringify(scienceNotes));
    
    if (hasNewScienceNotes) {
      console.log('Persisting science notes to recipe:', scienceNotes);
      
      // Update recipe with science notes
      updateRecipe.mutate(
        { science_notes: scienceNotes },
        {
          onSuccess: () => {
            console.log('Science notes successfully persisted');
            refetch();
          },
          onError: (error) => {
            console.error('Failed to persist science notes:', error);
          }
        }
      );
    }
  }, [hasAnalysisData, scienceNotes, recipe.science_notes, updateRecipe, refetch]);

  // Unified recipe update handler
  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setLocalRecipe({
      ...localRecipe,
      ...updatedRecipe
    });
    
    // Only update fields that have changed to avoid unnecessary updates
    const changedFields: Partial<Recipe> = {};
    
    if (updatedRecipe.nutrition !== localRecipe.nutrition) {
      changedFields.nutrition = updatedRecipe.nutrition;
    }
    
    if (updatedRecipe.science_notes !== localRecipe.science_notes) {
      changedFields.science_notes = updatedRecipe.science_notes;
    }
    
    if (updatedRecipe.chef_notes !== localRecipe.chef_notes) {
      changedFields.chef_notes = updatedRecipe.chef_notes;
    }
    
    // Only update if there are changes
    if (Object.keys(changedFields).length > 0) {
      updateRecipe.mutate(changedFields, {
        onSuccess: () => {
          refetch();
          // Also refresh science data to ensure it's up to date
          refetchScience();
        }
      });
    }
  };
  
  return (
    <ProfileProvider>
      <div className="max-w-4xl mx-auto mb-20">
        {/* Recipe Header with title */}
        <RecipeHeader recipe={localRecipe} hideReasoning={true} />
        
        {/* Recipe Image */}
        <RecipeImage recipe={localRecipe} />
        
        {/* Tabbed content area */}
        <TabsView 
          recipe={localRecipe} 
          onRecipeUpdate={handleRecipeUpdate}
          refetch={refetch}
        />
      </div>
    </ProfileProvider>
  );
}
