
import React, { useState } from 'react';
import { QuickRecipeForm } from './QuickRecipeForm';
import { QuickRecipeCard } from './QuickRecipeCard';
import { QuickCookingMode } from './QuickCookingMode';
import { QuickShoppingList } from './QuickShoppingList';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AuthDrawer } from '@/components/auth/AuthDrawer';

export function QuickRecipeGenerator() {
  const { generateQuickRecipe, isLoading, recipe, setRecipe } = useQuickRecipe();
  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSaveRecipe = () => {
    if (!user) {
      setAuthOpen(true);
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
    <div className="w-full max-w-4xl mx-auto">
      {!recipe ? (
        <QuickRecipeForm 
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
            onSave={handleSaveRecipe}
          />
          <AuthDrawer 
            open={authOpen}
            onOpenChange={setAuthOpen}
          />
        </>
      )}
    </div>
  );
}
