
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
  triggerPrint?: boolean;
}

export function QuickRecipePrint({ recipe, triggerPrint = false }: QuickRecipePrintProps) {
  const printDialogTriggerRef = useRef<HTMLButtonElement>(null);

  // Function to trigger the print dialog
  const handlePrint = () => {
    if (printDialogTriggerRef.current) {
      printDialogTriggerRef.current.click();
    }
  };

  // Automatically trigger print if requested
  React.useEffect(() => {
    if (triggerPrint) {
      handlePrint();
    }
  }, [triggerPrint]);

  // Convert ingredients to expected format for PrintRecipe
  const formattedIngredients = recipe.ingredients.map(formatIngredientForDB);

  // Determine which instructions/steps to display
  const instructionsToDisplay = 
    (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) ? recipe.instructions :
    (Array.isArray(recipe.steps) && recipe.steps.length > 0) ? recipe.steps :
    [];

  return (
    <>
      {/* Print Recipe Dialog */}
      <PrintRecipe 
        recipe={{
          id: 'quick-recipe',
          title: recipe.title,
          description: recipe.description,
          ingredients: formattedIngredients,
          instructions: instructionsToDisplay,
          prep_time_min: recipe.prepTime || 0,
          cook_time_min: recipe.cookTime || 0,
          servings: recipe.servings || 2,
          nutrition: undefined, // Removed nutrition data as it's not relevant for cooking
          science_notes: [], // Removed science notes as they're not relevant for cooking
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
