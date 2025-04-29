
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { RecipeHeader } from '@/components/recipe-detail/RecipeHeader';
import { RecipeIngredients } from '@/components/recipe-detail/RecipeIngredients';
import { RecipeNutrition } from '@/components/recipe-detail/RecipeNutrition';
import { RecipeInstructions } from '@/components/recipe-detail/RecipeInstructions';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';
import { CookingMode } from '@/components/recipe-detail/CookingMode';
import { RecipeActions } from '@/components/recipe-detail/RecipeActions';
import { RecipeChatDrawer } from '@/components/recipe-chat/RecipeChatDrawer';
import { Separator } from '@/components/ui/separator';
import { ScienceNotes } from "@/components/recipe-detail/notes/ScienceNotes";
import { ChefNotes } from "@/components/recipe-detail/notes/ChefNotes";
import { RecipeAnalysis } from '@/components/recipe-detail/analysis/RecipeAnalysis';
import { toast } from "@/hooks/use-toast";
import type { Recipe } from '@/types/recipe';
import { useRecipeSections } from '@/hooks/use-recipe-sections';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionControls } from '@/components/recipe-detail/controls/SectionControls';

const RecipeDetail = () => {
  const { id } = useParams();
  const { data: recipe, isLoading, error } = useRecipeDetail(id);
  const { sections, toggleSection, expandAll, collapseAll } = useRecipeSections();
  const [chatOpen, setChatOpen] = useState(false);
  const chatTriggerRef = useRef<HTMLButtonElement>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localRecipe, setLocalRecipe] = useState<Recipe | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} | Recipe`;
      setLocalRecipe(recipe);
    }
    return () => {
      document.title = 'Recipe App';
    };
  }, [recipe]);

  const handleOpenChat = () => {
    setChatOpen(true);
  };
  
  const handleNotesUpdate = (notes: string) => {
    if (localRecipe) {
      setLocalRecipe({
        ...localRecipe,
        chef_notes: notes
      });
      
      toast({
        title: "Notes saved",
        description: "Your chef notes have been updated successfully.",
      });
    }
  };

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setLocalRecipe(updatedRecipe);
    
    toast({
      title: "Recipe updated",
      description: "Recipe has been updated with analysis insights.",
    });
  };

  const handleToggleAnalysis = () => {
    if (!showAnalysis) {
      setIsAnalyzing(true);
    }
    setShowAnalysis(!showAnalysis);
  };

  useEffect(() => {
    if (showAnalysis) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showAnalysis]);

  const currentRecipe = localRecipe || recipe;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-4 sm:py-8">
          {isLoading ? (
            <div className="flex justify-center my-8 sm:my-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 my-8 sm:my-12">
              <p>Error loading recipe. Please try again later.</p>
              <p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          ) : currentRecipe ? (
            <div className="max-w-4xl mx-auto">
              <RecipeHeader recipe={currentRecipe} hideReasoning={true} />
              
              <div className="hidden">
                <PrintRecipe recipe={currentRecipe} />
                <CookingMode recipe={currentRecipe} />
              </div>
              
              <Separator className="mb-4 sm:mb-8" />
              
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

              <RecipeAnalysis 
                recipe={currentRecipe} 
                isVisible={showAnalysis} 
                onRecipeUpdated={handleRecipeUpdate}
              />

              <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
                <ScienceNotes 
                  recipe={currentRecipe}
                  isOpen={sections.science}
                  onToggle={() => toggleSection('science')}
                />
                <ChefNotes 
                  recipe={currentRecipe} 
                  onUpdate={handleNotesUpdate}
                  isOpen={sections.chef}
                  onToggle={() => toggleSection('chef')}
                />
              </div>

              {currentRecipe.nutrition && (
                <div className="mt-4 sm:mt-8 mb-40 sm:mb-28">
                  <RecipeNutrition 
                    recipe={currentRecipe}
                    isOpen={sections.nutrition}
                    onToggle={() => toggleSection('nutrition')}
                  />
                </div>
              )}

              <RecipeActions 
                recipe={currentRecipe} 
                sticky={true} 
                onOpenChat={handleOpenChat}
                onToggleAnalysis={handleToggleAnalysis}
                showingAnalysis={showAnalysis}
                isAnalyzing={isAnalyzing}
              />
              
              <RecipeChatDrawer 
                recipe={currentRecipe} 
                open={chatOpen} 
                onOpenChange={setChatOpen}
              />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default RecipeDetail;
