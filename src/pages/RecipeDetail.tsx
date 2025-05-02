
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { RecipeDetailLoading } from '@/components/recipe-detail/loading/RecipeDetailLoading';
import { RecipeNotFound } from '@/components/recipe-detail/error/RecipeNotFound';
import { RecipeDetailContent } from '@/components/recipe-detail/RecipeDetailContent';

const RecipeDetail = () => {
  const { id } = useParams();
  const { data: recipe, isLoading, error, refetch } = useRecipeDetail(id);
  
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} | Recipe`;
    }
    return () => {
      document.title = 'Recipe App';
    };
  }, [recipe]);
  
  // If there's an error, show the not found component
  if (error) {
    return <RecipeNotFound />;
  }

  // If we're loading, show the loading component
  if (isLoading) {
    return <RecipeDetailLoading />;
  }
  
  // If we have a recipe, show the content
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-4 sm:py-8">
          {recipe && <RecipeDetailContent recipe={recipe} id={id} refetch={refetch} />}
        </div>
      </main>
    </div>
  );
}

export default RecipeDetail;
