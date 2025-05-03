
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { RecipeDetailLoading } from '@/components/recipe-detail/loading/RecipeDetailLoading';
import { RecipeNotFound } from '@/components/recipe-detail/error/RecipeNotFound';
import { RecipeDetailContent } from '@/components/recipe-detail/RecipeDetailContent';
import { generateSlug, isValidUUID, extractIdFromSlug } from '@/utils/slug-utils';
import { ErrorDisplay } from '@/components/profile/ErrorDisplay';

const RecipeDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  
  // Extract and validate UUID from URL parameter
  const extractedId = id ? extractIdFromSlug(id) : null;
  const isValidId = extractedId !== null;
  
  // Fetch recipe data with the validated ID
  const { data: recipe, isLoading, error, refetch } = useRecipeDetail(isValidId ? extractedId : undefined);
  
  // Handle invalid ID format
  useEffect(() => {
    if (id && !isValidId) {
      console.error("Invalid recipe ID format:", id);
      // No need to navigate, we'll show the error component
    }
  }, [id, isValidId]);
  
  // Redirect to the proper URL with slug if we have a recipe but no slug in the URL
  useEffect(() => {
    if (recipe && isValidId && extractedId && !slug && !window.location.pathname.includes('-')) {
      const generatedSlug = generateSlug(recipe.title);
      navigate(`/recipes/${generatedSlug}-${extractedId}`, { replace: true });
    }
  }, [recipe, slug, id, navigate, isValidId, extractedId]);
  
  // Set page title based on recipe
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} | Recipe`;
    }
    return () => {
      document.title = 'Recipe App';
    };
  }, [recipe]);
  
  // Handle React.Children.only errors specifically
  if (error instanceof Error && error.message.includes('React.Children.only')) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <ErrorDisplay 
            error={error} 
            title="There was an issue rendering this recipe" 
            onRetry={refetch}
          />
        </main>
      </div>
    );
  }
  
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
          {recipe && <RecipeDetailContent recipe={recipe} id={extractedId || undefined} refetch={refetch} />}
        </div>
      </main>
    </div>
  );
}

export default RecipeDetail;
