
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
import { toast } from 'sonner';

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
  // Fix: Pass the complete recipe ID without splitting it
  const { updateRecipe } = useRecipeUpdates(id && isValidUUID(id) ? id : recipe.id);
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
        !Array.isArray(recipe.science_notes) ||
        recipe.science_notes.length !== scienceNotes.length ||
        JSON.stringify(recipe.science_notes) !== JSON.stringify(scienceNotes));
    
    if (hasNewScienceNotes) {
      console.log('Persisting science notes to recipe:', scienceNotes);
      
      // Update recipe with science notes
      updateRecipe.mutate(
        { science_notes: scienceNotes },
        {
          onSuccess: () => {
            console.log('Science notes successfully persisted');
            toast.success('Recipe analysis updated');
            refetch();
          },
          onError: (error) => {
            console.error('Failed to persist science notes:', error);
            toast.error('Failed to update recipe analysis');
          }
        }
      );
    }
  }, [hasAnalysisData, scienceNotes, recipe.science_notes, updateRecipe, refetch]);

  // Unified recipe update handler
  const handleRecipeUpdate = (updatedRecipe: Partial<Recipe>) => {
    // Create a new recipe object with the updates
    const newRecipe = {
      ...localRecipe,
      ...updatedRecipe,
      // Ensure science_notes is always an array
      science_notes: Array.isArray(updatedRecipe.science_notes) 
        ? updatedRecipe.science_notes 
        : localRecipe.science_notes
    };
    
    setLocalRecipe(newRecipe);
    
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
    
    // IMPORTANT: Use tagline instead of description if needed
    if (updatedRecipe.tagline !== localRecipe.tagline) {
      changedFields.tagline = updatedRecipe.tagline;
    }
    
    // Only update if there are changes
    if (Object.keys(changedFields).length > 0) {
      console.log('Updating recipe with fields:', Object.keys(changedFields));
      updateRecipe.mutate(changedFields, {
        onSuccess: () => {
          toast.success('Recipe updated successfully');
          refetch();
          // Also refresh science data to ensure it's up to date
          refetchScience();
        },
        onError: (error) => {
          toast.error('Failed to update recipe');
          console.error('Recipe update error:', error);
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
