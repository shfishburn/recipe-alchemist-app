import React, { useRef } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { PrintRecipe } from '@/components/recipe-detail/PrintRecipe';
import { Ingredient } from '@/types/recipe';

// Helper function to format ingredient for database storage
const formatIngredientForDB = (ingredient: unknown): Ingredient => {
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
  
  // Cast to record type for safer property access
  const ingObj = ingredient as Record<string, unknown>;
  
  // If it's already in the right format, return it
  if (ingObj.item && typeof ingObj.item === 'string') {
    return {
      qty: typeof ingObj.qty === 'number' ? ingObj.qty : 1,
      unit: typeof ingObj.unit === 'string' ? ingObj.unit : '',
      item: ingObj.item,
      // Add required metric/imperial units
      qty_metric: typeof ingObj.qty_metric === 'number' ? ingObj.qty_metric : 
                 (typeof ingObj.qty === 'number' ? ingObj.qty : 1),
      unit_metric: typeof ingObj.unit_metric === 'string' ? ingObj.unit_metric : 
                  (typeof ingObj.unit === 'string' ? ingObj.unit : ''),
      qty_imperial: typeof ingObj.qty_imperial === 'number' ? ingObj.qty_imperial : 
                   (typeof ingObj.qty === 'number' ? ingObj.qty : 1),
      unit_imperial: typeof ingObj.unit_imperial === 'string' ? ingObj.unit_imperial : 
                    (typeof ingObj.unit === 'string' ? ingObj.unit : '')
    };
  }
  
  // Otherwise, extract what we can
  return {
    qty: typeof ingObj.qty === 'number' ? ingObj.qty : 1,
    unit: typeof ingObj.unit === 'string' ? ingObj.unit : '',
    item: typeof ingredient === 'object' ? JSON.stringify(ingredient) : String(ingredient),
    // Add required metric/imperial units
    qty_metric: typeof ingObj.qty_metric === 'number' ? ingObj.qty_metric : 
               (typeof ingObj.qty === 'number' ? ingObj.qty : 1),
    unit_metric: typeof ingObj.unit_metric === 'string' ? ingObj.unit_metric : 
                (typeof ingObj.unit === 'string' ? ingObj.unit : ''),
    qty_imperial: typeof ingObj.qty_imperial === 'number' ? ingObj.qty_imperial : 
                 (typeof ingObj.qty === 'number' ? ingObj.qty : 1),
    unit_imperial: typeof ingObj.unit_imperial === 'string' ? ingObj.unit_imperial : 
                  (typeof ingObj.unit === 'string' ? ingObj.unit : '')
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

  return (
    <>
      {/* Print Recipe Dialog */}
      <PrintRecipe 
        recipe={{
          id: 'quick-recipe',
          title: recipe.title,
          // Support both fields for backwards compatibility during transition
          description: recipe.description,
          tagline: recipe.description,
          ingredients: formattedIngredients,
          instructions: recipe.steps,
          prep_time_min: recipe.prepTime,
          cook_time_min: recipe.cookTime,
          nutrition: recipe.nutritionHighlight ? {
            // Basic minimum valid nutrition object
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0,
            kcal: 0
          } : undefined,
          science_notes: [],
          cooking_tip: recipe.cookingTip
        }} 
        ref={printDialogTriggerRef}
      />
      
      {/* Return the handle print function for parent components to use */}
      {handlePrint}
    </>
  );
}
