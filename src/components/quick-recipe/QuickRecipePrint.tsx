
import React, { useRef } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';

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

interface QuickRecipePrintProps {
  recipe: QuickRecipe;
}

export function QuickRecipePrint({ recipe }: QuickRecipePrintProps) {
  const printDialogTriggerRef = useRef<HTMLButtonElement>(null);

  // Function to trigger the print dialog
  const handlePrint = () => {
    if (printDialogTriggerRef.current) {
      printDialogTriggerRef.current.click();
    }
  };

  // Convert ingredients to expected format for PrintRecipe
  const formattedIngredients = recipe.ingredients.map(ingredient => ({
    qty: ingredient.qty || 1,
    unit: ingredient.unit || '',
    item: typeof ingredient.item === 'string' ? ingredient.item : JSON.stringify(ingredient.item) 
  }));

  return (
    <>
      {/* Print Recipe Dialog */}
      <PrintRecipe 
        recipe={{
          id: 'quick-recipe',
          title: recipe.title,
          description: recipe.description,
          ingredients: formattedIngredients,
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
      
      {/* Return the handle print function for parent components to use */}
      {handlePrint}
    </>
  );
}
