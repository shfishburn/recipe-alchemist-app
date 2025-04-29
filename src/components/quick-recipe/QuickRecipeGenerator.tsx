
import React, { useState } from 'react';
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

export function QuickRecipeGenerator() {
  const { generateQuickRecipe, isLoading, recipe, setRecipe } = useQuickRecipe();
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const authDrawer = useAuthDrawer();
  
  const handleSaveRecipe = () => {
    if (!user) {
      authDrawer.open();
      return;
    }
    
    // In a real implementation, we would save the recipe to the database here
    toast({
      title: "Recipe saved",
      description: "Your recipe has been saved successfully",
    });
    
    navigate('/build');
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
        <div className="animate-fadeIn">
          <QuickRecipeCard 
            recipe={recipe} 
            onCook={() => setCookModeOpen(true)}
            onShop={() => setShoppingListOpen(true)}
            onSave={handleSaveRecipe}
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
    </div>
  );
}
