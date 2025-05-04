
import React, { useState } from 'react';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { RecipeHeader } from '@/components/recipe-detail/RecipeHeader';
import { RecipeImage } from '@/components/recipe-detail/RecipeImage';
import { RecipeActions } from '@/components/recipe-detail/RecipeActions';
import { TabsView } from '@/components/recipe-detail/navigation/TabsView';
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Recipe } from '@/types/recipe';
import { isValidUUID } from '@/utils/slug-utils';

interface RecipeDetailContentProps {
  recipe: Recipe;
  id?: string;
  refetch: () => void;
}

export function RecipeDetailContent({ recipe, id, refetch }: RecipeDetailContentProps) {
  // Safety check - if recipe is invalid, don't render
  if (!recipe || !recipe.id) {
    console.error("Invalid recipe data:", recipe);
    return null;
  }
  
  // Ensure ID is valid
  const validId = id && isValidUUID(id.split('-').pop() || id) ? id : null;
  
  const [localRecipe, setLocalRecipe] = useState<Recipe | null>(recipe);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMobile = useIsMobile();
  const { updateRecipe } = useRecipeUpdates(validId || '');
  
  // Use the unified science hook to check for analysis data
  const { hasAnalysisData } = useRecipeScience(recipe);
  
  const handleNotesUpdate = (notes: string) => {
    if (localRecipe) {
      setLocalRecipe({
        ...localRecipe,
        chef_notes: notes
      });
    }
  };

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    if (localRecipe) {
      // Update local state
      setLocalRecipe({
        ...localRecipe,
        ...updatedRecipe
      });
      
      // If the recipe has a valid ID, update it in the database
      if (validId) {
        const fieldsToUpdate = {};
        
        // Only include fields that have changed to avoid unnecessary updates
        if (updatedRecipe.nutrition !== localRecipe.nutrition) {
          Object.assign(fieldsToUpdate, { nutrition: updatedRecipe.nutrition });
        }
        
        if (updatedRecipe.science_notes !== localRecipe.science_notes) {
          Object.assign(fieldsToUpdate, { science_notes: updatedRecipe.science_notes });
        }
        
        // Only update if there are changes
        if (Object.keys(fieldsToUpdate).length > 0) {
          updateRecipe.mutate(fieldsToUpdate, {
            onSuccess: () => {
              refetch();
            }
          });
        }
      }
    }
  };

  const handleOpenChat = () => {
    // Navigate to modify tab and open chat
    window.location.hash = 'modify';
  };
  
  const handleToggleAnalysis = () => {
    // Navigate to science tab
    window.location.hash = 'science';
  };

  const currentRecipe = localRecipe || recipe;
  
  // If we have no valid recipe data, return null
  if (!currentRecipe || !currentRecipe.title) {
    return null;
  }

  return (
    <ProfileProvider>
      <div className="max-w-4xl mx-auto mb-20">
        {/* Recipe Header with title */}
        <RecipeHeader recipe={currentRecipe} hideReasoning={true} />
        
        {/* Recipe Image - Positioned between title and tabs */}
        <RecipeImage recipe={currentRecipe} />
        
        {/* Tabbed Navigation - Main content area */}
        <TabsView 
          recipe={currentRecipe} 
          onRecipeUpdate={handleRecipeUpdate}
          refetch={refetch}
        />
        
        {/* Floating action buttons at bottom */}
        <RecipeActions 
          recipe={currentRecipe} 
          sticky={true} 
          onOpenChat={handleOpenChat}
          onToggleAnalysis={handleToggleAnalysis}
          isAnalysisOpen={window.location.hash === '#science'}
          isAnalyzing={isAnalyzing}
          hasAnalysisData={hasAnalysisData}
        />
      </div>
    </ProfileProvider>
  );
}
