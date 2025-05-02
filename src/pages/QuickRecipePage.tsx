import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ChefHat } from 'lucide-react';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeFormContainer } from '@/components/quick-recipe/QuickRecipeFormContainer';
import { FullScreenLoading } from '@/components/quick-recipe/FullScreenLoading';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const QuickRecipePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recipe, isLoading, formData, error, reset, setFormData, setLoading } = useQuickRecipeStore();
  const { generateQuickRecipe } = useQuickRecipe();
  const { session } = useAuth();
  
  // Check if we're navigating from navbar (no state)
  const isDirectNavigation = !location.state;
  
  console.log("QuickRecipePage - Current state:", { 
    isLoading, 
    recipe: !!recipe, 
    error, 
    formData: !!formData, 
    isDirectNavigation,
    locationState: location.state
  });

  // Check if we need to resume recipe generation after login
  useEffect(() => {
    if (session) {
      const storedGenerationData = sessionStorage.getItem('recipeGenerationSource');
      if (storedGenerationData && !isLoading && !recipe) {
        try {
          const parsedData = JSON.parse(storedGenerationData);
          if (parsedData.formData) {
            console.log("Resuming recipe generation after login:", parsedData);
            // Clear the stored data
            sessionStorage.removeItem('recipeGenerationSource');
            
            // Start the generation process
            setLoading(true);
            setFormData(parsedData.formData);
            
            // Start an async generation
            generateQuickRecipe(parsedData.formData).catch(err => {
              console.error("Error resuming recipe generation:", err);
              toast({
                title: "Recipe generation failed",
                description: err.message || "Please try again later.",
                variant: "destructive",
              });
            });
          }
        } catch (err) {
          console.error("Error parsing stored recipe data:", err);
        }
      }
    }
  }, [session, isLoading, recipe, generateQuickRecipe, setLoading, setFormData]);

  // Reset loading state if navigating directly from navbar
  useEffect(() => {
    if (isDirectNavigation && isLoading) {
      console.log("Direct navigation detected while loading, resetting state");
      reset();
    }
  }, [isDirectNavigation, isLoading, reset]);

  // Only redirect if not loading AND no recipe data AND no error AND no formData
  useEffect(() => {
    if (!isLoading && !recipe && !error && !formData && !isDirectNavigation) {
      console.log("No recipe data available, redirecting to home");
      navigate('/');
    }
  }, [isLoading, recipe, error, formData, navigate, isDirectNavigation]);

  const handleRetry = async () => {
    if (formData) {
      try {
        console.log("Retrying recipe generation with formData:", formData);
        
        // Reset first to clear any existing errors
        reset();
        
        // Start the recipe generation with proper loading state
        setLoading(true);
        
        // Start the recipe generation immediately
        await generateQuickRecipe(formData);
      } catch (err: any) {
        console.error("Error retrying recipe generation:", err);
        toast({
          title: "Recipe generation failed",
          description: err.message || "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  // Show full-screen loading when generating a recipe, without the layout
  if (isLoading) {
    console.log("Showing loading screen for recipe generation");
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 md:py-10 animate-fadeIn">
        <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Title Section - Always show this */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl flex items-center justify-center gap-2">
              <ChefHat className="h-8 w-8 md:h-10 md:w-10 text-recipe-green" />
              {recipe ? "Your Custom Recipe" : "What's in your kitchen tonight?"}
            </h1>
            
            {!recipe && (
              <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto mt-3 md:mt-4">
                Share what you've got and what you're craving. Pick your flavor inspiration. 
                I'll instantly transform your ingredients into delicious, foolproof recipes.
              </p>
            )}
          </div>

          {isDirectNavigation ? (
            // Show form directly when navigating from navbar
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md max-w-lg mx-auto mb-10">
              <QuickRecipeFormContainer />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6 border rounded-xl bg-red-50 dark:bg-red-900/10">
              <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Recipe Generation Failed</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  Start Over
                </Button>
                {formData && (
                  <Button 
                    onClick={handleRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          ) : recipe ? (
            <>
              <QuickRecipeDisplay recipe={recipe} />
              <div className="mt-6 mb-10">
                <QuickRecipeRegeneration formData={formData} isLoading={isLoading} />
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">No recipe found. 
                <Button 
                  variant="link" 
                  onClick={() => navigate('/')}
                  className="p-0 h-auto text-primary underline"
                >
                  &nbsp;Return to home
                </Button>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default QuickRecipePage;
