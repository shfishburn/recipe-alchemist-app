
import React, { useState, useRef } from 'react';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { RecipeHeader } from '@/components/recipe-detail/RecipeHeader';
import { RecipeOverview } from '@/components/recipe-detail/RecipeOverview'; 
import { RecipeIngredients } from '@/components/recipe-detail/RecipeIngredients';
import { RecipeNutrition } from '@/components/recipe-detail/RecipeNutrition';
import { RecipeInstructions } from '@/components/recipe-detail/RecipeInstructions';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';
import { CookingMode } from '@/components/recipe-detail/CookingMode';
import { RecipeActions } from '@/components/recipe-detail/RecipeActions';
import { RecipeChatDrawer } from '@/components/recipe-chat/RecipeChatDrawer';
import { Separator } from '@/components/ui/separator';
import { RecipeAnalysis } from '@/components/recipe-detail/analysis/RecipeAnalysis';
import { ChefNotes } from "@/components/recipe-detail/notes/ChefNotes";
import { RecipeImage } from '@/components/recipe-detail/RecipeImage';
import { SectionControls } from '@/components/recipe-detail/controls/SectionControls';
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import { useRecipeSections } from '@/hooks/use-recipe-sections';
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
  
  const { sections, toggleSection, expandAll, collapseAll } = useRecipeSections();
  const [chatOpen, setChatOpen] = useState(false);
  const chatTriggerRef = useRef<HTMLButtonElement>(null);
  const [localRecipe, setLocalRecipe] = useState<Recipe | null>(recipe);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { updateRecipe } = useRecipeUpdates(validId || '');
  
  const handleOpenChat = () => {
    setChatOpen(true);
  };
  
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

  const handleToggleAnalysis = () => {
    // If we're opening the analysis section and it's not already open, show loading state
    if (!sections.analysis) {
      setIsAnalyzing(true);
      // Set a timeout to hide the loading state after a reasonable delay
      setTimeout(() => setIsAnalyzing(false), 3000); // Increased from 500ms to 3000ms
    }
    toggleSection('analysis');
  };

  const currentRecipe = localRecipe || recipe;
  
  // Check if the recipe has analysis data (any science_notes)
  const hasAnalysisData = currentRecipe?.science_notes && 
                          Array.isArray(currentRecipe.science_notes) && 
                          currentRecipe.science_notes.length > 0;

  // If we have no valid recipe data, return null
  if (!currentRecipe || !currentRecipe.title) {
    return null;
  }

  return (
    <ProfileProvider>
      <div className="max-w-4xl mx-auto">
        {/* Recipe Header with title */}
        <RecipeHeader recipe={currentRecipe} hideReasoning={true} />
        
        {/* Recipe Image - Positioned between title and overview */}
        <RecipeImage recipe={currentRecipe} />
        
        {/* Recipe Overview - Now separate from header */}
        <RecipeOverview recipe={currentRecipe} />
        
        <div className="hidden">
          <PrintRecipe recipe={currentRecipe} />
          <CookingMode recipe={currentRecipe} />
        </div>
        
        <Separator className="mb-4 sm:mb-8 mt-4" />
        
        <SectionControls onExpandAll={expandAll} onCollapseAll={collapseAll} />
        
        <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <RecipeIngredients 
              recipe={currentRecipe}
              isOpen={sections.ingredients}
              onToggle={() => toggleSection('ingredients')}
            />
          </div>
          <div className="md:col-span-2">
            <RecipeInstructions 
              recipe={currentRecipe}
              isOpen={sections.instructions}
              onToggle={() => toggleSection('instructions')}
            />
          </div>
        </div>

        {/* Scientific Analysis Section - Always include it but let it handle visibility */}
        <RecipeAnalysis 
          recipe={currentRecipe}
          isOpen={sections.analysis}
          onToggle={handleToggleAnalysis}
          onRecipeUpdated={handleRecipeUpdate}
        />

        <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
          <ChefNotes 
            recipe={currentRecipe} 
            onUpdate={handleNotesUpdate}
            isOpen={sections.chef}
            onToggle={() => toggleSection('chef')}
          />
        </div>

        {currentRecipe.nutrition && Object.keys(currentRecipe.nutrition).length > 0 && (
          <div className="mt-4 sm:mt-8 mb-40 sm:mb-28">
            <RecipeNutrition 
              recipe={currentRecipe}
              isOpen={sections.nutrition}
              onToggle={() => toggleSection('nutrition')}
              onRecipeUpdate={handleRecipeUpdate}
            />
          </div>
        )}

        <RecipeActions 
          recipe={currentRecipe} 
          sticky={true} 
          onOpenChat={handleOpenChat}
          onToggleAnalysis={handleToggleAnalysis}
          isAnalysisOpen={sections.analysis}
          isAnalyzing={isAnalyzing}
          hasAnalysisData={hasAnalysisData}
        />
        
        <RecipeChatDrawer 
          recipe={currentRecipe} 
          open={chatOpen} 
          onOpenChange={setChatOpen}
        />
      </div>
    </ProfileProvider>
  );
}
