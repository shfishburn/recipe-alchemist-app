
import React, { useRef } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';
import { Ingredient } from '@/types/recipe';

// Helper function to format ingredient for database storage
const formatIngredientForDB = (ingredient: any): Ingredient => {
  if (typeof ingredient === 'string') {
    return {
      qty: 1,
      unit: '',
      item: ingredient,
      // Add required metric/imperial units
      qty_metric: 1,
      unit_metric: '',
      qty_imperial: 1,
      unit_imperial: ''
    };
  }
  
  // If it's already in the right format, return it
  if (ingredient.item && typeof ingredient.item === 'string') {
    return {
      qty: ingredient.qty || 1,
      unit: ingredient.unit || '',
      item: ingredient.item,
      // Add required metric/imperial units
      qty_metric: ingredient.qty_metric || ingredient.qty || 1,
      unit_metric: ingredient.unit_metric || ingredient.unit || '',
      qty_imperial: ingredient.qty_imperial || ingredient.qty || 1,
      unit_imperial: ingredient.unit_imperial || ingredient.unit || ''
    };
  }
  
  // Otherwise, extract what we can
  return {
    qty: ingredient.qty || 1,
    unit: ingredient.unit || '',
    item: typeof ingredient === 'object' ? JSON.stringify(ingredient) : String(ingredient),
    // Add required metric/imperial units
    qty_metric: ingredient.qty_metric || ingredient.qty || 1,
    unit_metric: ingredient.unit_metric || ingredient.unit || '',
    qty_imperial: ingredient.qty_imperial || ingredient.qty || 1,
    unit_imperial: ingredient.unit_imperial || ingredient.unit || ''
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
  const formattedIngredients = recipe.ingredients.map(formatIngredientForDB);
  
  // Convert steps to the format expected by PrintRecipe
  const formattedInstructions = (recipe.steps || recipe.instructions || []).map(step => ({
    step: typeof step === 'string' ? step : JSON.stringify(step),
    group: undefined
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
          instructions: formattedInstructions,
          prep_time: recipe.prepTime || recipe.prep_time_min,
          cook_time: recipe.cookTime || recipe.cook_time_min,
          nutrition: recipe.nutrition ? {
            calories: recipe.nutrition.calories || 0,
            protein: recipe.nutrition.protein || 0,
            fat: recipe.nutrition.fat || 0,
            carbs: recipe.nutrition.carbs || 0,
            fiber: recipe.nutrition.fiber || 0,
            sugar: recipe.nutrition.sugar || 0,
            sodium: recipe.nutrition.sodium || 0
          } : {
            calories: 0,
            protein: 0,
            fat: 0, 
            carbs: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0
          },
          science_notes: recipe.science_notes || [],
          tagline: recipe.description,
          chef_notes: recipe.cookingTip || ''
        }} 
        ref={printDialogTriggerRef}
      />
      
      {/* Return the handle print function for parent components to use */}
      {handlePrint}
    </>
  );
}
