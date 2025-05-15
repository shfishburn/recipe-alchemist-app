import React, { useRef } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
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
  
  // If it's already in the right format, return it
  if (ingredient && typeof ingredient === 'object' && 'item' in ingredient && typeof ingredient.item === 'string') {
    const ing = ingredient as Record<string, any>;
    return {
      qty: ing.qty || 1,
      unit: ing.unit || '',
      item: ing.item,
      // Add required metric/imperial units
      qty_metric: ing.qty_metric || ing.qty || 1,
      unit_metric: ing.unit_metric || ing.unit || '',
      qty_imperial: ing.qty_imperial || ing.qty || 1,
      unit_imperial: ing.unit_imperial || ing.unit || ''
    };
  }
  
  // Otherwise, extract what we can
  const ing = ingredient as Record<string, any> || {};
  return {
    qty: ing.qty || 1,
    unit: ing.unit || '',
    item: typeof ingredient === 'object' ? JSON.stringify(ingredient) : String(ingredient),
    // Add required metric/imperial units
    qty_metric: ing.qty_metric || ing.qty || 1,
    unit_metric: ing.unit_metric || ing.unit || '',
    qty_imperial: ing.qty_imperial || ing.qty || 1,
    unit_imperial: ing.unit_imperial || ing.unit || ''
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
          tagline: recipe.description, // Use description for tagline
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
          science_notes: []
        }} 
        ref={printDialogTriggerRef}
      />
      
      {/* Return the handle print function for parent components to use */}
      {handlePrint}
    </>
  );
}
