import React, { useState, useRef } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from '@/components/quick-recipe/QuickRecipeCard';
import { QuickCookingMode } from '@/components/quick-recipe/QuickCookingMode';
import { QuickShoppingList } from '@/components/quick-recipe/QuickShoppingList';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { useNavigate } from 'react-router-dom';

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

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
}

export function QuickRecipeDisplay({ recipe }: QuickRecipeDisplayProps) {
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const { saveRecipe, isSaving, navigate } = useQuickRecipeSave();
  const printDialogTriggerRef = useRef<HTMLButtonElement>(null);

  // Function to open print dialog
  const handlePrint = () => {
    if (printDialogTriggerRef.current) {
      printDialogTriggerRef.current.click();
    }
  };

  const handleSave = async () => {
    const success = await saveRecipe(recipe);
    if (success) {
      navigate('/recipes');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <QuickRecipeCard 
        recipe={recipe} 
        onCook={() => setCookModeOpen(true)}
        onShop={() => setShoppingListOpen(true)}
        onSave={handleSave}
        onPrint={handlePrint}
        isSaving={isSaving}
      />
      
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
  );
}
