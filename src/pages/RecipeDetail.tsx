
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { RecipeDetailLoading } from '@/components/recipe-detail/loading/RecipeDetailLoading';
import { RecipeNotFound } from '@/components/recipe-detail/error/RecipeNotFound';
import { RecipeDetailContent } from '@/components/recipe-detail/RecipeDetailContent';

const RecipeDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error, refetch } = useRecipeDetail(id);
  
  // Function to generate a URL-friendly slug from a recipe title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with dashes
      .replace(/-+/g, '-');     // Remove duplicate dashes
  };
  
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} | Recipe`;
      
      // If the recipe is loaded but there's no slug in the URL, or it's incorrect, update it
      const correctSlug = generateSlug(recipe.title);
      if (!slug && recipe.title) {
        // Redirect to the URL with the correct slug
        navigate(`/recipes/${id}/${correctSlug}`, { replace: true });
      } else if (slug !== correctSlug) {
        // If the slug is wrong, update it
        navigate(`/recipes/${id}/${correctSlug}`, { replace: true });
      }
    }
    
    return () => {
      document.title = 'Recipe App';
    };
  }, [recipe, id, slug, navigate]);
  
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
