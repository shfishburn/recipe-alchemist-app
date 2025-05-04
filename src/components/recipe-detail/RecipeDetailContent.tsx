
import React, { useState } from 'react';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { RecipeHeader } from '@/components/recipe-detail/RecipeHeader';
import { RecipeImage } from '@/components/recipe-detail/RecipeImage';
import { RecipeActions } from '@/components/recipe-detail/RecipeActions';
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
  const [currentTab, setCurrentTab] = useState<string>('recipe');
  const { updateRecipe } = useRecipeUpdates(id && isValidUUID(id.split('-').pop() || id) ? id : '');
  const { hasAnalysisData } = useRecipeScience(recipe);

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
        onSuccess: () => refetch()
      });
    }
  };

  // Handle opening the chat in modify tab
  const handleOpenChat = () => {
    window.location.hash = 'modify';
  };

  // Handle tab change from TabsView
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };
  
  return (
    <ProfileProvider>
      <div className="max-w-4xl mx-auto mb-20">
        {/* Recipe Header with title */}
        <RecipeHeader recipe={localRecipe} currentTab={currentTab} onOpenChat={handleOpenChat} />
        
        {/* Recipe Image */}
        <RecipeImage recipe={localRecipe} />
        
        {/* Tabbed content area */}
        <TabsView 
          recipe={localRecipe} 
          onRecipeUpdate={handleRecipeUpdate}
          refetch={refetch}
          onTabChange={handleTabChange}
        />
        
        {/* Floating action buttons */}
        <RecipeActions 
          recipe={localRecipe} 
          sticky={true} 
          onOpenChat={handleOpenChat}
          currentTab={currentTab}
        />
      </div>
    </ProfileProvider>
  );
}
