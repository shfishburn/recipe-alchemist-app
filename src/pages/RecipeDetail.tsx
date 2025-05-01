
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { RecipeAnalysis } from '@/components/recipe-detail/analysis/RecipeAnalysis';
import { ChefNotes } from "@/components/recipe-detail/notes/ChefNotes";
import { RecipeImage } from '@/components/recipe-detail/RecipeImage';
import { toast } from "@/hooks/use-toast";
import { useRecipeUpdates } from '@/hooks/use-recipe-updates';
import type { Recipe } from '@/types/recipe';
import { useRecipeSections } from '@/hooks/use-recipe-sections';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionControls } from '@/components/recipe-detail/controls/SectionControls';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProfileProvider } from '@/contexts/ProfileContext';

const RecipeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: recipe, isLoading, error, refetch } = useRecipeDetail(id);
  const { sections, toggleSection, expandAll, collapseAll } = useRecipeSections();
  const [chatOpen, setChatOpen] = useState(false);
  const chatTriggerRef = useRef<HTMLButtonElement>(null);
  const [localRecipe, setLocalRecipe] = useState<Recipe | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMobile = useIsMobile();
  const { updateRecipe } = useRecipeUpdates(id || '');
  
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} | Recipe`;
      setLocalRecipe(recipe);
    }
    return () => {
      document.title = 'Recipe App';
    };
  }, [recipe]);

  useEffect(() => {
    // If there's an error, handle it with an appropriate timeout
    if (error) {
      console.error("Recipe detail error:", error);
      
      // Show error toast after a short delay
      const timer = setTimeout(() => {
        toast({
          title: "Error loading recipe",
          description: "We couldn't load this recipe. Please try again later.",
          variant: "destructive",
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    if (localRecipe) {
      // Update local state
      setLocalRecipe({
        ...localRecipe,
        ...updatedRecipe
      });
      
      // If the recipe has an ID, update it in the database
      if (id) {
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
              toast({
                title: "Recipe updated",
                description: "Recipe has been updated successfully.",
              });
              refetch();
            },
            onError: (error) => {
              console.error("Failed to update recipe:", error);
              toast({
                title: "Update failed",
                description: "Could not update the recipe. Please try again.",
                variant: "destructive",
              });
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
      setTimeout(() => setIsAnalyzing(false), 500);
    }
    toggleSection('analysis');
  };

  const currentRecipe = localRecipe || recipe;
  
  // Check if the recipe has analysis data (any science_notes)
  const hasAnalysisData = currentRecipe?.science_notes && 
                          Array.isArray(currentRecipe.science_notes) && 
                          currentRecipe.science_notes.length > 0;

  // Handle the case where recipe is not found
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-semibold mb-4">Recipe Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the recipe you're looking for. It may have been deleted or moved.
            </p>
            <Button asChild>
              <Link to="/recipes"><Home className="mr-2 h-4 w-4" /> Back to Recipes</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-4 sm:py-8">
          {isLoading ? (
            <div className="flex justify-center my-8 sm:my-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : currentRecipe ? (
            <ProfileProvider>
              <div className="max-w-4xl mx-auto">
                <RecipeHeader recipe={currentRecipe} hideReasoning={true} />
                
                {/* Recipe Image - Moved above recipe overview */}
                <RecipeImage recipe={currentRecipe} />
                
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

                {currentRecipe.nutrition && (
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
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default RecipeDetail;
