
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { RecipeDetailLoading } from '@/components/recipe-detail/loading/RecipeDetailLoading';
import { RecipeNotFound } from '@/components/recipe-detail/error/RecipeNotFound';
import { RecipeDetailContent } from '@/components/recipe-detail/RecipeDetailContent';
import { isValidUUID } from '@/utils/slug-utils';
import { ErrorDisplay } from '@/components/ui/error-display';
import { BreadcrumbNav, type BreadcrumbItem } from '@/components/ui/breadcrumb-nav';
import { PageContainer } from '@/components/ui/containers';
import { toast } from 'sonner';

const RecipeDetail = () => {
  // Use slug instead of id as parameter name to match route definition
  const { slug: recipeIdOrSlug } = useParams();
  const navigate = useNavigate();
  
  // Extract ID based on whether it's a UUID or slug
  const isUuid = recipeIdOrSlug ? isValidUUID(recipeIdOrSlug) : false;
  
  console.log('Recipe detail page loaded with parameter:', recipeIdOrSlug, 'isUUID:', isUuid);
  
  // Fetch recipe data using the ID or slug
  const { data: recipe, isLoading, error, refetch } = useRecipeDetail(recipeIdOrSlug);
  
  // Redirect to the slug URL if we have a recipe but accessed via UUID
  useEffect(() => {
    if (recipe?.slug && isUuid && recipeIdOrSlug !== recipe.slug) {
      console.log('Redirecting from UUID to slug URL:', recipe.slug);
      navigate(`/recipes/${recipe.slug}`, { replace: true });
    }
  }, [recipe, isUuid, recipeIdOrSlug, navigate]);
  
  // Set page title based on recipe
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} | Recipe`;
    }
    return () => {
      document.title = 'Recipe App';
    };
  }, [recipe]);
  
  console.log('Recipe Detail rendering state:', {
    isLoading,
    hasError: !!error,
    recipe: recipe ? recipe.id : null,
    errorMessage: error instanceof Error ? error.message : 'Unknown error'
  });
  
  // Generic error handler for unexpected errors
  const handleError = () => {
    console.log('Recipe detail page error:', error);
    
    // Show error toast
    if (error instanceof Error) {
      toast.error(`Failed to load recipe: ${error.message}`);
    } else {
      toast.error('Failed to load recipe');
    }
    
    // Handle React.Children.only errors specifically
    if (error instanceof Error && error.message.includes('React.Children.only')) {
      return (
        <PageContainer>
          <ErrorDisplay 
            error={error} 
            title="There was an issue rendering this recipe" 
            onRetry={refetch}
          />
        </PageContainer>
      );
    }
    
    // If we have a specific error or 404, show the not found component
    return <RecipeNotFound />;
  };
  
  // If there's an error, show the error handler result
  if (error) {
    return handleError();
  }

  // If we're loading, show the loading component
  if (isLoading) {
    return <RecipeDetailLoading />;
  }
  
  // Guard against null recipe after loading is complete
  if (!recipe) {
    return <RecipeNotFound />;
  }
  
  // Create breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'My Kitchen', href: '/recipes' },
    { label: recipe?.title || 'Recipe', current: true }
  ];
  
  // If we have a recipe, show the content
  return (
    <PageContainer variant="full">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav items={breadcrumbItems} />
      
      <RecipeDetailContent recipe={recipe} id={recipe.id} refetch={refetch} />
    </PageContainer>
  );
}

export default RecipeDetail;
