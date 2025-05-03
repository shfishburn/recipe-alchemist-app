
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { RecipeDetailLoading } from '@/components/recipe-detail/loading/RecipeDetailLoading';
import { RecipeNotFound } from '@/components/recipe-detail/error/RecipeNotFound';
import { RecipeDetailContent } from '@/components/recipe-detail/RecipeDetailContent';
import { generateSlug, isValidUUID } from '@/utils/slug-utils';

const RecipeDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  
  // Validate the ID before fetching
  const isValidId = id && isValidUUID(id.split('-').pop() || id);
  
  const { data: recipe, isLoading, error, refetch } = useRecipeDetail(isValidId ? id : undefined);
  
  // Handle invalid ID format
  useEffect(() => {
    if (id && !isValidId) {
      console.error("Invalid recipe ID format:", id);
      // No need to navigate, we'll show the error component
    }
  }, [id, isValidId]);
  
  // Redirect to the proper URL with slug if we have a recipe but no slug in the URL
  useEffect(() => {
    if (recipe && isValidId && !slug && !window.location.pathname.includes('-')) {
      const generatedSlug = generateSlug(recipe.title);
      navigate(`/recipes/${generatedSlug}-${id}`, { replace: true });
    }
  }, [recipe, slug, id, navigate, isValidId]);
  
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} | Recipe`;
    }
    return () => {
      document.title = 'Recipe App';
    };
  }, [recipe]);
  
  // If the ID is invalid or there's an error, show the not found component
  if (!isValidId || error) {
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
