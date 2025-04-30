import React, { useState, useRef } from 'react';
import { QuickRecipeTagForm } from './QuickRecipeTagForm';
import { QuickRecipeCard } from './QuickRecipeCard';
import { QuickCookingMode } from './QuickCookingMode';
import { QuickShoppingList } from './QuickShoppingList';
import { QuickRecipeLoading } from './QuickRecipeLoading';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';
import { supabase } from '@/integrations/supabase/client';

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

export function QuickRecipeGenerator() {
  const { generateQuickRecipe, isLoading, recipe, setRecipe } = useQuickRecipe();
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const authDrawer = useAuthDrawer();
  const [isSaving, setIsSaving] = useState(false);
  
  // Reference to trigger the print dialog
  const printDialogTriggerRef = useRef<HTMLButtonElement>(null);

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
    
    // Show saving state
    setIsSaving(true);
    
    try {
      // Format ingredients for database storage
      const formattedIngredients = recipe.ingredients.map(formatIngredientForDB);
      
      // In a real implementation, save the recipe to the database
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
  
  return (
    <div className="w-full">
      {isLoading ? (
        <QuickRecipeLoading />
      ) : !recipe ? (
        <QuickRecipeTagForm 
          onSubmit={generateQuickRecipe} 
          isLoading={isLoading} 
        />
      ) : (
        <div className="animate-fadeIn w-full">
          <QuickRecipeCard 
            recipe={recipe} 
            onCook={() => setCookModeOpen(true)}
            onShop={() => setShoppingListOpen(true)}
            onSave={handleSaveRecipe}
            onPrint={handlePrint}
            isSaving={isSaving}
          />
          <button 
            className="mt-6 text-sm text-center w-full text-muted-foreground hover:text-foreground"
            onClick={() => setRecipe(null)}
          >
            Try a different recipe
          </button>
        </div>
      )}
      
      {recipe && (
        <>
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
        </>
      )}
      
      {/* Print Recipe Dialog */}
      {recipe && (
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
            cooking_tip: recipe.cookingTip // Add cooking tip to print view
          }} 
          ref={printDialogTriggerRef}
        />
      )}
    </div>
  );
}
