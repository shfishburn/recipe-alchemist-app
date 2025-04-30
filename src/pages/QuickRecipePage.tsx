
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { QuickRecipeLoading } from '@/components/quick-recipe/QuickRecipeLoading';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { Button } from '@/components/ui/button';

const QuickRecipePage = () => {
  const navigate = useNavigate();
  const { recipe, isLoading, formData } = useQuickRecipeStore();

  // Only redirect if not loading AND no recipe data
  useEffect(() => {
    if (!isLoading && !recipe) {
      navigate('/');
    }
  }, [isLoading, recipe, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-4 md:py-8 animate-fadeIn">
        <div className="container-page max-w-full px-3 md:px-6">
          {isLoading ? (
            <div className="flex justify-center">
              <QuickRecipeLoading />
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
