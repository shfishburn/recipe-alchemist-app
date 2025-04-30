
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { QuickRecipeLoading } from '@/components/quick-recipe/QuickRecipeLoading';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';

const QuickRecipePage = () => {
  const navigate = useNavigate();
  const { recipe, isLoading, formData, error } = useQuickRecipeStore();
  const { generateQuickRecipe } = useQuickRecipe();

  // Only redirect if not loading AND no recipe data AND no error AND no formData
  useEffect(() => {
    if (!isLoading && !recipe && !error && !formData) {
      navigate('/');
    }
  }, [isLoading, recipe, error, formData, navigate]);

  const handleRetry = async () => {
    if (formData) {
      await generateQuickRecipe(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-4 md:py-8 animate-fadeIn">
        <div className="container-page max-w-full px-3 md:px-6">
          {isLoading ? (
            <div className="flex justify-center">
              <QuickRecipeLoading />
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
              <div className="mt-6 mb-8">
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
};

export default QuickRecipePage;
