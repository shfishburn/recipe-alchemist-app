import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { QuickRecipeLoading } from '@/components/quick-recipe/QuickRecipeLoading';
import { QuickRecipeCard } from '@/components/quick-recipe/QuickRecipeCard';
import { QuickCookingMode } from '@/components/quick-recipe/QuickCookingMode';
import { QuickShoppingList } from '@/components/quick-recipe/QuickShoppingList';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { supabase } from '@/integrations/supabase/client';
import { useRef, useState } from 'react';

// Helper function to format ingredient for database storage
const formatIngredientForDB = (ingredient: any) => {
  if (typeof ingredient === 'string') {
    return {
      qty: 1,
      unit: '',
      item: ingredient
    };
  }
  
  // If it's already in the right format, return it
  if (ingredient.item && typeof ingredient.item === 'string') {
    return {
      qty: ingredient.qty || 1,
      unit: ingredient.unit || '',
      item: ingredient.item
    };
  }
  
  // Otherwise, extract what we can
  return {
    qty: ingredient.qty || 1,
    unit: ingredient.unit || '',
    item: typeof ingredient === 'object' ? JSON.stringify(ingredient) : String(ingredient)
  };
};

const QuickRecipePage = () => {
  const navigate = useNavigate();
  const { recipe, isLoading, formData } = useQuickRecipeStore();
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const authDrawer = useAuthDrawer();
  
  // Reference to trigger the print dialog
  const printDialogTriggerRef = useRef<HTMLButtonElement>(null);

  // Redirect to home if no recipe is loading and no recipe data
  useEffect(() => {
    if (!isLoading && !recipe) {
      navigate('/');
    }
  }, [isLoading, recipe, navigate]);

  // Function to open print dialog
  const handlePrint = () => {
    if (printDialogTriggerRef.current) {
      printDialogTriggerRef.current.click();
    }
  };

  const handleSaveRecipe = async () => {
    if (!user) {
      authDrawer.open();
      return;
    }
    
    if (!recipe) return;
    
    // Show saving state
    setIsSaving(true);
    
    try {
      // Format ingredients for database storage
      const formattedIngredients = recipe.ingredients.map(formatIngredientForDB);
      
      // Save the recipe to the database
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: recipe.title,
          tagline: recipe.description,
          ingredients: formattedIngredients,
          instructions: recipe.steps,
          prep_time_min: recipe.prepTime,
          cook_time_min: recipe.cookTime,
          servings: 4, // Default value
          cuisine: recipe.cuisineType || 'general',
          cooking_tip: recipe.cookingTip || null, // Save the cooking tip
        })
        .select('id')
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Recipe saved",
        description: "Your recipe has been saved to My Kitchen",
      });
      
      // Navigate to the recipes page
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    if (formData) {
      // Go back to the home page with state to trigger regeneration
      navigate('/', { state: { regenerate: true, formData } });
    }
  };
  
  const handleTryDifferent = () => {
    // Go back to the home page to start fresh
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 md:py-10 animate-fadeIn">
        <div className="container-page max-w-full px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center">
              <QuickRecipeLoading />
            </div>
          ) : recipe ? (
            <div className="w-full max-w-xl mx-auto">
              <QuickRecipeCard 
                recipe={recipe} 
                onCook={() => setCookModeOpen(true)}
                onShop={() => setShoppingListOpen(true)}
                onSave={handleSaveRecipe}
                onPrint={handlePrint}
                isSaving={isSaving}
              />
              
              <div className="mt-6 flex justify-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleTryDifferent}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Try a different recipe
                </Button>
                
                {formData && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    className="text-muted-foreground hover:text-foreground flex items-center"
                  >
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Regenerate recipe
                  </Button>
                )}
              </div>
              
              {/* Dialogs for cooking mode and shopping list */}
              <QuickCookingMode 
                recipe={recipe}
                open={cookModeOpen}
                onOpenChange={setCookModeOpen}
              />
              <QuickShoppingList 
                recipe={recipe}
                open={shoppingListOpen}
                onOpenChange={setShoppingListOpen}
              />
              
              {/* Print Recipe Dialog */}
              <PrintRecipe 
                recipe={{
                  id: 'quick-recipe',
                  title: recipe.title,
                  description: recipe.description,
                  ingredients: recipe.ingredients.map(formatIngredientForDB),
                  instructions: recipe.steps,
                  prep_time_min: recipe.prepTime,
                  cook_time_min: recipe.cookTime,
                  nutrition: recipe.nutritionHighlight ? {
                    // Basic placeholder for nutrition data
                    kcal: 0
                  } : undefined,
                  science_notes: [],
                  tagline: recipe.description,
                  cooking_tip: recipe.cookingTip
                }} 
                ref={printDialogTriggerRef}
              />
            </div>
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
