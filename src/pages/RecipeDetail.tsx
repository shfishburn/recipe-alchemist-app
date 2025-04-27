import React, { useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';

const RecipeDetail = () => {
  const { id } = useParams();
  const { data: recipe, isLoading, error } = useRecipeDetail(id);
  
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} | Recipe`;
    }
    return () => {
      document.title = 'Recipe App';
    };
  }, [recipe]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          {isLoading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 my-12">
              <p>Error loading recipe. Please try again later.</p>
              <p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          ) : recipe ? (
            <div className="max-w-4xl mx-auto">
              <RecipeHeader recipe={recipe} />
              
              {/* Hidden components for triggers */}
              <div className="hidden">
                <PrintRecipe recipe={recipe} />
                <CookingMode recipe={recipe} />
              </div>
              
              {/* Visible recipe actions */}
              <RecipeActions recipe={recipe} sticky={true} />
              <Separator className="mb-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                  <RecipeIngredients recipe={recipe} />
                  {recipe.nutrition && <RecipeNutrition recipe={recipe} />}
                </div>
                <div className="md:col-span-2">
                  <RecipeInstructions recipe={recipe} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default RecipeDetail;
