
import React, { useState } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { QuickRecipeCard } from '@/components/quick-recipe/QuickRecipeCard';
import { QuickCookingMode } from '@/components/quick-recipe/QuickCookingMode';
import { QuickShoppingList } from '@/components/quick-recipe/QuickShoppingList';
import { QuickRecipePrint } from '@/components/quick-recipe/QuickRecipePrint';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { useNavigate } from 'react-router-dom';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
}

export function QuickRecipeDisplay({ recipe }: QuickRecipeDisplayProps) {
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const { saveRecipe, isSaving, navigate } = useQuickRecipeSave();
  
  // Create a ref to the QuickRecipePrint component
  const printRef = React.useRef<HTMLDivElement>(null);

  // Function to handle print request
  const handlePrint = () => {
    // Access the print dialog through the DOM - this is a workaround since we can't directly
    // return a function from our QuickRecipePrint component
    const printElement = printRef.current?.lastChild as HTMLElement;
    if (typeof printElement?.click === 'function') {
      printElement.click();
    }
  };

  const handleSave = async () => {
    const success = await saveRecipe(recipe);
    if (success) {
      navigate('/recipes');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-16">
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
      
      {/* Hidden div that contains the print functionality */}
      <div ref={printRef} className="hidden">
        <QuickRecipePrint recipe={recipe} />
      </div>
    </div>
  );
}
